#!/usr/bin/env bash
# setup-plan.sh [slug]
# Gera plan.md a partir do template para a feature ativa (ou slug passado).

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
[ -d "$target" ] || die "specs/$slug não existe — rode create-new-feature.sh primeiro"
require_file "$target/spec.md"

if [ -f "$target/plan.md" ]; then
  die "specs/$slug/plan.md já existe"
fi

cp "$root/.specify/templates/plan-template.md" "$target/plan.md"
printf "criado: specs/%s/plan.md\n" "$slug"
