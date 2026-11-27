FROM node:24-alpine
WORKDIR /app

# Toolchain para compilar bcrypt (binario nativo) si no hay prebuild para musl
RUN apk add --no-cache python3 make g++ \
    && npm i -g pnpm@10

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 8000
CMD ["node", "index.js"]
