
# 🔐 Authentication Strategy

This project uses **JWT-based authentication** with **access and refresh tokens**, designed for secure access across **API, mobile, and browser clients**, without relying on cookies.

---

## 📦 Token Types

| Token Type  | Purpose                  | Expiration         | Transport                              |
| ----------- | ------------------------ | ------------------ | -------------------------------------- |
| **Access**  | Authorizes API requests  | 1 hour (default)   | Bearer token in `Authorization` header |
| **Refresh** | Issues new access tokens | 48 hours (default) | Sent in body to `/auth/refresh`        |

Tokens are signed with JWT and configured via environment variables.

---

## 🔄 Authentication Flow

### 1. Register
Create a new user.

```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

---

### 2. Login
Authenticate and receive JWT tokens.

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePass123"
}
```

**Response:**
```json
{
  "access_token": "<JWT_ACCESS_TOKEN>",
  "refresh_token": "<JWT_REFRESH_TOKEN>",
  "access_interval": 3600000,
  "refresh_interval": 172800000
}
```

---

### 3. Access Protected Routes

Add the access token to the `Authorization` header:

```
GET /protected/route
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

---

### 4. Refresh Token

Use the refresh token to get a new pair of tokens:

```
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "<JWT_REFRESH_TOKEN>"
}
```

**Response:**
```json
{
  "access_token": "<NEW_ACCESS_TOKEN>",
  "refresh_token": "<NEW_REFRESH_TOKEN>",
  "access_interval": 3600000,
  "refresh_interval": 172800000
}
```

---

## ⚙️ Environment Configuration

Example `.env`:

```
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN_ACCESS=1h
JWT_EXPIRES_IN_REFRESH=48h
BCRYPT_SALT_ROUNDS=14
```

---

## 🔒 Security Notes

- Access and refresh tokens are stateless.
- Passwords are hashed using bcrypt.
- No cookies are used; all communication is token-based.
