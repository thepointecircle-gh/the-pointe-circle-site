/**
 * The Pointe Circle — "Submit Program & Music" form auto-generator
 * ------------------------------------------------------------------
 * See MUSIC-FORM-SETUP-GUIDE.md (same folder as admin.html) for the
 * one-time deployment steps. Once deployed, paste the Web App URL into
 * admin.html's MUSIC_FORM_SCRIPT_URL constant — nobody needs to touch
 * this file again after that.
 *
 * What this does, every time an officer checks the "Submit Program &
 * Music" box on an event in admin.html:
 *   1. Makes a fresh copy of the template form (so events never share
 *      or overwrite each other's forms).
 *   2. Renames the copy: "MM.DD.YY The Pointe Circle <Event Title>".
 *   3. Looks at the new copy's own questions and finds whichever ones
 *      mention "date" or "location" in their titles (this works even
 *      if the exact wording is tweaked later — it just needs those
 *      keywords to appear somewhere in the question title).
 *   4. Builds a pre-filled link with the event's real date/location
 *      already filled in, so respondents never retype them.
 *   5. Sends that link back to admin.html, which saves it on the event
 *      and shows a "Submit Program and Music" button on the live site.
 */

// ── ONE-TIME SETUP ──────────────────────────────────────────────────
// The template form's edit-mode ID (the part of the URL between
// /forms/d/ and /edit when you open the template for editing).
var TEMPLATE_FORM_ID = '1QG2_DOtRe5W6foRmks-fd2B6lvsa8fGlQIVa1XX7WiE';

// Optional: paste a Google Drive folder ID here if you'd like every
// auto-generated form copy to land in one specific folder instead of
// your Drive's root. Leave as '' to skip this.
var DESTINATION_FOLDER_ID = '';
// ─────────────────────────────────────────────────────────────────────

