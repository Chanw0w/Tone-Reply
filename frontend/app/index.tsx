import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../src/utils/theme-context";
import { useAuth } from "../src/utils/auth-context";
import { typography, spacing, borderRadius, shadows } from "../src/constants/theme";
import { RainbowStripe } from "../src/components/RainbowStripe";
import { StaticSparkle } from "../src/components/SparkleDecoration";

const FEATURES = [
  {
    title: "Smart Reply\nGeneration",
    desc: "Paste a conversation, pick your goal and tone, and get multiple styled reply options — from polite to assertive to flirty.",
    icon: "💬",
    color: "#3D6B4F",
  },
  {
    title: "9-Style\nRewriter",
    desc: "Take any draft message and instantly see it rewritten in 9 distinct personality styles: confident, romantic, professional, mysterious, and more.",
    icon: "✍️",
    color: "#7B6B8D",
  },
  {
    title: "Conversation\nCoach",
    desc: "Get deep analysis of any conversation — emotional tone, misunderstandings, unanswered questions, and actionable coaching tips.",
    icon: "🧠",
    color: "#4A9BA8",
  },
  {
    title: "Custom\nPresets",
    desc: "Save your favorite reply configurations as reusable presets. One tap to apply your go-to style for any situation.",
    icon: "📌",
    color: "#D4845A",
  },
  {
    title: "Save &\nOrganize",
    desc: "Bookmark the replies you love. Build a personal library of perfect responses for future conversations.",
    icon: "⭐",
    color: "#C9A84C",
  },
  {
    title: "Multi-\nPlatform",
    desc: "Works on iOS, Android, and web. Your communication assistant goes wherever your conversations happen.",
    icon: "📱",
    color: "#E87898",
  },
];

const STEPS = [
  { num: "01", title: "Paste Your Conversation", desc: "Drop in any chat history, email thread, or message draft. Tone Reply understands context." },
  { num: "02", title: "Choose Your Goal", desc: 'Select from 17 intent options — from "Reply politely" to "Set a boundary" to "Flirt" to "Negotiate."' },
  { num: "03", title: "Pick Your Format", desc: "One sentence? Full email? Text message? Bullet points? You decide how the reply should look." },
  { num: "04", title: "Get Multiple Options", desc: "Receive several styled replies side by side, each with a different tone and approach." },
  { num: "05", title: "Rewrite & Refine", desc: "Love the idea but not the wording? Rewrite any reply in 9 personality styles instantly." },
  { num: "06", title: "Save & Reuse", desc: "Bookmark your favorites or save as presets for one-tap access next time." },
];

const TESTIMONIALS = [
  {
    quote: "I used to spend 20 minutes drafting one work email. Now I paste it into Tone Reply and have 5 perfect options in 10 seconds. It's changed how I communicate professionally.",
    name: "Alex Chen",
    title: "Product Manager",
  },
  {
    quote: "The rewrite feature is incredible. I wrote a vulnerable text to someone I'm dating, and Tone Reply gave me 9 versions — from confident to mysterious. I picked the perfect one.",
    name: "Maya Rodriguez",
    title: "Freelance Designer",
  },
  {
    quote: "The conversation coach showed me I was asking too many unanswered questions and coming across as needy. Now I'm aware of my patterns and my texts are so much better.",
    name: "Jordan Park",
    title: "College Student",
  },
];

const PRICING = [
  {
    tier: "Free",
    price: "$0",
    period: "/mo",
    features: ["20 generates/day", "10 rewrites/day", "3 saves", "Basic styles", "Conversation coach"],
    cta: "Get Started",
    primary: false,
  },
  {
    tier: "Pro",
    price: "$9",
    period: "/mo",
    features: ["Unlimited generates", "Unlimited rewrites", "Unlimited saves", "All 17 goals", "All 9 styles", "Custom presets", "Priority support"],
    cta: "Start Pro",
    primary: true,
  },
  {
    tier: "Unlimited",
    price: "$19",
    period: "/mo",
    features: ["Everything in Pro", "Priority AI engine", "Advanced analytics", "API access", "Early access to features", "Dedicated support"],
    cta: "Go Unlimited",
    primary: false,
  },
];

