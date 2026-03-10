"use client";

import { useEffect } from "react";

const AGENT_ID = "agent_7701kkcvwxfsfk48txr32pszzf7f";

export function ElevenLabsWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<elevenlabs-convai agent-id="${AGENT_ID}"></elevenlabs-convai>`,
      }}
    />
  );
}
