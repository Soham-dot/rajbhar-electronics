import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/server/admin-auth";
import { enforceSameOrigin, withNoStore } from "../../../../lib/server/security";

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request, "Invalid logout request origin.");
  if (sameOriginError) {
    return withNoStore(sameOriginError);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return withNoStore(response);
}


