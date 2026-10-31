import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";

// POST: if BetterAuth session is valid -> sign JWT and store in HTTPOnly cookie
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: session.user.id, email: session.user.email, name: session.user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  (await cookies()).set("studio_token", token, {
    httpOnly: true, // JS can't read it -> safe from XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ success: true });
}

// DELETE: logout -> remove cookie
export async function DELETE() {
  (await cookies()).delete("studio_token");
  return Response.json({ success: true });
}
