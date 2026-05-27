import { NextResponse } from 'next/server';

const WHATSAPP_API_URL = "http://66.78.41.20:3000";

export async function GET() {
  try {
    const response = await fetch(`${WHATSAPP_API_URL}/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: `API Error: ${response.status}`
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      {
        status: "success",
        total: data.sessions?.length || 0,
        sessions: data.sessions || []
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Fetch Error:", error);

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
