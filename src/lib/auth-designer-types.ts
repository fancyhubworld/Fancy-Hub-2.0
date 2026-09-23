export interface AuthPageDesignConfig {
  logoUrl?: string;
  backgroundColor: string;
  backgroundGradient?: string;
  illustrationUrl: string;
  headingText: string;
  subheadingText: string;
  enableGoogleAuth: boolean;
  enablePhoneAuth: boolean;
  enableEmailAuth: boolean;
  enableSocialAuth: boolean;
  termsText: string;
  privacyText: string;
}

export const DEFAULT_AUTH_DESIGN: AuthPageDesignConfig = {
  logoUrl: "/images/logo.png",
  backgroundColor: "#0B1120",
  backgroundGradient: "radial-gradient(at 10% 20%, rgba(20, 85, 217, 0.15) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(247, 148, 29, 0.15) 0px, transparent 50%), #0A0F1D",
  illustrationUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
  headingText: "Sign in to FancyHub",
  subheadingText: "Access authentic handloom weaves, order tracking, and member-exclusive wallet discounts.",
  enableGoogleAuth: true,
  enablePhoneAuth: true,
  enableEmailAuth: true,
  enableSocialAuth: true,
  termsText: "By signing in, you agree to FancyHub's Terms of Service",
  privacyText: "and Privacy Policy. 100% data security guaranteed.",
};

/**
 * Validates Google OAuth config safely without exposing server secrets to client
 */
export function getClientGoogleOAuthConfig() {
  return {
    isEnabled: process.env.GOOGLE_CLIENT_ID ? true : false,
    clientId: process.env.GOOGLE_CLIENT_ID || "demo-google-client-id.apps.googleusercontent.com",
  };
}
