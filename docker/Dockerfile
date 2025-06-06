ARG NODE_VERSION=21.7.1

FROM node:${NODE_VERSION}-alpine as build
ARG NUXT_PUBLIC_PREZ_API_ENDPOINT=http://localhost:8000
ARG NUXT_PUBLIC_PREZ_AUTO_DETECT_HTML=false
ARG NUXT_PUBLIC_PREZ_AUTO_DETECT_MARKDOWN=false
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm dlx create-prez-app@latest prez-ui
WORKDIR /app/prez-ui
RUN pnpm install
RUN npm --platform=linux --arch=x64 --libc=musl rebuild sharp
ENV NUXT_PUBLIC_PREZ_API_ENDPOINT=$NUXT_PUBLIC_PREZ_API_ENDPOINT
ENV NUXT_PUBLIC_PREZ_AUTO_DETECT_HTML=$NUXT_PUBLIC_PREZ_AUTO_DETECT_HTML
ENV NUXT_PUBLIC_PREZ_AUTO_DETECT_MARKDOWN=$NUXT_PUBLIC_PREZ_AUTO_DETECT_MARKDOWN
RUN pnpm generate

FROM nginx:stable-alpine
COPY --from=build /app/prez-ui/.output/public /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]