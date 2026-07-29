// Lead-capture webhook target. Leave empty until the AllOne CRM backend is deployed —
// js/main.js falls back to a simulated success message while this is unset.
//
// Once the CRM is live, set this to the ingest endpoint and it will receive a POST
// with header `Content-Type: application/json` and body shaped like:
// {
//   "formType": "dang-ky" | "lien-he",
//   "submittedAt": "2026-07-29T12:00:00.000Z",
//   "page": "/dang-ky",
//   "fields": {
//     "fullName": "...", "email": "...", "phone": "...",
//     "company": "...", "teamSize": "...", "message": "..." // message only present on lien-he
//   }
// }
//
// The endpoint must accept cross-origin requests (CORS) from this site's domain, since
// this is a static site posting directly from the browser — there is no server hop here.
// Remember to also add its origin to the connect-src directive in render.yaml's
// Content-Security-Policy, or the browser will block the request.
const LEAD_WEBHOOK_URL = "";
