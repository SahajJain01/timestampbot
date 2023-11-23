FROM oven/bun

WORKDIR /app

ENV TOKEN=YOUR_BOT_TOKEN

COPY package.json .
RUN bun install

COPY . .

CMD ["bun", "index.js"]