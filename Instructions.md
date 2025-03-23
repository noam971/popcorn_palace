# Popcorn Palace – Instructions

This document explains how to set up, run, and test the Popcorn Palace RESTful API project. Copy this file into the root of your repository as **Instructions.md**.

---

## Prerequisites

- Node.js & npm (v14+)
- Docker & Docker Compose
- Git

---

## Environment Setup

Create these two files in your project root:

### .env (Development)

```ini
DATABASE_URL=postgresql://popcorn-palace:popcorn-palace@localhost:5432/popcorn-palace?schema=public
PORT=3000
NODE_ENV=development
```

### .env.test (Testing)

```ini
DATABASE_URL=postgresql://popcorn-palace_test:popcorn-palace_test@localhost:5433/popcorn-palace_test?schema=public
NODE_ENV=test
```

> Adjust credentials/ports if needed.

---

## Database Management

### Development DB

| Command                  | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| npm run db:dev:restart | Stop & remove existing dev DB → start fresh → apply migrations |
| npm run db:dev:rm      | Stop & remove dev DB container                                 |

### Test DB

| Command                   | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| npm run db:test:restart | Stop & remove existing test DB → start fresh → apply migrations |
| npm run db:test:rm      | Stop & remove test DB container                                 |

---

##  Running the Application

### Development Mode

1. Start dev database:

```bash
npm run db:dev:restart
```

2. Launch server:

```bash
npm run start

```
3. When done, remove db:

```bash
npm run db:dev:rm
```

Server URL: [http://localhost:3000](http://localhost:3000)

### Production Mode

```bash
npm run build
npm run start:prod
```

---

## Testing

### Unit Tests

```bash
npm run test
```

### End‑to‑End Tests

1. Start test database:

```bash
npm run db:test:restart
```

2. Run E2E suite:

```bash
npm run test:e2e
```
3. remove db_test:

```bash
npm run db:test:rm
```

---

##  Utility Scripts

| Script              | Description              |
| ------------------- | ------------------------ |
| npm run lint        | Run ESLint and auto‑fix  |
| npm run format      | Run Prettier formatting  |
| npm run test\:cov   | Generate coverage report |
| npm run test\:debug | Run tests in debug mode  |

---

##  Summary

1. Configure `.env` & `.env.test`
2. Manage DB with `db:dev:*` & `db:test:*` scripts
3. Run server (`start:dev` or `start:prod`)
4. Test (`npm run test` for unit, `npm run test:e2e` for E2E)
5. Lint & format frequently

Happy coding! 
