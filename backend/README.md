# Noctix Website Backend

Small Express backend for receiving Noctix website consultation form submissions and securely forwarding cleaned lead data to n8n.

The frontend should call this backend only. It should never call the n8n webhook directly.

## Install

```bash
npm install
```

## Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then update `.env` with the real n8n secret.

Required environment variables:

```env
PORT=3001
N8N_WEBHOOK_URL=https://n8nautomations.noctix.app/webhook/website-form-filled
N8N_WEBHOOK_SECRET=replace_with_long_random_secret
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://noctix.app,https://www.noctix.app
```

- `PORT`: Port the backend listens on.
- `N8N_WEBHOOK_URL`: Private n8n webhook URL used only by the backend.
- `N8N_WEBHOOK_SECRET`: Shared secret sent to n8n in the `x-noctix-secret` header.
- `ALLOWED_ORIGINS`: Comma-separated frontend origins allowed by CORS.

## Run Locally

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Endpoints

Health check:

```http
GET /health
```

Website form submission endpoint for the frontend:

```http
POST /api/website-form-filled
```

Example local frontend URL:

```text
http://localhost:3001/api/website-form-filled
```

The backend validates and cleans form data, applies rate limiting, adds `submitted_at` and `source`, and forwards the payload to n8n without exposing webhook details to the frontend.
