"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [form, setForm] = useState({
    goal: "",
    confusing: "",
    problem: "",
    scoreSense: "",
    change: ""
  });

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <main className="feedbackPage">
      <div className="feedbackCard">
        <a href="/" className="feedbackBack">
          ← Back to calculator
        </a>

        <h1>Send Feedback</h1>

        <p className="muted">
          Thanks for testing Don't Sign This Yet. Your feedback will help us
          make the calculator clearer and more useful.
        </p>

        <div className="feedbackField">
          <label>What were you trying to do?</label>
          <textarea
            value={form.goal}
            onChange={e => update("goal", e.target.value)}
            rows={3}
          />
        </div>

        <div className="feedbackField">
          <label>Was anything confusing?</label>
          <textarea
            value={form.confusing}
            onChange={e => update("confusing", e.target.value)}
            rows={3}
          />
        </div>

        <div className="feedbackField">
          <label>Did anything not work?</label>
          <textarea
            value={form.problem}
            onChange={e => update("problem", e.target.value)}
            rows={3}
          />
        </div>

        <div className="feedbackField">
          <label>Did the score and explanation make sense?</label>
          <textarea
            value={form.scoreSense}
            onChange={e => update("scoreSense", e.target.value)}
            rows={3}
          />
        </div>

        <div className="feedbackField">
          <label>What would you change?</label>
          <textarea
            value={form.change}
            onChange={e => update("change", e.target.value)}
            rows={3}
          />
        </div>

        <button type="button" className="primaryButton">
          Submit Feedback
        </button>

        <p className="muted feedbackNote">
          Please don't include sensitive personal or financial information.
        </p>
      </div>
    </main>
  );
}
