// ============================================================
// TONE REPLY — Figma Import Script
// Paste into: Figma → Dev Mode → Console  (or Plugins → Development → Open Console)
// ============================================================

const W = 1440;          // Desktop frame width
const PAD = 80;          // Section horizontal padding
const SECTION_GAP = 0;   // Vertical gap between sections
const CARD_RADIUS = 24;
const COLORS = {
  white:       "#FFFFFF",
  bg:          "#FFFFFF",
  surface:     "#FDF6EC",
  primary:     "#3D6B4F",
  primaryMuted:"#E8F5E9",
  secondary:   "#E8C4B8",
  text:        "#1A1A1A",
  textSec:     "#6B7280",
  textMuted:   "#9CA3AF",
  border:      "#E5E7EB",
  black:       "#000000",
  darkBg:      "#111827",
  gold:        "#C9A84C",
  purple:      "#7B6B8D",
  pink:        "#E87898",
  orange:      "#D4845A",
  teal:        "#4A9BA8",
  rainbow:     ["#7B6B8D","#E87898","#D4845A","#E8A840","#4A9BA8"],
};

// ── helpers ──────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  return { r, g, b };
}

function fill(node, color) {
  node.fills = [{ type: "SOLID", color: hexToRgb(color) }];
}

function frame(parent, name, opts = {}) {
  const f = figma.createFrame();
  f.name = name;
  if (opts.w) f.resizeWithoutConstraints(opts.w, opts.h || 100);
  if (opts.layout) {
    f.layoutMode = opts.layout;          // "HORIZONTAL" | "VERTICAL"
    f.primaryAxisAlignItems = opts.mainAlign || "MIN";
    f.counterAxisAlignItems = opts.crossAlign || "MIN";
    f.itemSpacing = opts.gap || 0;
  }
  if (opts.padding) {
    f.paddingLeft = opts.padding;
    f.paddingRight = opts.padding;
    f.paddingTop = opts.paddingTop || opts.padding;
    f.paddingBottom = opts.paddingBottom || opts.padding;
  }
  if (opts.bg) fill(f, opts.bg);
  if (opts.radius) f.cornerRadius = opts.radius;
  if (opts.stroke) {
    f.strokes = [{ type: "SOLID", color: hexToRgb(opts.stroke) }];
    f.strokeWeight = opts.strokeWidth || 1;
  }
  if (opts.autoW) f.primaryAxisSizingMode = "AUTO";
  if (opts.autoH) f.counterAxisSizingMode = "AUTO";
  parent.appendChild(f);
  return f;
}

function text(parent, str, opts = {}) {
  const t = figma.createText();
  t.name = opts.name || str.slice(0, 30);
  t.characters = str;
  t.fontSize = opts.size || 16;
  t.fontName = opts.font || { family: "{Poppins}", style: "Black" };
  t.fills = [{ type: "SOLID", color: hexToRgb(opts.color || COLORS.text) }];
  if (opts.align) t.textAlignHorizontal = opts.align;
  if (opts.width) { t.resizeWithoutConstraints(opts.width, 100); t.textAutoResize = "HEIGHT"; }
  if (opts.letterSpacing) t.letterSpacing = { value: opts.letterSpacing, unit: "PIXELS" };
  if (opts.lineHeight) t.lineHeight = { value: opts.lineHeight, unit: "PIXELS" };
  parent.appendChild(t);
  return t;
}

function autoFrame(parent, name, opts = {}) {
  return frame(parent, name, { layout: "VERTICAL", autoW: true, autoH: true, ...opts });
}

// ── ROOT ─────────────────────────────────────────────────────
const page = figma.currentPage;
const root = frame(page, "Tone Reply Landing", { w: W, h: 8000, bg: COLORS.bg, layout: "VERTICAL", gap: 0 });

// ============================================================
// 1. NAVBAR
// ============================================================
const nav = frame(root, "Navbar", { w: W, h: 80, layout: "HORIZONTAL", mainAlign: "CENTER", padding: PAD, bg: COLORS.surface });

const navLeft = autoFrame(nav, "Nav Left", { layout: "HORIZONTAL", gap: 40, crossAlign: "CENTER" });
text(navLeft, "✦ Tone Reply", { size: 22, font: { family: "Poppins", style: "Bold" }, color: COLORS.text });

