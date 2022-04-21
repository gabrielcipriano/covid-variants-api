# PRODUCTION DOCKERFILE
# ---------------------
# This Dockerfile allows to build a Docker image of the Covid Cases NestJS API
# and based on a NodeJS 16 image. 
# 
# USING MULTISTAGE FOR A LIGHTWEIGHT PRODUCTION IMAGE

FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY .env.docker .env

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

# ---

FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/.env .env

COPY /data /data

COPY docker-entrypoint.sh docker-entrypoint.sh

# RUN chmod 777 docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["node", "dist/src/main"]
