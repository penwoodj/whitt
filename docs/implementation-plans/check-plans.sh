#!/usr/bin/env bash
# check-plans.sh — mechanical verification of implementation plan suite.
# Exit 1 on any failure. Run from repo root or docs/implementation-plans/.
# CLI usage docs: see docs/implementation-plans/README.md#verification.
set -u
cd "$(dirname "$0")" || exit 1
ROOT="$(cd ../.. && pwd)"
PLANS_DIR="$PWD"
FAIL=0
err() { echo "FAIL: $1"; FAIL=1; }
ok() { echo "ok: $1"; }

echo "== 1. Suite file inventory =="
EXPECT="README.md EXECUTION-PROTOCOL.md"
for f in $EXPECT; do [ -f "$f" ] && ok "$f" || err "missing $f"; done
for d in CONTEXT ENABLERS SLICES; do [ -d "$d" ] && ok "$d/" || err "missing $d/"; done
for f in CONTEXT/TEMPLATE.md CONTEXT/C0-reference-repos.md CONTEXT/C1-decision-register.md CONTEXT/C2-xyflow12-migration-facts.md; do
  [ -f "$f" ] && ok "$f" || err "missing $f"
done
for n in 01 02 03 04 05 06 07 08 09 10 11; do
  f=$(ls SLICES/S${n}-*.md 2>/dev/null | head -1)
  [ -n "$f" ] && ok "$f" || err "missing SLICES/S${n}-*.md"
done
for n in 1 2 3 4; do
  f=$(ls ENABLERS/E${n}-*.md 2>/dev/null | head -1)
  [ -n "$f" ] && ok "$f" || err "missing ENABLERS/E${n}-*.md"
done

echo "== 2. Template sections present in every plan =="
SECTIONS=("Objective" "Inputs (READ FIRST" "File plan" "Question-cycle gate" "Tasks (incremental" "Skill + agent routing" "Live-system validation gate" "Retry loop" "Out of scope")
for f in SLICES/S*.md ENABLERS/E*.md; do
  for s in "${SECTIONS[@]}"; do
    grep -q "$s" "$f" || err "$f missing section '$s'"
  done
done
ok "all plans have 9 template sections"

echo "== 3. No TBD/TODO placeholders =="
BAD=$(grep -rn "TBD\|TODO:\|<fill in>" SLICES ENABLERS 2>/dev/null | grep -v "test.todo" | grep -vi "no TBD" | grep -v "TBD placeholders" || true)
[ -z "$BAD" ] && ok "no placeholders" || { echo "$BAD"; err "placeholders found"; }

echo "== 4. Case IDs exist in coverage manifest =="
MANIFEST="$ROOT/docs/feature-requirements/validation/coverage-manifest.tsv"
[ -f "$MANIFEST" ] || { err "manifest missing"; exit 1; }
IDS=$(cut -f1 "$MANIFEST" | tail -n +2 | sort -u)
CHECKED=0
for f in SLICES/S*.md ENABLERS/E*.md; do
  for cid in $(grep -oE '\b(APP|VOX|EXP|EXE|AGT|FIL|PIL|GIT|GRP|NAV)(C)?-[0-9]+\b' "$f" | sort -u); do
    CHECKED=$((CHECKED+1))
    echo "$IDS" | grep -qx "$cid" || err "$f cites unknown case $cid"
  done
done
ok "$CHECKED case-ID references all resolve"

echo "== 5. .repos/ paths exist on disk =="
for f in SLICES/S*.md ENABLERS/E*.md CONTEXT/C0-reference-repos.md; do
  for p in $(grep -oE '\.repos/[A-Za-z0-9._/-]+' "$f" | sort -u | grep -v '<' || true); do
    base=$(echo "$p" | cut -d/ -f2)
    [ -d "$ROOT/.repos/$base" ] || err "$f references uncloned repo .$ROOT/.repos/$base ($p)"
  done
done
ok "all .repos references point to cloned repos"

echo "== 6. vision-graph-ui paths in file plans exist or are sanctioned creates =="
for f in SLICES/S*.md ENABLERS/E*.md; do
  for p in $(grep -oE 'vision-graph-ui/src/[A-Za-z0-9._/-]+' "$f" | sort -u || true); do
    if [ ! -e "$ROOT/$p" ]; then
      grep -q "create" "$f" || err "$f references nonexistent $p without create row"
    fi
  done
done
ok "src paths verified"

echo "== 7. Status lines set =="
for f in SLICES/S*.md ENABLERS/E*.md; do
  grep -q "Status: NOT-STARTED\|Status: IN-PROGRESS\|Status: CASES-PASSING\|Status: DONE" "$f" || err "$f missing status line"
done
ok "all status lines present"

echo "== 8. Every slice plan cites its validation spec =="
for n in 01 02 03 04 05 06 07 08 09 10 11; do
  f=$(ls SLICES/S${n}-*.md 2>/dev/null | head -1)
  [ -n "$f" ] && grep -q "slice-${n}.validation.md" "$f" || err "$f does not cite validation spec"
done
ok "validation specs cited"

echo ""
[ "$FAIL" -eq 0 ] && echo "PLANS GREEN" || { echo "PLANS RED — fix above"; exit 1; }
