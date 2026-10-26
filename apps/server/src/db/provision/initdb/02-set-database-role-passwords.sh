#!/bin/sh
set -eu

psql --no-psqlrc -v ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -v migrator_password="$DB_MIGRATOR_PASSWORD" \
  -v api_password="$DB_PASSWORD" \
  -v cli_password="$DB_CLI_PASSWORD" <<'SQL'
ALTER ROLE app_migrator WITH PASSWORD :'migrator_password';
ALTER ROLE app_runtime WITH PASSWORD :'api_password';
ALTER ROLE app_cli WITH PASSWORD :'cli_password';
SQL
