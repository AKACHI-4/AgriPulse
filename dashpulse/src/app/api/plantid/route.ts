import { NextRequest, NextResponse } from "next/server";
import axiosConfig from "@/lib/axios.config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = req.nextUrl.searchParams.get("type") || "identification";

    console.log(body);
    console.log(type);
    console.log(req.nextUrl);

    // const { data } = await axiosConfig.post(`/${type}`, body); // ✅ Only pass endpoint

    // return NextResponse.json(data);
    return {};
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    if (!type) throw new Error("Type parameter is required");

    const query = req.nextUrl.searchParams.toString();

    const { data } = await axiosConfig.get(`/${type}?${query}`); // ✅ Only pass endpoint

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}