export default function Index() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [openStep, setOpenStep] = useState<number | null>(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleGetStarted = () => {
    if (user) {
      router.push("/(tabs)/generate");
    } else {
      router.push("/register");
    }
  };

  const handleSignIn = () => {
    if (user) {
      router.push("/(tabs)/generate");
    } else {
      router.push("/login");
    }
  };

  const s = styles(theme);

  return (
    <View style={s.container}>
      <ScrollView
        ref={scrollRef}
        style={s.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== NAVBAR ===== */}
        <View style={s.navbar}>
          <View style={s.navInner}>
            <View style={s.navLeft}>
              <Text style={s.logo}>
                <Text style={s.logoIcon}>✦</Text> Tone Reply
              </Text>
              {Platform.OS === "web" && (
                <View style={s.navLinks}>
                  <TouchableOpacity onPress={() => scrollRef.current?.scrollTo({ y: 800, animated: true })}>
                    <Text style={s.navLink}>Features</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => scrollRef.current?.scrollTo({ y: 1800, animated: true })}>
                    <Text style={s.navLink}>How It Works</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => scrollRef.current?.scrollTo({ y: 3600, animated: true })}>
                    <Text style={s.navLink}>Pricing</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => scrollRef.current?.scrollTo({ y: 4400, animated: true })}>
                    <Text style={s.navLink}>Testimonials</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={s.navRight}>
              <TouchableOpacity style={s.themeToggle} onPress={toggleTheme}>
                <Text style={s.themeToggleText}>{isDark ? "☀️" : "🌙"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.navCta} onPress={handleGetStarted}>
                <Text style={s.navCtaText}>Get Started Free</Text>
              </TouchableOpacity>
            </View>
          </View>
          <RainbowStripe />
        </View>

        {/* ===== HERO ===== */}
        <View style={s.hero}>
          <View style={s.heroContent}>
            <Text style={s.heroHeadline}>
              Say the right{"\n"}thing, every time
            </Text>
            <Text style={s.heroSub}>
              Tone Reply is your AI-powered communication assistant. Paste any
              conversation and get multiple reply options tailored to your exact
              goal — whether that's setting a boundary, flirting, negotiating,
              or simply being more confident.
            </Text>
            <TouchableOpacity style={s.heroCta} onPress={handleGetStarted}>
              <Text style={s.heroCtaText}>Try It Now</Text>
            </TouchableOpacity>
            <View style={s.heroBadges}>
              {["Chat", "Analyze", "Rewrite", "Save"].map((label) => (
                <View key={label} style={s.heroBadge}>
                  <StaticSparkle size={10} color={theme.accent.gold} />
                  <Text style={s.heroBadgeText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={s.heroVisual}>
            <View style={s.phoneMockup}>
              <View style={s.phoneScreen}>
                <View style={s.phoneHeader}>
                  <View style={[s.phoneDot, { backgroundColor: theme.primary }]} />
                  <Text style={s.phoneTitle}>Tone Reply</Text>
                </View>
                <View style={s.chatBubbleIncoming}>
                  <Text style={s.chatText}>Hey, are we still on for tonight?</Text>
                </View>
                <View style={s.chatBubbleOutgoing}>
                  <Text style={s.chatTextWhite}>I'd love to but I'm swamped. Rain check?</Text>
                </View>
                <View style={s.chatBubbleIncoming}>
                  <Text style={s.chatText}>Sure, no worries!</Text>
                </View>
                <View style={s.replyOptions}>
                  <View style={[s.replyOption, { borderColor: theme.primary }]}>
                    <Text style={[s.replyLabel, { color: theme.primary }]}>Polite</Text>
                    <Text style={s.replySample}>Absolutely! Let's reschedule soon.</Text>
                  </View>
                  <View style={[s.replyOption, { borderColor: theme.accent.purple }]}>
                    <Text style={[s.replyLabel, { color: theme.accent.purple }]}>Casual</Text>
                    <Text style={s.replySample}>Totally! Next time for sure 🙌</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ===== FEATURES ===== */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionLabelWrap}>
              <Text style={s.sectionLabel}>FEATURES</Text>
            </View>
            <Text style={s.sectionHeadline}>
              Everything you need to{"\n"}communicate with confidence
            </Text>
          </View>
          <View style={s.featuresGrid}>
            {FEATURES.map((f, i) => (
              <View key={i} style={[s.featureCard, i % 2 === 1 && s.featureCardAlt]}>
                <View style={[s.featureIcon, { backgroundColor: f.color + "15" }]}>
                  <Text style={s.featureIconText}>{f.icon}</Text>
                </View>
                <Text style={s.featureTitle}>{f.title}</Text>
                <Text style={s.featureDesc}>{f.desc}</Text>
                <TouchableOpacity style={s.learnMore}>
                  <Text style={[s.learnMoreText, { color: f.color }]}>Learn more →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* ===== CTA BLOCK ===== */}
        <View style={[s.ctaBlock, { backgroundColor: theme.primary }]}>
          <View style={s.ctaBlockContent}>
            <Text style={s.ctaBlockHeadline}>
              Stop overthinking{"\n"}your messages
            </Text>
            <Text style={s.ctaBlockSub}>
              Whether it's a tricky work email, a sensitive text, or a first
              message — Tone Reply helps you find the right words in seconds.
            </Text>
            <TouchableOpacity style={s.ctaBlockBtn} onPress={handleGetStarted}>
              <Text style={s.ctaBlockBtnText}>Start Free Today</Text>
            </TouchableOpacity>
          </View>
          <View style={s.ctaBlockDecor}>
            <StaticSparkle size={40} color="#C9A84C" />
            <View style={s.ctaCircle} />
          </View>
        </View>

        {/* ===== HOW IT WORKS ===== */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionLabelWrap}>
              <Text style={s.sectionLabel}>HOW IT WORKS</Text>
            </View>
            <Text style={s.sectionHeadline}>
              Three steps to{"\n"}better conversations
            </Text>
          </View>
          <View style={s.stepsList}>
            {STEPS.map((step, i) => (
              <TouchableOpacity
                key={i}
                style={[s.stepCard, openStep === i && s.stepCardOpen]}
                onPress={() => setOpenStep(openStep === i ? null : i)}
                activeOpacity={0.7}
              >
                <View style={s.stepHeader}>
                  <Text style={[s.stepNum, openStep === i && { color: theme.primary }]}>{step.num}</Text>
                  <Text style={[s.stepTitle, openStep === i && { color: theme.primary }]}>{step.title}</Text>
                  <Text style={s.stepToggle}>{openStep === i ? "−" : "+"}</Text>
                </View>
                {openStep === i && (
                  <Text style={s.stepDesc}>{step.desc}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ===== RESULTS ===== */}
        <View style={[s.section, { backgroundColor: theme.primary }]}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionLabelWrap, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Text style={[s.sectionLabel, { color: "#FFFFFF" }]}>RESULTS</Text>
            </View>
            <Text style={[s.sectionHeadline, { color: "#FFFFFF" }]}>
              What users are saying{"\n"}about their experience
            </Text>
          </View>
          <View style={s.resultsGrid}>
            {[
              { stat: "9", label: "Message Styles", detail: "One draft, nine completely different vibes — from professional to mysterious." },
              { stat: "17", label: "Reply Goals", detail: "Every conversation is different. Pick the exact intent that fits your situation." },
              { stat: "7", label: "Insight Cards", detail: "Emotional tone, balance, misunderstandings, ambiguity — all analyzed in seconds." },
            ].map((r, i) => (
              <View key={i} style={s.resultCard}>
                <Text style={s.resultStat}>{r.stat}</Text>
                <Text style={s.resultLabel}>{r.label}</Text>
                <Text style={s.resultDetail}>{r.detail}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ===== PRICING ===== */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionLabelWrap}>
              <Text style={s.sectionLabel}>PRICING</Text>
            </View>
            <Text style={s.sectionHeadline}>
              Simple, transparent{"\n"}pricing
            </Text>
            <Text style={s.sectionSub}>
              Start free, upgrade when you need more. No hidden fees.
            </Text>
          </View>
          <View style={s.pricingGrid}>
            {PRICING.map((p, i) => (
              <View
                key={i}
                style={[
                  s.pricingCard,
                  p.primary && { borderColor: theme.primary, borderWidth: 2 },
                ]}
              >
                {p.primary && (
                  <View style={[s.popularBadge, { backgroundColor: theme.primary }]}>
                    <Text style={s.popularBadgeText}>Most Popular</Text>
                  </View>
                )}
                <Text style={s.pricingTier}>{p.tier}</Text>
                <View style={s.pricingPriceRow}>
                  <Text style={s.pricingPrice}>{p.price}</Text>
                  <Text style={s.pricingPeriod}>{p.period}</Text>
                </View>
                <View style={s.pricingDivider} />
                {p.features.map((f, j) => (
                  <View key={j} style={s.pricingFeatureRow}>
                    <Text style={[s.pricingCheck, { color: theme.primary }]}>✓</Text>
                    <Text style={s.pricingFeature}>{f}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={[
                    s.pricingCta,
                    p.primary
                      ? { backgroundColor: theme.primary }
                      : { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border },
                  ]}
                  onPress={handleGetStarted}
                >
                  <Text
                    style={[
                      s.pricingCtaText,
                      p.primary ? { color: "#FFFFFF" } : { color: theme.textPrimary },
                    ]}
                  >
                    {p.cta}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* ===== TESTIMONIALS ===== */}
        <View style={[s.section, { backgroundColor: "#000000" }]}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionLabelWrap, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
              <Text style={[s.sectionLabel, { color: "#FFFFFF" }]}>TESTIMONIALS</Text>
            </View>
            <Text style={[s.sectionHeadline, { color: "#FFFFFF" }]}>
              Don't take our word for it
            </Text>
          </View>
          <View style={s.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <View key={i} style={s.testimonialCard}>
                <Text style={s.testimonialQuote}>"{t.quote}"</Text>
                <View style={s.testimonialAuthor}>
                  <View style={[s.testimonialAvatar, { backgroundColor: FEATURES[i].color }]}>
                    <Text style={s.testimonialAvatarText}>{t.name[0]}</Text>
                  </View>
                  <View>
                    <Text style={s.testimonialName}>{t.name}</Text>
                    <Text style={s.testimonialTitle}>{t.title}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ===== FINAL CTA ===== */}
        <View style={s.finalCta}>
          <StaticSparkle size={24} color={theme.accent.gold} />
          <Text style={s.finalCtaHeadline}>
            Let's make your{"\n"}conversations effortless
          </Text>
          <Text style={s.finalCtaSub}>
            Join hundreds of people who communicate with confidence. Free to
            start — no credit card required.
          </Text>
          <TouchableOpacity style={s.finalCtaBtn} onPress={handleGetStarted}>
            <Text style={s.finalCtaBtnText}>Get Started Free</Text>
          </TouchableOpacity>
          <StaticSparkle size={18} color={theme.accent.pink} />
        </View>

        {/* ===== FOOTER ===== */}
        <View style={s.footer}>
          <RainbowStripe />
          <View style={s.footerInner}>
            <View>
              <Text style={s.footerLogo}>
                <Text style={s.logoIcon}>✦</Text> Tone Reply
              </Text>
              <Text style={s.footerTagline}>AI-powered communication assistant</Text>
            </View>
            <View style={s.footerLinks}>
              {["Features", "How It Works", "Pricing", "Testimonials"].map((l) => (
                <TouchableOpacity key={l}>
                  <Text style={s.footerLink}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.footerCopy}>© 2026 Tone Reply. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollView: { flex: 1 },

    /* Navbar */
    navbar: { backgroundColor: theme.surface, paddingTop: Platform.OS === "web" ? 20 : 50 },
    navInner: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Platform.OS === "web" ? 80 : 20,
      paddingVertical: 16,
    },
    navLeft: { flexDirection: "row", alignItems: "center", gap: 40 },
    logo: { fontSize: 22, fontFamily: typography.fontFamily.serifBold, color: theme.textPrimary },
    logoIcon: { color: theme.primary },
    navLinks: { flexDirection: "row", gap: 28 },
    navLink: { fontSize: 15, color: theme.textSecondary, fontWeight: "500" },
    navRight: { flexDirection: "row", alignItems: "center", gap: 12 },
    themeToggle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    themeToggleText: { fontSize: 20 },
    navCta: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: borderRadius.xl,
    },
    navCtaText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },

    /* Hero */
    hero: {
      flexDirection: Platform.OS === "web" ? "row" : "column",
      alignItems: "center",
      paddingHorizontal: Platform.OS === "web" ? 80 : 20,
      paddingVertical: Platform.OS === "web" ? 60 : 40,
      gap: 40,
    },
    heroContent: { flex: 1 },
    heroVisual: { flex: 1, alignItems: "center" },
    heroHeadline: {
      fontSize: Platform.OS === "web" ? 52 : 34,
      fontFamily: typography.fontFamily.serifBlack,
      color: theme.textPrimary,
      lineHeight: Platform.OS === "web" ? 60 : 42,
      marginBottom: 20,
    },
    heroSub: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 26,
      marginBottom: 28,
      maxWidth: 480,
    },
    heroCta: {
      backgroundColor: theme.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: borderRadius.xl,
      alignSelf: "flex-start",
    },
    heroCtaText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
    heroBadges: { flexDirection: "row", gap: 12, marginTop: 32, flexWrap: "wrap" },
    heroBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.primaryMuted,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: borderRadius.full,
    },
    heroBadgeText: { fontSize: 13, fontWeight: "600", color: theme.primary },

    /* Phone Mockup */
    phoneMockup: {
      width: 280,
      height: 500,
      backgroundColor: theme.surface,
      borderRadius: 36,
      borderWidth: 3,
      borderColor: theme.border,
      overflow: "hidden",
      ...shadows.lg,
    },
    phoneScreen: { flex: 1, padding: 16 },
    phoneHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
    phoneDot: { width: 8, height: 8, borderRadius: 4 },
    phoneTitle: { fontSize: 14, fontWeight: "700", color: theme.textPrimary },
    chatBubbleIncoming: {
      backgroundColor: theme.surfaceAlt,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
      borderBottomLeftRadius: 4,
      alignSelf: "flex-start",
      marginBottom: 8,
      maxWidth: "85%",
    },
    chatBubbleOutgoing: {
      backgroundColor: theme.primary,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
      borderBottomRightRadius: 4,
      alignSelf: "flex-end",
      marginBottom: 8,
      maxWidth: "85%",
    },
    chatText: { fontSize: 12, color: theme.textPrimary, lineHeight: 17 },
    chatTextWhite: { fontSize: 12, color: "#FFFFFF", lineHeight: 17 },
    replyOptions: { gap: 8, marginTop: 12 },
    replyOption: {
      borderWidth: 1.5,
      borderRadius: 12,
      padding: 10,
    },
    replyLabel: { fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
    replySample: { fontSize: 11, color: theme.textSecondary },

    /* Sections */
    section: {
      paddingHorizontal: Platform.OS === "web" ? 80 : 20,
      paddingVertical: Platform.OS === "web" ? 60 : 40,
    },
    sectionHeader: { marginBottom: 40 },
    sectionLabelWrap: {
      backgroundColor: theme.primaryMuted,
      alignSelf: "flex-start",
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: borderRadius.sm,
      marginBottom: 16,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: "800",
      color: theme.primary,
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
    sectionHeadline: {
      fontSize: Platform.OS === "web" ? 36 : 26,
      fontFamily: typography.fontFamily.serifBlack,
      color: theme.textPrimary,
      lineHeight: Platform.OS === "web" ? 44 : 34,
    },
    sectionSub: {
      fontSize: 15,
      color: theme.textSecondary,
      lineHeight: 24,
      marginTop: 12,
      maxWidth: 500,
    },

    /* Features */
    featuresGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 20,
    },
    featureCard: {
      width: Platform.OS === "web" ? "48%" : "100%",
      backgroundColor: theme.surface,
      borderRadius: borderRadius.xxxl,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 28,
      ...shadows.sm,
    },
    featureCardAlt: {
      backgroundColor: theme.primary,
    },
    featureIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    featureIconText: { fontSize: 24 },
    featureTitle: {
      fontSize: 20,
      fontFamily: typography.fontFamily.serifBold,
      color: theme.textPrimary,
      marginBottom: 10,
      lineHeight: 26,
    },
    featureDesc: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    learnMore: { alignSelf: "flex-start" },
    learnMoreText: { fontSize: 14, fontWeight: "600" },

    /* CTA Block */
    ctaBlock: {
      flexDirection: Platform.OS === "web" ? "row" : "column",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: Platform.OS === "web" ? 80 : 20,
      marginVertical: 20,
      borderRadius: borderRadius.xxxl,
      padding: Platform.OS === "web" ? 48 : 32,
      overflow: "hidden",
    },
    ctaBlockContent: { flex: 1 },
    ctaBlockHeadline: {
      fontSize: Platform.OS === "web" ? 32 : 24,
      fontFamily: typography.fontFamily.serifBlack,
      color: "#FFFFFF",
      lineHeight: Platform.OS === "web" ? 40 : 32,
      marginBottom: 12,
    },
    ctaBlockSub: {
      fontSize: 15,
      color: "rgba(255,255,255,0.85)",
      lineHeight: 24,
      marginBottom: 24,
      maxWidth: 440,
    },
    ctaBlockBtn: {
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: borderRadius.xl,
      alignSelf: "flex-start",
    },
    ctaBlockBtnText: { color: theme.primary, fontSize: 15, fontWeight: "700" },
    ctaBlockDecor: { alignItems: "center", gap: 16 },
    ctaCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "rgba(255,255,255,0.1)",
    },

    /* Steps */
    stepsList: { gap: 12 },
    stepCard: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 20,
    },
    stepCardOpen: {
      backgroundColor: theme.primaryMuted,
      borderColor: theme.primary,
    },
    stepHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    stepNum: {
      fontSize: 20,
      fontFamily: typography.fontFamily.serifBlack,
      color: theme.textMuted,
      width: 36,
    },
    stepTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
    },
    stepToggle: {
      fontSize: 22,
      fontWeight: "300",
      color: theme.textMuted,
    },
    stepDesc: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 22,
      marginTop: 12,
      marginLeft: 52,
    },

    /* Results */
    resultsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 20,
    },
    resultCard: {
      flex: 1,
      minWidth: Platform.OS === "web" ? 280 : "100%",
      backgroundColor: "rgba(255,255,255,0.08)",
      borderRadius: borderRadius.xxxl,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
      padding: 28,
    },
    resultStat: {
      fontSize: 48,
      fontFamily: typography.fontFamily.serifBlack,
      color: "#FFFFFF",
      marginBottom: 4,
    },
    resultLabel: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 8,
    },
    resultDetail: {
      fontSize: 14,
      color: "rgba(255,255,255,0.7)",
      lineHeight: 22,
    },

    /* Pricing */
    pricingGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 20,
      justifyContent: "center",
    },
    pricingCard: {
      width: Platform.OS === "web" ? 300 : "100%",
      backgroundColor: theme.surface,
      borderRadius: borderRadius.xxxl,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 28,
      position: "relative",
      ...shadows.sm,
    },
    popularBadge: {
      position: "absolute",
      top: -12,
      right: 20,
      paddingHorizontal: 14,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
    },
    popularBadgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
    pricingTier: {
      fontSize: 18,
      fontFamily: typography.fontFamily.serifBold,
      color: theme.textPrimary,
      marginBottom: 8,
    },
    pricingPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 4, marginBottom: 16 },
    pricingPrice: {
      fontSize: 42,
      fontFamily: typography.fontFamily.serifBlack,
      color: theme.textPrimary,
    },
    pricingPeriod: { fontSize: 15, color: theme.textMuted },
    pricingDivider: { height: 1, backgroundColor: theme.border, marginBottom: 16 },
    pricingFeatureRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
    pricingCheck: { fontSize: 15, fontWeight: "700" },
    pricingFeature: { fontSize: 14, color: theme.textSecondary, flex: 1 },
    pricingCta: {
      marginTop: 20,
      paddingVertical: 14,
      borderRadius: borderRadius.xl,
      alignItems: "center",
    },
    pricingCtaText: { fontSize: 15, fontWeight: "700" },

    /* Testimonials */
    testimonialsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 20,
    },
    testimonialCard: {
      flex: 1,
      minWidth: Platform.OS === "web" ? 300 : "100%",
      backgroundColor: "rgba(255,255,255,0.06)",
      borderRadius: borderRadius.xxxl,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      padding: 28,
    },
    testimonialQuote: {
      fontSize: 15,
      color: "rgba(255,255,255,0.85)",
      lineHeight: 24,
      fontStyle: "italic",
      marginBottom: 20,
    },
    testimonialAuthor: { flexDirection: "row", alignItems: "center", gap: 12 },
    testimonialAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    testimonialAvatarText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
    testimonialName: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
    testimonialTitle: { fontSize: 12, color: "rgba(255,255,255,0.5)" },

    /* Final CTA */
    finalCta: {
      alignItems: "center",
      paddingHorizontal: Platform.OS === "web" ? 80 : 20,
      paddingVertical: Platform.OS === "web" ? 60 : 40,
      gap: 16,
    },
    finalCtaHeadline: {
      fontSize: Platform.OS === "web" ? 36 : 26,
      fontFamily: typography.fontFamily.serifBlack,
      color: theme.textPrimary,
      textAlign: "center",
      lineHeight: Platform.OS === "web" ? 44 : 34,
    },
    finalCtaSub: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      maxWidth: 480,
    },
    finalCtaBtn: {
      backgroundColor: theme.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: borderRadius.xl,
      marginTop: 8,
    },
    finalCtaBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

    /* Footer */
    footer: { backgroundColor: theme.surface, marginTop: 20 },
    footerInner: {
      paddingHorizontal: Platform.OS === "web" ? 80 : 20,
      paddingVertical: 32,
    },
    footerLogo: {
      fontSize: 20,
      fontFamily: typography.fontFamily.serifBold,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    footerTagline: { fontSize: 13, color: theme.textMuted, marginBottom: 20 },
    footerLinks: { flexDirection: "row", gap: 24, marginBottom: 20, flexWrap: "wrap" },
    footerLink: { fontSize: 13, color: theme.textSecondary },
    footerCopy: { fontSize: 12, color: theme.textMuted },
  });
