import { NextRequest, NextResponse } from "next/server";
import { GET as getPayments, POST as postPayments } from "../payments/route";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return getPayments(request);
}

export async function POST(request: NextRequest) {
  return postPayments(request);
}
