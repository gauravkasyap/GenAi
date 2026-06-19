# GenAi Healthcare Assistant

A refactored full-stack healthcare assistant for rural India with a dedicated React frontend and a layered Python backend.

## Architecture

```text
project-root/
  frontend/
    src/
      components/
      hooks/
      pages/
      services/
      utils/
    public/
    package.js
    vite.config.js
  backend/
    src/
      config/
      controllers/
      data/
      middleware/
      models/
      routes/
      services/
    static/
    server.py
    requirements.txt
```

## Frontend responsibilities

- Render the dark multilingual chat UI
- Manage onboarding, chat history, and medical-book UX
- Call backend APIs through `frontend/src/services/api.js`

## Backend responsibilities

- Serve API endpoints and compiled frontend assets
- Run triage, prescription parsing, facility search, and medical-book grounding
- Keep routing, controllers, and business logic separated

## Environment files

- `frontend/.env.example`
- `backend/.env.example`

## Optional AI analysis via OpenAI or Groq

Create `backend/.env` from `backend/.env.example` and set one of these keys:

- `OPENAI_API_KEY` or `OPEN_API_KEY`
- `GROQ_API_KEY`

Useful options:

- `LLM_PROVIDER=auto` uses OpenAI first, then Groq if both are present
- `LLM_PROVIDER=openai` forces OpenAI
- `LLM_PROVIDER=groq` forces Groq
- `LLM_PROVIDER=off` keeps the existing rule-based analyzer only

The `/api/analyze` endpoint will use the configured model for illness explanation and fall back safely to the built-in rule-based logic if no provider is configured or the API call fails.

## Install frontend dependencies

```powershell
cd frontend
npm.cmd install
```

## Build frontend

```powershell
cd frontend
npm.cmd run build
```

This writes the production build into `backend/static/`.

## Run backend

```powershell
cd backend
python server.py
```

Open `http://127.0.0.1:8000` after the backend starts.

## API examples

- `GET /api/messages` can be added later for persistent storage
- `POST /api/symptoms` maps to the existing triage flow design
- Current implemented endpoints include:
  - `GET /api/bootstrap`
  - `GET /api/hospitals`
  - `POST /api/analyze`
  - `POST /api/prescription/explain`
  - `GET /api/books`
  - `POST /api/books/upload`
  - `POST /api/books/remove`
  - `POST /api/books/confirm`
  - `POST /api/books/query`

## Safety note

This is still an MVP. It offers a first-step health guidance experience and grounded medical-book lookup, but it is not a confirmed diagnosis system.
