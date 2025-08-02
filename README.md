<div align="center">

# 🏍️ Taller Motos Backend

[![Bun](https://img.shields.io/badge/Bun-1.x-black?logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/express-4.x-green.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/prisma-5.x-2D3748.svg)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/docker-🐳-blue.svg)](https://www.docker.com/)

API REST moderna y eficiente para la gestión de talleres de motos, construida con Bun.js, Express, TypeScript y Prisma.

</div>

## 🚀 Características

- ⚡ **Alto Rendimiento**: Construido con Bun.js para máxima velocidad y eficiencia
- 🔒 **Seguridad**: Autenticación robusta y manejo de roles
- 🎯 **TypeScript**: Código tipado para mayor mantenibilidad
- 📦 **Prisma ORM**: Gestión de base de datos moderna y type-safe
- 🐳 **Docker**: Contenedorización para desarrollo y producción
- 🔄 **CI/CD**: Integración y despliegue continuo con GitHub Actions

## 💻 Requisitos Previos

- [Bun](https://bun.sh) >= 1.0.0
- [Docker](https://www.docker.com/) (opcional)
- Base de datos PostgreSQL

## 📍 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/Uber830/taller-motos-backend.git
cd taller-motos-backend
```

2. Instalar dependencias:

```bash
bun install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Generar el cliente de Prisma:

```bash
bunx prisma generate
```

5. Ejecutar migraciones:

```bash
bunx prisma migrate dev
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
bun run dev         # Inicia el servidor en modo desarrollo con hot reload

# Producción
bun run build       # Construye la aplicación
bun run start       # Inicia la aplicación en modo producción

# Testing
bun test           # Ejecuta las pruebas
bun run test:watch # Ejecuta las pruebas en modo watch

# Docker
docker compose up  # Inicia los servicios en contenedores
```

## 📝 API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/logout` - Cerrar sesión

## 🛠️ Docker

El proyecto incluye configuración Docker para desarrollo y producción:

```bash
# Desarrollo
docker build --target dev -t taller-motos-backend:dev .
docker run -p 3010:3010 --env-file .env taller-motos-backend:dev

# Producción
docker build --target production -t taller-motos-backend:prod .
docker run -p 3010:3010 --env-file .env taller-motos-backend:prod
```

El enfoque es que el backend sea un API REST que se conecte a la base de datos y que se pueda usar en el frontend. Manteniendo la simplicidad y funcionalidad core sin feaures adicionales complejas.

## 📘 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
