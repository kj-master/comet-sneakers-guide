# Best Sneakers Under ₹5,000 in India — Comet Sneakers Guide (Student Concept)

Student concept built for an SEO assignment at Atlas SkillTech University × Schbang. Not an official Comet or The Croffle Guys page.

## Production SEO Note: SSR or Static Export

This project is built as a client-rendered Vite + React Single-Page Application (SPA). While `index.html` includes static `<title>`, `<meta name="description">`, Open Graph / Twitter Card tags, JSON-LD structured data (`FAQPage`, `ItemList`, `BreadcrumbList`), and a `<noscript>` fallback with the H1, intro, and FAQ copy, **client-side rendering (CSR) is weaker for search crawlers and link previews** because:

1. Some crawlers and social scrapers do not execute JavaScript reliably or defer rendering to a secondary wave.
2. The full interactive product catalog, comparison checks, and Mumbai Sunday café crawl section are hydrated by React at runtime.

### Recommended Production Upgrade
Before deploying to production for organic search ranking:
- **Pre-render / Static Export (SSG)** using a framework such as Next.js (`output: 'export'`), Astro, or `vite-plugin-ssr` / `vite-ssg` so the entire HTML document (all headings, product cards, tables, and FAQ accordions) is served directly in the initial HTTP response.
- **Update the Canonical URL** in `index.html` (search for `TODO` near `<link rel="canonical">`) and `og:url` to match the final deployed HTTPS URL.
- **TODO (Post-Deployment Placeholders)**: Replace the literal `DEPLOYED_URL` placeholder in `public/llms.txt`, `public/robots.txt` (and uncomment the `Sitemap:` directive), and `public/sitemap.xml` with your actual deployed origin (for example `https://your-domain.com`) after deployment. Ensure your production host serves `/llms.txt`, `/llms-full.txt`, and `/robots.txt` with `Content-Type: text/plain; charset=utf-8`.
- **Verify Structured Data** using Google's Rich Results Test after replacing the canonical URL.
