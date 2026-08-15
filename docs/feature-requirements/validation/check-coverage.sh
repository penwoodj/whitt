#!/usr/bin/env bash
# check-coverage.sh — verify every GWT case ID in feature-requirements slices
# has a row in validation/coverage-manifest.tsv (and every manifest row points
# at a case that exists). Exits 1 on any gap.
#
# Usage: bash docs/feature-requirements/validation/check-coverage.sh

set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SLICES="$DIR/../slices"
MANIFEST="$DIR/coverage-manifest.tsv"

PATTERN='(APP|VOX|EXP|EXE|AGT|FIL|PIL|GIT|GRP|APPC|VOXC|EXPC|EXEC|AGTC|FILC|PILC|GITC|GRPC|LGT|NAV)-[0-9]{2}'

grep -rhoE "$PATTERN" "$SLICES" | sort -u > /tmp/slice-ids.txt

tail -n +2 "$MANIFEST" | cut -f1 | sort -u > /tmp/manifest-ids.txt

MISSING=$(comm -23 /tmp/slice-ids.txt /tmp/manifest-ids.txt)
ORPHAN=$(comm -13 /tmp/slice-ids.txt /tmp/manifest-ids.txt)

FAIL=0
if [ -n "$MISSING" ]; then
  echo "FAIL: cases in slices but NOT in manifest:"
  echo "$MISSING"
  FAIL=1
fi
if [ -n "$ORPHAN" ]; then
  echo "FAIL: manifest rows pointing at non-existent cases:"
  echo "$ORPHAN"
  FAIL=1
fi

TOTAL=$(wc -l < /tmp/manifest-ids.txt | tr -d ' ')
READY=$(awk -F'\t' 'NR>1 && $4=="ready"' "$MANIFEST" | wc -l | tr -d ' ')
DEFERRED=$(awk -F'\t' 'NR>1 && $4 ~ /deferred/' "$MANIFEST" | wc -l | tr -d ' ')
echo "Coverage: $TOTAL cases mapped, $READY ready, $DEFERRED deferred, $(($TOTAL - $READY - $DEFERRED)) todo."

exit $FAIL
