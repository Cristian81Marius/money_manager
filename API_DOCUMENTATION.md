# Steps for moving to api
Pentru fiecare serviciu, 2 pași:
Șterge blocul // --- MOCK --- (inclusiv await setTimeout)
Decomentează blocul // --- REAL API --- și mută linia cu import { api... } from './apiClient' sus în imports
Exemplu în transactions.ts:

// Înainte (mock activ):
await new Promise((resolve) => setTimeout(resolve, 1000));
return { transactionId: `mock-...`, ...payload };

// --- REAL API ---
// import { apiPost } from './apiClient';   ← add to file imports
// return apiPost<AddTransactionResponse>('/transactions', payload);

// După (real API activ):
import { apiPost } from './apiClient';   // ← mutat sus
// ...
return apiPost<AddTransactionResponse>('/transactions', payload);
Același pattern în toate cele 5 fișiere. Asigură-te că backend-ul rulează pe localhost:8080 — proxy-ul din vite.config.js face tot restul automat.


# Money Manager — Frontend API Contract

This document defines every REST endpoint the React frontend requires.
The Java Spring Boot backend must implement these contracts exactly — request/response
shapes, HTTP status codes, and error code strings are all consumed directly by the
frontend service layer (`src/services/`).

---

## Conventions

| Concern          | Value                                                              |
|------------------|--------------------------------------------------------------------|
| **Base URL**     | `/api/v1`                                                          |
| **Auth scheme**  | JWT — `Authorization: Bearer <token>` header                       |
| **Request body** | `application/json` (except file uploads: `multipart/form-data`)   |
| **Response body**| `application/json`                                                 |
| **Date fields**  | ISO 8601 string `YYYY-MM-DD`                                       |
| **Month fields** | `YYYY-MM` (e.g. `"2025-06"`)                                       |
| **Amounts**      | Decimal number — RON (Romanian Leu). Use `BigDecimal` on the server |
| **IDs**          | UUID strings                                                       |

### Error response format

Every non-2xx response **must** return this JSON body:

```json
{
  "error":   "ERROR_CODE",
  "message": "Human-readable description (optional, for logging)",
  "details": { "fieldName": "Validation message" }
}
```

The `error` field is the machine-readable code the frontend maps to a translated UI
message. `message` and `details` are optional and not shown to users.

### HTTP status codes

| Code | Meaning                                        |
|------|------------------------------------------------|
| 200  | OK — successful GET or POST with a body        |
| 201  | Created — resource created (POST)              |
| 204  | No Content — success, no response body         |
| 400  | Bad Request — missing/invalid fields or params |
| 401  | Unauthorized — missing or invalid JWT          |
| 409  | Conflict — duplicate resource                  |
| 413  | Payload Too Large — file exceeds size limit    |
| 422  | Unprocessable Entity — semantic validation     |
| 500  | Internal Server Error                          |

### CORS

The backend must allow requests from the Vite dev server origin (`http://localhost:5173`)
during development. For production, restrict to the deployed frontend domain.

```java
// Spring Boot example
@CrossOrigin(origins = "${app.cors.allowed-origins}")
```

---

## 1. Authentication

### 1.1 Login

| Field            | Value                     |
|------------------|---------------------------|
| **Method**       | `POST`                    |
| **URL**          | `/api/v1/auth/login`      |
| **Auth required**| No                        |
| **Content-Type** | `application/json`        |
| **Frontend file**| `src/services/auth.ts`    |

**Request body**

```json
{
  "email":    "user@example.com",
  "password": "secret123"
}
```

| Field      | Type     | Required | Rules                  |
|------------|----------|----------|------------------------|
| `email`    | `string` | Yes      | Valid email format     |
| `password` | `string` | Yes      | Non-blank              |

**Response 200**

