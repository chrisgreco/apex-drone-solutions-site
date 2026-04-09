"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Typewriter({
  text,
  className,
  speed = 45,
  startDelay = 0,
  cursorChar = "|",
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  cursorChar?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return (
    <span className={cn("", className)}>
      {displayed}
      <span
        className={cn(
          "inline-block ml-0.5 font-light",
          done ? "animate-blink" : "opacity-100"
        )}
      >
        {cursorChar}
      </span>
    </span>
  );
}