const navLinks = autoFrame(navLeft, "Nav Links", { layout: "HORIZONTAL", gap: 28 });
["Features", "How It Works", "Pricing", "Testimonials"].forEach(l => text(navLinks, l, { size: 15, color: COLORS.textSec }));

const navRight = autoFrame(nav, "Nav Right", { layout: "HORIZONTAL", gap: 12, crossAlign: "CENTER" });
const toggle = frame(navRight, "Theme Toggle", { w: 44, h: 44, radius: 22, bg: "#F3F4F6", layout: "HORIZONTAL", mainAlign: "CENTER", crossAlign: "CENTER" });
text(toggle, "🌙", { size: 20 });
const cta = frame(navRight, "CTA", { h: 44, layout: "HORIZONTAL", mainAlign: "CENTER", crossAlign: "CENTER", bg: COLORS.primary, radius: 24, padding: 24 });
text(cta, "Get Started Free", { size: 14, color: COLORS.white });

// Rainbow stripe under nav
const stripe = frame(root, "Rainbow Stripe", { w: W, h: 4, layout: "HORIZONTAL" });
COLORS.rainbow.forEach(c => { const s = frame(stripe, c, { w: W / 5, h: 4 }); fill(s, c); });

// ============================================================
// 2. HERO
// ============================================================
const hero = frame(root, "Hero", { w: W, h: 600, layout: "HORIZONTAL", padding: PAD, gap: 60, bg: COLORS.bg, mainAlign: "CENTER" });

// Left column
const heroLeft = autoFrame(hero, "Hero Content", { layout: "VERTICAL", gap: 20, w: 600 });
text(heroLeft, "Say the right\nthing, every time", { size: 52, font: { family: "Poppins", style: "Black" }, color: COLORS.text, lineHeight: 62 });
text(heroLeft, "Tone Reply is your AI-powered communication assistant. Paste any conversation and get multiple reply options tailored to your exact goal — whether that's setting a boundary, flirting, negotiating, or simply being more confident.", { size: 16, color: COLORS.textSec, lineHeight: 26, width: 500 });
const heroBtn = frame(heroLeft, "CTA Button", { h: 52, layout: "HORIZONTAL", mainAlign: "CENTER", crossAlign: "CENTER", bg: COLORS.primary, radius: 24, padding: 32, autoW: true });
text(heroBtn, "Try It Now", { size: 16, color: COLORS.white });
const badges = autoFrame(heroLeft, "Badges", { layout: "HORIZONTAL", gap: 12, crossAlign: "CENTER" });
["Chat", "Analyze", "Rewrite", "Save"].forEach(b => {
  const bg2 = frame(badges, b, { h: 36, layout: "HORIZONTAL", gap: 6, crossAlign: "CENTER", bg: COLORS.primaryMuted, radius: 18, padding: 14 });
  text(bg2, "✦", { size: 10, color: COLORS.gold });
  text(bg2, b, { size: 13, color: COLORS.primary });
});

// Right column — phone mockup
const phone = frame(hero, "Phone Mockup", { w: 280, h: 500, bg: COLORS.surface, radius: 36, stroke: COLORS.border, strokeWidth: 3, layout: "VERTICAL", padding: 16 });
const phoneHeader = autoFrame(phone, "Phone Header", { layout: "HORIZONTAL", gap: 8, crossAlign: "CENTER" });
const dot = frame(phoneHeader, "Dot", { w: 8, h: 8, radius: 4 }); fill(dot, COLORS.primary);
text(phoneHeader, "Tone Reply", { size: 14, color: COLORS.text });

const bubble1 = frame(phone, "Incoming", { h: 40, bg: "#F3F4F6", radius: 16, layout: "HORIZONTAL", crossAlign: "CENTER", padding: 14, autoW: true });
text(bubble1, "Hey, are we still on for tonight?", { size: 12, color: COLORS.text });
const bubble2 = frame(phone, "Outgoing", { h: 40, bg: COLORS.primary, radius: 16, layout: "HORIZONTAL", crossAlign: "CENTER", padding: 14, autoW: true });
text(bubble2, "I'd love to but I'm swamped. Rain check?", { size: 12, color: COLORS.white });
const bubble3 = frame(phone, "Incoming 2", { h: 40, bg: "#F3F4F6", radius: 16, layout: "HORIZONTAL", crossAlign: "CENTER", padding: 14, autoW: true });
text(bubble3, "Sure, no worries!", { size: 12, color: COLORS.text });

