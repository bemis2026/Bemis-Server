<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-context-md -->
# Project context document

A canonical project-context document is kept at:
`C:\Users\sales\Desktop\Claude Çalışmaları\Bemis Website\md\BEMIS_PROJECT_CONTEXT.md`

**At session start:** if the user references prior work, bin IDs, env vars,
sharding, or open issues — read that file first; it has the authoritative
state (bin IDs, env-var status, sprint backlog, sharding map, etc.).

**After meaningful changes — update the same file.** Trigger an update
whenever any of these happen:
- A new JSONBin bin is created or a bin shard is added
- A category is added, renamed, or moved between shards
- An env var is added / removed / changed in Vercel
- A previously open item ("Resend not set up", "DC kategorisi boş", etc.)
  becomes done, or a new open item is discovered
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
