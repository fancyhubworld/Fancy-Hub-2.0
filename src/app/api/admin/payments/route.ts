import { NextRequest, NextResponse } from "next/server";
import {
  PaymentControlCenterEngine,
  PaymentProviderId,
} from "@/lib/payment-control-center-engine";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("provider") as PaymentProviderId | null;

    if (providerId) {
      const provider = PaymentControlCenterEngine.getProvider(providerId);
      if (!provider) {
        return NextResponse.json({ success: false, error: "Provider not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, provider });
    }

    const providers = PaymentControlCenterEngine.getAllProviders();
    return NextResponse.json({
      success: true,
      providers,
      totalActive: providers.filter((p) => p.status === "ACTIVE").length,
      liveActiveCount: providers.filter((p) => p.environment === "PRODUCTION" && p.id !== "COD").length,
      sandboxCount: providers.filter((p) => p.environment === "SANDBOX").length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, providerId, activationToken, confirmationPhrase, adminEmail, adminRole, targetEnv } = body;

    // Action 1: Generate Pre-Flight Audit Report
    if (action === "PRE_FLIGHT_AUDIT") {
      if (!providerId) {
        return NextResponse.json({ success: false, error: "providerId is required" }, { status: 400 });
      }
      const report = PaymentControlCenterEngine.generatePreFlightReport(providerId as PaymentProviderId);
      return NextResponse.json({ success: true, report });
    }

    // Action 2: Confirm Live Activation (Two-Step Super Admin)
    if (action === "CONFIRM_LIVE_ACTIVATION") {
      if (!providerId || !activationToken || !confirmationPhrase) {
        return NextResponse.json(
          { success: false, error: "providerId, activationToken, and confirmationPhrase are required" },
          { status: 400 }
        );
      }

      const result = await PaymentControlCenterEngine.confirmLiveActivation({
        providerId: providerId as PaymentProviderId,
        activationToken,
        confirmationPhrase,
        adminEmail: adminEmail || "superadmin@fancyhub.in",
        adminRole: adminRole || "SUPER_ADMIN",
      });

      if (!result.success) {
        return NextResponse.json(result, { status: 400 });
      }

      return NextResponse.json(result);
    }

    // Action 3: Switch to Sandbox / Toggle
    if (action === "SWITCH_ENVIRONMENT") {
      if (!providerId || !targetEnv) {
        return NextResponse.json({ success: false, error: "providerId and targetEnv are required" }, { status: 400 });
      }
      const result = PaymentControlCenterEngine.switchEnvironment(
        providerId as PaymentProviderId,
        targetEnv,
        adminEmail || "admin@fancyhub.in"
      );
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
