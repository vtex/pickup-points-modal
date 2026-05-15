#!/usr/bin/env bash
# create-new-feature.sh <slug-or-title>
# Creates the specs/<slug>/ structure with a fresh spec.md from the template.

set -euo pipefail
. "$(dirname "$0")/common.sh"

[ $# -ge 1 ] || die "usage: $(basename "$0") <slug-or-title>"

slug="$(slugify "$1")"
[ -n "$slug" ] || die "invalid slug"

root="$(repo_root)"
target="$root/specs/$slug"

if [ -d "$target" ]; then
  die "feature already exists: specs/$slug"
fi

mkdir -p "$target"
cp "$root/.specify/templates/spec-template.md" "$target/spec.md"

# Track the active feature in .specify/feature.json (git-ignored).
mkdir -p "$root/.specify"
printf '{"slug":"%s","created":"%s"}\n' "$slug" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  > "$root/.specify/feature.json"

printf "created: specs/%s/spec.md\n" "$slug"
printf "active feature: %s\n" "$slug"
