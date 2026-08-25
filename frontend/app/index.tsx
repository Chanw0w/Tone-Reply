import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../src/utils/theme-context";
import { useAuth } from "../src/utils/auth-context";
import { typography, borderRadius, shadows } from "../src/constants/theme";
import { RainbowStripe } from "../src/components/RainbowStripe";
import { StaticSparkle } from "../src/components/SparkleDecoration";

const FEATURES = [
  { title: "Smart Reply Generation", desc: "Paste a conversation, pick your goal and tone, and get multiple styled reply options \u2014 from polite to assertive to flirty.", icon: "\uD83D\uDCAC", color: "#3D6B4F", bg: "#E8F5E9" },
  { title: "9-Style Rewriter", desc: "Take any draft message and instantly see it rewritten in 9 distinct personality styles: confident, romantic, professional, mysterious, and more.", icon: "\u270D\uFE0F", color: "#7B6B8D", bg: "#EDE8F4" },
  { title: "Conversation Coach", desc: "Get deep analysis of any conversation \u2014 emotional tone, misunderstandings, unanswered questions, and actionable coaching tips.", icon: "\uD83E\uDDE0", color: "#4A9BA8", bg: "#E0F4F6" },
  { title: "Custom Presets", desc: "Save your favorite reply configurations as reusable presets. One tap to apply your go-to style for any situation.", icon: "\uD83D\uDCCC", color: "#D4845A", bg: "#FAEDE5" },
  { title: "Save & Organize", desc: "Bookmark the replies you love. Build a personal library of perfect responses for future conversations.", icon: "\u2B50", color: "#C9A84C", bg: "#FAF3E0" },
  { title: "Multi-Platform", desc: "Works on iOS, Android, and web. Your communication assistant goes wherever your conversations happen.", icon: "\uD83D\uDCF1", color: "#E87898", bg: "#FDE9EF" },
];

const STEPS = [
  { num: "01", title: "Paste Your Conversation", desc: "Drop in any chat history, email thread, or message draft. Tone Reply understands context." },
  { num: "02", title: "Choose Your Goal", desc: "Select from 17 intent options \u2014 from Reply politely to Set a boundary to Flirt to Negotiate." },
  { num: "03", title: "Pick Your Format", desc: "One sentence? Full email? Text message? Bullet points? You decide how the reply should look." },
  { num: "04", title: "Get Multiple Options", desc: "Receive several styled replies side by side, each with a different tone and approach." },
  { num: "05", title: "Rewrite & Refine", desc: "Love the idea but not the wording? Rewrite any reply in 9 personality styles instantly." },
  { num: "06", title: "Save & Reuse", desc: "Bookmark your favorites or save as presets for one-tap access next time." },
];

const STATS = [
  { value: "9", label: "Message Styles", detail: "One draft, nine completely different vibes \u2014 from professional to mysterious.", color: "#7B6B8D" },
  { value: "17", label: "Reply Goals", detail: "Every conversation is different. Pick the exact intent that fits your situation.", color: "#3D6B4F" },
  { value: "7", label: "Insight Cards", detail: "Emotional tone, balance, misunderstandings, ambiguity \u2014 all analyzed in seconds.", color: "#4A9BA8" },
];

const TESTIMONIALS = [
  { quote: "I used to spend 20 minutes drafting one work email. Now I paste it into Tone Reply and have 5 perfect options in 10 seconds. It\u2019s changed how I communicate professionally.", name: "Alex Chen", title: "Product Manager", color: "#3D6B4F", initial: "A" },
  { quote: "The rewrite feature is incredible. I wrote a vulnerable text to someone I\u2019m dating, and Tone Reply gave me 9 versions \u2014 from confident to mysterious. I picked the perfect one.", name: "Maya Rodriguez", title: "Freelance Designer", color: "#7B6B8D", initial: "M" },
  { quote: "The conversation coach showed me I was asking too many unanswered questions and coming across as needy. Now I\u2019m aware of my patterns and my texts are so much better.", name: "Jordan Park", title: "College Student", color: "#4A9BA8", initial: "J" },
];

const PRICING = [
  { tier: "Free", price: "$0", period: "/mo", features: ["20 generates/day", "10 rewrites/day", "3 saves", "Basic styles", "Conversation coach"], cta: "Get Started", highlight: false, color: "#4A9BA8" },
  { tier: "Pro", price: "$9", period: "/mo", badge: "Most Popular", features: ["Unlimited generates", "Unlimited rewrites", "Unlimited saves", "All 17 goals", "All 9 styles", "Custom presets", "Priority support"], cta: "Start Pro", highlight: true, color: "#3D6B4F" },
  { tier: "Unlimited", price: "$19", period: "/mo", features: ["Everything in Pro", "Priority AI engine", "Advanced analytics", "API access", "Early access to features", "Dedicated support"], cta: "Go Unlimited", highlight: false, color: "#7B6B8D" },
];

