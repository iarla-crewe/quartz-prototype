import { requestAuth } from "@/src/requestAuth";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function GET(req: NextRequest, res: NextResponse) {
    return new NextResponse(JSON.stringify({ status: "online"}))
}

export async function POST(req: NextRequest, res: NextResponse) {
    const { appToken, fiat, label, location }: { appToken: string, fiat: number, label: string, location: string } = await req.json();

    if (!appToken) return new Response(JSON.stringify({ message: "appToken is required"}));
    if (!fiat) return new Response(JSON.stringify({ message: "fiat amount required" }));
    if (isNaN(Number(fiat))) return new Response(JSON.stringify({ message: "invalid fiat amount" }));
    if (!label) return new Response(JSON.stringify({ message: "label is required" }));
    if (!location) return new Response(JSON.stringify({ message: "location is required" }));

    const success = await requestAuth(appToken, fiat, label, location);

    if (success) return new NextResponse(JSON.stringify({ transaction: "success"}))
    else return new NextResponse(JSON.stringify({ transaction: "not-verified"}))
}