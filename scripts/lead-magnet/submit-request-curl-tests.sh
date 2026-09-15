#!/usr/bin/env bash
#
# Integration tests for the submit-lead-magnet-request Edge Function.
#
# Runs ONLY against jitpro_website with LEAD_MAGNET_TEST_MODE=true,
# LEAD_MAGNET_TURNSTILE_TEST_SECRET set to Cloudflare's always-pass test
# secret, and LEAD_MAGNET_TEST_FAULT_SECRET set. See README.md beside this
# file for prerequisites, the exact rows each run creates, and cleanup.
#
# Every address is a Resend test recipient (delivered+lm-test-<run-id>-<x>@resend.dev)
# and every stored row carries utm_campaign=lm-test and utm_content=<run-id>.
# No real prospect address is used. One recovery alert is emailed to
# info@jit-pro.com (case 15).
#
# Usage:
#   LEAD_MAGNET_FUNCTION_URL=https://pynjyrvnokfexyudimsn.supabase.co/functions/v1/submit-lead-magnet-request \
#   SUPABASE_ANON_KEY=... \
#   LEAD_MAGNET_TEST_FAULT_SECRET=... \
#   scripts/lead-magnet/submit-request-curl-tests.sh <run-id>
#
# <run-id>: 3 to 32 lowercase letters, digits, or hyphens, unique per run (e.g. 20260916a).
# Wait at least 10 minutes after any earlier run from the same network, or the
# rate-limit case will not line up.

set -uo pipefail

: "${LEAD_MAGNET_FUNCTION_URL:?set LEAD_MAGNET_FUNCTION_URL}"
: "${SUPABASE_ANON_KEY:?set SUPABASE_ANON_KEY}"
: "${LEAD_MAGNET_TEST_FAULT_SECRET:?set LEAD_MAGNET_TEST_FAULT_SECRET}"

RUN_ID="${1:-}"
if [[ ! "$RUN_ID" =~ ^[a-z0-9-]{3,32}$ ]]; then
  echo "usage: $0 <run-id>   (3-32 lowercase letters, digits, hyphens)" >&2
  exit 2
fi

case "$LEAD_MAGNET_FUNCTION_URL" in
  https://pynjyrvnokfexyudimsn.supabase.co/functions/v1/submit-lead-magnet-request) ;;
  *)
    echo "refusing to run: LEAD_MAGNET_FUNCTION_URL is not the jitpro_website function URL" >&2
    exit 2
    ;;
esac

URL="$LEAD_MAGNET_FUNCTION_URL"
DUMMY_TOKEN="XXXX.DUMMY.TOKEN.XXXX"
GUIDE_URL="https://jit-pro.com/guides/procurement-field-guide"
PASSED=0
FAILED=0
STATUS=""
BODY=""
HEADERS=""

email_for() {
  echo "delivered+lm-test-${RUN_ID}-$1@resend.dev"
}

# request_body <email> <marketing_opt_in true|false> [extra JSON members, each starting with a comma]
request_body() {
  printf '{"email":"%s","asset_id":"procurement-field-guide","placement":"landing-page","page_path":"/field-guide?utm_campaign=lm-test#top","landing_path":"/field-guide?utm_campaign=lm-test","referrer":"https://www.linkedin.com/feed/?trk=lm-test#x","utm_source":"lm-test-script","utm_medium":"cli","utm_campaign":"lm-test","utm_content":"%s","marketing_opt_in":%s,"consent_text_version":"v1","turnstile_token":"%s"%s}' \
    "$1" "$RUN_ID" "$2" "$DUMMY_TOKEN" "${3:-}"
}

# post <json> [extra curl args...]
post() {
  local data="$1"
  shift
  local output
  output=$(curl -sS -X POST "$URL" \
    -H "Content-Type: application/json" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    "$@" \
    --data "$data" \
    -w $'\n%{http_code}')
  BODY="${output%$'\n'*}"
  STATUS="${output##*$'\n'}"
}

# request_raw <method> [extra curl args...] : captures status and response headers
request_raw() {
  local method="$1"
  shift
  HEADERS=$(curl -sS -o /dev/null -D - -X "$method" "$URL" "$@" | tr -d '\r' | tr '[:upper:]' '[:lower:]')
  STATUS=$(printf '%s' "$HEADERS" | head -n 1 | awk '{print $2}')
}

record() {
  local name="$1" ok="$2" detail="$3"
  if [[ "$ok" == "yes" ]]; then
    PASSED=$((PASSED + 1))
    printf 'PASS  %s\n' "$name"
  else
    FAILED=$((FAILED + 1))
    printf 'FAIL  %s  (%s)\n' "$name" "$detail"
  fi
}

# expect <name> <status> <substring>...
expect() {
  local name="$1" status="$2"
  shift 2
  local ok="yes" detail="status ${STATUS}, body ${BODY}"
  [[ "$STATUS" == "$status" ]] || ok="no"
  for fragment in "$@"; do
    [[ "$BODY" == *"$fragment"* ]] || ok="no"
  done
  record "$name" "$ok" "$detail"
}

echo "submit-lead-magnet-request integration tests, run ${RUN_ID}"
echo "target: ${URL}"
echo

