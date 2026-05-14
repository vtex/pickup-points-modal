#!/usr/bin/env bash
# setup-plan.sh [slug]
# Generates plan.md from the template for the active feature (or the slug
# passed as an argument).

set -euo pipefail
. "$(dirname "$0")/common.sh"

root="$(repo_root)"

if [ $# -ge 1 ]; then
  slug="$(slugify "$1")"
else
  feature_file="$root/.specify/feature.json"
  require_file "$feature_file"
  slug=$(sed -n 's/.*"slug":"\([^"]*\)".*/\1/p' "$feature_file")
  [ -n "$slug" ] || die "could not determine the active feature"
fi

target="$root/specs/$slug"
[ -d "$target" ] || die "specs/$slug does not exist — run create-new-feature.sh first"
require_file "$target/spec.md"

if [ -f "$target/plan.md" ]; then
  die "specs/$slug/plan.md already exists"
fi

cp "$root/.specify/templates/plan-template.md" "$target/plan.md"
printf "created: specs/%s/plan.md\n" "$slug"
