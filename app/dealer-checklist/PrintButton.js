"use client";

import { track } from "@vercel/analytics";

export default function PrintButton() {
  return <button className="checklistPrint" type="button" onClick={() => {track("Checklist Print Clicked"); window.print();}}>Print checklist</button>;
}
