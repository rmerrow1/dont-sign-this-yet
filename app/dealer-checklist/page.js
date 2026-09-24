import "../globals.css";
import PrintButton from "./PrintButton";

export const metadata = {
  title: "Dealer Numbers Checklist | Don't Sign This Yet",
  description: "A printable checklist of the written prices, trade-in figures, loan terms, and optional charges to get before signing a car deal.",
  alternates: { canonical: "https://www.dontsignthisyet.com/dealer-checklist" }
};

const groups = [
  { title: "Vehicle and full price", items: [
    ["Vehicle selling price", "Before taxes, fees, and add-ons"],
    ["Dealer add-ons", "Itemized; mark which you can decline"],
    ["Dealer fees", "Itemized separately from government charges"],
    ["Taxes", "Ask what applies to this deal"],
    ["Title, registration, and other government fees", "Separate from dealer fees"],
    ["Written out-the-door price", "The total before down payment or trade-in"]
  ]},
  { title: "Trade-in and cash", items: [
    ["Written trade-in offer", "Get a separate value for your current car"],
    ["Exact payoff on current loan", "Ask your lender; it can differ from your statement balance"],
    ["Cash down payment", "Confirm whether any government charges are due upfront"]
  ]},
  { title: "Financing offer", items: [
    ["Amount financed", "Confirm whether old debt, add-ons, or fees are included"],
    ["APR", "Annual percentage rate"],
    ["Loan term", "Number of monthly payments"],
    ["Monthly payment", "For this exact price and loan term"],
    ["Total of payments", "All scheduled payments combined"],
    ["Finance charge", "The total borrowing cost shown in the loan disclosure"]
  ]}
];

export default function DealerChecklist() {
  return <>
    <header className="guideHeader"><a href="/">DON&apos;T SIGN <span>THIS YET</span></a><a href="/#calculator">Calculator</a></header>
    <main className="guideWrap checklistWrap"><article className="card guideArticle checklistArticle">
      <div className="checklistTop"><div><span className="guideEyebrow">Car buying worksheet</span><h1>Numbers to get from the dealer</h1></div><PrintButton /></div>
      <p className="checklistIntro">Ask for an itemized written quote and financing offer. Fill in these amounts before comparing the deal in the calculator. Check each line as you confirm it.</p>
      <div className="checklistGroups">{groups.map(group => <section className="checklistGroup" key={group.title}>
        <h2>{group.title}</h2>
        <div className="checklistRows">{group.items.map(([label, hint]) => <div className="checklistRow" key={label}>
          <span className="checklistBox" aria-hidden="true"/><div className="checklistLabel"><strong>{label}</strong><small>{hint}</small></div><span className="checklistBlank" aria-label={`${label} value`}>{label === "APR" ? "__________ %" : label === "Loan term" ? "__________ months" : "$ __________"}</span>
        </div>)}</div>
      </section>)}</div>
      <div className="checklistNotes"><strong>Before signing:</strong> Ask for a revised quote without any add-on you do not want. Check whether taxes and government fees are paid upfront or financed. Compare the final buyer&apos;s order and financing contract with these figures; a monthly payment alone does not show the full cost.</div>
      <div className="checklistFooter"><a className="guideAction" href="/#calculator">Compare the numbers in the calculator →</a><p className="guideNote">The calculator also asks for your own income, savings, essential expenses, and estimated insurance, fuel, and maintenance costs. Keep those personal figures separate from the dealer quote.</p></div>
      <section className="guideSources checklistSources"><h2>Consumer guidance</h2><p><a href="https://consumer.ftc.gov/articles/car-dealer-ads-and-promotions-know-you-go">FTC: Get an out-the-door price in writing</a> · <a href="https://www.consumerfinance.gov/ask-cfpb/how-do-i-compare-auto-loan-offers-what-should-i-look-at-besides-the-monthly-payment-en-753/">CFPB: Compare auto loan offers</a></p></section>
    </article></main>
  </>;
}
