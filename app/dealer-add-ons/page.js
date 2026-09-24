import "../globals.css";

export const metadata = {
  title: "Which Car Dealer Add-Ons Can You Decline? | Don't Sign This Yet",
  description: "Learn how to identify optional car dealer add-ons, ask for an itemized quote without them, and check how they affect your loan.",
  alternates: { canonical: "https://dontsignthisyet.com/dealer-add-ons" }
};

export default function DealerAddOnsGuide() {
  return <>
    <header className="guideHeader"><a href="/">DON&apos;T SIGN <span>THIS YET</span></a><a href="/#calculator">Calculator</a></header>
    <main className="guideWrap">
      <article className="card guideArticle">
        <p className="guideEyebrow">Car buying guide</p>
        <h1>Which car dealer add-ons can you decline?</h1>
        <p className="guideLead">A dealer may offer products on top of the vehicle price. Ask what each one costs, whether you want it, and what the written deal looks like without it.</p>

        <h2>Start with the itemized quote</h2>
        <p>Ask the dealer to separate the vehicle selling price, optional products, dealer fees, taxes, and title and registration charges. An add-on is a product or service offered with the car or financing; a dealer fee is a separate charge. Do not assume every charge labeled a “fee” is a government charge. Ask who receives it and whether the dealer will remove or reduce it.</p>
        <p>Common optional products include vehicle service contracts (often called extended warranties), GAP coverage, credit insurance, maintenance plans, VIN etching, and paint or fabric protection. Check the details before deciding: a product can have exclusions, deductibles, limits, or coverage you already have. The Consumer Financial Protection Bureau says extended warranties, GAP coverage, and credit insurance are not required to get an auto loan.</p>

        <h2>Compare the deal with and without add-ons</h2>
        <p>Here is a fictional example, before taxes, government charges, down payment, or trade-in:</p>
        <table className="guideTable"><caption>Example optional add-on comparison</caption><tbody>
          <tr><th scope="row">Vehicle selling price</th><td>$28,000</td></tr>
          <tr><th scope="row">Service contract</th><td>$1,500</td></tr>
          <tr><th scope="row">Paint protection</th><td>$700</td></tr>
          <tr className="guideTotal"><th scope="row">Price with these add-ons</th><td>$30,200</td></tr>
        </tbody></table>
        <p>Declining both optional products reduces the purchase charges in this example by <strong>$2,200</strong>. If they would have been financed, removing them also reduces the amount borrowed and the interest paid over time. Your actual payment change depends on the APR, loan term, and which charges are financed.</p>

        <h2>What to say at the dealership</h2>
        <ul>
          <li>“Please show me an itemized out-the-door quote with every add-on listed separately.”</li>
          <li>“Which products are optional? Please give me the price without the ones I decline.”</li>
          <li>“Is this charge a dealer fee or a government charge? Can you remove or reduce it?”</li>
          <li>“Show me the amount financed, APR, term, monthly payment, and total finance charge with and without these products.”</li>
        </ul>
        <p>Compare the revised buyer&apos;s order and financing paperwork before signing. If you want a product, ask for its full price and contract terms in writing. You can also compare similar coverage elsewhere. If a dealer says an optional product is required for financing, ask for that claim in writing and consider another financing offer.</p>

        <h2>Put the revised numbers in the calculator</h2>
        <p>Enter the price of add-ons you choose to keep in <strong>Dealer add-ons</strong>, and enter the dealer&apos;s separate fees in <strong>Dealer fees</strong>. Use zero for add-ons you decline. Include taxes, title, and registration from the written quote so the estimated out-the-door total is complete. Our <a href="/out-the-door-price">out-the-door price guide</a> shows how those charges fit together.</p>
        <a className="guideAction" href="/#calculator">Check your deal in the calculator →</a>
        <p className="guideNote">The calculator estimates costs from the numbers you enter. Confirm the final charges and amount financed on the dealer&apos;s documents.</p>

        <h2>Sources and further reading</h2>
        <ul className="guideSources">
          <li><a href="https://www.consumerfinance.gov/ask-cfpb/am-i-required-to-purchase-an-extended-warranty-or-guaranteed-asset-protection-gap-insurance-from-a-lender-or-dealer-to-get-an-auto-loan-en-807/">Consumer Financial Protection Bureau: Are add-on products required for an auto loan?</a></li>
          <li><a href="https://www.consumerfinance.gov/ask-cfpb/what-things-can-i-negotiate-when-shopping-for-a-car-or-auto-loan-en-2132/">Consumer Financial Protection Bureau: What can I negotiate?</a></li>
          <li><a href="https://consumer.ftc.gov/articles/financing-or-leasing-car">Federal Trade Commission: Financing or leasing a car</a></li>
        </ul>
      </article>
    </main>
  </>;
}
