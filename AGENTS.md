<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-context-md -->
# Project context document

The canonical project-context document is **`BEMIS_OTURUM_BAGLAM.md` in this
repository** (auto-loaded every session via `CLAUDE.md`). It lives in git on
purpose: the operator works from a phone, from the web IDE, and from more than
one computer, so the context has to travel with the repo — not with a machine.

⚠️ **Never point session state at a local disk path.** An older version of this
file pointed at `C:\Users\sales\Desktop\...\BEMIS_PROJECT_CONTEXT.md`, which does
not exist on phone/web sessions — so the session-start instruction silently
failed there. That Windows file may still exist as a personal mirror; treat it as
optional and non-authoritative. If a session needs state, it reads the repo.

**At session start:** if the user references prior work, env vars, data bins, or
open issues — read `BEMIS_OTURUM_BAGLAM.md` first (especially "§0 ŞU AN AÇIK İŞ").
Pending operator to-dos are in `docs/ACIK_ISLER.md`. How to work across devices:
`docs/CROSS_DEVICE.md`.

**After meaningful changes — update `BEMIS_OTURUM_BAGLAM.md` and commit it.**
An uncommitted update is invisible to the next device. Trigger an update when:
- A data bin (Cloudflare R2 `bins/<name>.json`) is added, or its shape changes
- A category is added, renamed, or moved
- An env var is added / removed / changed in Vercel
- A previously open item becomes done, or a new open item is discovered
- A non-obvious decision is made that future-you would forget (e.g. "we
  intentionally kept .com and .com.tr without redirect because…")
- Repository visibility or domain wiring changes

Don't bump the file for routine work — copy edits, single-product imports
inside an existing category, small UI tweaks. The MD is for state that a
fresh session would need to avoid mistakes, not a changelog.

Keep the same section structure and tone. Update "Son güncelleme" date.
Surface meaningful diffs in the user-facing reply too, so the operator
knows the doc was refreshed.
<!-- END:project-context-md -->
