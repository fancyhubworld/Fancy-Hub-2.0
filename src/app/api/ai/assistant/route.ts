import { NextResponse } from "next/server";
import { chatWithShoppingAssistant } from "@/lib/gemini-ai-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history = [], activePincode, cartCount = 0 } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "User message is required" },
        { status: 400 }
      );
    }

    const assistantResponse = chatWithShoppingAssistant({
      userMessage: message,
      conversationHistory: history,
      activePincode,
      cartCount,
    });

    return NextResponse.json({
      success: true,
      ...assistantResponse,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process AI chat message" },
      { status: 500 }
    );
  }
}
