import { NextRequest, NextResponse } from "next/server";
import axiosConfig from "@/lib/axios.config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const endpoint = req.nextUrl.searchParams.get("endpoint");
    const details = req.nextUrl.searchParams.get("details");

    // console.log(body, endpoint, details)

    const { data } = await axiosConfig.post(
      `/${endpoint}?details=${details}`,
      body
    );

    // console.log("data : ", data);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const endpoint = req.nextUrl.searchParams.get("endpoint");
    const query = req.nextUrl.searchParams.get("q");

    // console.log(endpoint, query);

    const { data } = await axiosConfig.get(
      `/${endpoint}?q=${query}`
    );

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}