```json
{
  "id":    "550e8400-e29b-41d4-a716-446655440000",
  "name":  "John Doe",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Field   | Type     | Description                                  |
|---------|----------|----------------------------------------------|
| `id`    | `string` | User UUID                                    |
| `name`  | `string` | Display name                                 |
| `email` | `string` | Email address                                |
| `token` | `string` | JWT — stored in `localStorage` by the client |

**Error responses**

| Status | `error` code          | Trigger                           |
|--------|-----------------------|-----------------------------------|
| 400    | `VALIDATION_ERROR`    | Missing or malformed fields       |
| 401    | `INVALID_CREDENTIALS` | Email not found or wrong password |

---

### 1.2 Register

| Field            | Value                     |
|------------------|---------------------------|
| **Method**       | `POST`                    |
| **URL**          | `/api/v1/auth/register`   |
| **Auth required**| No                        |
| **Content-Type** | `application/json`        |
| **Frontend file**| `src/services/auth.ts`    |

**Request body**

```json
{
  "name":     "John Doe",
  "email":    "user@example.com",
  "password": "secret123"
}
```

| Field      | Type     | Required | Rules                              |
|------------|----------|----------|------------------------------------|
| `name`     | `string` | Yes      | 2–100 characters, non-blank        |
| `email`    | `string` | Yes      | Valid email format, unique         |
| `password` | `string` | Yes      | Minimum 6 characters               |

**Response 201** — same shape as Login response 200.

**Error responses**

| Status | `error` code       | Trigger                          |
|--------|--------------------|----------------------------------|
| 400    | `VALIDATION_ERROR` | Missing or invalid fields        |
| 409    | `EMAIL_TAKEN`      | An account with that email exists|

---

### 1.3 Logout

| Field            | Value                     |
|------------------|---------------------------|
| **Method**       | `POST`                    |
| **URL**          | `/api/v1/auth/logout`     |
| **Auth required**| Yes — Bearer token        |
| **Content-Type** | None (empty body)         |
| **Frontend file**| `src/services/auth.ts`    |

The server should invalidate the token (blocklist / revoke if using refresh tokens).

**Response 204** — no body.

**Error responses**

| Status | `error` code   | Trigger               |
|--------|----------------|-----------------------|
| 401    | `UNAUTHORIZED` | Missing/invalid token |

---

### 1.4 Get Current User

| Field            | Value                     |
|------------------|---------------------------|
| **Method**       | `GET`                     |
| **URL**          | `/api/v1/auth/me`         |
| **Auth required**| Yes — Bearer token        |
| **Frontend file**| `src/services/auth.ts`    |

> Used to validate a persisted token on page refresh. The frontend stores the user
> object in `localStorage` (key `mm_user`); this endpoint confirms the token is still
> valid without requiring the user to log in again.

**Response 200** — same shape as Login response 200 (`id`, `name`, `email`, `token`).

**Error responses**

| Status | `error` code   | Trigger               |
|--------|----------------|-----------------------|
| 401    | `UNAUTHORIZED` | Missing/invalid token |

---

## 2. Dashboard

### 2.1 Get Dashboard Summary

| Field            | Value                       |
|------------------|-----------------------------|
| **Method**       | `GET`                       |
| **URL**          | `/api/v1/dashboard`         |
| **Auth required**| Yes — Bearer token          |
| **Frontend file**| `src/services/dashboard.ts` |

**Query parameters** (all optional)

| Parameter | Type     | Description                                                      |
|-----------|----------|------------------------------------------------------------------|
| `month`   | `YYYY-MM`| Which month to compute `incomeThisMonth` and `expensesThisMonth` for. Defaults to the current calendar month on the server. |

**Response 200**

```json
{
  "totalBalance":       12432.50,
  "incomeThisMonth":     4500.00,
  "expensesThisMonth":   1769.38,
  "transactionCount":    47,
  "recentTransactions": [
    {
      "id":          "550e8400-e29b-41d4-a716-446655440001",
      "type":        "income",
      "description": "Salary — June",
      "amount":      4500.00,
      "date":        "2025-06-01",
      "category":    "Salary"
    },
    {
      "id":          "550e8400-e29b-41d4-a716-446655440002",
      "type":        "expense",
      "description": "Lidl",
      "amount":      156.40,
      "date":        "2025-06-08",
      "category":    "Food & Drink"
    }
  ]
}
```

| Field                | Type              | Description                                                  |
|----------------------|-------------------|--------------------------------------------------------------|
| `totalBalance`       | `number`          | All-time net balance for the authenticated user              |
| `incomeThisMonth`    | `number`          | Sum of income transactions in the requested/current month    |
| `expensesThisMonth`  | `number`          | Sum of expense transactions in the requested/current month   |
| `transactionCount`   | `number` (int)    | Total number of transactions for the user (all time)         |
| `recentTransactions` | `Transaction[]`   | The 10 most recent transactions, ordered by `date` descending|

**Transaction object**

| Field         | Type                      | Description                  |
|---------------|---------------------------|------------------------------|
| `id`          | `string` (UUID)           | Unique transaction identifier|
| `type`        | `"income"` \| `"expense"` | Direction of money flow      |
| `description` | `string`                  | User-provided label          |
| `amount`      | `number`                  | Always positive              |
| `date`        | `string` (`YYYY-MM-DD`)   | Transaction date             |
| `category`    | `string`                  | Category name                |

**Error responses**

| Status | `error` code       | Trigger                        |
|--------|--------------------|--------------------------------|
| 400    | `VALIDATION_ERROR` | Invalid `month` format         |
| 401    | `UNAUTHORIZED`     | Missing/invalid token          |

---

## 3. Statistics

### 3.1 Get Statistics

| Field            | Value                        |
|------------------|------------------------------|
| **Method**       | `GET`                        |
| **URL**          | `/api/v1/statistics`         |
| **Auth required**| Yes — Bearer token           |
| **Frontend file**| `src/services/statistics.ts` |

**Query parameters** (all optional)

| Parameter   | Type     | Description                                                                     |
|-------------|----------|---------------------------------------------------------------------------------|
| `fromMonth` | `YYYY-MM`| Start of the period (inclusive). Defaults to 6 calendar months before `toMonth`.|
| `toMonth`   | `YYYY-MM`| End of the period (inclusive). Defaults to the current calendar month.          |

**Response 200**

```json
{
  "monthlyTrend": [
    { "monthIndex": 0, "income": 4500.00, "expenses": 2847.00 },
    { "monthIndex": 1, "income": 4500.00, "expenses": 3156.00 },
    { "monthIndex": 2, "income": 5700.00, "expenses": 2634.00 },
    { "monthIndex": 3, "income": 4500.00, "expenses": 3842.00 },
    { "monthIndex": 4, "income": 5700.00, "expenses": 2956.00 },
    { "monthIndex": 5, "income": 4500.00, "expenses": 1769.00 }
  ],
  "expensesByCategory": [
    { "category": "Housing",      "amount": 7200.00 },
    { "category": "Food & Drink", "amount": 4380.00 },
    { "category": "Transport",    "amount": 1620.00 }
  ],
  "totalIncome":   29400.00,
  "totalExpenses": 17204.00,
  "netSavings":    12196.00,
  "savingsRate":   41
}
```

| Field                | Type               | Description                                                                  |
|----------------------|--------------------|------------------------------------------------------------------------------|
| `monthlyTrend`       | `MonthlyPoint[]`   | One entry per calendar month in the requested range, ordered chronologically |
| `expensesByCategory` | `CategoryAmount[]` | Expense totals grouped by category for the whole period, ordered by amount descending |
| `totalIncome`        | `number`           | Sum of all income in the period                                              |
| `totalExpenses`      | `number`           | Sum of all expenses in the period                                            |
| `netSavings`         | `number`           | `totalIncome - totalExpenses`                                                |
| `savingsRate`        | `number` (int)     | `round((netSavings / totalIncome) * 100)` — percentage 0–100                |

**MonthlyPoint object**

| Field        | Type     | Description                                                                          |
|--------------|----------|--------------------------------------------------------------------------------------|
| `monthIndex` | `number` | 0-based month number (0 = January … 11 = December). The frontend maps this to a locale-appropriate label. |
| `income`     | `number` | Total income for that month                                                          |
| `expenses`   | `number` | Total expenses for that month                                                        |

**CategoryAmount object**

| Field      | Type     | Description          |
|------------|----------|----------------------|
| `category` | `string` | Category name        |
| `amount`   | `number` | Total amount for the period |

**Error responses**

| Status | `error` code       | Trigger                              |
|--------|--------------------|--------------------------------------|
| 400    | `VALIDATION_ERROR` | Invalid date format or `from > to`   |
| 401    | `UNAUTHORIZED`     | Missing/invalid token                |

---

## 4. Transactions

### 4.1 Add Transaction

| Field            | Value                          |
|------------------|--------------------------------|
| **Method**       | `POST`                         |
| **URL**          | `/api/v1/transactions`         |
| **Auth required**| Yes — Bearer token             |
| **Content-Type** | `application/json`             |
| **Frontend file**| `src/services/transactions.ts` |

**Request body**

```json
{
  "type":        "expense",
  "description": "Lidl shopping",
  "amount":      156.40,
  "date":        "2025-06-08",
  "category":    "Food & Drink",
  "notes":       "Weekly groceries"
}
```

| Field         | Type                      | Required | Rules                                            |
|---------------|---------------------------|----------|--------------------------------------------------|
| `type`        | `"income"` \| `"expense"` | Yes      | Exact string match                               |
| `description` | `string`                  | Yes      | 1–255 characters                                 |
| `amount`      | `number`                  | Yes      | Strictly positive (`> 0`)                        |
| `date`        | `string` (`YYYY-MM-DD`)   | Yes      | Valid date; not more than 1 day in the future    |
| `category`    | `string`                  | Yes      | 1–100 characters                                 |
| `notes`       | `string`                  | No       | Max 1000 characters                              |

**Response 201**

```json
{
  "transactionId": "550e8400-e29b-41d4-a716-446655440003",
  "type":          "expense",
  "description":   "Lidl shopping",
  "amount":        156.40,
  "date":          "2025-06-08",
  "category":      "Food & Drink",
  "notes":         "Weekly groceries"
}
```

The response echoes back all submitted fields plus the server-assigned `transactionId`.

**Error responses**

| Status | `error` code       | Trigger                     |
|--------|--------------------|-----------------------------|
| 400    | `VALIDATION_ERROR` | Missing or invalid fields   |
| 401    | `UNAUTHORIZED`     | Missing/invalid token       |

---

## 5. Bank Statements

### 5.1 Upload Bank Statement

| Field            | Value                           |
|------------------|---------------------------------|
| **Method**       | `POST`                          |
| **URL**          | `/api/v1/statements/upload`     |
| **Auth required**| Yes — Bearer token              |
| **Content-Type** | `multipart/form-data`           |
| **Frontend file**| `src/services/bankStatement.ts` |

**Form fields**

| Field       | Type     | Required | Rules                                                    |
|-------------|----------|----------|----------------------------------------------------------|
| `bank`      | `string` | Yes      | One of the supported bank values (see below)             |
| `file`      | `File`   | Yes      | MIME type `application/pdf` or `text/csv`; max 10 MB     |
| `startDate` | `string` | No       | ISO date `YYYY-MM-DD` — import only transactions from this date onward |
| `endDate`   | `string` | No       | ISO date `YYYY-MM-DD` — import only transactions up to this date |

**Supported `bank` values**

`BCR`, `BRD`, `ING`, `Raiffeisen`, `BT`, `UniCredit`, `CEC`, `Other`

**Date range validation**: when both `startDate` and `endDate` are provided,
`startDate` must not be after `endDate`.

**Response 201**

```json
{
  "statementId":   "550e8400-e29b-41d4-a716-446655440004",
  "bank":          "BT",
  "importedCount": 23
}
```

| Field           | Type           | Description                                              |
|-----------------|----------------|----------------------------------------------------------|
| `statementId`   | `string` (UUID)| Identifier for the uploaded statement record             |
| `bank`          | `string`       | The bank value from the request (echoed back)            |
| `importedCount` | `number` (int) | Number of transactions successfully parsed and saved     |

**Error responses**

| Status | `error` code         | Trigger                                  |
|--------|----------------------|------------------------------------------|
| 400    | `VALIDATION_ERROR`   | Missing `bank`/`file`, invalid date range|
| 401    | `UNAUTHORIZED`       | Missing/invalid token                    |
| 413    | `FILE_TOO_LARGE`     | File exceeds 10 MB                       |
| 422    | `UNSUPPORTED_FORMAT` | File MIME type is not PDF or CSV         |

---

## 6. Activating the real API on the frontend

Each service file has a mock block and a commented-out real API block.
To switch a service from mock to real once the backend endpoint is ready:

1. Delete or comment out the `// --- MOCK ---` block (including the `await setTimeout` line).
2. Uncomment the `// --- REAL API ---` block.
3. Move the `import { api... } from './apiClient';` line at the top of the comment block to the actual file imports.
4. Set `VITE_API_BASE_URL=http://localhost:8080/api/v1` in `.env.local` if the Vite proxy is not sufficient.

The frontend will then send real HTTP requests with the JWT token automatically attached.

---

## 7. Java / Spring Boot implementation notes

- Use **Spring Security** with **JWT** (e.g. `jjwt` or `nimbus-jose-jwt`) for authentication.
- Annotate controllers with `@RequestMapping("/api/v1")`.
- Use `@AuthenticationPrincipal` to extract the authenticated user from the JWT on every protected endpoint — the user's identity is never sent in the request body.
- Use `@Valid` + `@RequestBody` with Bean Validation annotations (`@NotBlank`, `@Email`, `@Positive`, `@Size`) for request validation.
- For the upload endpoint, use `@RequestPart("file") MultipartFile file` and `@RequestParam String bank`.
- Set `spring.servlet.multipart.max-file-size=10MB` and `spring.servlet.multipart.max-request-size=10MB`.
- Return `ResponseEntity<ApiErrorResponse>` (a shared record/class) for all error cases with the matching HTTP status and the exact `error` string from this document.
- Enable CORS for `http://localhost:5173` (Vite dev) and the production frontend domain.
