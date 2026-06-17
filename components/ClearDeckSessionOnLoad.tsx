"use client";

import { useEffect } from "react";

type ClearDeckSessionOnLoadProps = {
  enabled: boolean;
};

export default function ClearDeckSessionOnLoad({ enabled }: ClearDeckSessionOnLoadProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    fetch("/api/deck/logout", {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // A failed clear only affects whether refresh asks again immediately.
    });
  }, [enabled]);

  return null;
}
