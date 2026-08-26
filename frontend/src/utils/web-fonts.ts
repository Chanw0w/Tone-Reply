import { Platform } from "react-native";

// On web, inject @font-face declarations for Poppins and DM Sans.
// In dev mode, +html.tsx's <head> content is not rendered client-side, so
// we inject the @font-face via a runtime <style> tag. Local .ttf fonts don't
// load via expo-font on web because expo-asset generates empty URIs for them.
if (Platform.OS === "web" && typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @font-face{font-family:'Poppins_400Regular';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2')}
    @font-face{font-family:'Poppins_700Bold';font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2')}
    @font-face{font-family:'Poppins_900Black';font-style:normal;font-weight:900;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLBT5Z1xlFQ.woff2) format('woff2')}
    @font-face{font-family:'DMSans_400Regular';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2) format('woff2')}
    @font-face{font-family:'DMSans_500Medium';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2) format('woff2')}
    @font-face{font-family:'DMSans_600SemiBold';font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2) format('woff2')}
    @font-face{font-family:'DMSans_700Bold';font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2) format('woff2')}
  `;
  document.head.appendChild(style);

  // Set a default font-family on the body so any text without an explicit
  // fontFamily falls back to DM Sans instead of the browser default (Times serif).
  document.body.style.fontFamily = "DMSans_400Regular, sans-serif";
}
