"use client";

import { useEffect } from "react";

export default function DisableContextMenu() {
  useEffect(() => {
    const handler = (event: MouseEvent) => event.preventDefault();
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, []);

  return null;
}
