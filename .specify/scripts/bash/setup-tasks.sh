#!/usr/bin/env bash
# setup-tasks.sh [slug]
# Gera tasks.md a partir do template para a feature ativa (ou slug passado).

set -euo pipefail
. "$(dirname "$0")/common.sh"

root="$(repo_root)"

if [ $# -ge 1 ]; then
  slug="$(slugify "$1")"
else
  feature_file="$root/.specify/feature.json"
  require_file "$feature_file"
  slug=$(sed -n 's/.*"slug":"\([^"]*\)".*/\1/p' "$feature_file")
  [ -n "$slug" ] || die "feature ativa não pôde ser determinada"
fi

target="$root/specs/$slug"
[ -d "$target" ] || die "specs/$slug não existe"
require_file "$target/plan.md"

if [ -f "$target/tasks.md" ]; then
  die "specs/$slug/tasks.md já existe"
fi

cp "$root/.specify/templates/tasks-template.md" "$target/tasks.md"
printf "criado: specs/%s/tasks.md\n" "$slug"
