# build on top of linux kernal system (not mac or pc)
FROM --platform=linux/amd64 node:21.5.0-alpine AS base

FROM base AS dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn run build

FROM base AS deploy
# Install necessary packages for Puppeteer in deploy image
RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# If you want to deploy with config env in k8s deployment spec
# COPY .env .env

CMD ["node","dist/main.js"]