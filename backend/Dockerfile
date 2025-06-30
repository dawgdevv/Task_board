FROM node:22-alpine3.20

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN addgroup -g 1001 -S nodejs
RUN adduser -S taskly -u 1001

RUN chown -R taskly:nodejs /app
USER taskly


EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \ 
 CMD curl -f http://localhost:5000/ || exit 1

CMD [ "npm","start" ]

