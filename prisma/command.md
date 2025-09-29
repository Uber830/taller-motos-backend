# Commands Prisma

- Generar cliente Prisma

```bash
 bun run db:generate
```

- Sincronizar esquema con BD (desarrollo)

```bash
bun run db:push
```

- Crear migración (producción)

```bash
bun run db:migrate
```

- Aplicar migraciones (producción)

```bash
bun run db:migrate:deploy
```

- Ver estado de migraciones

```bash
bun run db:migrate:status
```
