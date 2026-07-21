FROM node:20-bookworm-slim AS frontend

WORKDIR /app/ui

ARG NEXT_PUBLIC_BACKEND_BASE_URL=""
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=""
ARG NEXT_PUBLIC_GOOGLE_REDIRECT_URI="accounts/googleCallback"
ARG NEXT_PUBLIC_FACEBOOK_APP_ID=""
ARG NEXT_PUBLIC_FACEBOOK_REDIRECT_URI="accounts/fbCallback"
ARG NEXT_PUBLIC_MICROSOFT_CLIENT_ID=""
ARG NEXT_PUBLIC_MICROSOFT_REDIRECT_URI="accounts/msCallback"

ENV NEXT_PUBLIC_BACKEND_BASE_URL=$NEXT_PUBLIC_BACKEND_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_REDIRECT_URI=$NEXT_PUBLIC_GOOGLE_REDIRECT_URI
ENV NEXT_PUBLIC_FACEBOOK_APP_ID=$NEXT_PUBLIC_FACEBOOK_APP_ID
ENV NEXT_PUBLIC_FACEBOOK_REDIRECT_URI=$NEXT_PUBLIC_FACEBOOK_REDIRECT_URI
ENV NEXT_PUBLIC_MICROSOFT_CLIENT_ID=$NEXT_PUBLIC_MICROSOFT_CLIENT_ID
ENV NEXT_PUBLIC_MICROSOFT_REDIRECT_URI=$NEXT_PUBLIC_MICROSOFT_REDIRECT_URI

COPY ui/package*.json ./
RUN npm ci

COPY ui ./
RUN npm run build


FROM python:3.13-slim AS app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        default-libmysqlclient-dev \
        libpq-dev \
        pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY --from=frontend /app/ui/out ./ui/out

ENV SECRET_KEY=build-time-secret
ENV DEBUG=False
ENV ALLOWED_HOSTS=*
ENV CORS_ALLOWED_ORIGINS=http://localhost
ENV CSRF_TRUSTED_ORIGINS=http://localhost
ENV ACCESS_TOKEN_TIME=1440
ENV REFRESH_TOKEN_TIME=10080
ENV FRONTEND_BASE_URL=http://localhost
ENV GOOGLE_REDIRECT_URI=accounts/googleCallback

RUN python manage.py collectstatic --noinput

EXPOSE 8080

CMD ["sh", "-c", "python manage.py migrate && exec gunicorn server.wsgi:application --bind 0.0.0.0:${PORT:-8080}"]