const replyOpts = autoFrame(phone, "Reply Options", { layout: "VERTICAL", gap: 8, padding: 0 });
const r1 = frame(replyOpts, "Polite", { h: 60, bg: COLORS.white, radius: 12, stroke: COLORS.primary, strokeWidth: 1.5, layout: "VERTICAL", padding: 10 });
text(r1, "POLITE", { size: 10, color: COLORS.primary, font: { family: "Poppins", style: "Bold" } });
text(r1, "Absolutely! Let's reschedule soon.", { size: 11, color: COLORS.textSec });
const r2 = frame(replyOpts, "Casual", { h: 60, bg: COLORS.white, radius: 12, stroke: COLORS.purple, strokeWidth: 1.5, layout: "VERTICAL", padding: 10 });
text(r2, "CASUAL", { size: 10, color: COLORS.purple, font: { family: "Poppins", style: "Bold" } });
text(r2, "Totally! Next time for sure 🙌", { size: 11, color: COLORS.textSec });

// ============================================================
// 3. FEATURES
// ============================================================
const featSection = frame(root, "Features Section", { w: W, layout: "VERTICAL", padding: PAD, gap: 40, bg: COLORS.bg });

const featHeader = autoFrame(featSection, "Section Header", { layout: "VERTICAL", gap: 16 });
const featLabel = frame(featHeader, "Label", { h: 28, bg: COLORS.primaryMuted, radius: 6, layout: "HORIZONTAL", crossAlign: "CENTER", padding: 14, autoW: true });
text(featLabel, "FEATURES", { size: 11, color: COLORS.primary, font: { family: "Poppins", style: "Bold" }, letterSpacing: 1.5 });
text(featHeader, "Everything you need to\ncommunicate with confidence", { size: 36, font: { family: "Poppins", style: "Black" }, color: COLORS.text, lineHeight: 44 });

const features = [
  { icon: "💬", title: "Smart Reply\nGeneration", desc: "Paste a conversation, pick your goal and tone, and get multiple styled reply options — from polite to assertive to flirty.", color: COLORS.primary },
  { icon: "✍️", title: "9-Style\nRewriter", desc: "Take any draft message and instantly see it rewritten in 9 distinct personality styles: confident, romantic, professional, mysterious, and more.", color: COLORS.purple },
  { icon: "🧠", title: "Conversation\nCoach", desc: "Get deep analysis of any conversation — emotional tone, misunderstandings, unanswered questions, and actionable coaching tips.", color: COLORS.teal },
  { icon: "📌", title: "Custom\nPresets", desc: "Save your favorite reply configurations as reusable presets. One tap to apply your go-to style for any situation.", color: COLORS.orange },
  { icon: "⭐", title: "Save &\nOrganize", desc: "Bookmark the replies you love. Build a personal library of perfect responses for future conversations.", color: COLORS.gold },
  { icon: "📱", title: "Multi-\nPlatform", desc: "Works on iOS, Android, and web. Your communication assistant goes wherever your conversations happen.", color: COLORS.pink },
];

