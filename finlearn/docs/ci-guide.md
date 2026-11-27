# FinLearn — Guía de CI (GitHub Actions)

El workflow vive en `.github/workflows/ci.yml` **en la raíz del repositorio**, un nivel arriba de `finlearn/` (GitHub solo lee workflows desde esa carpeta). Todos los jobs apuntan al subdirectorio `finlearn/`.

## Qué corre y cuándo

Se ejecuta en cada push a `main`, en cada pull request que toque `finlearn/`, y manualmente (pestaña *Actions* → *Run workflow*). Tres jobs en paralelo:

| Job          | Qué hace                                                                  |
| ------------ | ------------------------------------------------------------------------- |
| Server tests | `pnpm test` contra un Postgres 17 real (service container de Actions).     |
| Client       | `pnpm lint` + `pnpm build` (TypeScript + Vite).                            |
| Docker build | `docker compose -f docker-compose.yml build server client` (producción).   |

## Detalles por job

**Server tests.** En CI no existe `.env` (está gitignoreado), así que las variables `DB_*` y `JWT_SECRET` se inyectan a nivel de job. `settings/env.js` las valida igual que en local y `settings/test-setup.js` crea y usa la base `finlearn_test`, nunca una real. El Postgres del service container usa la misma versión (`postgres:17-alpine`) que `docker-compose.yml`.

**Client.** Lint y build con Node 24 y pnpm 10, las mismas versiones de los Dockerfiles. Cuando el cliente tenga tests reales, añadir `pnpm test` en ese job (hay un comentario en el workflow marcando el lugar).

**Docker build.** Usa `-f docker-compose.yml` para excluir el override de desarrollo y construir las imágenes de producción, igual que en deploy. Las variables `DB_*`/`JWT_SECRET` del job son solo placeholders para la interpolación del compose: el build no las consume.

## Ver los resultados

- En GitHub: pestaña *Actions* del repositorio.
- Localmente (con GitHub CLI):

```bash
gh run list
gh run watch
```
