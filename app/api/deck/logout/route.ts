import { NextResponse } from "next/server";
import { DECK_AUTH_COOKIE } from "@/lib/deck-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: DECK_AUTH_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}
