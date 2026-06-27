# "Submit Program & Music" Form — One-Time Setup Guide

This sets up the feature behind the **🎵 Auto-generate a "Submit Program & Music" form** checkbox in admin.html. Once one officer does these steps **one time**, every future event just needs a checkbox click — no coding, no copying forms by hand.

You do **not** need to know how to code. You're just copying and pasting a few things between two browser tabs.

---

## What this feature does

When an officer checks the box on an event in admin.html:
1. A brand-new copy of your music/program template form is created automatically.
2. The new form is renamed to something like `06.30.26 The Pointe Circle Summer Concert`.
3. The event's date and location are pre-filled into the new form wherever it finds questions mentioning "date" or "location."
4. A "📋 Submit Program and Music" button appears on the live site for that event, linking to the new form.

---

## Step 1 — Open the Apps Script editor

1. Open your template Google Form for editing (the one you want every event's form copied from).
2. Click the **⋮ (three dots)** menu in the top right → **Script editor** (or in newer Forms, **Apps Script** under the same menu).
3. This opens a new tab — Google's online code editor. It starts empty (or with a placeholder `myFunction(){}`).

## Step 2 — Paste in the script

1. In this website folder, open the file **`music-form-apps-script.gs`** in any text editor (Notepad, TextEdit, VS Code — anything works) and copy its entire contents.
2. Back in the Apps Script editor tab, delete whatever's there by default, then paste in what you copied.
3. Click the **💾 Save** icon (or press Ctrl+S / Cmd+S).

The script already has your template form's ID filled in — you don't need to change anything unless you want to.

## Step 3 — (Optional but recommended) Test it once

1. In the Apps Script editor, use the function dropdown near the **Run** button and select **`listTemplateQuestions`**.
2. Click **▶ Run**. The first time, Google will ask you to authorize the script — click through **Review permissions → (your account) → Advanced → Go to (project name) → Allow**. This is normal; it's just Google confirming *you* own this script and the form.
3. After it finishes, go to **View → Logs** (or **Executions** in the left sidebar) to see a list of every question in your template and its type.
4. Confirm you see your Date and Location questions listed — if their titles don't contain the words "date" or "location" anywhere, let your developer/admin know so the matching can be adjusted.

## Step 4 — Deploy as a Web App

1. Click **Deploy** (top right) → **New deployment**.
2. Click the ⚙️ gear icon next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description:** anything, e.g. "Music form generator"
   - **Execute as:** **Me** (your account)
   - **Who has access:** **Anyone** *(this does not give anyone access to your Drive — it only lets admin.html call this one specific script)*
4. Click **Deploy**.
5. Google will show you a **Web app URL** — it looks like `https://script.google.com/macros/s/AKfycb.../exec`. **Copy this whole URL.**

   You may be asked to authorize permissions again the first time — same as Step 3, this is expected.

## Step 5 — Paste the URL into admin.html

1. Open `admin.html` in a text editor.
2. Search for `MUSIC_FORM_SCRIPT_URL` (it's near the top of the `<script>` section, right after `ACTIVITY_META`).
3. You'll see this line:
   ```
   const MUSIC_FORM_SCRIPT_URL = ''; // <-- paste your deployed Apps Script Web App URL here
   ```
4. Paste your Web App URL between the quotes, so it looks like:
   ```
   const MUSIC_FORM_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
5. Save the file, and re-upload/save it the same way you normally publish site changes (e.g. through GitHub).

**That's it.** From now on, anyone checking the box in admin.html will generate a real, ready-to-share form — no further setup ever needed, even for officers in future years, as long as nobody deletes the Apps Script deployment.

---

## If something goes wrong

- **"Setup needed first" alert in admin.html** → `MUSIC_FORM_SCRIPT_URL` is still blank or wasn't saved — recheck Step 5.
- **"Could not generate the form" / an error message** → Open the Apps Script editor → **Executions** (left sidebar) to see the actual error from the most recent run; this usually points to a permissions or Form ID issue.
- **The new form's Date/Location aren't pre-filled, but the form itself was created fine** → the question titles in your template likely don't contain the words "date" or "location." Re-run `listTemplateQuestions` (Step 3) to check exact titles, then ask your developer/admin to adjust the matching keywords in `music-form-apps-script.gs`.
- **You want forms saved to a specific Drive folder instead of the root** → open `music-form-apps-script.gs`, find `DESTINATION_FOLDER_ID = ''`, and paste a folder's ID between the quotes (the ID is in that folder's own Google Drive URL).

If you ever want to retire this feature, you can simply leave `MUSIC_FORM_SCRIPT_URL` blank again — the checkbox will go back to telling people setup isn't finished, and no existing forms are deleted.
