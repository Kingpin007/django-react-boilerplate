FROM oven/bun:1-alpine

WORKDIR /app/
ADD package.json bun.lockb* /app/
RUN bun install --frozen-lockfile
ADD . /app/

CMD ["bun", "run", "dev"]
