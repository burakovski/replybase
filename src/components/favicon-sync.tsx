"use client";

import { useEffect } from "react";

/** Favicon follows OS/browser scheme only — not data-theme. */
const LIGHT_ICON = "/logo/fav-lt-64.png";
const DARK_ICON = "/logo/fav-dt-64.png";
const LIGHT_APPLE = "/apple-touch-icon-light.png";
const DARK_APPLE = "/apple-touch-icon-dark.png";

function ensureLink(rel: string, id: string) {
  return (
    document.querySelector<HTMLLinkElement>(`#${id}`) ??
    (() => {
      const el = document.createElement("link");
      el.id = id;
      el.rel = rel;
      document.head.appendChild(el);
      return el;
    })()
  );
}

export function FaviconSync() {
  useEffect(() => {
    const icon = ensureLink("icon", "site-favicon");
    icon.type = "image/png";
    icon.sizes = "64x64";

    const apple = ensureLink("apple-touch-icon", "site-apple-icon");

    const apply = () => {
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      icon.href = dark ? DARK_ICON : LIGHT_ICON;
      apple.href = dark ? DARK_APPLE : LIGHT_APPLE;
    };

    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return null;
}
