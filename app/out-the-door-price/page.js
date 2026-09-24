import "../globals.css";

export const metadata = {
  title: "How to Check a Dealer's Out-the-Door Price | Don't Sign This Yet",
  description: "Add the vehicle price, dealer fees, add-ons, taxes and title charges to check a car dealer's out-the-door quote before considering your down payment or trade-in.",
  alternates: { canonical: "https://www.dontsignthisyet.com/out-the-door-price" }
};

export default function OutTheDoorPriceGuide() {
  return <>
    <header className="guideHeader"><a href="/">DON&apos;T SIGN <span>THIS YET</span></a><a href="/#calculator">Calculator</a></header>
    <main className="guideWrap">
      <article className="card guideArticle">
        <p className="guideEyebrow">Car buying guide</p>
        <h1>How to check a dealer&apos;s out-the-door price</h1>
        <p className="guideLead">The vehicle&apos;s advertised price is only one part of the purchase. Before agreeing to a payment, ask for a written quote that lists the selling price and every charge added to it.</p>

        <h2>What belongs in the total?</h2>
        <p>For a useful comparison, start with the vehicle&apos;s selling price. Add any optional products you accepted, dealer fees, sales taxes, title and registration, and other government charges. This is the <strong>out-the-door price before a down payment or trade-in</strong> as used by our calculator. The precise charges and tax treatment depend on the transaction and location, so use the dealer&apos;s itemized figures.</p>

        <h2>Work through a sample quote</h2>
        <p>Here is a fictional deal. Add each listed item once:</p>
        <table className="guideTable"><caption>Example out-the-door calculation</caption><tbody>
          <tr><th scope="row">Vehicle selling price</th><td>$28,000</td></tr>
          <tr><th scope="row">Optional add-ons</th><td>$1,200</td></tr>
          <tr><th scope="row">Dealer fees</th><td>$400</td></tr>
          <tr><th scope="row">Taxes</th><td>$1,800</td></tr>
          <tr><th scope="row">Title and registration</th><td>$250</td></tr>
          <tr><th scope="row">Other government fees</th><td>$100</td></tr>
          <tr className="guideTotal"><th scope="row">Itemized out-the-door price</th><td>$31,750</td></tr>
        </tbody></table>
        <p>If the dealer instead quotes <strong>$32,850</strong>, there is a <strong>$1,100 difference</strong> to explain. Ask which item is missing from the breakdown before treating either figure as final.</p>

        <h2>Keep the purchase price separate from the loan</h2>
        <p>The example total is before the buyer&apos;s cash and trade-in. A $3,000 down payment lowers the amount borrowed. If the trade is worth $7,000 but its payoff is $9,000, the $2,000 difference is negative equity; financing that old balance increases the new loan. If all $31,750 of the purchase charges are financed, the estimated amount borrowed is <strong>$31,750 − $3,000 + $2,000 = $30,750</strong>. Interest is then calculated on the loan; it is not part of the out-the-door purchase price.</p>
        <p>Some taxes or fees may be paid upfront instead of financed. Enter them accurately when comparing the payment, and verify the contract&apos;s amount financed.</p>

        <h2>Questions to ask before signing</h2>
        <ul>
          <li>Can I see the selling price and every tax, fee and add-on as separate line items?</li>
          <li>Which products are optional, and what does the quote look like without them?</li>
          <li>What are the trade-in value and the exact payoff on my current loan?</li>
          <li>Which charges are paid now and which are included in the amount financed?</li>
          <li>What are the final APR, loan term, monthly payment and total finance charge?</li>
        </ul>
        <p>Dealer document and preparation fees may be negotiable; government-set taxes, title and registration charges generally are not. The Consumer Financial Protection Bureau recommends comparing the full cost of the car and financing terms, rather than focusing only on the monthly payment.</p>
        <p>Unsure which extras to keep? Read our <a href="/dealer-add-ons">guide to optional dealer add-ons</a> before comparing quotes.</p>

        <a className="guideAction" href="/#calculator">Check your deal in the calculator →</a>
        <p className="guideNote">The calculator uses the numbers you enter and cannot verify the dealer&apos;s paperwork. Compare its estimate with the final written contract.</p>
        <h2>Sources and further reading</h2>
        <ul className="guideSources">
          <li><a href="https://www.consumerfinance.gov/ask-cfpb/how-much-can-i-afford-to-borrow-for-a-car-or-auto-loan-en-751/">Consumer Financial Protection Bureau: How much can I afford to borrow?</a></li>
          <li><a href="https://www.consumerfinance.gov/ask-cfpb/what-things-can-i-negotiate-when-shopping-for-a-car-or-auto-loan-en-2132/">Consumer Financial Protection Bureau: What can I negotiate?</a></li>
          <li><a href="https://www.consumerfinance.gov/ask-cfpb/should-i-trade-in-my-car-if-its-not-paid-off-en-2045/">Consumer Financial Protection Bureau: Trading in a car with a loan</a></li>
        </ul>
      </article>
    </main>
  </>;
}
