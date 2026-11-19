# Online Voting System — Backend (Spring Boot)

## Requirements
- Java 17+
- Maven 3.8+
- MySQL 8+

## Setup

1. Create the database (or let Hibernate auto-create it):
   ```sql
   CREATE DATABASE online_voting_db;
   ```

2. Update `src/main/resources/application.properties` with your MySQL username/password:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

3. Run the app:
   ```bash
   mvn spring-boot:run
   ```
   The API will start on **http://localhost:8080**

## Key Endpoints

| Method | Endpoint                  | Access        | Description                |
|--------|----------------------------|---------------|----------------------------|
| POST   | /api/auth/register         | Public        | Register (role: ADMIN/VOTER) |
| POST   | /api/auth/login            | Public        | Login, returns JWT         |
| GET    | /api/candidates             | Authenticated | List candidates            |
| POST   | /api/candidates             | ADMIN         | Add candidate               |
| PUT    | /api/candidates/{id}        | ADMIN         | Update candidate            |
| DELETE | /api/candidates/{id}        | ADMIN         | Delete candidate            |
| POST   | /api/vote                   | VOTER         | Cast a vote (once only)     |
| GET    | /api/results                | Authenticated | Live results                |
| GET    | /api/elections               | ADMIN         | List/manage elections       |
| GET    | /api/voters                  | Authenticated | List registered voters (admin view) |

## Auth flow
Send `Authorization: Bearer <token>` with every request after login/register.
Duplicate voting is blocked at the database/service level using the `voted` flag on the `users` table.

## Test with Postman
1. `POST /api/auth/register` with `{ "name": "Admin", "email": "admin@test.com", "password": "admin123", "role": "ADMIN" }`
2. `POST /api/auth/register` with a VOTER account.
3. Use the ADMIN token to add candidates via `POST /api/candidates`.
4. Use the VOTER token to `POST /api/vote` with `{ "candidateId": 1 }`.
5. `GET /api/results` to see live counts.
