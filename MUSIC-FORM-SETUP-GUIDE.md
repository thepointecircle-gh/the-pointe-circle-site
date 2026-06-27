# "Submit Program & Music" Form — One-Time Setup Guide

This sets up the feature behind the **🎵 Auto-generate a "Submit Program & Music" form** checkbox in admin.html. Once one officer does these steps **one time**, every future event just needs a checkbox click — no coding, no copying forms by hand.

You do **not** need to know how to code. You're just copying and pasting a few things between two browser tabs.

---

## What this feature does

When an officer checks the box on an event in admin.html:
1. A brand-new copy of your music/program template form is created automatically.
2. The new form is renamed to something like `06.30.26 Summer Concert` (date prefix + the event's title, nothing else).
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

## Step 3 — Test it once (do not skip this — it's how Drive access gets granted)

The Web App in Step 4 can only touch your Drive once you've personally clicked through Google's one-time permission screen. The only way to trigger that screen is to manually run a function here in the editor that actually uses Drive — it does **not** happen automatically when admin.html calls the Web App later. Skipping this step is the #1 cause of the error "*You do not have permission to call DriveApp.getFileById*."

1. In the Apps Script editor, use the function dropdown near the **Run** button and select **`testDriveAccess`** (not `listTemplateQuestions` — that one only touches the form itself, which doesn't require this permission, so it won't trigger the popup you need).
2. Click **▶ Run**. Google should ask you to authorize the script — click through **Review permissions → (your account)**. If you see "Google hasn't verified this app," that's expected for a script you wrote yourself — click **Advanced → Go to (project name) (unsafe) → Allow**.
   - You may actually see **two separate permission prompts** here, one after another — Google treats "read a file" and "make a copy of a file" as two different permissions, even though both are "Drive access." Click through Allow on both if asked.
3. Check **View → Logs** (or **Executions** in the left sidebar) — you should see:
   ```
   ✅ Drive read access OK — found file: ...
   ✅ Drive write access OK — created test copy: ...
   ```
   If you see a red error instead, read it directly; it usually means you're not logged into the same Google account that has access to the template form.
4. This test deliberately creates one real copy of your template form in your Drive, named `TEST COPY — safe to delete (created by testDriveAccess)`. Find it in Drive and delete it — it served its purpose once the logs above show both ✅ lines.
5. Then also run **`listTemplateQuestions`** the same way, and check the logs to confirm you see your Date and Location questions listed — if their titles don't contain the words "date" or "location" anywhere, let your developer/admin know so the matching can be adjusted.

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
- **"Could not generate the form: You do not have permission to call DriveApp.getFileById..."** or **"...DriveApp.File.makeCopy..."** → Step 3 was skipped, run incompletely, or you ran `listTemplateQuestions` instead of `testDriveAccess`. These are actually two *separate* Google permissions — "read a file" (`getFileById`) and "make a copy of a file" (`makeCopy`) — and you need both. Go to the Apps Script editor, select `testDriveAccess` in the function dropdown, click ▶ Run, and click Allow through every prompt that appears (there may be more than one). Confirm the log shows **both** "✅ Drive read access OK" and "✅ Drive write access OK" lines before trying the checkbox again — if you only see the first ✅ line, the write permission still hasn't been granted. No redeploy needed once both show up.
  - **If running `testDriveAccess` shows no popup at all and just errors in red** → read the exact error text in the log. It almost always means the Google account you're currently logged into in the Apps Script editor doesn't have access to the template form itself — switch to the account that owns/edits the template, then run it again.
  - If it still fails after both ✅ lines show up → redeploy (**Deploy → Manage deployments → ✏️ Edit → Deploy**) while logged into that same account.
- **"Could not generate the form" with a different error message** → Open the Apps Script editor → **Executions** (left sidebar) to see the actual error from the most recent run; this usually points to a permissions or Form ID issue.
- **The new form's Date/Location aren't pre-filled, but the form itself was created fine** → the question titles in your template likely don't contain the words "date" or "location." Re-run `listTemplateQuestions` (Step 3) to check exact titles, then ask your developer/admin to adjust the matching keywords in `music-form-apps-script.gs`.
- **You want forms saved to a specific Drive folder instead of the root** → open `music-form-apps-script.gs`, find `DESTINATION_FOLDER_ID = ''`, and paste a folder's ID between the quotes (the ID is in that folder's own Google Drive URL).

If you ever want to retire this feature, you can simply leave `MUSIC_FORM_SCRIPT_URL` blank again — the checkbox will go back to telling people setup isn't finished, and no existing forms are deleted.
