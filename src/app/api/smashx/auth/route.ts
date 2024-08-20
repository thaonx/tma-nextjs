import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encrypt, SESSION_DURATION } from "@/utils/session";
import { validateTelegramWebAppData } from "@/utils/telegramAuth";
import { use } from "react";

const SMASHX_TELEGRAM_BOT_TOKEN = process.env
  .SMASHX_TELEGRAM_BOT_TOKEN as string;
const DESINTYX_API_BASE_URL = process.env.DESINTYX_API_BASE_URL as string;

export async function POST(request: Request) {
  const { initDataRaw, initData, isMocked } = await request.json();
  const { hash } = initData;

  console.log("Auth handler > initDataRaw:", initDataRaw);
  console.log("Auth handler > initData:", initData);
  console.log("Auth handler > isMocked:", isMocked);
  const expires = new Date(Date.now() + SESSION_DURATION);

  if (isMocked) {
    const mockUser = {
      id: initData.user.id,
      username: initData.user.username,
      destinyx_user_id: "mocked_user_id",
      destinyx_token: "mocked_token",
    };
    const session = await encrypt({ user: mockUser, expires });
    // Save the session in a cookie
    cookies().set("session", session, { expires, httpOnly: true });
    return NextResponse.json({ message: "Authentication successful" });
  }

  const validationResult = validateTelegramWebAppData(
    initDataRaw,
    SMASHX_TELEGRAM_BOT_TOKEN
  );

  if (validationResult.validatedData) {
    console.log("Mocked environment detected");
    // Authenticate DestinyX
    const authUrl = `${DESINTYX_API_BASE_URL}/oauth/telegram/authenticate`;
    const authResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: hash, init_data_raw: initDataRaw }),
    });
    const { data: destinyxAuthResp } = await authResponse.json();
    console.log("authenticateUser > response data:", destinyxAuthResp);

    if (!authResponse.ok) {
      return NextResponse.json(
        { message: "Authentication failed" },
        { status: 401 }
      );
    }

    // Create a new session
    const user = {
      id: validationResult.user.id,
      username: validationResult.user.username,
      destinyx_user_id: destinyxAuthResp.user_id,
      destinyx_token: destinyxAuthResp.token,
    };

    user["destinyx_user_id"] = destinyxAuthResp.user_id;
    user["destinyx_token"] = destinyxAuthResp.token;

    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set("session", session, { expires, httpOnly: true });

    return NextResponse.json({ message: "Authentication successful" });
  }

  console.log("Validation failed: ", validationResult);
  return NextResponse.json(
    { message: validationResult.message },
    { status: 401 }
  );
}