const featGrid = frame(featSection, "Features Grid", { w: W - PAD * 2, layout: "HORIZONTAL", gap: 20 });
for (let row = 0; row < 3; row++) {
  const rowFrame = autoFrame(featGrid, `Row ${row}`, { layout: "VERTICAL", gap: 20, w: (W - PAD * 2 - 20) / 2 });
  for (let col = 0; col < 2; col++) {
    const f = features[row * 2 + col];
    const card = autoFrame(rowFrame, f.title.replace("\n", " "), { layout: "VERTICAL", gap: 12, bg: col === 1 ? COLORS.primary : COLORS.surface, radius: CARD_RADIUS, stroke: COLORS.border, strokeWidth: 1, padding: 28 });
    const iconBg = frame(card, "Icon", { w: 52, h: 52, radius: 16, layout: "HORIZONTAL", mainAlign: "CENTER", crossAlign: "CENTER" });
    fill(iconBg, f.color + "15");
    text(iconBg, f.icon, { size: 24 });
    text(card, f.title, { size: 20, font: { family: "Poppins", style: "Bold" }, color: col === 1 ? COLORS.white : COLORS.text, lineHeight: 26 });
    text(card, f.desc, { size: 14, color: col === 1 ? "rgba(255,255,255,0.8)" : COLORS.textSec, lineHeight: 22, width: 400 });
    text(card, "Learn more →", { size: 14, color: col === 1 ? COLORS.white : f.color });
  }
}

// ============================================================
// 4. CTA BLOCK
// ============================================================
const ctaBlock = frame(root, "CTA Block", { w: W - PAD * 2, h: 200, layout: "HORIZONTAL", mainAlign: "CENTER", crossAlign: "CENTER", bg: COLORS.primary, radius: CARD_RADIUS, padding: 48, margin: PAD });
const ctaLeft = autoFrame(ctaBlock, "CTA Content", { layout: "VERTICAL", gap: 12, w: 600 });
text(ctaLeft, "Stop overthinking\nyour messages", { size: 32, font: { family: "Poppins", style: "Black" }, color: COLORS.white, lineHeight: 40 });
text(ctaLeft, "Whether it's a tricky work email, a sensitive text, or a first message — Tone Reply helps you find the right words in seconds.", { size: 15, color: "rgba(255,255,255,0.85)", lineHeight: 24, width: 440 });
const ctaBtn = frame(ctaLeft, "Button", { h: 48, layout: "HORIZONTAL", mainAlign: "CENTER", crossAlign: "CENTER", bg: COLORS.white, radius: 24, padding: 28, autoW: true });
text(ctaBtn, "Start Free Today", { size: 15, color: COLORS.primary, font: { family: "Poppins", style: "Bold" } });
const ctaDecor = autoFrame(ctaBlock, "Decor", { layout: "VERTICAL", gap: 16, crossAlign: "CENTER" });
text(ctaDecor, "✦", { size: 40, color: COLORS.gold });
const ctaCircle = frame(ctaDecor, "Circle", { w: 100, h: 100, radius: 50 }); fill(ctaCircle, "rgba(255,255,255,0.1)");

// ============================================================
// 5. HOW IT WORKS
// ============================================================
const howSection = frame(root, "How It Works", { w: W, layout: "VERTICAL", padding: PAD, gap: 40, bg: COLORS.bg });
const howHeader = autoFrame(howSection, "Header", { layout: "VERTICAL", gap: 16 });
const howLabel = frame(howHeader, "Label", { h: 28, bg: COLORS.primaryMuted, radius: 6, layout: "HORIZONTAL", crossAlign: "CENTER", padding: 14, autoW: true });
text(howLabel, "HOW IT WORKS", { size: 11, color: COLORS.primary, font: { family: "Poppins", style: "Bold" }, letterSpacing: 1.5 });
text(howHeader, "Three steps to\nbetter conversations", { size: 36, font: { family: "Poppins", style: "Black" }, color: COLORS.text, lineHeight: 44 });

const steps = [
  { num: "01", title: "Paste Your Conversation", desc: "Drop in any chat history, email thread, or message draft. Tone Reply understands context." },
  { num: "02", title: "Choose Your Goal", desc: "Select from 17 intent options — from \"Reply politely\" to \"Set a boundary\" to \"Flirt\" to \"Negotiate.\"" },
  { num: "03", title: "Pick Your Format", desc: "One sentence? Full email? Text message? Bullet points? You decide how the reply should look." },
  { num: "04", title: "Get Multiple Options", desc: "Receive several styled replies side by side, each with a different tone and approach." },
  { num: "05", title: "Rewrite & Refine", desc: "Love the idea but not the wording? Rewrite any reply in 9 personality styles instantly." },
  { num: "06", title: "Save & Reuse", desc: "Bookmark your favorites or save as presets for one-tap access next time." },
];

