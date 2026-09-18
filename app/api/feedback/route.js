import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function clean(value) {
  return String(value || "").trim().slice(0, 5000);
}

function escapeHtml(value) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request) {
  try {
    const body = await request.json();

    const goal = clean(body.goal);
    const confusing = clean(body.confusing);
    const problem = clean(body.problem);
    const scoreSense = clean(body.scoreSense);
    const change = clean(body.change);

    if (!goal && !confusing && !problem && !scoreSense && !change) {
      return Response.json(
        { error: "Please enter some feedback before submitting." },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Don't Sign This Yet <onboarding@resend.dev>",
      to: ["rmerrow111@gmail.com"],
      subject: "New Don't Sign This Yet feedback",
      html: `
        <h2>New Don't Sign This Yet Feedback</h2>

        <h3>What were you trying to do?</h3>
        <p>${escapeHtml(goal) || "No response"}</p>

        <h3>Was anything confusing?</h3>
        <p>${escapeHtml(confusing) || "No response"}</p>

        <h3>Did anything not work?</h3>
        <p>${escapeHtml(problem) || "No response"}</p>

        <h3>Did the score and explanation make sense?</h3>
        <p>${escapeHtml(scoreSense) || "No response"}</p>

        <h3>What would you change?</h3>
        <p>${escapeHtml(change) || "No response"}</p>
      `
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "Feedback could not be sent." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);

    return Response.json(
      { error: "Feedback could not be sent." },
      { status: 500 }
    );
  }
}
