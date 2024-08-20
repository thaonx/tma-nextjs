"use client";

import { Button, Divider, Text } from "@telegram-apps/telegram-ui";
import { useEffect, useState } from "react";
import useSound from "use-sound";

export default function SmashXPlay() {
  const [session, setSession] = useState(null);

  const [play] = useSound("/sounds/pop.mp3");

  const playSound = () => {
    play();
  }

  useEffect(() => {
    fetch("/api/session")
      .then((response) => response.json())
      .then((data) => setSession(data));
  }, []);

  return (
    <div>
      <h1>[ Play Screen ]</h1>
      <Text weight="1">{JSON.stringify(session)}</Text>
      <Divider />
      <Button onClick={playSound}>Boop!</Button>
    </div>
  );
}
