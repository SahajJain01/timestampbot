FROM oven/bun

WORKDIR /app

ENV TOKEN=$TOKEN

COPY package.json .
RUN bun install

COPY . .

CMD ["bun", "index.js"]