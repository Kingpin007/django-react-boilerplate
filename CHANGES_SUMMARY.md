# Project Changes Summary

## ✅ Completed Changes

### 1. Project Renamed: `project_name` → `url_shortener`
- Renamed `backend/project_name/` directory to `backend/url_shortener/`
- Updated all references throughout the codebase:
  - Python files (settings, URLs, celery, wsgi)
  - Configuration files (pyproject.toml, package.json, docker-compose.yml, etc.)
  - Documentation files

### 2. Package Manager: `pnpm` → `bun`
- Updated `package.json`:
  - Changed `packageManager` field to `bun@latest`
  - Updated all scripts to use `bun` instead of `pnpm`
- Updated build scripts:
  - `Makefile` - Docker commands now use `bun`
  - `render_build.sh` - Uses bun installation and commands
  - `frontend/Dockerfile` - Now uses `oven/bun:1-alpine` base image
- Removed `pnpm-lock.yaml` (will be replaced with `bun.lockb` after first `bun install`)

### 3. Linter: `ESLint` → `Biome`
- Removed ESLint and all related plugins from `package.json`
- Added `@biomejs/biome` to devDependencies
- Created `biome.json` configuration file
- Deleted `eslint.config.mjs`
- Updated scripts:
  - `lint`: `biome check .`
  - `lint:fix`: `biome check --write .`
  - `format`: `biome format --write .`

### 4. Authentication: Custom User Model → `django-allauth`
- **Removed:**
  - Custom `users.User` model
  - `AUTH_USER_MODEL = "users.User"` setting
  - `users` app from `INSTALLED_APPS`
  - User-related routes from URLs

- **Added:**
  - `django-allauth` package (version ^65.13.0)
  - Allauth apps to `INSTALLED_APPS`:
    - `django.contrib.sites` (required by allauth)
    - `allauth`
    - `allauth.account`
    - `allauth.socialaccount`
  - `allauth.account.middleware.AccountMiddleware` to `MIDDLEWARE`
  - Allauth authentication backends
  - Allauth URLs at `/accounts/`

- **Configuration:**
  - `ACCOUNT_LOGIN_METHODS = {"email"}` - Login with email only
  - `ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]` - Signup fields
  - `ACCOUNT_EMAIL_VERIFICATION = "none"` - No email verification (development)
  - `ACCOUNT_UNIQUE_EMAIL = True` - Unique email addresses
  - `LOGIN_REDIRECT_URL = "/"` - Redirect after login
  - `ACCOUNT_LOGOUT_REDIRECT_URL = "/"` - Redirect after logout

- **Database:**
  - Reset database to remove old custom user model migrations
  - Applied fresh migrations including allauth tables

## 📝 Next Steps

1. **Install frontend dependencies with bun:**
   ```bash
   bun install
   ```

2. **Update API schema:**
   ```bash
   export PATH="$HOME/.local/bin:$PATH"
   poetry run python backend/manage.py spectacular --color --file backend/schema.yml
   bun run openapi-ts
   ```

3. **Start development servers:**
   ```bash
   # Terminal 1: Backend
   export PATH="$HOME/.local/bin:$PATH"
   poetry run python backend/manage.py runserver

   # Terminal 2: Frontend
   bun run dev
   ```

4. **Create a superuser (for admin access):**
   ```bash
   export PATH="$HOME/.local/bin:$PATH"
   poetry run python backend/manage.py createsuperuser
   ```

## 🔗 Allauth URLs

- `/accounts/login/` - Login page
- `/accounts/signup/` - Signup page
- `/accounts/logout/` - Logout
- `/accounts/password/reset/` - Password reset
- `/accounts/email/` - Email management

## ⚠️ Important Notes

- The `users` app still exists in the codebase but is no longer used. You may want to remove it or repurpose it.
- Email verification is currently disabled (`ACCOUNT_EMAIL_VERIFICATION = "none"`). Enable it in production.
- The database was reset during migration. If you had important data, you'll need to restore it from a backup.

