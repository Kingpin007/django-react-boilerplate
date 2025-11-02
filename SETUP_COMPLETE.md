# Setup Complete! 🎉

Your Django + React boilerplate project has been successfully configured and is ready to run.

## What Was Done

1. ✅ **Created configuration files:**
   - `backend/.env` - Configured with your PostgreSQL and Redis credentials
   - `backend/url_shortener/settings/local.py` - Local development settings

2. ✅ **Installed dependencies:**
   - Python dependencies via Poetry (including psycopg-binary for PostgreSQL)
   - Frontend dependencies via pnpm

3. ✅ **Database setup:**
   - Created database `url_shortener` in PostgreSQL
   - Ran initial migrations

4. ✅ **Generated API schema:**
   - OpenAPI schema generated
   - TypeScript client code generated

5. ✅ **Fixed project placeholders:**
   - Replaced `{{url_shortener}}` placeholders with `url_shortener` throughout the codebase

## How to Run the Project

### 1. Start the Backend Server

In one terminal window:

```bash
cd /Users/anirudhkanabar/Projects/django-react-boilerplate
export PATH="$HOME/.local/bin:$PATH"
poetry run python backend/manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 2. Start the Frontend Development Server

In another terminal window:

```bash
cd /Users/anirudhkanabar/Projects/django-react-boilerplate
pnpm run dev
```

This starts the webpack dev server that serves the React frontend assets.

### 3. Start Celery Worker (Optional - for background tasks)

In a third terminal window:

```bash
cd /Users/anirudhkanabar/Projects/django-react-boilerplate
export PATH="$HOME/.local/bin:$PATH"
poetry run celery --app=url_shortener worker --loglevel=info
```

## Access Points

- **Main Application:** http://localhost:8000
- **Django Admin:** http://localhost:8000/admin
- **API Documentation (Swagger):** http://localhost:8000/api/schema/swagger-ui/
- **API Documentation (ReDoc):** http://localhost:8000/api/schema/redoc/

## Database Configuration

- **Database Name:** `url_shortener`
- **Host:** `localhost:5432`
- **Username:** `postgres`
- **Password:** `localdbpassword`

## Redis Configuration

- **Host:** `localhost:6379`
- **Database:** `0` (used for Celery broker and Django-defender)

## Next Steps for URL Shortener Service

Now that the project is set up, you can start building your URL shortener:

1. **Create a new Django app for the URL shortener:**
   ```bash
   export PATH="$HOME/.local/bin:$PATH"
   poetry run python backend/manage.py startapp urlshortener
   ```

2. **Add models** for storing shortened URLs
3. **Create API endpoints** using Django REST Framework
4. **Build React components** for the frontend
5. **Implement URL shortening logic** and redirect functionality

## Useful Commands

- **Create migrations:** `poetry run python backend/manage.py makemigrations`
- **Apply migrations:** `poetry run python backend/manage.py migrate`
- **Create superuser:** `poetry run python backend/manage.py createsuperuser`
- **Update API schema:** `poetry run python backend/manage.py spectacular --color --file backend/schema.yml`
- **Update TypeScript client:** `pnpm run openapi-ts`

## Notes

- Make sure PostgreSQL and Redis are running before starting the servers
- The `webpack_bundles` directory will be created automatically when you build the frontend
- Poetry automatically uses Python 3.12 (it's installed in the virtualenv)
- Add `export PATH="$HOME/.local/bin:$PATH"` to your `~/.zshrc` to make Poetry available globally

Happy coding! 🚀

