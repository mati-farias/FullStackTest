FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

RUN npm install

COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

RUN npm run build -w packages/shared

WORKDIR /app/apps/web
EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0"]
