# Agentic Commerce

A Spring Boot e-commerce backend — products, users, and orders — being built from scratch as a
full production-style application: real database, auth, containerization, CI/CD, and eventually
agentic AI / GenAI features layered on top once the core platform is solid.

**Status:** actively in development. This is a placeholder README — a full version (architecture
diagram, deployment guide, API docs) lands once the core backend and frontend are further along.

## Stack (so far)

- Java 17, Spring Boot
- Spring Data JPA + PostgreSQL (run via Docker)
- Spring Security (JWT auth in progress)
- Bean Validation, global exception handling

## Running locally

1. Start Postgres:
   ```
   docker compose up -d
   ```
2. Run the app:
   ```
   ./mvnw spring-boot:run
   ```
3. API is available at `http://localhost:8080`. See `requests.http` for example requests.
