# FinLearn — Guía de Docker

Solo necesitas Docker con Compose. No es necesario instalar Node.js, pnpm ni PostgreSQL localmente.

## 1. Desarrollo

Primera ejecución:

```bash
cp .env.example .env
```

Configura `JWT_SECRET` en `.env`. Puedes generar una clave con:

```bash
openssl rand -hex 32
```

Construye e inicia el proyecto:

```bash
docker compose up --build
```

Servicios disponibles:

| Servicio   | Dirección             |
| ---------- | --------------------- |
| Frontend   | http://localhost:5173 |
| API        | http://localhost:8000 |
| PostgreSQL | localhost:5432        |

El modo desarrollo incluye hot-reload: los cambios en el código se reflejan automáticamente.

## 2. Dependencias

Después de agregar dependencias, instálalas dentro del contenedor correspondiente:

```bash
docker compose exec server pnpm install
docker compose exec client pnpm install
```

Si el backend no reconoce los cambios:

```bash
docker compose restart server
```

## 3. Tests

Ejecutar con el proyecto iniciado:

```bash
docker compose exec server pnpm test
```

Ejecutar sin iniciar previamente el proyecto:

```bash
docker compose run --rm server pnpm test
```

Los tests utilizan una base de datos independiente (`<DB_NAME>_test`), por lo que no modifican los datos reales.

## 4. Detener el proyecto

```bash
docker compose down
```

Detiene y elimina los contenedores, pero conserva los datos de PostgreSQL.

**¡Cuidado!** No utilices `-v` a menos que quieras borrar también los datos:

```bash
docker compose down -v
```

## 5. Producción

Para construir e iniciar la versión de producción:

```bash
docker compose -f docker-compose.yml up -d --build
```

Es obligatorio indicar `-f docker-compose.yml` para evitar que se cargue la configuración de desarrollo (`docker-compose.override.yml`).

En producción:

- Nginx sirve el frontend.
- El backend procesa las peticiones de la API.
- PostgreSQL almacena los datos.
- Solo se expone el puerto `8080`.

Acceso: http://localhost:8080

## Comandos útiles

| Comando                     | Función                          |
| --------------------------- | -------------------------------- |
| `docker compose up`         | Iniciar en desarrollo.           |
| `docker compose up --build` | Reconstruir e iniciar.           |
| `docker compose up -d`      | Iniciar en segundo plano.        |
| `docker compose down`       | Detener y eliminar contenedores. |
| `docker compose logs -f`    | Ver logs en tiempo real.         |
| `docker compose ps`         | Ver contenedores activos.        |
