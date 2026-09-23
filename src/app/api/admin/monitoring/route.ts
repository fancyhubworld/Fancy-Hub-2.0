import { NextResponse } from "next/server";
import { ObservabilityEngine, AlertManager } from "@/lib/observability-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const healthReport = ObservabilityEngine.getUnifiedHealthReport();
    const appTelemetry = ObservabilityEngine.getAppTelemetry();
    const activeAlerts = AlertManager.listAlerts(false);

    return NextResponse.json({
      success: true,
      report: healthReport,
      telemetry: appTelemetry,
      alerts: activeAlerts,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve monitoring telemetry" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, alertId } = body;

    if (action === "RESOLVE_ALERT" && alertId) {
      const resolved = AlertManager.resolveAlert(alertId);
      return NextResponse.json({ success: true, resolved });
    }

    if (action === "TRIGGER_TEST_PROBE") {
      ObservabilityEngine.recordRequest(200, Math.floor(Math.random() * 40) + 10);
      return NextResponse.json({ success: true, message: "Probe telemetry recorded" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Operation failed" },
      { status: 500 }
    );
  }
}
