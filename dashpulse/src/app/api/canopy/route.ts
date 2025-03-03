import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://one00xfarmer-model-api.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const endpoint = req.nextUrl.searchParams.get("endpoint");
    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint parameter" }, { status: 400 });
    }

    const formData = await req.formData();
    const response = await axios.post(
      `${BASE_URL}${endpoint}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorMessage = error.response?.data || "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: error.response?.status || 500 });
  }
}
