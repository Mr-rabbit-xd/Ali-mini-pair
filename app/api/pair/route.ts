import { NextRequest, NextResponse } from 'next/server';

const API_URL = "https://rabbitapi.zone.id/api/pair";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const number = searchParams.get('number');

    if (!number) {
      return NextResponse.json(
        {
          status: "error",
          message: "Phone number is required"
        },
        { status: 400 }
      );
    }

    // 3 minute timeout
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 180000);

    const response = await fetch(
      `${API_URL}?number=${encodeURIComponent(number)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        {
          status: "error",
          message: data.message || "Failed to generate pair code"
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        creator: data.creator,
        number: data.result.number,
        pairingCode: data.result.code
      },
      { status: 200 }
    );

  } catch (error) {

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          status: "error",
          message: "Request timeout after 3 minutes"
        },
        { status: 408 }
      );
    }

    console.error("Pair API Error:", error);

    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unknown error"
      },
      { status: 500 }
    );
  }
}
