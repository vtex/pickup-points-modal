#!/usr/bin/env bash
# setup-tasks.sh [slug]
# Generates tasks.md from the template for the active feature (or the slug
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
[ -d "$target" ] || die "specs/$slug does not exist"
require_file "$target/plan.md"

if [ -f "$target/tasks.md" ]; then
  die "specs/$slug/tasks.md already exists"
fi

cp "$root/.specify/templates/tasks-template.md" "$target/tasks.md"
printf "created: specs/%s/tasks.md\n" "$slug"
