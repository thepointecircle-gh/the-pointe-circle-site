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
5. The new form is explicitly **published** through Google's Forms system, so it's actually reachable by the public the moment it's created (Google added a separate "Publish" switch to Forms that, if skipped, shows visitors "We're sorry. This document is not published." even on an otherwise-working form — this step prevents that).
6. *(if Step 6 below is set up)* The form automatically closes itself — stops accepting new responses — the day after the event happens, with nobody needing to do anything.
7. *(if Step 7 below is set up)* The new form lands directly inside a Drive folder you choose (e.g. "The Pointe Circle → Activities") instead of loose in your Drive's root.

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
   - You may actually see **several separate permission prompts** here, one after another — Google treats "read a file," "make a copy of a file," and "make a web request to publish the form" as different permissions, even though they're all part of the same feature. Click through Allow on all of them if asked.
3. Check **View → Logs** (or **Executions** in the left sidebar) — you should see:
   ```
   ✅ Drive read access OK — found file: ...
   ✅ Drive write access OK — created test copy: ...
   ✅ Form-publish access OK — successfully published the test copy.
   ```
   If you see a red error instead, read it directly; it usually means you're not logged into the same Google account that has access to the template form. A red **"⚠️ Form-publish access FAILED"** line specifically means the "Submit Program and Music" button will keep showing visitors "This document is not published" until that one gets fixed — re-run this step after addressing whatever the error text says.
   - **If that error mentions "Google Forms API has not been used in project ... or it is disabled" (HTTP 403, SERVICE_DISABLED)** — this is expected the very first time, and is a one-time switch every Apps Script project needs flipped on. The error message includes a link like `https://console.developers.google.com/apis/api/forms.googleapis.com/overview?project=...` — click it (while logged into the same Google account), click the blue **Enable** button on that page, wait 2-3 minutes for it to take effect, then run `testDriveAccess` again.
4. This test deliberately creates one real copy of your template form in your Drive, named `TEST COPY — safe to delete (created by testDriveAccess)`. Find it in Drive and delete it — it served its purpose once the logs above show all three ✅ lines.
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

**The core feature is done at this point.** Step 6 below is optional but recommended — it makes old forms close themselves automatically so people can't submit late responses to a past event.

## Step 6 (optional but recommended) — Make forms auto-close after their event

Without this step, every generated form stays open to responses forever — harmless, but it means someone could still submit to a form for an event that already happened. This step makes that close itself automatically, with nobody needing to remember to do it.

1. In the Apps Script editor, click the **⏰ clock icon** in the left sidebar (this is "Triggers").
2. Click **+ Add Trigger** (bottom right).
3. Fill in:
   - **Choose which function to run:** `closeExpiredForms`
   - **Choose which deployment should run:** Head
   - **Select event source:** Time-driven
   - **Select type of time based trigger:** Day timer
   - **Select time of day:** any time you like, e.g. midnight to 1am
4. Click **Save**. You may be asked to authorize permissions again — same as Step 3, this is expected; click through it.

## Step 7 (recommended) — Save generated forms into a specific Drive folder

By default, every auto-generated form lands loose in your Drive's root (the main "My Drive" view) — not inside any folder. If you'd rather they all land inside a specific folder (e.g. **The Pointe Circle → Activities**), here's how:

1. In Google Drive, open the folder you want forms to land in (e.g. navigate into **The Pointe Circle**, then into **Activities**).
2. Look at the address bar in your browser. The URL will look like:
   ```
   https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
   ```
3. Copy the **whole address bar URL** — you don't need to trim it down to just the ID; the script figures that part out on its own.
4. Open `music-form-apps-script.gs` in the Apps Script editor, find this line near the top:
   ```
   var DESTINATION_FOLDER_ID = '';
   ```
5. Paste what you copied between the quotes — either the full link or just the ID both work, so this is hard to get wrong:
   ```
   var DESTINATION_FOLDER_ID = 'https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz';
   ```
6. Click **💾 Save**, then redeploy so the live Web App picks up the change: **Deploy → Manage deployments → ✏️ Edit (next to your existing deployment) → Version: New version → Deploy**.

From that point on, every newly generated Program/Music form lands directly in that folder — no extra clicks needed per event.

