# ---- target: dev ----
# Servidor de desarrollo de Vite con hot-reload (usado por docker-compose.override.yml)
FROM node:24-alpine AS dev
WORKDIR /app
RUN npm i -g pnpm@10

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# ---- target: prod (default) ----
# Build estático del SPA servido por nginx
FROM node:24-alpine AS build
WORKDIR /app
RUN npm i -g pnpm@10

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
