/* ════════════════════════════════════════════════════════════════════
   THE POINTE CIRCLE — SITE CONTENT
   ════════════════════════════════════════════════════════════════════
   This file holds every piece of content that changes often: leadership
   bios, club members, upcoming events, and past event photos/videos.

   YOU SHOULD NOT NEED TO EDIT THIS FILE BY HAND.
   Open admin.html (in this same folder) instead — it gives you simple
   forms and upload buttons, and it writes this file for you.

   If you ever do need to edit it directly: it must stay valid JSON
   inside `window.SITE_CONTENT = { ... };`. Use a tool like jsonlint.com
   to check your edits before saving if you're not sure.
   ════════════════════════════════════════════════════════════════════ */
window.SITE_CONTENT = {
  "leadership": [
    { "id": "president",  "name": "", "role": "Founder & President", "bio": "", "photo": "", "emoji": "👑" },
    { "id": "vp",          "name": "", "role": "Vice President",     "bio": "", "photo": "", "emoji": "🌸" },
    { "id": "secretary",   "name": "", "role": "Secretary",          "bio": "", "photo": "", "emoji": "📋" },
    { "id": "treasurer",   "name": "", "role": "Treasurer",          "bio": "", "photo": "", "emoji": "💰" },
    { "id": "officer-1",   "name": "", "role": "Officer",            "bio": "", "photo": "", "emoji": "🎀" },
    { "id": "officer-2",   "name": "", "role": "Officer",            "bio": "", "photo": "", "emoji": "🎀" }
  ],

  "members": [
    { "id": "m1", "name": "", "role": "Member", "bio": "", "photo": "", "emoji": "🩰" },
    { "id": "m2", "name": "", "role": "Member", "bio": "", "photo": "", "emoji": "🩰" },
    { "id": "m3", "name": "", "role": "Member", "bio": "", "photo": "", "emoji": "🩰" },
    { "id": "m4", "name": "", "role": "Member", "bio": "", "photo": "", "emoji": "🩰" },
    { "id": "m5", "name": "", "role": "Member", "bio": "", "photo": "", "emoji": "🩰" },
    { "id": "m6", "name": "", "role": "Member", "bio": "", "photo": "", "emoji": "🩰" }
  ],

  "upcomingEvents": [
    {
      "id": "upcoming-1", "title": "", "dateText": "", "location": "", "details": "",
      "gformUrl": "", "flyer": "", "photos": [], "youtube": "",
      "archiveDate": "", "archiveCategory": ""
    },
    {
      "id": "upcoming-2", "title": "", "dateText": "", "location": "", "details": "",
      "gformUrl": "", "flyer": "", "photos": [], "youtube": "",
      "archiveDate": "", "archiveCategory": ""
    },
    {
      "id": "upcoming-3", "title": "", "dateText": "", "location": "", "details": "",
      "gformUrl": "", "flyer": "", "photos": [], "youtube": "",
      "archiveDate": "", "archiveCategory": ""
    }
  ],

  "pastActivities": {
    "storytime": {
      "label": "📚 Ballerina | Bilingual Storytime",
      "description": "We bring the magic of ballet to children through enchanting bilingual storytelling sessions. Our dancers perform alongside narrated fairy tales and classic stories in English and other languages, sparking imagination and a love for the arts in young audiences at schools, libraries, and community centers.",
      "events": [
        { "id": "st-ev1", "title": "", "date": "", "location": "", "notes": "", "flyer": "", "photos": [], "youtube": "" },
        { "id": "st-ev2", "title": "", "date": "", "location": "", "notes": "", "flyer": "", "photos": [], "youtube": "" },
        { "id": "st-ev3", "title": "", "date": "", "location": "", "notes": "", "flyer": "", "photos": [], "youtube": "" }
      ]
    },
    "senior": {
      "label": "🌹 Senior House Performance",
      "description": "We visit senior living communities to bring joy and warmth through live ballet performances. These visits are a cherished connection between generations — our dancers share their passion while brightening the days of seniors who may feel isolated or underserved.",
      "events": [
        { "id": "sn-ev1", "title": "", "date": "", "location": "", "notes": "", "flyer": "", "photos": [], "youtube": "" },
        { "id": "sn-ev2", "title": "", "date": "", "location": "", "notes": "", "flyer": "", "photos": [], "youtube": "" },
        { "id": "sn-ev3", "title": "", "date": "", "location": "", "notes": "", "flyer": "", "photos": [], "youtube": "" }
      ]
    },
    "ronald": {
      "label": "🏥 Ronald McDonald House",
      "description": "We partner with the Ronald McDonald House to support families staying near hospitals during difficult times. Our dancers perform for families and children, offering a moment of lightness and joy during what can be an incredibly stressful experience.",
      "events": [
        { "id": "rm-ev1", "title": "", "date": "", "location": "", "notes": "", "flyer": "", "photos": [], "youtube": "" },
        { "id": "rm-ev2", "title": "", "date": "", "location": "", "notes": "", "flyer": "", "photos": [], "youtube": "" },
        { "id": "rm-ev3", "title": "", "date": "", "location": "", "notes": "", "flyer": "", "photos": [], "youtube": "" }
      ]
    },
    "drive": {
      "label": "🤲 Drive for Dancewear, Books & Toys",
      "description": "Every child deserves access to the arts and the joy of reading and play. We organize community collection drives to gather gently used dancewear, books, and toys for children in need. Donated items are distributed to local shelters, underfunded schools, and community programs.",
      "events": []
    }
  }
};