steps.forEach((s, i) => {
  const card = autoFrame(howSection, `Step ${s.num}`, { layout: "VERTICAL", gap: 0, bg: i === 0 ? COLORS.primaryMuted : COLORS.surface, radius: 16, stroke: i === 0 ? COLORS.primary : COLORS.border, strokeWidth: 1, padding: 20 });
  const header = autoFrame(card, "Header", { layout: "HORIZONTAL", gap: 16, crossAlign: "CENTER" });
  text(header, s.num, { size: 20, font: { family: "Poppins", style: "Black" }, color: i === 0 ? COLORS.primary : COLORS.textMuted });
  text(header, s.title, { size: 16, color: i === 0 ? COLORS.primary : COLORS.text, font: { family: "Poppins", style: "Semi Bold" } });
  text(header, i === 0 ? "−" : "+", { size: 22, color: COLORS.textMuted });
  if (i === 0) {
    text(card, s.desc, { size: 14, color: COLORS.textSec, lineHeight: 22, width: 800 });
  }
});

// ============================================================
// 6. RESULTS
// ============================================================
const resultsSection = frame(root, "Results", { w: W, layout: "VERTICAL", padding: PAD, gap: 40, bg: COLORS.primary });
const resHeader = autoFrame(resultsSection, "Header", { layout: "VERTICAL", gap: 16 });
const resLabel = frame(resHeader, "Label", { h: 28, bg: "rgba(255,255,255,0.15)", radius: 6, layout: "HORIZONTAL", crossAlign: "CENTER", padding: 14, autoW: true });
text(resLabel, "RESULTS", { size: 11, color: COLORS.white, font: { family: "Poppins", style: "Bold" }, letterSpacing: 1.5 });
text(resHeader, "What users are saying\nabout their experience", { size: 36, font: { family: "Poppins", style: "Black" }, color: COLORS.white, lineHeight: 44 });

const resGrid = frame(resultsSection, "Stats Grid", { w: W - PAD * 2, layout: "HORIZONTAL", gap: 20 });
const stats = [
  { val: "9", label: "Message Styles", detail: "One draft, nine completely different vibes — from professional to mysterious." },
  { val: "17", label: "Reply Goals", detail: "Every conversation is different. Pick the exact intent that fits your situation." },
  { val: "7", label: "Insight Cards", detail: "Emotional tone, balance, misunderstandings, ambiguity — all analyzed in seconds." },
];
stats.forEach(s => {
  const card = autoFrame(resGrid, s.label, { layout: "VERTICAL", gap: 8, bg: "rgba(255,255,255,0.08)", radius: CARD_RADIUS, stroke: "rgba(255,255,255,0.12)", strokeWidth: 1, padding: 28, w: (W - PAD * 2 - 40) / 3 });
  text(card, s.val, { size: 48, font: { family: "Poppins", style: "Black" }, color: COLORS.white });
  text(card, s.label, { size: 18, color: COLORS.white, font: { family: "Poppins", style: "Bold" } });
  text(card, s.detail, { size: 14, color: "rgba(255,255,255,0.7)", lineHeight: 22 });
});

// ============================================================
// 7. PRICING
// ============================================================
const priceSection = frame(root, "Pricing", { w: W, layout: "VERTICAL", padding: PAD, gap: 40, bg: COLORS.bg });
const priceHeader = autoFrame(priceSection, "Header", { layout: "VERTICAL", gap: 12 });
const priceLabel = frame(priceHeader, "Label", { h: 28, bg: COLORS.primaryMuted, radius: 6, layout: "HORIZONTAL", crossAlign: "CENTER", padding: 14, autoW: true });
text(priceLabel, "PRICING", { size: 11, color: COLORS.primary, font: { family: "Poppins", style: "Bold" }, letterSpacing: 1.5 });
text(priceHeader, "Simple, transparent\npricing", { size: 36, font: { family: "Poppins", style: "Black" }, color: COLORS.text, lineHeight: 44 });
text(priceHeader, "Start free, upgrade when you need more. No hidden fees.", { size: 15, color: COLORS.textSec, lineHeight: 24 });

