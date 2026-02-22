import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body as { pin?: string };
    const expectedPin = process.env.BARISTA_PIN;

    if (!expectedPin) {
      return NextResponse.json({ valid: false }, { status: 500 });
    }

    return NextResponse.json({
      valid: pin === expectedPin,
    });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