function ColorMosaic({ size = 112 }: { size?: number }) {
  const colors = ["#3D6B4F", "#7B6B8D", "#E8C4B8", "#E87898", "#4A9BA8", "#D4845A", "#E8A840", "#FDF6EC", "#3D6B4F"];
  const blockW = (size - 8) / 3;
  return (
    <View style={{ width: size, height: size, flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
      {colors.map((c, i) => (
        <View key={i} style={{ width: blockW, height: blockW, backgroundColor: c, borderRadius: 2 }} />
      ))}
    </View>
  );
}

export default function Index() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const handleGetStarted = () => {
    router.push(user ? "/(tabs)/generate" : "/register");
  };

  const scrollTo = (y: number) => scrollRef.current?.scrollTo({ y, animated: true });

  const s = styles(theme, isMobile, isTablet, isDesktop);

  return (
    <View style={s.container}>
      <ScrollView ref={scrollRef} style={s.scrollView} showsVerticalScrollIndicator={false}>
        {/* NAVBAR */}
        <View style={s.navbar}>
          <View style={s.navInner}>
            <View style={s.navLeft}>
              <StaticSparkle size={14} color={theme.accent.gold} />
              <Text style={s.logo}>Tone Reply</Text>
              {isDesktop && (
                <View style={s.navLinks}>
                  {[{l:"Features",y:800},{l:"How It Works",y:2000},{l:"Pricing",y:4200},{l:"Testimonials",y:5200}].map(({l,y}) => (
                    <TouchableOpacity key={l} onPress={() => scrollTo(y)}>
                      <Text style={s.navLink}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={s.navRight}>
              <TouchableOpacity style={s.themeToggle} onPress={toggleTheme}>
                <Text style={s.themeToggleText}>{isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.navCta} onPress={handleGetStarted}>
                <Text style={s.navCtaText}>Get Started Free</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* HERO */}
        <View style={s.hero}>
          <RainbowStripe height={8} />
          <View style={s.heroInner}>
            <View style={s.heroCopy}>
              <View style={s.heroTagRow}>
                <StaticSparkle size={12} color="#E8A840" />
                <Text style={s.heroTag}>AI Communication Assistant</Text>
                <StaticSparkle size={12} color="#E87898" />
              </View>
              <Text style={s.heroHeadline}>
                Say the right{"\n"}
                <Text style={{ color: "#3D6B4F" }}>thing every</Text>{"\n"}
                time.
              </Text>
              <Text style={s.heroSub}>
                Paste any conversation and get multiple reply options tailored to
                your exact goal {"\u2014"} whether {"that's"} setting a boundary, flirting,
                negotiating, or simply being more confident.
              </Text>
              <View style={s.heroBadges}>
                {[["Chat","#3D6B4F"],["Analyze","#7B6B8D"],["Rewrite","#4A9BA8"],["Save","#D4845A"]].map(([label,color]) => (
                  <View key={label} style={[s.heroBadge, { backgroundColor: color }]}>
                    <Text style={s.heroBadgeText}>{label}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={s.heroCta} onPress={handleGetStarted}>
                <Text style={s.heroCtaText}>Try It Now</Text>
                <Ionicons name="arrow-forward" size={16} color="#FDF6EC" />
              </TouchableOpacity>
            </View>
            <View style={s.heroVisual}>
              {isDesktop && <View style={[s.mosaicDecor, { top: -32, right: -32 }]}><ColorMosaic size={112} /></View>}
              <View style={s.phoneMockup}>
                <View style={s.phoneStatusBar}>
                  <Text style={s.phoneStatusBarText}>{"\u2726"} Tone Reply</Text>
                  <Text style={[s.phoneStatusBarText, { opacity: 0.7 }]}>Generate</Text>
                </View>
                <RainbowStripe height={4} />
                <View style={s.phoneScreen}>
                  <Text style={s.phoneSectionLabel}>Conversation</Text>
                  <View style={s.chatBubbleIncoming}><Text style={s.chatText}>Hey, are we still on for tonight?</Text></View>
                  <View style={s.chatBubbleOutgoing}><Text style={s.chatTextWhite}>I{"'d"} love to but {"I'm"} swamped. Rain check?</Text></View>
                  <View style={s.chatBubbleIncoming}><Text style={s.chatText}>Sure, no worries!</Text></View>
                  <Text style={[s.phoneSectionLabel, { marginTop: 16 }]}>{"\u2726"} Styled Replies</Text>
                  <View style={s.replyOption}>
                    <View style={[s.replyBadge, { backgroundColor: "#3D6B4F" }]}><Text style={s.replyBadgeText}>Polite</Text></View>
                    <Text style={s.replyText}>Absolutely! {"Let's"} reschedule soon.</Text>
                  </View>
                  <View style={s.replyOption}>
                    <View style={[s.replyBadge, { backgroundColor: "#7B6B8D" }]}><Text style={s.replyBadgeText}>Casual</Text></View>
                    <Text style={s.replyText}>Totally! Next time for sure {"\uD83D\uDE4C"}</Text>
                  </View>
                </View>
              </View>
              {isDesktop && <View style={[s.mosaicDecor, { bottom: -24, left: -24 }]}><ColorMosaic size={96} /></View>}
            </View>
          </View>
          <RainbowStripe height={6} />
        </View>

        {/* FEATURES */}
        <View style={s.section}>
          <View style={s.sectionMax}>
            <View style={s.sectionLabelRow}>
              <StaticSparkle size={14} color={theme.accent.gold} />
              <Text style={s.sectionLabel}>FEATURES</Text>
            </View>
            <Text style={s.sectionHeadline}>
              Everything you need to{"\n"}
              <Text style={{ color: "#3D6B4F" }}>communicate with confidence</Text>
            </Text>
            <Text style={s.sectionSub}>Six powerful tools wrapped in one elegant interface. Your words, upgraded.</Text>
            <View style={s.featuresGrid}>
              {FEATURES.map((f, i) => (
                <View key={i} style={s.featureCard}>
                  <View style={[s.featureAccentBar, { backgroundColor: f.color }]} />
                  <View style={[s.featureIcon, { backgroundColor: f.bg }]}><Text style={s.featureIconText}>{f.icon}</Text></View>
                  <Text style={s.featureTitle}>{f.title}</Text>
                  <Text style={s.featureDesc}>{f.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* HOW IT WORKS */}
        <View style={s.howItWorksSection}>
          <View style={s.sectionMax}>
            <View style={s.sectionLabelRow}>
              <StaticSparkle size={14} color="#C9A84C" />
              <Text style={[s.sectionLabel, { color: "rgba(253,246,236,0.6)" }]}>HOW IT WORKS</Text>
            </View>
            <Text style={[s.sectionHeadline, { color: "#FDF6EC" }]}>Three steps to{"\n"}better conversations</Text>
            <Text style={[s.sectionSub, { color: "rgba(253,246,236,0.7)" }]}>A simple, elegant flow that gets you from confusion to confidence in seconds.</Text>
            <View style={s.stepsGrid}>
              {STEPS.map((step, i) => (
                <View key={i} style={s.stepCard}>
                  <Text style={s.stepNum}>{step.num}</Text>
                  <Text style={s.stepTitle}>{step.title}</Text>
                  <Text style={s.stepDesc}>{step.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* STATS */}
        <View style={s.section}>
          <View style={s.sectionMax}>
            <View style={s.sectionLabelRow}>
              <StaticSparkle size={14} color="#E87898" />
              <Text style={s.sectionLabel}>RESULTS</Text>
            </View>
            <Text style={s.sectionHeadline}>
              What users are saying{"\n"}
              <Text style={{ color: "#3D6B4F" }}>about their experience</Text>
            </Text>
            <View style={s.statsGrid}>
              {STATS.map((stat, i) => (
                <View key={i} style={s.statCard}>
                  <View style={[s.statAccentBar, { backgroundColor: stat.color }]} />
                  <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                  <Text style={s.statDetail}>{stat.detail}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* CTA BLOCK */}
        <View style={s.ctaBlockBg}>
          {isDesktop && <View style={[s.mosaicDecor, { left: -64, top: "50%" }]}><ColorMosaic size={192} /></View>}
          {isDesktop && <View style={[s.mosaicDecor, { right: -64, top: "50%" }]}><ColorMosaic size={192} /></View>}
          <View style={[s.ctaContent, s.sectionMax]}>
            <StaticSparkle size={36} color={theme.accent.gold} />
            <Text style={s.ctaHeadline}>Stop overthinking{"\n"}<Text style={{ color: "#3D6B4F" }}>your messages</Text></Text>
            <Text style={s.ctaSub}>{"Whether it's"} a tricky work email, a sensitive text, or a first message {"\u2014"} Tone Reply helps you find the right words in seconds.</Text>
            <TouchableOpacity style={s.ctaBtn} onPress={handleGetStarted}>
              <Text style={s.ctaBtnText}>Start Free Today</Text>
              <Ionicons name="arrow-forward" size={16} color="#FDF6EC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* PRICING */}
        <View style={s.pricingSection}>
          <View style={s.sectionMax}>
            <View style={s.sectionLabelRow}>
              <StaticSparkle size={14} color="#C9A84C" />
              <Text style={[s.sectionLabel, { color: "rgba(253,246,236,0.5)" }]}>PRICING</Text>
            </View>
            <Text style={[s.sectionHeadline, { color: "#FDF6EC" }]}>Simple, transparent{"\n"}<Text style={{ color: "#C9A84C" }}>pricing</Text></Text>
            <Text style={[s.sectionSub, { color: "rgba(253,246,236,0.6)" }]}>Start free, upgrade when you need more. No hidden fees.</Text>
            <RainbowStripe height={6} style={{ borderRadius: 3, marginBottom: 48, maxWidth: 120 }} />
            <View style={s.pricingGrid}>
              {PRICING.map((p, i) => (
                <View key={i} style={[s.pricingCard, p.highlight && { backgroundColor: "#FDF6EC", transform: [{ scale: 1.03 }] }]}>
                  {p.badge && <View style={[s.popularBadge, { backgroundColor: p.color }]}><Text style={s.popularBadgeText}>{p.badge}</Text></View>}
                  <Text style={[s.pricingTier, { color: p.highlight ? p.color : "rgba(253,246,236,0.5)" }]}>{p.tier}</Text>
                  <View style={s.pricingPriceRow}>
                    <Text style={[s.pricingPrice, { color: p.highlight ? "#1A1A1A" : "#FDF6EC" }]}>{p.price}</Text>
                    <Text style={[s.pricingPeriod, { color: p.highlight ? "#6B7280" : "rgba(253,246,236,0.4)" }]}>{p.period}</Text>
                  </View>
                  {p.features.map((f, j) => (
                    <View key={j} style={s.pricingFeatureRow}>
                      <Ionicons name="checkmark" size={14} color={p.color} style={{ marginRight: 10 }} />
                      <Text style={[s.pricingFeature, { color: p.highlight ? "#374151" : "rgba(253,246,236,0.75)" }]}>{f}</Text>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={[s.pricingCta, p.highlight ? { backgroundColor: p.color } : { backgroundColor: "transparent", borderWidth: 2, borderColor: "rgba(253,246,236,0.25)" }]}
                    onPress={handleGetStarted}
                  >
                    <Text style={[s.pricingCtaText, p.highlight ? { color: "#FDF6EC" } : { color: "rgba(253,246,236,0.8)" }]}>{p.cta}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* TESTIMONIALS */}
        <View style={s.section}>
          <View style={s.sectionMax}>
            <View style={s.sectionLabelRow}>
              <StaticSparkle size={14} color="#E87898" />
              <Text style={s.sectionLabel}>TESTIMONIALS</Text>
            </View>
            <Text style={s.sectionHeadline}>{"Don't take our word for it"}</Text>
            <View style={s.testimonialsGrid}>
              {TESTIMONIALS.map((t, i) => (
                <View key={i} style={s.testimonialCard}>
                  <Text style={[s.testimonialQuoteMark, { color: t.color }]}>{"\u201C"}</Text>
                  <Text style={s.testimonialQuote}>{"\u201C"}{t.quote}{"\u201D"}</Text>
                  <View style={s.testimonialAuthor}>
                    <View style={[s.testimonialAvatar, { backgroundColor: t.color }]}><Text style={s.testimonialAvatarText}>{t.initial}</Text></View>
                    <View>
                      <Text style={s.testimonialName}>{t.name}</Text>
                      <Text style={s.testimonialTitle}>{t.title}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* FINAL CTA */}
        <View style={s.finalCtaSection}>
          <RainbowStripe height={8} />
          {isDesktop && (
            <>
              <View style={[s.sparkleDecor, { top: 32, left: 48 }]}><StaticSparkle size={48} color="rgba(201,168,76,0.15)" /></View>
              <View style={[s.sparkleDecor, { bottom: 48, left: "33%" }]}><StaticSparkle size={32} color="rgba(232,120,152,0.15)" /></View>
              <View style={[s.sparkleDecor, { top: 64, right: 64 }]}><StaticSparkle size={40} color="rgba(74,155,168,0.15)" /></View>
              <View style={[s.sparkleDecor, { bottom: 32, right: "25%" }]}><StaticSparkle size={24} color="rgba(201,168,76,0.2)" /></View>
            </>
          )}
          <View style={[s.finalCtaContent, s.sectionMax]}>
            <StaticSparkle size={48} color="#C9A84C" />
            <Text style={s.finalCtaHeadline}>{"Let's make your"}{"\n"}<Text style={{ color: "#C9A84C" }}>conversations effortless</Text></Text>
            <Text style={s.finalCtaSub}>Join hundreds of people who communicate with confidence. Free to start {"\u2014"} no credit card required.</Text>
            <TouchableOpacity style={s.finalCtaBtn} onPress={handleGetStarted}>
              <Text style={s.finalCtaBtnText}>Get Started Free</Text>
              <Ionicons name="arrow-forward" size={16} color="#3D6B4F" />
            </TouchableOpacity>
          </View>
          <RainbowStripe height={8} />
        </View>

        {/* FOOTER */}
        <View style={s.footer}>
          <View style={[s.footerInner, s.sectionMax]}>
            <View style={s.footerTop}>
              <View>
                <View style={s.footerLogoRow}>
                  <StaticSparkle size={14} color={theme.accent.gold} />
                  <Text style={s.footerLogo}>Tone Reply</Text>
                </View>
                <Text style={s.footerTagline}>AI-powered communication assistant</Text>
              </View>
              <View style={s.footerLinks}>
                {[{l:"Features",y:800},{l:"How It Works",y:2000},{l:"Pricing",y:4200},{l:"Testimonials",y:5200}].map(({l,y}) => (
                  <TouchableOpacity key={l} onPress={() => scrollTo(y)}>
                    <Text style={s.footerLink}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={s.footerBottom}>
              <Text style={s.footerCopy}>{"\u00A9"} 2026 Tone Reply. All rights reserved.</Text>
              <RainbowStripe height={6} style={{ borderRadius: 3, width: 96 }} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = (theme: any, isMobile: boolean, isTablet: boolean, isDesktop: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollView: { flex: 1 },

    /* Navbar */
    navbar: { backgroundColor: theme.background, borderBottomWidth: 1, borderBottomColor: theme.border },
    navInner: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: isMobile ? 16 : isTablet ? 32 : 48, paddingVertical: isMobile ? 12 : 16, maxWidth: 1152, alignSelf: "center", width: "100%" },
    navLeft: { flexDirection: "row", alignItems: "center", gap: isMobile ? 8 : 12 },
    logo: { fontSize: isMobile ? 18 : 20, fontFamily: typography.fontFamily.serifBlack, color: theme.textPrimary },
    navLinks: { flexDirection: "row", gap: isTablet ? 16 : 28, marginLeft: isTablet ? 20 : 32 },
    navLink: { fontSize: 14, color: theme.textSecondary, fontFamily: typography.fontFamily.sansMedium },
    navRight: { flexDirection: "row", alignItems: "center", gap: isMobile ? 8 : 12 },
    themeToggle: { width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, borderRadius: 20, backgroundColor: theme.surfaceAlt, alignItems: "center", justifyContent: "center" },
    themeToggleText: { fontSize: isMobile ? 16 : 18 },
    navCta: { backgroundColor: "#3D6B4F", paddingHorizontal: isMobile ? 16 : 20, paddingVertical: isMobile ? 8 : 10, borderRadius: borderRadius.full },
    navCtaText: { color: "#FDF6EC", fontSize: isMobile ? 12 : 14, fontFamily: typography.fontFamily.serifBlack },

    /* Hero */
    hero: { backgroundColor: theme.background, overflow: "hidden" },
    heroInner: { flexDirection: isDesktop ? "row" : "column", paddingHorizontal: isMobile ? 16 : isTablet ? 32 : 48, paddingVertical: isMobile ? 24 : isTablet ? 48 : 80, maxWidth: 1152, alignSelf: "center", width: "100%", gap: isDesktop ? 48 : isMobile ? 24 : 32, alignItems: isDesktop ? "center" : "stretch" },
    heroCopy: { flex: isDesktop ? 1 : undefined },
    heroVisual: { flex: isDesktop ? 1 : undefined, alignItems: "center" },
    mosaicDecor: { position: "absolute", opacity: 0.6 },
    heroTagRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: isMobile ? 16 : 24 },
    heroTag: { fontSize: isMobile ? 10 : 11, fontFamily: typography.fontFamily.serifBold, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 2 },
    heroHeadline: { fontSize: isMobile ? 30 : isTablet ? 48 : 72, fontFamily: typography.fontFamily.serifBlack, color: theme.textPrimary, lineHeight: isMobile ? 36 : isTablet ? 54 : 76, marginBottom: isMobile ? 16 : 24 },
    heroSub: { fontSize: isMobile ? 14 : 16, color: theme.textSecondary, lineHeight: isMobile ? 22 : 26, marginBottom: isMobile ? 20 : 32, maxWidth: 480, fontFamily: typography.fontFamily.sansRegular },
    heroBadges: { flexDirection: "row", gap: isMobile ? 8 : 12, marginBottom: isMobile ? 24 : 40, flexWrap: "wrap" },
    heroBadge: { paddingHorizontal: isMobile ? 14 : 16, paddingVertical: isMobile ? 6 : 8, borderRadius: borderRadius.full },
    heroBadgeText: { fontSize: isMobile ? 12 : 13, fontFamily: typography.fontFamily.serifBlack, color: "#FFFFFF" },
    heroCta: { backgroundColor: "#3D6B4F", paddingHorizontal: isMobile ? 24 : 32, paddingVertical: isMobile ? 14 : 16, borderRadius: borderRadius.full, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, shadowColor: "#8B6F5E", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 },
    heroCtaText: { color: "#FDF6EC", fontSize: isMobile ? 14 : 16, fontFamily: typography.fontFamily.serifBlack },

    /* Phone Mockup */
    phoneMockup: { width: isMobile ? 260 : 300, backgroundColor: "#FDF6EC", borderRadius: 24, borderWidth: 1, borderColor: theme.border, overflow: "hidden", ...shadows.lg },
    phoneStatusBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#3D6B4F" },
    phoneStatusBarText: { fontSize: 13, fontFamily: typography.fontFamily.serifBlack, color: "#FDF6EC" },
    phoneScreen: { padding: 20 },
    phoneSectionLabel: { fontSize: 11, fontFamily: typography.fontFamily.serifBold, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 },
    chatBubbleIncoming: { backgroundColor: "#EDE8E0", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderBottomLeftRadius: 4, alignSelf: "flex-start", marginBottom: 8, maxWidth: "78%" },
    chatBubbleOutgoing: { backgroundColor: "#3D6B4F", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderBottomRightRadius: 4, alignSelf: "flex-end", marginBottom: 8, maxWidth: "78%" },
    chatText: { fontSize: 13, color: theme.textPrimary, lineHeight: 18 },
    chatTextWhite: { fontSize: 13, color: "#FFFFFF", lineHeight: 18 },
    replyOption: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.border, backgroundColor: "#FFFFFF", marginBottom: 8 },
    replyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full },
    replyBadgeText: { fontSize: 10, fontFamily: typography.fontFamily.serifBlack, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: 1 },
    replyText: { fontSize: 12, color: theme.textPrimary, flex: 1 },

    /* Sections */
    section: { paddingHorizontal: isMobile ? 16 : isTablet ? 32 : 48, paddingVertical: isMobile ? 32 : isTablet ? 64 : 96 },
    sectionMax: { maxWidth: 1152, alignSelf: "center", width: "100%" },
    sectionLabelRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
    sectionLabel: { fontSize: 11, fontFamily: typography.fontFamily.serifBold, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 2.5 },
    sectionHeadline: { fontSize: isMobile ? 24 : isTablet ? 36 : 48, fontFamily: typography.fontFamily.serifBlack, color: theme.textPrimary, lineHeight: isMobile ? 32 : isTablet ? 42 : 54, marginBottom: 12 },
    sectionSub: { fontSize: isMobile ? 14 : 16, color: theme.textSecondary, lineHeight: isMobile ? 22 : 26, marginBottom: isMobile ? 28 : 64, maxWidth: 500, fontFamily: typography.fontFamily.sansRegular },

    /* Features */
    featuresGrid: { flexDirection: "row", flexWrap: "wrap", gap: isMobile ? 12 : 20 },
    featureCard: { width: isMobile ? "100%" : isTablet ? "48%" : "31%", backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: theme.border, padding: isMobile ? 18 : 24, overflow: "hidden" },
    featureAccentBar: { position: "absolute", top: 0, left: 0, right: 0, height: 4, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    featureIcon: { width: isMobile ? 42 : 44, height: isMobile ? 42 : 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 16, marginTop: 4 },
    featureIconText: { fontSize: isMobile ? 20 : 22 },
    featureTitle: { fontSize: isMobile ? 16 : 18, fontFamily: typography.fontFamily.serifBlack, color: theme.textPrimary, marginBottom: 8 },
    featureDesc: { fontSize: isMobile ? 13 : 14, color: theme.textSecondary, lineHeight: isMobile ? 20 : 22, fontFamily: typography.fontFamily.sansRegular },

    /* How It Works */
    howItWorksSection: { paddingHorizontal: isMobile ? 16 : isTablet ? 32 : 48, paddingVertical: isMobile ? 32 : isTablet ? 64 : 96, backgroundColor: "#3D6B4F" },
    stepsGrid: { flexDirection: "row", flexWrap: "wrap", gap: isMobile ? 12 : 24 },
    stepCard: { width: isMobile ? "100%" : isTablet ? "48%" : "31%", backgroundColor: "rgba(253,246,236,0.07)", borderRadius: 20, borderWidth: 1, borderColor: "rgba(253,246,236,0.15)", padding: isMobile ? 18 : 24 },
    stepNum: { fontSize: isMobile ? 36 : 48, fontFamily: typography.fontFamily.serifBlack, color: "rgba(201,168,76,0.4)", marginBottom: isMobile ? 8 : 12 },
    stepTitle: { fontSize: isMobile ? 14 : 16, fontFamily: typography.fontFamily.serifBlack, color: "#FDF6EC", marginBottom: 8 },
    stepDesc: { fontSize: isMobile ? 13 : 14, color: "rgba(253,246,236,0.65)", lineHeight: isMobile ? 20 : 22, fontFamily: typography.fontFamily.sansRegular },

    /* Stats */
    statsGrid: { flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", gap: isMobile ? 12 : 24 },
    statCard: { flex: isMobile ? undefined : 1, minWidth: isMobile ? "100%" : isTablet ? 200 : 280, backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: theme.border, padding: isMobile ? 20 : 32, overflow: "hidden" },
    statAccentBar: { position: "absolute", top: 0, left: 0, right: 0, height: 6 },
    statValue: { fontSize: isMobile ? 48 : 72, fontFamily: typography.fontFamily.serifBlack, marginBottom: 4, marginTop: 4 },
    statLabel: { fontSize: isMobile ? 16 : 18, fontFamily: typography.fontFamily.serifBlack, color: theme.textPrimary, marginBottom: 8 },
    statDetail: { fontSize: isMobile ? 13 : 14, color: theme.textSecondary, lineHeight: isMobile ? 20 : 22, fontFamily: typography.fontFamily.sansRegular },

    /* CTA Block */
    ctaBlockBg: { paddingVertical: isMobile ? 32 : isTablet ? 64 : 80, backgroundColor: "#FDF6EC", alignItems: "center", overflow: "hidden" },
    ctaContent: { alignItems: "center", gap: isMobile ? 12 : 16, maxWidth: 896, alignSelf: "center", width: "100%", paddingHorizontal: isMobile ? 16 : 48 },
    ctaHeadline: { fontSize: isMobile ? 24 : isTablet ? 40 : 60, fontFamily: typography.fontFamily.serifBlack, color: theme.textPrimary, textAlign: "center", lineHeight: isMobile ? 32 : isTablet ? 48 : 68 },
    ctaSub: { fontSize: isMobile ? 14 : 16, color: theme.textSecondary, textAlign: "center", lineHeight: isMobile ? 22 : 26, maxWidth: 500, fontFamily: typography.fontFamily.sansRegular },
    ctaBtn: { backgroundColor: "#3D6B4F", paddingHorizontal: isMobile ? 24 : 40, paddingVertical: isMobile ? 14 : 16, borderRadius: borderRadius.full, flexDirection: "row", alignItems: "center", gap: 8, shadowColor: "#8B6F5E", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 },
    ctaBtnText: { color: "#FDF6EC", fontSize: isMobile ? 14 : 16, fontFamily: typography.fontFamily.serifBlack },

    /* Pricing */
    pricingSection: { paddingHorizontal: isMobile ? 16 : isTablet ? 32 : 48, paddingVertical: isMobile ? 32 : isTablet ? 64 : 96, backgroundColor: "#1A1A1A" },
    pricingGrid: { flexDirection: "row", flexWrap: "wrap", gap: isMobile ? 16 : 24, justifyContent: "center" },
    pricingCard: { width: isMobile ? "100%" : isTablet ? "48%" : 320, backgroundColor: "rgba(253,246,236,0.05)", borderRadius: 20, borderWidth: 1, borderColor: "rgba(253,246,236,0.12)", padding: isMobile ? 22 : 28, position: "relative" },
    popularBadge: { position: "absolute", top: -12, left: "50%", marginLeft: -50, width: 100, alignItems: "center", paddingHorizontal: 16, paddingVertical: 4, borderRadius: borderRadius.full },
    popularBadgeText: { color: "#FFFFFF", fontSize: 11, fontFamily: typography.fontFamily.serifBlack },
    pricingTier: { fontSize: isMobile ? 12 : 14, fontFamily: typography.fontFamily.serifBlack, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 },
    pricingPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 4, marginBottom: 20 },
    pricingPrice: { fontSize: isMobile ? 40 : 48, fontFamily: typography.fontFamily.serifBlack },
    pricingPeriod: { fontSize: isMobile ? 12 : 14 },
    pricingFeatureRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    pricingFeature: { fontSize: isMobile ? 13 : 14, flex: 1, fontFamily: typography.fontFamily.sansRegular },
    pricingCta: { marginTop: 20, paddingVertical: isMobile ? 12 : 14, borderRadius: borderRadius.full, alignItems: "center" },
    pricingCtaText: { fontSize: isMobile ? 13 : 14, fontFamily: typography.fontFamily.serifBlack },

    /* Testimonials */
    testimonialsGrid: { flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", gap: isMobile ? 12 : 24 },
    testimonialCard: { flex: isMobile ? undefined : 1, minWidth: isMobile ? "100%" : isTablet ? 280 : 300, backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: theme.border, padding: isMobile ? 18 : 24 },
    testimonialQuoteMark: { fontSize: isMobile ? 36 : 48, fontFamily: typography.fontFamily.serifBlack, lineHeight: isMobile ? 36 : 48, marginBottom: 8, opacity: 0.25 },
    testimonialQuote: { fontSize: isMobile ? 13 : 14, color: theme.textPrimary, lineHeight: isMobile ? 21 : 24, marginBottom: isMobile ? 14 : 20, fontFamily: typography.fontFamily.sansRegular },
    testimonialAuthor: { flexDirection: "row", alignItems: "center", gap: 12 },
    testimonialAvatar: { width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
    testimonialAvatarText: { color: "#FFFFFF", fontSize: isMobile ? 14 : 16, fontFamily: typography.fontFamily.serifBlack },
    testimonialName: { fontSize: isMobile ? 13 : 14, fontFamily: typography.fontFamily.serifBlack, color: theme.textPrimary },
    testimonialTitle: { fontSize: 12, color: theme.textSecondary },

    /* Final CTA */
    finalCtaSection: { overflow: "hidden", backgroundColor: "#3D6B4F", position: "relative" },
    sparkleDecor: { position: "absolute" },
    finalCtaContent: { alignItems: "center", paddingVertical: isMobile ? 32 : isTablet ? 48 : 96, gap: isMobile ? 12 : 16, position: "relative" },
    finalCtaHeadline: { fontSize: isMobile ? 24 : isTablet ? 40 : 60, fontFamily: typography.fontFamily.serifBlack, color: "#FDF6EC", textAlign: "center", lineHeight: isMobile ? 32 : isTablet ? 48 : 68 },
    finalCtaSub: { fontSize: isMobile ? 14 : 16, color: "rgba(253,246,236,0.75)", textAlign: "center", lineHeight: isMobile ? 22 : 26, maxWidth: 440, fontFamily: typography.fontFamily.sansRegular },
    finalCtaBtn: { backgroundColor: "#FDF6EC", paddingHorizontal: isMobile ? 24 : 40, paddingVertical: isMobile ? 14 : 16, borderRadius: borderRadius.full, marginTop: 8, flexDirection: "row", alignItems: "center", gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
    finalCtaBtnText: { color: "#3D6B4F", fontSize: isMobile ? 14 : 16, fontFamily: typography.fontFamily.serifBlack },

    /* Footer */
    footer: { backgroundColor: theme.background, borderTopWidth: 1, borderTopColor: theme.border },
    footerInner: { paddingHorizontal: isMobile ? 16 : 48, paddingVertical: isMobile ? 24 : 48, maxWidth: 1152, alignSelf: "center", width: "100%" },
    footerTop: { flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 24, gap: isMobile ? 16 : 0 },
    footerLogoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
    footerLogo: { fontSize: 18, fontFamily: typography.fontFamily.serifBlack, color: theme.textPrimary },
    footerTagline: { fontSize: 13, color: theme.textSecondary, fontFamily: typography.fontFamily.sansRegular },
    footerLinks: { flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 24 },
    footerLink: { fontSize: isMobile ? 13 : 14, color: theme.textSecondary, fontFamily: typography.fontFamily.sansMedium },
    footerBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 24 },
    footerCopy: { fontSize: 12, color: theme.textSecondary },
  });
