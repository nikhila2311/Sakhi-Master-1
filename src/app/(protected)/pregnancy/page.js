'use client';

import React, { useEffect } from "react";

export default function PregnancyPage() {
  useEffect(() => {
    function handleMessage(event) {
      // Check the origin of the message for security
      if (event.origin === "https://bloom-baby-bliss-guide.lovable.app") {
        const { data } = event;
        if (typeof data === "object" && data !== null && data.type === "iframe-pos") {
          // Handle the "iframe-pos" message here
          console.log("Received iframe-pos message:", data);
          // You would then implement logic to use this positional data
        }
      }
    }

    window.addEventListener("message", handleMessage);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="h-screen w-full p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Baby Bloom Guide</h1>
      <iframe
        src="https://bloom-baby-bliss-guide.lovable.app/"
        className="w-full h-full border rounded-lg"
        allowFullScreen
      />
    </div>
  );
}