# 01-04: new and repeat requests, both checkbox states
post "$(request_body "$(email_for a)" false)"
expect "01 new contact, unchecked" 200 '"ok":true' '"stored":true' '"email_status":null' "\"guide_url\":\"${GUIDE_URL}\""

post "$(request_body "$(email_for a)" false)"
expect "02 repeat request, unchecked" 200 '"stored":true'

post "$(request_body "$(email_for a)" true)"
expect "03 repeat request, checked (becomes marketing_opt_in)" 200 '"stored":true'

post "$(request_body "$(email_for b)" true)"
expect "04 new contact, checked" 200 '"stored":true'

# 05-09: validation
post "$(request_body "not-an-email" false)"
expect "05 invalid email" 400 '"error":"invalid_email"' '"guide_url":null' '"stored":false'

post "$(request_body "$(email_for x)" false | sed 's/"procurement-field-guide"/"unknown-guide"/')"
expect "06 unknown asset" 400 '"error":"invalid_request"' '"guide_url":null'

post "$(request_body "$(email_for x)" false | sed 's/"landing-page"/"nav-cta"/')"
expect "07 unknown placement" 400 '"error":"invalid_request"' "\"guide_url\":\"${GUIDE_URL}\""

post "$(request_body "$(email_for x)" false | sed 's/"v1"/"v999"/')"
expect "08 unknown consent text version" 400 '"error":"invalid_request"'

post '{not json'
expect "09 body is not JSON" 400 '"error":"invalid_request"'

# 10: honeypot (ordinary-looking success, nothing stored)
post "$(request_body "$(email_for c)" false ',"website":"http://spam.example"')"
expect "10 honeypot filled" 200 '"ok":true' '"stored":true'

# 11: Turnstile token missing
post "$(request_body "$(email_for d)" false | sed "s/\"turnstile_token\":\"${DUMMY_TOKEN}\"/\"turnstile_token\":\"\"/")"
expect "11 Turnstile token missing" 403 '"error":"verification_failed"' "\"guide_url\":\"${GUIDE_URL}\""

# 12: test mode refuses an outside recipient before anything is stored
post "$(request_body "lm-test-${RUN_ID}@example.com" false)"
expect "12 test mode refuses outside recipient" 403 '"error":"test_mode_refused"' "\"guide_url\":\"${GUIDE_URL}\""

# 13-15: the persistence-failure hook requires test mode, the header, AND the secret
post "$(request_body "$(email_for e)" false)" -H "x-lead-magnet-test-fault: persistence"
expect "13 fault header alone does not simulate failure" 200 '"stored":true'

post "$(request_body "$(email_for f)" false)" \
  -H "x-lead-magnet-test-fault: persistence" \
  -H "x-lead-magnet-test-fault-secret: wrong-secret-wrong-secret-wrong-secret"
expect "14 fault header with wrong secret does not simulate failure" 200 '"stored":true'

post "$(request_body "$(email_for g)" false)" \
  -H "x-lead-magnet-test-fault: persistence" \
  -H "x-lead-magnet-test-fault-secret: ${LEAD_MAGNET_TEST_FAULT_SECRET}"
expect "15 simulated persistence failure fails open (recovery alert to info@)" 200 '"ok":true' '"stored":false' "\"guide_url\":\"${GUIDE_URL}\""

# 16-18: CORS and method handling
request_raw OPTIONS -H "Origin: https://jit-pro.com" -H "Access-Control-Request-Method: POST"
if [[ "$STATUS" == "204" && "$HEADERS" == *"access-control-allow-origin: https://jit-pro.com"* ]]; then
  record "16 preflight from allowed origin" yes ""
else
  record "16 preflight from allowed origin" no "status ${STATUS}"
fi

request_raw OPTIONS -H "Origin: https://evil.example" -H "Access-Control-Request-Method: POST"
if [[ "$STATUS" == "403" && "$HEADERS" != *"access-control-allow-origin"* ]]; then
  record "17 preflight from disallowed origin is refused and not reflected" yes ""
else
  record "17 preflight from disallowed origin is refused and not reflected" no "status ${STATUS}"
fi

request_raw GET
if [[ "$STATUS" == "405" ]]; then
  record "18 GET is not allowed" yes ""
else
  record "18 GET is not allowed" no "status ${STATUS}"
fi

# 19: rate limit. Cases 01-04 and 13-15 recorded 7 attempts from this address;
# attempts 8-10 succeed and attempt 11 is refused with the guide.
RATE_RESULTS=""
for attempt in 1 2 3 4; do
  post "$(request_body "$(email_for h)" false)"
  RATE_RESULTS="${RATE_RESULTS}${STATUS} "
done
if [[ "$RATE_RESULTS" == "200 200 200 429 " && "$BODY" == *'"error":"rate_limited"'* && "$BODY" == *"\"guide_url\":\"${GUIDE_URL}\""* ]]; then
  record "19 eleventh attempt in ten minutes is rate limited, guide still returned" yes ""
else
  record "19 eleventh attempt in ten minutes is rate limited, guide still returned" no "statuses ${RATE_RESULTS}"
fi

echo
echo "run ${RUN_ID}: ${PASSED} passed, ${FAILED} failed"
[[ "$FAILED" -eq 0 ]]
