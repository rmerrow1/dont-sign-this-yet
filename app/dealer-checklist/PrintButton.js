"use client";

export default function PrintButton() {
  return <button className="checklistPrint" type="button" onClick={() => window.print()}>Print checklist</button>;
}
