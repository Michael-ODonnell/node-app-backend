FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
RUN npm install pm2 -g
EXPOSE 3000
CMD ["pm2-runtime", "web/ecosystem.config.js", "--watch=TRUE"]