function doPost(e) {
  var result;
  try {
    var body = JSON.parse(e.postData.contents);
    var eventTitle = (body.title || '').trim();
    var eventDate = (body.date || '').trim();
    var eventLocation = (body.location || '').trim();

    if (!eventTitle) throw new Error('Missing event title.');

    var newFormName = buildFormTitle(eventTitle, eventDate);

    // 1) Duplicate the template.
    var templateFile = DriveApp.getFileById(TEMPLATE_FORM_ID);
    var copy = DESTINATION_FOLDER_ID
      ? templateFile.makeCopy(newFormName, DriveApp.getFolderById(DESTINATION_FOLDER_ID))
      : templateFile.makeCopy(newFormName);

    // 2) Open the new copy and make sure its internal title matches too
    //    (makeCopy sets the Drive file name; this sets the Form's own title).
    var newForm = FormApp.openById(copy.getId());
    newForm.setTitle(newFormName);

    // 3) Find "Date" / "Location" questions by keyword match (case-insensitive,
    //    matches "Date", "Event Date", "What date...", etc. without needing
    //    the exact wording confirmed ahead of time).
    var prefill = {};
    newForm.getItems().forEach(function (item) {
      var lower = item.getTitle().toLowerCase();
      if (eventDate && !prefill.date && lower.indexOf('date') !== -1) {
        prefill.date = { item: item, value: eventDate };
      }
      if (eventLocation && !prefill.location && lower.indexOf('location') !== -1) {
        prefill.location = { item: item, value: eventLocation };
      }
    });

    // 4) Build a pre-filled link for whichever of those are plain
    //    text/paragraph questions (the normal case for "Date"/"Location").
    //    Anything else (e.g. multiple choice) is left for the respondent
    //    to fill in themselves rather than guessed at.
    var formResponse = newForm.createResponse();
    var filledAny = false;
    Object.keys(prefill).forEach(function (key) {
      var item = prefill[key].item;
      var value = prefill[key].value;
      try {
        if (typeof item.asTextItem === 'function') {
          formResponse.withItemResponse(item.asTextItem().createResponse(value));
          filledAny = true;
        }
      } catch (err) {
        // Not a plain text item — skip pre-filling this one.
      }
    });

    var url;
    if (filledAny) {
      try {
        url = formResponse.toPrefilledUrl();
      } catch (err) {
        url = newForm.getPublishedUrl();
      }
    } else {
      url = newForm.getPublishedUrl();
    }

    result = { url: url };
  } catch (err) {
    result = { error: err.message };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// "MM.DD.YY The Pointe Circle <Event Title>" — matches the convention:
// "Date: Mon.Day.XX(year) The Pointe Circle + Title"
function buildFormTitle(eventTitle, eventDateText) {
  var datePrefix = formatDatePrefix(eventDateText);
  return (datePrefix ? datePrefix + ' ' : '') + 'The Pointe Circle ' + eventTitle;
}

function formatDatePrefix(eventDateText) {
  if (!eventDateText) return '';
  var d = parseLooseDate(eventDateText);
  if (!d) return '';
  var mm = ('0' + (d.getMonth() + 1)).slice(-2);
  var dd = ('0' + d.getDate()).slice(-2);
  var yy = ('' + d.getFullYear()).slice(-2);
  return mm + '.' + dd + '.' + yy;
}

// admin.html sends either a raw "YYYY-MM-DD" (archiveDate) or the
// human-friendly "Shown on site as" text (e.g. "June 30, 2026 5:30 - 6:45
// PM") — this handles both.
function parseLooseDate(text) {
  var isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }
  var d = new Date(text);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Run this once manually from the Apps Script editor (select
 * "listTemplateQuestions" in the function dropdown, then click ▶ Run) to
 * double check which questions in your template will be matched as
 * "Date" / "Location" before relying on it live. Check View → Logs (or
 * View → Execution log) after running.
 *
 * NOTE: this function only touches FormApp on the form this script is
 * bound to, which a script can already do without asking permission —
 * so running this alone will NOT trigger Google's Drive permission
 * prompt. Run testDriveAccess (below) instead/first if you're trying to
 * fix a "You do not have permission to call DriveApp.getFileById" error.
 */
function listTemplateQuestions() {
  var form = FormApp.openById(TEMPLATE_FORM_ID);
  form.getItems().forEach(function (item, i) {
    Logger.log((i + 1) + '. [' + item.getType() + '] ' + item.getTitle());
  });
}

/**
 * Run this once manually (select "testDriveAccess" in the function
 * dropdown, then click ▶ Run) to force Google's Drive permission
 * prompts. doPost needs TWO separate Drive permissions — reading the
 * template (getFileById) AND making a copy of it (makeCopy) — and
 * Google treats those as different scopes. This function deliberately
 * exercises both, in that order, so both get requested/granted here.
 * Neither permission can ever be granted from inside the deployed Web
 * App itself (calls from admin.html never show a popup) — only a
 * manual run here in the editor can trigger it.
 *
 * If you see "Authorization required," click through Review
 * permissions → (your account) → Advanced → Go to (project name)
 * (unsafe) → Allow. If you see NO popup and instead get a red error in
 * the Execution log, read the error message directly: it most often
 * means you're not logged into the same Google account that owns (or
 * has edit access to) the template form, or that your account/
 * organization blocks "unverified app" consent outright — in either
 * case, check the error text and the troubleshooting section of
 * MUSIC-FORM-SETUP-GUIDE.md.
 *
 * This creates one real test copy of your template in Drive, clearly
 * named so you can find and delete it afterward — it's only there to
 * prove the "make a copy" permission actually works end-to-end.
 */
function testDriveAccess() {
  var file = DriveApp.getFileById(TEMPLATE_FORM_ID);
  Logger.log('✅ Drive read access OK — found file: ' + file.getName());

  var copy = file.makeCopy('TEST COPY — safe to delete (created by testDriveAccess)');
  Logger.log('✅ Drive write access OK — created test copy: ' + copy.getUrl());
  Logger.log('You can delete that test copy from Google Drive now — it was only created to test this permission.');
}
