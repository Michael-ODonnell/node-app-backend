#!/bin/bash
set -eu

function usage {
	echo "Usage: $0 (-u) *USERNAME* (-h) *HOST* (-d) *DATABASE*"
    echo '-u Username. Optional, defaults to environment variable $POSTGRES_USER'
    echo '-h Host. Optional, defaults to none (local instance)'
    echo '-d Database. Optional, defaults to environment variable $POSTGRES_DB'
	exit 1;
}
while getopts ":u:h:d:" opt; do
  case $opt in
    u) username_in="$OPTARG"
    ;;
    h) host_in="$OPTARG"
    ;;
    d) db_in="$OPTARG"
    ;;
    \?) usage
    ;;
  esac
done

user=${username_in:-$POSTGRES_USER}
db=${db_in:-$POSTGRES_DB}
host=${host_in:-""}

if [ -z "$host"]; then 
    psql=( psql -v ON_ERROR_STOP=1 --username "$user" --dbname "$db")
else 
    psql=( psql -v ON_ERROR_STOP=1 --username "$user" --dbname "$db" --host "$host")
fi

dir=$(dirname "$0")

for f in $dir/migrations/*; do
    script=$(basename "$f")
    hash=$(sha1sum "$f" | cut -d " " -f 1 )
    exists=$("${psql[@]}" -t -c "SELECT COUNT(*) FROM meta_data.migrations WHERE script = '$script' LIMIT 1")
    exists=$(echo -e $exists | tr -d '[:space:]')
    if [ $exists == '0' ] ; then
        case "$f" in
            *.sql)    echo "$0: running $f"; "${psql[@]}" -f "$f"; echo ;;
            *.sql.gz) echo "$0: running $f"; gunzip -c "$f" | "${psql[@]}"; echo ;;
            *)        echo "$0: ignoring $f" ;;
        esac
        "${psql[@]}" -c "INSERT INTO meta_data.migrations (script, hash) VALUES ('$script', '$hash')"
        echo
    else
        migrated_hash=$("${psql[@]}" -t -c "SELECT hash FROM meta_data.migrations WHERE script = '$script' LIMIT 1")
        migrated_hash=$(echo -e $migrated_hash | tr -d '[:space:]')
        if [ $migrated_hash != $hash ] ; then
            echo "ERROR: $f has changed since it was migrated. Importing from this point is an invalid operation"
            exit 1
        fi
        echo "Skipping - $f is already migrated"
    fi
done
