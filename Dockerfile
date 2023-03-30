FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN rm .env
RUN CI=false npm run build

FROM nginx:alpine AS prod
RUN apk add --no-cache bash
RUN mkdir /app
COPY --from=build /app/dist /app
COPY ./docker_entrypoint.sh ./.env ./
COPY nginx.conf /etc/nginx/nginx.conf
RUN chmod +x /docker_entrypoint.sh
ENTRYPOINT [ "/bin/bash", "./docker_entrypoint.sh" ]