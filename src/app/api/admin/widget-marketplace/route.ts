import { NextRequest, NextResponse } from "next/server";
import {
  getAllMarketplacePlugins,
  getInstalledWidgetPlugins,
  installWidgetPlugin,
  uninstallWidgetPlugin,
} from "@/lib/widget-marketplace-engine";

export async function GET() {
  try {
    const all = getAllMarketplacePlugins();
    const installed = getInstalledWidgetPlugins();
    return NextResponse.json({
      success: true,
      plugins: all,
      installedCount: installed.length,
      totalCount: all.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pluginId, action } = body;

    if (!pluginId) {
      return NextResponse.json({ success: false, error: "Plugin ID required" }, { status: 400 });
    }

    if (action === "uninstall") {
      uninstallWidgetPlugin(pluginId);
      return NextResponse.json({ success: true, message: "Widget uninstalled successfully" });
    } else {
      installWidgetPlugin(pluginId);
      return NextResponse.json({ success: true, message: "Widget installed successfully and ready in builder" });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
