#!/bin/bash
# Safely apply Supabase migrations for local/dev testing
# Usage: bash scripts/supabase-migrate.sh

set -e

SUPABASE_URL=${SUPABASE_URL:-$NEXT_PUBLIC_SUPABASE_URL}
SUPABASE_KEY=${SUPABASE_KEY:-$SUPABASE_SERVICE_ROLE_KEY}
MIGRATION_DIR="supabase/migrations"

if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_KEY" ]]; then
  echo "Error: SUPABASE_URL and SUPABASE_KEY must be set in your .env.local or environment."
  exit 1
fi

for sql in "$MIGRATION_DIR"/*.sql; do
  echo "Applying migration: $sql"
  PGPASSWORD="$SUPABASE_KEY" psql "$SUPABASE_URL" -U postgres -f "$sql"
  echo "Done: $sql"
done

echo "All migrations applied."
