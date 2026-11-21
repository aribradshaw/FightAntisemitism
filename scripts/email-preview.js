// Renders the contact question alert to a static review
// page. Nothing is sent.
//
//   node scripts/email-preview.js [--out .scratch/onemail-preview]
//
// .scratch/ is gitignored. The logo is copied next to the page and the
// emails point at the copy, so the page works before a deploy. Switch the OS
// or browser to dark mode to check dark rendering.
/* global process */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contactEmailSamples as emailSamples } from "../server/contactEmailSamples.js";
import { SITE_ORIGIN, LOGO_PATH } from "../server/emailBrand.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const at = process.argv.indexOf("--out");
const out = path.resolve(at >= 0 ? process.argv[at + 1] : path.join(root, ".scratch/onemail-preview"));
const h = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

fs.mkdirSync(path.join(out, "emails"), { recursive: true });
fs.mkdirSync(path.join(out, "assets"), { recursive: true });
for (const logo of [LOGO_PATH]) {
  fs.copyFileSync(path.join(root, "public", logo.slice(1)), path.join(out, "assets", path.basename(logo)));
}

const sections = emailSamples.map((sample, index) => {
  const email = sample.render();
  fs.writeFileSync(path.join(out, "emails", `${sample.id}.html`), email.html.replaceAll(`${SITE_ORIGIN}/email/`, "../assets/"));
  return `<section id="${h(sample.id)}"><h2>${index + 1}. ${h(sample.label)}</h2>
<dl><dt>Subject</dt><dd>${h(email.subject)}</dd><dt>Headers</dt><dd>None (alert to the site owner, transactional, no List-Unsubscribe)</dd></dl>
<div class="pair"><iframe src="emails/${h(sample.id)}.html" title="${h(sample.label)} HTML"></iframe><pre>${h(email.text)}</pre></div></section>`;
});

fs.writeFileSync(path.join(out, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>OneMail preview: hashem.faith</title>
<style>body{font:15px/1.5 system-ui,sans-serif;margin:0;padding:24px;background:Canvas;color:CanvasText}h1{margin:0 0 4px}section{border-top:1px solid #8884;padding:20px 0}h2{font-size:18px}dl{display:grid;grid-template-columns:max-content 1fr;gap:2px 12px;margin:0 0 12px}dt{opacity:.7}dd{margin:0}.pair{display:grid;grid-template-columns:minmax(0,640px) minmax(0,1fr);gap:16px}iframe{width:100%;height:900px;border:1px solid #8886;border-radius:8px;background:#fff0}pre{white-space:pre-wrap;margin:0;padding:12px;border:1px solid #8886;border-radius:8px;font-size:13px}@media(max-width:1000px){.pair{grid-template-columns:1fr}}</style></head>
<body><h1>OneMail preview: hashem.faith</h1><p>${emailSamples.length} emails, synthetic data. HTML on the left, the plain-text part (unchanged from before) on the right. Switch to dark mode to check dark rendering.</p>
${sections.join("\n")}
</body></html>
`);
console.log(`${emailSamples.length} emails: ${path.join(out, "index.html")}`);
