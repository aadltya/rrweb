import axios from "axios";
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function POST(req: Request) {
  try {
    const { sessionData } = await req.json();

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: `Analyze this user session data and provide insights and what he did on page and return response on what he did in human understandable manner in markdown language so it is easy to display on frontend:\n\n${sessionData}` }],
          },
        ],
      }
    );

    // console.log("🔹 Gemini AI Response:", JSON.stringify(response.data, null, 2));

    return NextResponse.json({ insights: response.data.candidates[0].content });
  } catch (error) {
    console.error("Error analyzing session:", error);
    return NextResponse.json({ error: "Failed to analyze session" }, { status: 500 });
  }
}