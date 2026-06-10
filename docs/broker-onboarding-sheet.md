# Broker Onboarding → Google Sheet logging

When a broker completes the onboarding form, `api/brokers/onboarding.ts` appends
a row to a Google Sheet and uploads the signed NDA to Drive (linked in the row).
This runs after the notification email and is **best-effort** — if Google is not
configured or the call fails, the submission and email still succeed and the
sheet write is skipped (logged to the function logs).

**Tracking sheet:** [Bayview Advance — Onboarded Brokers](https://docs.google.com/spreadsheets/d/1d3VEhgRCbDbylnCzact8RZ_iw1O9V2r0_LZci3XVWUg/edit)

Columns: `Date Onboarded · Name · Phone Number · Email · Status · Close Account · Signed NDA · Notes`

- `Status` is written as `Pending` automatically.
- `Close Account` is left blank for ops to fill in manually.

## Required setup (NOT yet done)

The integration is dormant until a Google service account is configured. Steps:

1. Create a Google Cloud service account; enable the **Google Sheets API** and
   **Google Drive API**; create a JSON key.
2. Share the tracking sheet with the service-account email as **Editor**.
3. (Recommended) Create a Drive folder for NDAs, share it with the service
   account and the ops team, and note its folder ID.
4. Set these env vars in Vercel:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (keep the `\n` escapes)
   - `BROKERS_SHEET_ID` = `1d3VEhgRCbDbylnCzact8RZ_iw1O9V2r0_LZci3XVWUg`
   - `BROKERS_NDA_FOLDER_ID` (optional)
   - `BROKERS_NDA_SHARE_DOMAIN` (optional)

## Unfinished / open items

- [ ] Service account + env vars not yet provisioned (above).
- [ ] **End-to-end run untested** — submit one real onboarding after setup to
      confirm the row and NDA link appear.
- [ ] **NDA Drive sharing left as default** (per request): NDAs are only visible
      to whoever can see the `BROKERS_NDA_FOLDER_ID` folder. `BROKERS_NDA_SHARE_DOMAIN`
      (e.g. `optentia.com`) is supported but intentionally not set. Decide on a
      sharing policy before relying on the links.
- [ ] Signed NDA is uploaded as HTML converted to a Google Doc; the embedded
      signature image (a data-URI) may not survive the conversion. The
      authoritative signed copy remains the email attachment.
- [ ] An empty duplicate draft sheet of the same name exists in Drive and should
      be trashed manually (no delete tool was available during setup).
