import "../globals.css";

export const metadata = {
  title: "Trading In a Car with Negative Equity | Don't Sign This Yet",
  description: "Find out what happens when you owe more than your trade-in is worth, how old debt affects a new car loan, and which numbers to check before signing.",
  alternates: { canonical: "https://www.dontsignthisyet.com/negative-equity" }
};

export default function NegativeEquityGuide() {
  return <>
    <header className="guideHeader"><a href="/">DON&apos;T SIGN <span>THIS YET</span></a><a href="/#calculator">Calculator</a></header>
    <main className="guideWrap">
      <article className="card guideArticle">
        <p className="guideEyebrow">Car buying guide</p>
        <h1>What happens when you trade in a car with negative equity?</h1>
        <p className="guideLead">If your current loan payoff exceeds what the dealer offers for your car, you still owe the difference. Find that number before deciding whether to trade.</p>

        <h2>Calculate the gap</h2>
        <p>Get the exact payoff amount from your current lender and a written trade-in offer. The payoff may differ from the balance shown on a recent statement. Subtract the trade-in value from the payoff:</p>
        <table className="guideTable"><caption>Fictional trade-in example</caption><tbody>
          <tr><th scope="row">Current loan payoff</th><td>$18,000</td></tr>
          <tr><th scope="row">Dealer&apos;s trade-in offer</th><td>− $14,000</td></tr>
          <tr className="guideTotal"><th scope="row">Negative equity</th><td>$4,000</td></tr>
        </tbody></table>
        <p>That <strong>$4,000</strong> does not disappear when the dealer pays off your old lender. You may pay the gap separately or, if the lender and dealer allow it, finance it as part of the new deal. Compare the complete written terms for either choice.</p>

        <h2>See what rolling it into a new loan does</h2>
        <p>Suppose the new car&apos;s itemized out-the-door price is $30,000 and you make no down payment. If you finance the $4,000 gap too, your estimated amount borrowed rises from <strong>$30,000 to $34,000</strong>. That is $4,000 of old debt on top of the new purchase. Financing it can also increase the interest you pay; the amount depends on the APR and loan term.</p>
        <p>A lower monthly payment does not by itself show that the trade helped. Ask to compare the amount financed, APR, number of payments, and total finance charge. A longer term can lower the payment while keeping you in debt longer.</p>

        <h2>Questions to ask before signing</h2>
        <ul>
          <li>What is the exact payoff amount on my current loan, and when is that quote valid through?</li>
          <li>How much are you offering for my trade-in? Can I see it separately from the new car&apos;s selling price?</li>
          <li>Where does the difference appear on the buyer&apos;s order and financing contract?</li>
          <li>What are the amount financed, APR, term, monthly payment, and total finance charge if I roll in the difference?</li>
          <li>If you say you will “pay off” my old loan, am I paying that difference through the new loan or another charge?</li>
        </ul>
        <p>Consider getting another trade-in offer and comparing the cost of keeping your current vehicle longer, if that works for you. If the dealer handles the payoff, confirm with your old lender afterward that the old loan has been paid in full.</p>

        <h2>Check the deal in the calculator</h2>
        <p>In <strong>Trade-In</strong>, enter the written offer as <strong>Trade-in value</strong> and the lender&apos;s payoff as <strong>Amount still owed</strong>. Enter the new vehicle&apos;s selling price and other charges separately, along with the proposed APR, loan term, and down payment. The calculator estimates how the trade affects the new deal. Our <a href="/out-the-door-price">out-the-door price guide</a> explains which charges belong in the purchase price.</p>
        <a className="guideAction" href="/#calculator">Check your deal in the calculator →</a>
        <p className="guideNote">The calculator cannot verify a lender payoff or dealer contract. Check the actual amount financed and payoff terms in the final paperwork.</p>

        <h2>Sources and further reading</h2>
        <ul className="guideSources">
          <li><a href="https://www.consumerfinance.gov/ask-cfpb/should-i-trade-in-my-car-if-its-not-paid-off-en-2045/">Consumer Financial Protection Bureau: Trading in a car that is not paid off</a></li>
          <li><a href="https://consumer.ftc.gov/articles/auto-trade-ins-and-negative-equity-when-you-owe-more-your-car-worth">Federal Trade Commission: Auto trade-ins and negative equity</a></li>
        </ul>
      </article>
    </main>
  </>;
}
