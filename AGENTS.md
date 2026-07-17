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
bun run generate         # Generate Prisma client (always after schema changes)
bun run db:migrate       # Create and apply migration (add -- --name <name>)
bun run db:deploy        # Apply migrations in production
bun run db:studio        # Open Prisma Studio GUI at localhost:5555
bun run db:validate      # Validate schema
bun run db:format        # Format schema
```

**Never** use `prisma db push`. Always use `prisma migrate dev --name <nombre>`.

---

## Prisma Schema Conventions

See `skills/prisma-base-datos.md` for the full standard. Key rules:

### Schema location
```
prisma/
└── schema/
    ├── schema.prisma      # Model definitions
    ├── generated/         # Generated client (gitignored, NO editar)
    └── migrations/        # Migration history
```

### Naming

| Scope | Convention | Example |
|---|---|---|
| Database name | `db_` prefix + snake_case | `db_finanzas_personales` |
| Business model (schema) | PascalCase, singular | `Cliente`, `Contrato` |
| Business table (physical) | `tbl_` prefix + snake_case via `@@map` | `@@map("tbl_cliente")` |
| Fields (compound) | camelCase in schema, `@map` to snake_case | `userId @map("user_id")` |
| Auth models (Better Auth) | English, no `tbl_` prefix (historical exception) | `User`, `Session`, `Account` |

### Mandatory fields in every model

```prisma
model NombreModelo {
    id        String   @id @default(cuid())
    // ... campos del modelo
    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")

    @@map("tbl_nombre_modelo")
}
```

### Imports

```typescript
// PrismaClient type/class — desde el barrel generado
import { PrismaClient } from "@/prisma";

// Singleton del cliente — desde el módulo db
import { prisma } from "@/db";
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
prisma/
└── schema/
    ├── schema.prisma
    ├── generated/          # Generated client (gitignored)
    └── migrations/

src/
  config/                   # Zod-validated environment variables (env.ts)
  db/                       # PrismaClient singleton (index.ts)
  prisma.ts                 # Re-export barrel from generated client
  domain/                   # Pure entities and repository interfaces
    entities/
    repositories/
  application/              # Use cases, DTOs (Zod schemas)
    use-cases/
    dtos/
  infrastructure/            # Concrete implementations
    auth/                   # Better Auth configuration
    repositories/           # Prisma-based repository implementations
  presentation/             # HTTP layer (Hono)
    controllers/
    v1/
      routes/
      middlewares/
  shared/                   # Cross-cutting concerns
    errors/
    types/
    utils/
index.ts                    # Entry point
```

### Key conventions:

- **Path aliases**: Use `@/` to reference `src/`. Example: `import { prisma } from "@/db"`
- **Controllers**: Thin handlers that delegate to use cases. Return JSON directly.
- **Middlewares**: `auth.middleware.ts` validates Better Auth session. `error.middleware.ts` catches all errors and formats JSON responses.
- **Error handling**: Throw `AppError` subclasses (`NotFoundError`, `ValidationError`, `UnauthorizedError`, `ConflictError`, `InternalError`). The global `errorMiddleware` catches them. Never use try-catch in controllers for business errors.
- **Validation**: Use Zod schemas in DTOs. The error middleware catches `ZodError` automatically and returns 400.
- **API versioning**: All routes under `/api/v1/`. Health at `/api/v1/health`. Auth at `/api/v1/auth/*`.
- **Prisma client**: Import singleton from `@/db`. Import the type/class from `@/prisma`.
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
