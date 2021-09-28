FROM node:14.15.4-alpine
WORKDIR /app
COPY ./build /app
RUN npm install
EXPOSE 80
ARG HOST=${HOST}
ARG PORT=${PORT}
ARG NODE_ENV=${NODE_ENV}
ARG APP_KEY=${APP_KEY}
ARG DB_CONNECTION=${DB_CONNECTION}
ARG PG_HOST=${PG_HOST}
ARG PG_PORT=${PG_PORT}
ARG PG_USER=${PG_USER}
ARG PG_PASSWORD=${PG_PASSWORD}
ARG PG_DB_NAME=${PG_DB_NAME}
ARG FRONTEND_URL=${FRONTEND_URL}
ARG STORAGE_ENDPOINT=${STORAGE_ENDPOINT}
ARG STORAGE_ACCESS_KEY_ID=${STORAGE_ACCESS_KEY_ID}
ARG STORAGE_ACCESS_SECRET_KEY=${STORAGE_ACCESS_SECRET_KEY}
ARG STORAGE_BUCKET=${STORAGE_BUCKET}
ARG BULL_REDIS_HOST=${BULL_REDIS_HOST}
ARG BULL_REDIS_PORT=${BULL_REDIS_PORT}
ARG BULL_REDIS_PASSWORD=${BULL_REDIS_PASSWORD}
ARG CACHE_VIEWS=${CACHE_VIEWS}
ARG FRONTEND_URL=${FRONTEND_URL}
ARG MOBILE_URL=${MOBILE_URL}
ARG SMTP_HOST=${SMTP_HOST}
ARG SMTP_PORT=${SMTP_PORT}
ARG SMTP_USERNAME=${SMTP_USERNAME}
ARG SMTP_PASSWORD=${SMTP_PASSWORD}

CMD ["npm", "start"]