const tiers = [
  { name: "Free", price: "$0", period: "/mo", features: ["20 generates/day","10 rewrites/day","3 saves","Basic styles","Conversation coach"], cta: "Get Started", primary: false },
  { name: "Pro", price: "$9", period: "/mo", features: ["Unlimited generates","Unlimited rewrites","Unlimited saves","All 17 goals","All 9 styles","Custom presets","Priority support"], cta: "Start Pro", primary: true, badge: "Most Popular" },
  { name: "Unlimited", price: "$19", period: "/mo", features: ["Everything in Pro","Priority AI engine","Advanced analytics","API access","Early access to features","Dedicated support"], cta: "Go Unlimited", primary: false },
];

const priceGrid = frame(priceSection, "Pricing Grid", { w: W - PAD * 2, layout: "HORIZONTAL", gap: 20, mainAlign: "CENTER" });
tiers.forEach(t => {
  const card = autoFrame(priceGrid, t.name, { layout: "VERTICAL", gap: 12, bg: COLORS.surface, radius: CARD_RADIUS, stroke: t.primary ? COLORS.primary : COLORS.border, strokeWidth: t.primary ? 2 : 1, padding: 28, w: 300, autoH: true });
  if (t.badge) {
    const badge = frame(card, "Badge", { h: 24, bg: COLORS.primary, radius: 12, layout: "HORIZONTAL", mainAlign: "CENTER", crossAlign: "CENTER", padding: 14, autoW: true });
    text(badge, t.badge, { size: 11, color: COLORS.white, font: { family: "Poppins", style: "Bold" } });
  }
  text(card, t.name, { size: 18, font: { family: "Poppins", style: "Bold" }, color: COLORS.text });
  const priceRow = autoFrame(card, "Price", { layout: "HORIZONTAL", gap: 4, crossAlign: "BASELINE" });
  text(priceRow, t.price, { size: 42, font: { family: "Poppins", style: "Black" }, color: COLORS.text });
  text(priceRow, t.period, { size: 15, color: COLORS.textMuted });
  const divider = frame(card, "Divider", { w: 244, h: 1 }); fill(divider, COLORS.border);
  t.features.forEach(f => {
    const row = autoFrame(card, f, { layout: "HORIZONTAL", gap: 10, crossAlign: "CENTER" });
    text(row, "✓", { size: 15, color: COLORS.primary });
    text(row, f, { size: 14, color: COLORS.textSec });
  });
  const btn = frame(card, "CTA", { h: 48, bg: t.primary ? COLORS.primary : COLORS.surface, radius: 16, layout: "HORIZONTAL", mainAlign: "CENTER", crossAlign: "CENTER", stroke: t.primary ? "transparent" : COLORS.border, strokeWidth: 1, autoW: true, padding: 28 });
  text(btn, t.cta, { size: 15, color: t.primary ? COLORS.white : COLORS.text, font: { family: "Poppins", style: "Bold" } });
});

// ============================================================
// 8. TESTIMONIALS
// ============================================================
const testSection = frame(root, "Testimonials", { w: W, layout: "VERTICAL", padding: PAD, gap: 40, bg: COLORS.black });
const testHeader = autoFrame(testSection, "Header", { layout: "VERTICAL", gap: 16 });
const testLabel = frame(testHeader, "Label", { h: 28, bg: "rgba(255,255,255,0.1)", radius: 6, layout: "HORIZONTAL", crossAlign: "CENTER", padding: 14, autoW: true });
text(testLabel, "TESTIMONIALS", { size: 11, color: COLORS.white, font: { family: "Poppins", style: "Bold" }, letterSpacing: 1.5 });
text(testHeader, "Don't take our word for it", { size: 36, font: { family: "Poppins", style: "Black" }, color: COLORS.white, lineHeight: 44 });

const testimonials = [
  { quote: "I used to spend 20 minutes drafting one work email. Now I paste it into Tone Reply and have 5 perfect options in 10 seconds. It's changed how I communicate professionally.", name: "Alex Chen", title: "Product Manager", color: COLORS.primary },
  { quote: "The rewrite feature is incredible. I wrote a vulnerable text to someone I'm dating, and Tone Reply gave me 9 versions — from confident to mysterious. I picked the perfect one.", name: "Maya Rodriguez", title: "Freelance Designer", color: COLORS.purple },
  { quote: "The conversation coach showed me I was asking too many unanswered questions and coming across as needy. Now I'm aware of my patterns and my texts are so much better.", name: "Jordan Park", title: "College Student", color: COLORS.teal },
];

