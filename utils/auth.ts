import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const checkAuth = async () => {
  const headersList = await headers();
  const authorization = headersList.get("authorization") as string;
  const session: any = await jwt.verify(
    authorization.replace("Bearer ", "") || "",
    process.env.AUTH_SECRET || ""
  );

  if (session?.id) {
    return session;
  }

  return NextResponse.json(
    { success: false, message: "Unauthorized" },
    { status: 401 }
  );
};
