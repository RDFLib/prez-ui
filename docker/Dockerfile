ARG NODE_VERSION=26.5.0

FROM node:${NODE_VERSION}-alpine AS build
ARG NUXT_PUBLIC_PREZ_API_ENDPOINT=http://localhost:8000
ARG NUXT_PUBLIC_PREZ_AUTO_DETECT_HTML=false
ARG NUXT_PUBLIC_PREZ_AUTO_DETECT_MARKDOWN=false
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack
RUN corepack enable
RUN pnpm dlx create-prez-app@latest prez-ui
WORKDIR /app/prez-ui
RUN pnpm add -D prez-ui \
  --allow-build='@fortawesome/fontawesome-common-types' \
  --allow-build='@fortawesome/free-solid-svg-icons' \
  --allow-build=esbuild \
  --allow-build=prez-components \
  --allow-build=prez-lib \
  --allow-build=prez-ui \
  --allow-build=vue-demi
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