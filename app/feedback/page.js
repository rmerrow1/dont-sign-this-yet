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

  const [status, setStatus] = useState("idle");

  const submitFeedback = async () => {
    setStatus("sending");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Feedback could not be sent.");
      }

      setStatus("success");

      setForm({
        goal: "",
        confusing: "",
        problem: "",
        scoreSense: "",
        change: ""
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };
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

       <button
  type="button"
  className="primaryButton"
  onClick={submitFeedback}
  disabled={status === "sending"}
>
  {status === "sending" ? "Sending..." : "Submit Feedback"}
</button>

{status === "success" && (
  <p className="feedbackSuccess">
    Thank you. Your feedback was sent.
  </p>
)}

{status === "error" && (
  <p className="feedbackError">
    Sorry, your feedback couldn't be sent. Please try again.
  </p>
)}

        <p className="muted feedbackNote">
          Please don't include sensitive personal or financial information.
        </p>
      </div>
    </main>
  );
}