**Note on moving your existing template form and any already-generated forms:** moving a file to a different Drive folder never changes its ID or its link (edit link, published link, or pre-filled link). So you can freely drag your template form and any past Program/Music forms into **The Pointe Circle → Activities** (or wherever you like) at any time — nothing on the website or in admin.html needs to be updated or relinked because of that move. Step 7 above only controls where *future* auto-generated copies land; it doesn't move anything that already exists.

**That's it.** From now on, anyone checking the box in admin.html will generate a real, ready-to-share form — no further setup ever needed, even for officers in future years, as long as nobody deletes the Apps Script deployment or this trigger.

---

## If something goes wrong

- **"Setup needed first" alert in admin.html** → `MUSIC_FORM_SCRIPT_URL` is still blank or wasn't saved — recheck Step 5.
- **"Could not generate the form: You do not have permission to call DriveApp.getFileById..."** or **"...DriveApp.File.makeCopy..."** → Step 3 was skipped, run incompletely, or you ran `listTemplateQuestions` instead of `testDriveAccess`. These are actually two *separate* Google permissions — "read a file" (`getFileById`) and "make a copy of a file" (`makeCopy`) — and you need both. Go to the Apps Script editor, select `testDriveAccess` in the function dropdown, click ▶ Run, and click Allow through every prompt that appears (there may be more than one). Confirm the log shows **both** "✅ Drive read access OK" and "✅ Drive write access OK" lines before trying the checkbox again — if you only see the first ✅ line, the write permission still hasn't been granted. No redeploy needed once both show up.
  - **If running `testDriveAccess` shows no popup at all and just errors in red** → read the exact error text in the log. It almost always means the Google account you're currently logged into in the Apps Script editor doesn't have access to the template form itself — switch to the account that owns/edits the template, then run it again.
  - If it still fails after both ✅ lines show up → redeploy (**Deploy → Manage deployments → ✏️ Edit → Deploy**) while logged into that same account.
- **The generated form/button shows visitors "We're sorry. This document is not published."** → Google added a separate "Publish" switch to Forms, on top of the older "Accepting responses" setting — a form can be open to responses yet still unpublished, and only this specific switch controls whether outside visitors can open the link at all. Go to the Apps Script editor, select `testDriveAccess` in the function dropdown, click ▶ Run, click Allow on any new permission prompt (there's a third one now, specifically for this), and confirm the log shows **"✅ Form-publish access OK."** Any *future* generated forms will publish themselves automatically from then on. Forms generated *before* this fix was set up need to be published once by hand: open the form itself in Google Forms → click **Publish** (top right) → **Publish** in the dialog that appears.
- **"Could not generate the form" with a different error message** → Open the Apps Script editor → **Executions** (left sidebar) to see the actual error from the most recent run; this usually points to a permissions or Form ID issue.
- **The new form's Date/Location aren't pre-filled, but the form itself was created fine** → the question titles in your template likely don't contain the words "date" or "location." Re-run `listTemplateQuestions` (Step 3) to check exact titles, then ask your developer/admin to adjust the matching keywords in `music-form-apps-script.gs`.
- **You want forms saved to a specific Drive folder instead of the root** → see Step 7 above.
- **Newly generated forms are still landing in the Drive root after setting `DESTINATION_FOLDER_ID`** → you saved the script but forgot to redeploy. Code changes only reach the live Web App after **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy** (same as any other change to this file).
- **Old forms aren't closing themselves after their event passed** → make sure Step 6 was completed (check the ⏰ Triggers page in the Apps Script editor — you should see one trigger listed for `closeExpiredForms`). You can also select `closeExpiredForms` in the function dropdown and click ▶ Run any time to immediately close everything that's currently overdue, instead of waiting for the next scheduled run.
- **A form generated *before* Step 6 was set up never auto-closes** → that's expected; only forms created after the trigger exists get remembered for auto-closing. To close an older one yourself, open it in Google Forms → **Responses** tab → toggle "Accepting responses" off.

If you ever want to retire this feature, you can simply leave `MUSIC_FORM_SCRIPT_URL` blank again — the checkbox will go back to telling people setup isn't finished, and no existing forms are deleted.
