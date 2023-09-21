import { runDemo } from "@/utils/sendMessage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
    const { destination }: { destination: string } = await request.json();

    if (!destination) {
        return new Response(JSON.stringify({ message: "destination is required"}))
    }

    console.log("[server] Running demo...");
    runDemo(destination);

    return new NextResponse(JSON.stringify({ status: "success"}))
}