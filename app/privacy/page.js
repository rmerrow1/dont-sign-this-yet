import "../globals.css";

export const metadata = {
  title: "Privacy | Don't Sign This Yet",
  description: "How Don't Sign This Yet handles calculator entries, site analytics, and feedback.",
  alternates: { canonical: "https://www.dontsignthisyet.com/privacy" }
};

export default function PrivacyPage() {
  return <>
    <header className="guideHeader"><a href="/">DON&apos;T SIGN <span>THIS YET</span></a><a href="/#calculator">Calculator</a></header>
    <main className="guideWrap"><article className="card guideArticle">
      <h1>Privacy</h1>
      <p className="guideLead">We want you to understand what happens to the information you enter here.</p>
      <p><strong>Updated September 26, 2026.</strong></p>

      <h2>Calculator entries</h2>
      <p>Your deal and household numbers are used in your browser to calculate the score and explanations. The calculator does not send those entered numbers to us or save them in an account. Avoid entering names, account numbers, or other identifying details.</p>

      <h2>Site analytics</h2>
      <p>We use Vercel Web Analytics to understand visits and broad actions, such as starting the calculator, attempting a calculation, viewing a completed score, and using the checklist. These events do not include the financial figures you enter. Vercel Web Analytics does not use cookies for this measurement. Our hosting provider may process technical request information needed to deliver and protect the site. See <a href="https://vercel.com/docs/analytics/privacy-policy">Vercel&apos;s analytics privacy information</a>.</p>

      <h2>Feedback</h2>
      <p>If you choose to submit the feedback form, the text you write is sent through our email provider, Resend, to the site owner so we can review and improve the site. Please do not include sensitive personal or financial information. Do not put deal numbers in the feedback form if you do not want us to receive them.</p>

      <h2>Advertising and affiliate links</h2>
      <p>The site does not currently display ads or affiliate links. If we add them, we will update this page and explain any advertising cookies, partner data use, and relevant choices before they go live. Any compensated recommendation will be identified near the link.</p>

      <h2>Questions</h2>
      <p>Use the <a href="/feedback">feedback form</a> for questions about this page. Please leave out sensitive details.</p>
      <a className="guideAction" href="/#calculator">Return to calculator →</a>
    </article></main>
  </>;
}
