"use client";

import React, { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { postEvent } from "@telegram-apps/sdk";
import {
  useInitData,
  useLaunchParams,
  type User,
} from "@telegram-apps/sdk-react";
import { useClientOnce } from "@/hooks/useClientOnce";
import { Button } from "@telegram-apps/telegram-ui";

export default function SmashX() {
  const launchParams = useLaunchParams();
  const initDataRaw = useLaunchParams().initDataRaw;
  const initData = useInitData();
  const router = useRouter();


  // auto full screen
  useClientOnce(() => postEvent("web_app_expand"));

  // authenticate user
  const authenticateUser = async () => {
    const isMocked = sessionStorage.getItem('____mocked');

    if (initData) {
      try {
        const response = await fetch("/api/smashx/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initDataRaw, ...initData, isMocked}),
        });

        if (response.ok) {
          router.push("/smashx");
        } else {
          console.error("Authentication failed");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    }
  };

  return (
    <div>
      <h1>SmashX</h1>
      <p>launchParams: {JSON.stringify(launchParams)}</p>
      <p>initDataRaw: {JSON.stringify(initDataRaw)}</p>
      <p>initData: {JSON.stringify(initData)}</p>
      <p>isMocked: {sessionStorage.getItem('____mocked')}</p>
      <Button mode="filled" size="s" onClick={authenticateUser}>
        Authenticate
      </Button>
    </div>
  );
}
