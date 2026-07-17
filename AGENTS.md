# AGENTS.md

## Lint & TypeCheck

```bash
bun run lint
```

This runs `tsc --noEmit`. Always run it after making changes and ensure it passes.

---

## Run & Develop

```bash
bun run dev       # Start dev server with hot reload on localhost:3000
bun run build     # Production build to dist/
bun run start     # Run production build
```

---

## Database Commands

```bash
bun run db:generate   # Generate Prisma client after schema changes
bun run db:push       # Push schema directly to DB (no migrations)
bun run db:migrate    # Create and apply migrations
bun run db:studio     # Open Prisma Studio GUI at localhost:5555
```

---

## Architecture

This project follows **Clean Architecture** with strict layer separation. Never cross layer boundaries improperly.

### Layer dependencies (top-down):

```
presentation -> application -> domain
presentation -> infrastructure
application -> domain
infrastructure -> domain
```

### Directory structure:

```
src/
  config/            # Zod-validated environment variables (env.ts)
  domain/            # Pure entities and repository interfaces (no deps on infra)
    entities/        # Business entities (extend BaseEntity)
    repositories/    # Abstract repository interfaces (IBaseRepository)
  application/       # Use cases, DTOs (Zod schemas)
    use-cases/       # Business logic orchestration
    dtos/            # Data transfer object schemas
  infrastructure/    # Concrete implementations
    prisma/          # PrismaClient singleton
    repositories/    # Prisma-based repository implementations
    auth/            # Better Auth configuration
  presentation/      # HTTP layer (Hono)
    v1/
      routes/        # Route definitions grouped by feature (health, auth, etc.)
      middlewares/   # Auth middleware, error middleware
    controllers/     # Request handlers
  shared/            # Cross-cutting concerns
    errors/          # AppError, NotFoundError, ValidationError, etc.
    types/           # Result<T,E>, PaginationParams, PaginatedResult
    utils/           # Shared helpers
index.ts             # Entry point: creates Hono app, mounts /api/v1
```

### Key conventions:

- **Path aliases**: Use `@/` to reference `src/`. Example: `import { prisma } from "@/infrastructure/prisma/client"`
- **Controllers**: Thin handlers that delegate to use cases. Return JSON directly.
- **Middlewares**: `auth.middleware.ts` validates Better Auth session. `error.middleware.ts` catches all errors and formats JSON responses.
- **Error handling**: Throw `AppError` subclasses (`NotFoundError`, `ValidationError`, `UnauthorizedError`, `ConflictError`, `InternalError`). The global `errorMiddleware` catches them. Never use try-catch in controllers for business errors.
- **Validation**: Use Zod schemas in DTOs. The error middleware catches `ZodError` automatically and returns 400.
- **API versioning**: All routes under `/api/v1/`. Health at `/api/v1/health`. Auth at `/api/v1/auth/*`.
- **Prisma client**: Import from `@/infrastructure/prisma/client`. The singleton handles dev/prod appropriately.
- **Better Auth**: Auth endpoints are reverse-proxied through Hono at `/api/v1/auth/*` using `auth.handler(c.req.raw)`. The Better Auth instance is in `@/infrastructure/auth/better-auth.ts`. Currently configured for email+password.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Bun |
| HTTP Framework | Hono v4 |
| ORM | Prisma v6 |
| Auth | Better Auth v1 |
| Validation | Zod v3 |
| Database | PostgreSQL |
| Language | TypeScript 5 |
