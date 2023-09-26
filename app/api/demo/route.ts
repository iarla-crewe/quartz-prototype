import { runDemo } from "@/utils/sendMessage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const { appToken, fiat, label, location }: { appToken: string, fiat: number, label: string, location: string } = await req.json();

    if (!appToken) return new Response(JSON.stringify({ message: "appToken is required"}))
    if (!fiat) return new Response(JSON.stringify({ message: "fiat amount required" }));
    try { Number(fiat) } catch { return new Response(JSON.stringify({ message: "invalid fiat amount" })); }
    if (!label) return new Response(JSON.stringify({ message: "label is required" }));
    if (!location) return new Response(JSON.stringify({ message: "location is required" }));

    runDemo(appToken, fiat, label, location);

    return new NextResponse(JSON.stringify({ status: "success"}))
}