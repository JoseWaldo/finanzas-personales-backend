FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN bunx prisma generate

EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]