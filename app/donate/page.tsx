"use client";

import Script from "next/script";
import { useState } from "react";
import { config } from "@/lib/config";

declare const Blockonomics: {
  widget: (options: {
    msg_area: string;
    uid?: string;
    email?: string;
    amount?: number;
  }) => void;
};

export default function DonatePage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(5);

  const uid = config.widgetUid;

  const handleSubmitParams = () => {
    if (!uid) {
      alert("Payment widget UID is not configured. Please contact support.");
      return;
    }

    const container = document.getElementById("blockonomics_widget");
    if (container) container?.replaceChildren(); // Clear previous widget

    Blockonomics.widget({
      msg_area: "blockonomics_widget",
      uid: uid,
      email: email || undefined, // Pass email if provided
      amount: amount,
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-3xl font-bold">Support the Project</h1>
      <p className="text-center max-w-md">
        If you enjoy using this project and would like to support its
        development, please consider making a donation. Your support helps us
        continue improving and adding new features!
      </p>
      <Script
        src="https://www.blockonomics.co/js/pay_widget.js"
        strategy="afterInteractive"
      />

      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded-lg mb-4"
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        className="p-2 border rounded-lg mb-4 w-24"
      />

      <button
        onClick={handleSubmitParams}
        className="p-2 bg-blue-500 text-white rounded-lg mb-4"
      >
        Apply
      </button>

      <div id="blockonomics_widget" suppressHydrationWarning></div>
    </div>
  );
}
