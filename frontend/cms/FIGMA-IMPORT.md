# Figma Import Instructions

## Option 1: Console Script (Recommended)

1. Open Figma
2. Create a new file or open existing
3. Go to **Plugins → Development → Open Console**
4. Paste the entire content of `figma-import.js` into the console
5. Press **Enter**
6. The full landing page will be generated as frames

## Option 2: CMS JSON

1. Import `landing-page.json` into a CMS like:
   - **Sanity** (structured data)
   - **Contentful** (entries)
   - **Figma** (via "Content Reel" plugin — paste JSON values)
2. Use the structure to populate Figma components manually

## Generated Sections

| Section | Frame Name | Content |
|---------|------------|---------|
| Navbar | `Navbar` | Logo, links, theme toggle, CTA |
| Hero | `Hero` | Headline, subtitle, CTA, phone mockup |
| Features | `Features Grid` | 6 feature cards (2×3 grid) |
| CTA Block | `CTA Block` | Green banner with CTA |
| How It Works | `How It Works` | 6 accordion steps |
| Results | `Results` | 3 stat cards (dark bg) |
| Pricing | `Pricing Grid` | 3 pricing tiers |
| Testimonials | `Testimonials Grid` | 3 testimonial cards (black bg) |
| Final CTA | `Final CTA` | Final conversion block |
| Footer | `Footer` | Logo, links, copyright |

## Colors Reference

- Primary: `#3D6B4F` (forest green)
- Secondary: `#E8C4B8` (blush pink)
- Dark BG: `#000000`
- Surface: `#FDF6EC`
- Rainbow: `#7B6B8D`, `#E87898`, `#D4845A`, `#E8A840`, `#4A9BA8`

## Font

- Heading: **Poppins Black** (900)
- Body: **Poppins Regular** (400)
