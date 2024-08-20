"use client";

import React, { useMemo } from "react";
import {
  Banner,
  Button,
  Image,
  List
} from "@telegram-apps/telegram-ui";


export default function BotMenu() {
  return (
    <List>
      <Banner
        before={<Image alt="app1" size={48} src='/images/smash.png' />}
        header="Game 1"
        subheader="{Game 1 description}"
        type="section"
      >
        <React.Fragment key=".0">
          <Button Component="a" size="s" href="/smash">Play</Button>
        </React.Fragment>
      </Banner>
      <Banner
        before={<Image alt="app1"   size={48} />}
        header="Game 2"
        subheader="{Game 2 description}"
        type="section"
      >
        <React.Fragment key=".0">
          <Button size="s">Play</Button>
        </React.Fragment>
      </Banner>
    </List>
  );
}
