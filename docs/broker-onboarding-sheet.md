# Broker Onboarding → Google Drive + Sheet

When a broker completes the onboarding form, `api/brokers/onboarding.ts`:

1. Emails the Bayview team the broker's info with the **signed NDA as a PDF**
   and all uploaded documents attached.
2. Creates a **per-broker subfolder** in a shared Drive folder and uploads the
   signed NDA (PDF) plus every document the broker submitted (W-9/1099,
   government ID, voided check / bank letter, and any extra file).
3. Appends a row to the tracking sheet, linking that Drive folder.

Steps 2–3 run after the email and are **best-effort** — if Google is not
configured or a call fails, the submission and email still succeed and the
Drive/sheet step is skipped (logged to the function logs).

## Where things live

- **Shared documents folder:** [Bayview — Broker Onboarding Documents](https://drive.google.com/drive/folders/1sfqdk0gmeIgluCgCAc3-YoWfkWe-WYcx)
  (`1sfqdk0gmeIgluCgCAc3-YoWfkWe-WYcx`) — holds one subfolder per broker and the
  tracking sheet.
- **Tracking sheet:** [Bayview Advance — Onboarded Brokers](https://docs.google.com/spreadsheets/d/1VmAp74B7Cm-YghuZKv-cImijVKSqQ5Xzk8QBCM8GfuE/edit)
  (`1VmAp74B7Cm-YghuZKv-cImijVKSqQ5Xzk8QBCM8GfuE`)

Sheet columns: `Date Onboarded · Name · Phone Number · Email · Status · Close Account · Documents (Drive) · Notes`

- `Status` is written as `Pending` automatically.
- `Close Account` is left blank for ops to fill in manually.
- `Documents (Drive)` links the broker's subfolder (NDA + all uploaded files).

## Required setup (to turn it on)

The Drive/sheet automation stays dormant until a Google service account is
configured (the PDF-in-email fix works without any of this):

1. In Google Cloud Console, create a **service account**; enable the
   **Google Sheets API** and **Google Drive API**; create a **JSON key**.
2. Share the documents folder (above) **and** the tracking sheet with the
   service-account email as **Editor**. (Sharing the folder also shares the
   per-broker subfolders the function creates inside it.)
3. Set these env vars in Vercel:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (keep the `\n` escapes)
   - `BROKERS_SHEET_ID` = `1VmAp74B7Cm-YghuZKv-cImijVKSqQ5Xzk8QBCM8GfuE`
   - `BROKERS_DRIVE_FOLDER_ID` = `1sfqdk0gmeIgluCgCAc3-YoWfkWe-WYcx`
   - `BROKERS_NDA_SHARE_DOMAIN` (optional — e.g. `optentia.com`, to grant the
     whole Workspace read access to each broker folder)

> `BROKERS_NDA_FOLDER_ID` is still accepted as a fallback for
> `BROKERS_DRIVE_FOLDER_ID`.

## Open items

- [ ] Service account + env vars not yet provisioned (above).
- [ ] **End-to-end run untested** — submit one real onboarding after setup to
      confirm the subfolder, files, and sheet row appear.
- [ ] **Folder sharing left at default** (per request): broker folders are only
      visible to whoever can see the parent documents folder.
      `BROKERS_NDA_SHARE_DOMAIN` is supported but intentionally not set.
- [ ] Earlier empty draft sheets of the same name exist in Drive and can be
      trashed manually (no delete tool was available during setup).