const testGrid = frame(testSection, "Testimonials Grid", { w: W - PAD * 2, layout: "HORIZONTAL", gap: 20 });
testimonials.forEach(t => {
  const card = autoFrame(testGrid, t.name, { layout: "VERTICAL", gap: 20, bg: "rgba(255,255,255,0.06)", radius: CARD_RADIUS, stroke: "rgba(255,255,255,0.1)", strokeWidth: 1, padding: 28, w: (W - PAD * 2 - 40) / 3 });
  text(card, `"${t.quote}"`, { size: 15, color: "rgba(255,255,255,0.85)", lineHeight: 24 });
  const author = autoFrame(card, "Author", { layout: "HORIZONTAL", gap: 12, crossAlign: "CENTER" });
  const avatar = frame(author, "Avatar", { w: 44, h: 44, radius: 22, layout: "HORIZONTAL", mainAlign: "CENTER", crossAlign: "CENTER" }); fill(avatar, t.color);
  text(avatar, t.name[0], { size: 18, color: COLORS.white });
  const info = autoFrame(author, "Info", { layout: "VERTICAL", gap: 2 });
  text(info, t.name, { size: 14, color: COLORS.white, font: { family: "Poppins", style: "Bold" } });
  text(info, t.title, { size: 12, color: "rgba(255,255,255,0.5)" });
});

// ============================================================
// 9. FINAL CTA
// ============================================================
const finalCta = frame(root, "Final CTA", { w: W, layout: "VERTICAL", padding: PAD, gap: 16, bg: COLORS.bg, crossAlign: "CENTER" });
text(finalCta, "✦", { size: 24, color: COLORS.gold });
text(finalCta, "Let's make your\nconversations effortless", { size: 36, font: { family: "Poppins", style: "Black" }, color: COLORS.text, lineHeight: 44, align: "CENTER" });
text(finalCta, "Join hundreds of people who communicate with confidence. Free to start — no credit card required.", { size: 15, color: COLORS.textSec, lineHeight: 24, align: "CENTER", width: 480 });
const finalBtn = frame(finalCta, "CTA Button", { h: 52, bg: COLORS.primary, radius: 24, layout: "HORIZONTAL", mainAlign: "CENTER", crossAlign: "CENTER", padding: 32, autoW: true });
text(finalBtn, "Get Started Free", { size: 16, color: COLORS.white });
text(finalCta, "✦", { size: 18, color: COLORS.pink });

// ============================================================
// 10. FOOTER
// ============================================================
const footer = frame(root, "Footer", { w: W, bg: COLORS.surface, layout: "VERTICAL" });
const footerStripe = frame(footer, "Rainbow Stripe", { w: W, h: 4, layout: "HORIZONTAL" });
COLORS.rainbow.forEach(c => { const s = frame(footerStripe, c, { w: W / 5, h: 4 }); fill(s, c); });
const footerInner = autoFrame(footer, "Footer Inner", { layout: "VERTICAL", gap: 20, padding: PAD });
text(footerInner, "✦ Tone Reply", { size: 20, font: { family: "Poppins", style: "Bold" }, color: COLORS.text });
text(footerInner, "AI-powered communication assistant", { size: 13, color: COLORS.textMuted });
const footerLinks = autoFrame(footerInner, "Links", { layout: "HORIZONTAL", gap: 24 });
["Features", "How It Works", "Pricing", "Testimonials"].forEach(l => text(footerLinks, l, { size: 13, color: COLORS.textSec }));
text(footerInner, "© 2026 Tone Reply. All rights reserved.", { size: 12, color: COLORS.textMuted });

// ── Resize root to fit ───────────────────────────────────────
root.resizeWithoutConstraints(W, root.height);
figma.viewport.scrollAndZoomIntoView([root]);

figma.notify("✅ Tone Reply landing page imported successfully!");
