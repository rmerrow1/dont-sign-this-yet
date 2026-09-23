"use client";

import { useMemo, useState } from "react";
import { calculateDealScore } from "../lib/scoring";
import { checkDealerNumbers } from "../lib/dealer-checks";
import { compareLoanTerms } from "../lib/payment";
import { track } from "@vercel/analytics";
import "./globals.css";

const initial = {
  condition:"", price:"", market:"", apr:"", term:"", down:"", credit:"prime",
  tradeValue:"", tradeOwed:"", addons:"", fees:"", income:"", savings:"",
  expenses:"", insurance:"", fuel:"", maintenance:""
};

const money = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);

export default function Home() {
  const [form,setForm] = useState(initial);
  const [marketSource,setMarketSource] = useState("");
  const [calculated,setCalculated] = useState(false);
  const [attempted,setAttempted] = useState(false);
  const [dealerDetails,setDealerDetails] = useState({outTheDoor:"", taxes:"", titleRegistration:"", otherGovernmentFees:"", payment:"", financeGovernmentCharges:true});
  const result = useMemo(()=>calculateDealScore({...form,...dealerDetails}),[form,dealerDetails]);
  const termComparison = useMemo(()=>compareLoanTerms({...form,...dealerDetails}),[form,dealerDetails]);
  const dealerCheck = checkDealerNumbers(form, dealerDetails);
  const updateDealerDetail = (key, value) => {
    setDealerDetails(prev => ({...prev, [key]:value}));
    if (["taxes", "titleRegistration", "otherGovernmentFees", "financeGovernmentCharges"].includes(key)) setCalculated(false);
  };
  const dealerDetailError = Object.entries(dealerDetails).filter(([key]) => key !== "financeGovernmentCharges").some(([,value]) =>
    String(value).trim() && (!Number.isFinite(Number(value)) || Number(value) < 0));

  const validation = useMemo(() => {
    const errors = [];
    const required = [
      ["price", "vehicle price", "greater than $0"],
      ["market", "estimated fair market value", "greater than $0"],
  ["apr", "APR", "0% or greater"],
["term", "loan term", "greater than 0"],
["income", "monthly take-home pay", "greater than $0"],
["expenses", "monthly essential expenses", "greater than $0"]
    ];
    const optional = [
     
  ["down", "down payment"], ["tradeValue", "trade-in value"],
      ["tradeOwed", "amount still owed"], ["addons", "dealer add-ons"], ["fees", "dealer fees"],
      ["savings", "liquid savings"], ["insurance", "monthly insurance"], ["fuel", "monthly fuel"],
      ["maintenance", "monthly maintenance reserve"]
    ];
if (!form.condition) {
  errors.push("Select whether the vehicle is new or used.");
}
if (!marketSource) {
  errors.push("Select how you estimated the fair market value.");
}
    for (const [key, label, rule] of required) {
      const value = Number(form[key]);
      if (!String(form[key] ?? "").trim() || !Number.isFinite(value) || (key === "apr" ? value < 0 : value <= 0)) {
        errors.push(`Enter ${label} ${rule}.`);
      }
    }

    for (const [key, label] of optional) {
      const raw = String(form[key] ?? "").trim();
      const value = Number(form[key]);
   if (raw && (!Number.isFinite(value) || value < 0)) {
        errors.push(`Enter a valid ${label}.`);
      }
    }
    for (const [key, label] of [["taxes", "taxes"], ["titleRegistration", "title and registration"], ["otherGovernmentFees", "other government fees"]]) {
      const raw = String(dealerDetails[key] ?? "").trim();
      if (raw && (!Number.isFinite(Number(raw)) || Number(raw) < 0)) errors.push(`Enter valid ${label}.`);
    }

    return errors;
  }, [form, marketSource, dealerDetails]);
  const scoreReady = calculated && validation.length === 0;

  const update=(key,value)=>{
    setForm(f=>({...f,[key]:value}));
    setCalculated(false);
  };

  const calculate=()=>{
  setAttempted(true);
  if (validation.length) return;
    setCalculated(true);
    track("Calculate Score");
    requestAnimationFrame(() => {
      const results = document.getElementById("results");
      const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      if (results) {
        window.scrollTo({
          top: window.scrollY + results.getBoundingClientRect().top - headerHeight - 16,
          behavior: "smooth"
        });
      }
    });
  };

  const jumpToMissingCharges = event => {
    event.preventDefault();
    const section = document.getElementById("dealer-costs");
    if (!section) return;
    section.open = true;
    const firstMissing = [
      ["taxes", "dealer-taxes"],
      ["titleRegistration", "dealer-title"],
      ["otherGovernmentFees", "dealer-government"]
    ].find(([key]) => String(dealerDetails[key] ?? "").trim() === "");
    requestAnimationFrame(() => {
      const target = document.getElementById(firstMissing?.[1] ?? "dealer-taxes");
      const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      if (target) window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top - headerHeight - 24,
        behavior: "smooth"
      });
    });
  };

const requiredNumbers = ["price", "market", "apr", "term", "income", "expenses"];
const requiredComplete = requiredNumbers.filter(key =>
  String(form[key] ?? "").trim() !== "" && Number.isFinite(Number(form[key])) &&
  (key === "apr" ? Number(form[key]) >= 0 : Number(form[key]) > 0)
).length + (form.condition ? 1 : 0) + (marketSource ? 1 : 0);
const progress = Math.round(requiredComplete / 8 * 100);

const price = Number(form.price) || 0;
const market = Number(form.market) || 1;
const fees = Number(form.fees) || 0;
const income = Number(form.income) || 1;
const expenses = Number(form.expenses) || 1;
const insurance = Number(form.insurance) || 0;
const fuel = Number(form.fuel) || 0;
const maintenance = Number(form.maintenance) || 0;
const neg = Math.max(0,(Number(form.tradeOwed)||0)-(Number(form.tradeValue)||0));

const priceDiff = ((price-market)/market)*100;
const feePct = fees/Math.max(price,1)*100;
const transportRatio = (result.monthly+insurance+fuel+maintenance)/income*100;
const upfrontCharges = dealerDetails.financeGovernmentCharges ? 0 :
  (Number(dealerDetails.taxes)||0)+(Number(dealerDetails.titleRegistration)||0)+(Number(dealerDetails.otherGovernmentFees)||0);
const reserveMonths = form.savings !== "" ? Math.max(0,(Number(form.savings)||0)-(Number(form.down)||0)-upfrontCharges)/expenses : null;

const scoreReasons = [];

if(priceDiff >= 5){
  scoreReasons.push(
    `Vehicle price is ${money(price-market)} (${Math.round(priceDiff)}%) above the estimated fair market value. Ask the dealer to explain the difference or negotiate closer to market value.`
  );
}

if(result.aprDiff >= 3){
  scoreReasons.push(
    `The APR is ${result.aprDiff.toFixed(1)} percentage points above the estimated benchmark. Compare an outside bank or credit-union offer before signing.`
  );
}

if(result.term >= 72){
  scoreReasons.push(
    `The loan term is ${result.term} months. Ask to see the total interest and payment with a shorter term before focusing on the monthly payment.`
  );
}

if(neg > 0){
  scoreReasons.push(
    `You appear to be rolling ${money(neg)} of negative equity into the new deal. Confirm exactly how much of the old loan is being carried forward.`
  );
}

if(result.addonPct >= 5){
  scoreReasons.push(
    `Dealer add-ons equal about ${Math.round(result.addonPct)}% of the vehicle price. Request an itemized list and ask which products are optional.`
  );
}

if(feePct >= 2){
  scoreReasons.push(
    `Dealer fees are about ${Math.round(feePct)}% of the vehicle price. Ask for an itemized explanation of every fee.`
  );
}

if(transportRatio > 25){
  scoreReasons.push(
    `Estimated monthly transportation costs are about ${Math.round(transportRatio)}% of take-home pay. Make sure the payment remains comfortable after insurance, fuel and maintenance.`
  );
}

if(income - expenses - result.monthly - insurance - fuel - maintenance < 0){
  scoreReasons.push(
    "Your listed essential expenses and estimated transportation costs exceed take-home pay. Recheck the expenses and consider a lower total vehicle cost."
  );
}

if(reserveMonths !== null && reserveMonths < 1){
  scoreReasons.push(
    "After the down payment, your listed savings provide less than one month of essential expenses. Consider how much cash you want to keep available after buying the vehicle."
  );
}

if(result.score < 70 && scoreReasons.length === 0){
  scoreReasons.push(
    "Several deal factors are weighing on the score. Review the price, financing, fees and affordability numbers before signing."
  );
}

const aprGuidance =
  result.aprDiff >= 5
    ? `Your APR is ${result.aprDiff.toFixed(1)} percentage points above the estimated benchmark. Compare offers from another lender before signing.`
    : result.aprDiff >= 3
    ? `Your APR is ${result.aprDiff.toFixed(1)} percentage points above the estimated benchmark. Consider comparing another lender's offer.`
    : result.aprDiff >= 1
    ? `Your APR is ${result.aprDiff.toFixed(1)} percentage points above the estimated benchmark. Comparing another offer may help you find a lower rate.`
    : Number(form.apr) < result.benchmark
    ? `Your APR is below the estimated benchmark for this credit profile.`
    : `Your APR is close to the estimated benchmark for this credit profile.`;

  const marketConfidence =
  marketSource === "multiple"
    ? "Stronger estimate — you compared multiple valuation sources."
    : marketSource === "unsure"
    ? "Verify this number before relying on the score."
    : "Reasonable starting point — consider comparing another valuation source.";
  const nextSteps = [
  "Review the final buyer's order and financing contract before signing.",
  "Take your time and ask for the paperwork to review before making a decision."
];

  return <main>
    <header>
      <div className="nav">
        <div className="brand">DON'T SIGN <span>THIS YET</span></div>
        <div className="links">
          <a href="#calculator">Calculator</a>
          <a href="#learn">Learn</a>
          <a href="#tips">Tips</a>
          <a href="#about">About</a>
        </div>
      </div>
    </header>

    <div className="progress">
      <div className="progressFill" style={{width:`${progress}%`}}/>
      <div className="progressText">
        <span>Required details: {progress}% complete</span>
       
      </div>
    </div>

    <section className="hero">
      <div>
     
        <h1>Know the numbers before you sign.</h1>
    <p>Enter the numbers from your vehicle deal. We'll show you what's driving the score—and what to look at before you sign.</p>
      </div>
    </section>

    <div className="container" id="calculator">
      <div className="appGrid">

        <section className="card formCard">
          <h2>Calculate Your Deal</h2>
        <p className="muted">You can use approximate numbers. This is a decision-support tool—not financial or legal advice. Your numbers are used to calculate your score in this browser.</p>
        <p className="muted">* Required to calculate a score</p>
          
 <details className="helpDetails beforeCalculator">
  <summary>📋 What numbers should I get from the dealer?</summary>
  <ul>
    <li>Vehicle selling price</li>
    <li>Out-the-door price</li>
    <li>Trade-in value and exact loan payoff</li>
    <li>Down payment</li>
    <li>Dealer add-ons and fees</li>
    <li>APR and loan term</li>
    <li>Monthly payment</li>
  </ul>
</details> <Section title="🚙 Vehicle">
            <div className="formGrid">
              <div className="field">
                <label>Vehicle condition *</label>
                <div className="seg">
                  <button className={form.condition==="new"?"selected":""} onClick={()=>update("condition","new")}>New</button>
                  <button className={form.condition==="used"?"selected":""} onClick={()=>update("condition","used")}>Used</button>
                </div>
              </div>

             <Field label="Vehicle price ($) *" id="price" value={form["price"]} onChange={value => update("price", value)}/>
            <Field label="Estimated fair market value ($) *" id="market" value={form["market"]} onChange={value => update("market", value)}/>
  <p className="muted">
  <strong>Important:</strong> Vehicle price is the selling price of the vehicle.
  It is not necessarily the same as the out-the-door price. Ask the dealer for
  the complete out-the-door price, including taxes, title, registration, fees
  and add-ons, before signing.
</p>
            </div>
 <div className="marketSource">
  <label htmlFor="marketSource"><strong>How did you estimate the market value? *</strong></label>
  <select
    id="marketSource"
    value={marketSource}
    onChange={e => {setMarketSource(e.target.value); setCalculated(false);}}
  >
    <option value="" disabled>Select a source</option>
    <option value="multiple">I compared multiple sources</option>
    <option value="kbb">Kelley Blue Book</option>
    <option value="edmunds">Edmunds</option>
    <option value="jdpower">J.D. Power</option>
    <option value="other">Another source</option>
    <option value="unsure">I'm not sure</option>
  </select>
</div>
  <details className="helpDetails marketGuide">
  <summary>💡 Need help estimating market value?</summary>

  <p>
    Compare this vehicle using its exact year, make, model, trim, mileage and condition.
  </p>
  <div className="marketLinks">
    <p><strong>Research the vehicle's value:</strong></p>

    <p>
      <a
        href="https://www.kbb.com/whats-my-car-worth/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Kelley Blue Book — My Car's Value →
      </a>
    </p>

    <p>
      <a
        href="https://www.edmunds.com/appraisal/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Edmunds — Vehicle Appraisal →
      </a>
    </p>

    <p>
      <a
        href="https://www.jdpower.com/jd-power-pricing-and-values"
        target="_blank"
        rel="noopener noreferrer"
      >
        J.D. Power — Pricing & Values →
      </a>
    </p>
  </div>

  <p className="muted">
    These are third-party estimates. Values can differ based on mileage,
    condition, equipment and local market conditions. Use the results as
    a reference—not a guarantee.
  </p>

  <p className="muted">
    Enter your best-supported estimate above. Don't use the dealer's asking
    price as the market value.
  </p>
</details>
          </Section>

          <Section title="💰 Financing">
            <div className="formGrid">
              <Field label="APR (%) *" id="apr" value={form["apr"]} onChange={value => update("apr", value)}/>

              <div className="field">
                <label>Loan term *</label>
             <select value={form.term} onChange={e=>update("term",Number(e.target.value))}>
            <option value="">Select loan term</option>
                  {[36,48,60,72,84,96].map(x=><option key={x}>{x}</option>)}
                </select>
              </div>

              <Field label="Down payment ($)" id="down" value={form["down"]} onChange={value => update("down", value)}/>

              <div className="field">
                <label>Credit profile</label>
                <select value={form.credit} onChange={e=>update("credit",e.target.value)}>
                  <option value="super">Excellent</option>
                  <option value="prime">Prime / Good</option>
                  <option value="near">Near Prime</option>
                  <option value="sub">Subprime</option>
                  <option value="deep">Deep Subprime</option>
                </select>    
      </div>
              </div>
          <details className="helpDetails financeGuide">
  <summary>💡 Need help checking the financing?</summary>

  <p>
    Compare the APR you're being offered with rates available from a bank
    or credit union. A lower APR can save you significant money over the
    life of the loan.
  </p>

  <p>
    Also check the loan term. A longer term can lower the monthly payment,
    but may increase the total interest you pay.
  </p>

  <p>
    <strong>Compare current auto-loan rates:</strong>
  </p>

  <p>
    <a
      href="https://www.bankrate.com/loans/auto-loans/rates/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Bankrate — Current Auto Loan Rates →
    </a>
  </p>

  <p>
    <a
      href="https://www.nerdwallet.com/auto-loans"
      target="_blank"
      rel="noopener noreferrer"
    >
      NerdWallet — Auto Loan Resources →
    </a>
  </p>

  <p className="muted">
    These are comparison resources, not guarantees of the rate you will
    qualify for. Your credit profile, vehicle, loan term and lender can
    affect your actual APR.
  </p>
</details>
          </Section>

          <Section title="👤 Your affordability picture">
            <div className="formGrid">
              <Field label="Monthly take-home pay ($) *" id="income" value={form["income"]} onChange={value => update("income", value)}/>
              <Field label="Liquid savings ($)" id="savings" value={form["savings"]} onChange={value => update("savings", value)}/>
              <Field label="Monthly essential expenses ($) *" id="expenses" value={form["expenses"]} onChange={value => update("expenses", value)}/>
              <Field label="Monthly insurance ($)" id="insurance" value={form["insurance"]} onChange={value => update("insurance", value)}/>
              <Field label="Monthly fuel ($)" id="fuel" value={form["fuel"]} onChange={value => update("fuel", value)}/>
              <Field label="Monthly maintenance reserve ($)" id="maintenance" value={form["maintenance"]} onChange={value => update("maintenance", value)}/>
            </div>
          </Section>

          <Section title="🔄 Trade-In">
            <div className="formGrid">
              <Field label="Trade-in value ($)" id="tradeValue" value={form["tradeValue"]} onChange={value => update("tradeValue", value)}/>
              <Field label="Amount still owed ($)" id="tradeOwed" value={form["tradeOwed"]} onChange={value => update("tradeOwed", value)}/>
            </div><details className="helpDetails tradeGuide">
  <summary>💡 How does my trade-in affect this deal?</summary>

  <p>
    Compare your trade-in's value with what you still owe on the old loan.
    If you owe more than the vehicle is worth, the difference is negative
    equity and may be added to your new loan.
    If the vehicle is worth more than you owe, the remaining trade credit
    reduces our estimated amount financed. Confirm how the dealer applies it.
  </p>

  <p>
    Ask the dealer to show exactly how your trade-in value, loan payoff and
    any negative equity are reflected in the final paperwork.
  </p>

  <p className="muted">
    A higher trade-in value does not necessarily mean you're getting a better
    deal. Look at the complete transaction, including the new vehicle price
    and financing.
  </p>
</details>
          </Section>

         <Section title="📋 Deal extras">
  <div className="formGrid">
    <div>
      <Field label="Dealer add-ons ($)" id="addons" value={form["addons"]} onChange={value => update("addons", value)}/>
      <p className="muted">Optional products or services added to the deal. Ask which ones you can decline.</p>
    </div>

    <div>
      <Field label="Dealer fees ($)" id="fees" value={form["fees"]} onChange={value => update("fees", value)}/>
      <p className="muted">Check the buyer's order to see exactly what each fee is for.</p>
    </div>
  </div>
</Section>


          <details className="dealerCheck" id="dealer-costs">
            <summary>Taxes, title and dealer checks (optional)</summary>
            <p className="muted">We add the selling price, add-ons, dealer fees and listed government charges to estimate the out-the-door price before a down payment or trade-in. Enter the dealer's quote to compare. Financed government charges also affect the payment and score.</p>
            <div className="formGrid">
              <Field label="Dealer's out-the-door price ($)" id="dealer-otd" value={dealerDetails.outTheDoor} onChange={value=>updateDealerDetail("outTheDoor",value)}/>
              <Field label="Taxes ($)" id="dealer-taxes" value={dealerDetails.taxes} onChange={value=>updateDealerDetail("taxes",value)}/>
              <Field label="Title and registration ($)" id="dealer-title" value={dealerDetails.titleRegistration} onChange={value=>updateDealerDetail("titleRegistration",value)}/>
              <Field label="Other government fees ($)" id="dealer-government" value={dealerDetails.otherGovernmentFees} onChange={value=>updateDealerDetail("otherGovernmentFees",value)}/>
              <Field label="Dealer's monthly payment ($)" id="dealer-payment" value={dealerDetails.payment} onChange={value=>updateDealerDetail("payment",value)}/>
            </div>
            <label className="financeCharges"><input type="checkbox" checked={dealerDetails.financeGovernmentCharges} onChange={e=>updateDealerDetail("financeGovernmentCharges",e.target.checked)}/> Include taxes, title and government fees in the loan estimate</label>
            <p className="muted">Enter 0 if a tax or government charge doesn't apply. Use the selling price, dealer add-ons and dealer fees above; don't enter them again.</p>
            {dealerDetailError ? <p className="validation">Enter nonnegative numbers in these optional fields.</p> :
              Number(form.price) > 0 && <div className="dealerCheckResult" aria-live="polite">
                <p>{dealerCheck.completeCosts ? "Estimated out-the-door price" : "Known costs so far"}: <strong>{money(dealerCheck.total)}</strong></p>
                {!dealerCheck.completeCosts && <p>Enter taxes, title and registration, and other government fees (use 0 when none) for a complete estimate and dealer comparison.</p>}
                {dealerCheck.completeCosts && <>
                  {Number(dealerDetails.payment) > 0 && String(form.apr).trim() !== "" && Number.isFinite(Number(form.apr)) && Number(form.apr) >= 0 && Number(form.term) > 0 && <p>Estimated monthly payment using the same loan amount as the score: <strong>{money(dealerCheck.estimatedPayment)}</strong></p>}
                  {dealerCheck.notes.length ? <ul>{dealerCheck.notes.map((note,i)=><li key={i}>{note}</li>)}</ul> :
                    dealerCheck.comparisons > 0 && <p>No difference greater than $25 was found in the comparisons available from your entries.</p>}
                </>}
              </div>}
          </details>

          <button className="calculate" onClick={calculate}>
            Calculate My Deal Score →
          </button>
        </section>

        <aside className="results" id="results">
          <section className="card scoreCard">
            <div className="resultsTop">
              <span className="eyebrow dark">{scoreReady && !dealerCheck.completeCosts ? "PRELIMINARY DEAL SCORE" : "YOUR DEAL SCORE"}</span>
     
            </div>
       <div className={`scoreRing ${scoreReady?result.color:"neutral"}`}>
              <div>
                <div className="score">{scoreReady?result.score:"—"}</div>
                <div className="out">out of 100</div>
              </div>
            </div>

        
<div className="verdict">{scoreReady?result.verdict:"SCORE NEEDS UPDATING"}</div>

<p className="muted">
  {scoreReady
    ?"Review the strengths and concerns below before making your decision."
    :"Complete the required fields below to calculate your score."}
</p>

{!scoreReady && (
  <div className="missingFields">
    <strong>Still needed:</strong>
    <ul>
  {!form.condition && <li>Vehicle condition</li>}
      {!(Number(form.price) > 0) && <li>Vehicle price</li>}
      {!(Number(form.market) > 0) && <li>Estimated fair market value</li>}
       {!marketSource && <li>Market value source</li>}
     {!(String(form.apr).trim() !== "" && Number.isFinite(Number(form.apr)) && Number(form.apr) >= 0) && <li>APR</li>}
{!(Number(form.term) > 0) && <li>Loan term</li>}
{!(Number(form.income) > 0) && <li>Monthly take-home pay</li>}
{!(Number(form.expenses) > 0) && <li>Monthly essential expenses</li>}
    </ul>
  </div>
)}

            {attempted && validation.length>0 &&
              <div className="validation">
                <b>Please check your numbers:</b>
                <ul>{validation.map((e,i)=><li key={i}>{e}</li>)}</ul>
              </div>
            }

       <div className={scoreReady ? "resultsData" : "resultsData stale"} hidden={!scoreReady}>
              {!dealerCheck.completeCosts && <p className="preliminaryNotice"><strong>Preliminary result.</strong> Taxes, title and registration, or other government fees are missing. Your score, amount financed and payment may change. <a href="#dealer-costs" onClick={jumpToMissingCharges}>Add these charges</a> (enter 0 if none), then recalculate.</p>}

              <div className="kpis">
                <Kpi label={dealerCheck.completeCosts ? "Estimated monthly payment" : "Payment with entered costs"} value={money(result.monthly)}/>
                <Kpi label="Amount financed" value={money(result.financed)}/>
                <Kpi label={dealerCheck.completeCosts ? "Estimated out-the-door price" : "Known costs so far"} value={money(dealerCheck.total)}/>
                <Kpi label="Estimated interest" value={money(result.interest)}/>
                <Kpi label="Benchmark APR" value={result.benchmark.toFixed(1)+"%"}/>
              </div>
              <p className="muted">{dealerCheck.completeCosts ? "Out-the-door price is before any down payment or trade-in. Blank add-ons or dealer fees are treated as $0." : "Out-the-door total is incomplete until you enter taxes, title and registration, and other government fees (use 0 when none). Blank add-ons or dealer fees are treated as $0."}</p>
              <p className="muted">This payment uses only the charges you entered. Confirm the actual amount financed and payment on the dealer's contract.</p>

              {termComparison && <section className="termCompare" aria-label="Loan term comparison">
                <h3>What if you chose a shorter loan?</h3>
                <p>Same estimated amount financed and APR. The score above uses your selected term.</p>
                <table>
                  <thead><tr><th scope="col">Loan term</th><th scope="col">Monthly payment</th><th scope="col">Total interest</th></tr></thead>
                  <tbody>
                    <tr><th scope="row">{termComparison.term} months (selected)</th><td>{money(termComparison.currentPayment)}</td><td>{money(termComparison.currentInterest)}</td></tr>
                    <tr><th scope="row">{termComparison.shorterTerm} months</th><td>{money(termComparison.shorterPayment)}</td><td>{money(termComparison.shorterInterest)}</td></tr>
                  </tbody>
                </table>
                <p>A shorter loan raises the estimated payment by <strong>{money(termComparison.shorterPayment - termComparison.currentPayment)}/month</strong> and saves about <strong>{money(termComparison.currentInterest - termComparison.shorterInterest)}</strong> in interest if all payments are made on time. Ask the dealer whether the shorter term is available at the same APR.</p>
              </section>}


              <div className="breakdown">
                {Object.entries(result.categories).map(([key,val])=>
                  <Bar
                    key={key}
                    label={{vehicle:"Vehicle Deal",finance:"Financing",affordability:"Affordability",structure:"Deal Structure"}[key]}
                    value={val}
                  />
                )}
              </div>
            </div>

           {scoreReady && result.caps.length>0 &&
              <div className="flags">
                <h3>🚨 Critical Red Flags</h3>
                <p>Base score: <b>{result.base}/100</b>. The final score was capped because certain risks should not be canceled out by strengths elsewhere.</p>
                <ul>
                  {result.caps.map((c,i)=>
                    <li key={i}><b>Maximum {c.max}:</b> {c.reason}</li>
                  )}
                </ul>
              </div>
            }

    {scoreReady &&
  <div className="next">
    <h3>Why this score</h3>
    <p className="muted"><strong>Market value confidence:</strong> {marketConfidence}</p><ul>
              <p className="muted"><strong>Financing guidance:</strong> {aprGuidance}</p>
      {scoreReasons.slice(0,4).map((reason,i)=><li key={i}>{reason}</li>)}
    </ul>

    <h3>What to do next</h3>
    <ul>
      {nextSteps.map((s,i)=><li key={i}>{s}</li>)}
    </ul>
                     <details className="scoreMethod">
  <summary>How is my score calculated?</summary>
  <ul>
    <li><strong>Vehicle Deal — up to 25 points:</strong> vehicle price compared with estimated market value.</li>
    <li><strong>Financing — up to 25 points:</strong> APR, loan term and estimated interest.</li>
    <li><strong>Affordability — up to 25 points:</strong> payment and transportation costs compared with take-home pay.</li>
    <li><strong>Deal Structure — up to 25 points:</strong> trade-in, negative equity, dealer add-ons and fees.</li>
    <li><strong>Important:</strong> certain serious risks can limit the maximum score.</li>
  </ul>
  <p className="muted">This score is a decision-support tool based on the numbers you entered. It is not a guarantee that a deal is good or bad.</p>
</details>
  </div>
}
          </section>
        </aside>
      </div>

     <InfoSection
  id="how-it-works"
  title="🧭 How It Works"
  
  items={[
    ["1️⃣","Enter your deal numbers","Use the numbers from the dealer's worksheet or your best estimates."],
    ["2️⃣","We analyze the deal","The calculator looks at vehicle price, financing, affordability and deal structure."],
    ["3️⃣","Review the score","See what's driving the score, along with specific things to review before signing."],
    ["4️⃣","Make your own decision","Use the information to ask better questions and decide what you're comfortable with."]
  ]}
/> <InfoSection
        id="learn"
        title="📚 Learn the Numbers"
       
        items={[
       ["📈","APR","APR is the cost of borrowing. We compare it with an estimated benchmark based on vehicle condition and credit profile."],
          ["📅","Loan Term","A lower payment can hide a much longer loan and significantly more interest."],
          ["↘️","Negative Equity","Rolling old debt into a new loan can make the new deal much more expensive."],
          ["➕","Add-ons","Optional products can add thousands. Ask what each item costs and whether it is required."],
          ["🛡️","Category Floors","Weak categories retain a small floor so different bad deals do not all collapse to zero."],
          ["🚨","Critical Red Flags","Certain severe risks can cap the overall score because strengths elsewhere should not completely cancel them out."]
        ]}
      />

    

      
          
         <InfoSection
  id="tips"
  title="🗣️ Questions to Ask at the Dealership"
  items={[
    ["1️⃣","What is the total out-the-door price?","Ask for the complete price, including taxes, fees, add-ons, and other charges."],
    ["2️⃣","What is my APR and loan term?","Ask for the exact interest rate and number of months, not just the monthly payment."],
    ["3️⃣","How much will I pay in interest?","Ask for the total finance charge and total amount you will pay over the life of the loan."],
    ["4️⃣","What are you giving me for my trade?","Ask for the trade-in value and the exact payoff amount on your old loan."],
    ["5️⃣","Which add-ons are optional?","Ask what each add-on costs and whether you can decline it."],
    ["6️⃣","Can I take the paperwork home to review?","You should be able to review the final numbers before signing."]
  ]}
/> <section className="card info" id="about">
        <h2>About Don't Sign This Yet</h2>
        <p><b>We're not here to tell you what to do. We're here to help you understand what you're agreeing to.</b></p>
        <p className="muted">
          This tool organizes the information you enter and highlights areas that appear worth reviewing. It does not guarantee that a deal is good or bad and cannot replace reading your contract or obtaining professional advice.
        </p>
        <details>
          <summary>About the provisional Version 1.4 engine</summary>
          <p>
            Version 1.4 retains the Version 1.3 payment and scoring rules and limits the overall score to 69 when affordability is 5 out of 25 or lower. This prevents a green verdict when the listed payment, transportation costs and cash reserves produce a very low affordability score. Entered financed taxes, title and government fees affect the payment and affordability estimate. Confirm the actual amount financed on the contract.
          </p>
        </details>
      </section>
    </div>

  <footer>
  © 2026 Don't Sign This Yet · Provisional Version 1.4 scoring engine · Decision-support tool only
  <br />
  <a href="/feedback">Send Feedback</a>
</footer>
  </main>;
}


function Field({ label, id, type = "number", value, onChange, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children || (
        <input
          id={id}
          type={type === "number" ? "text" : type}
          inputMode={type === "number" ? "decimal" : undefined}
          autoComplete="off"
          value={value ?? ""}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function Section({title,children}){
  return <section className="section"><h3>{title}</h3>{children}</section>
}

function Kpi({label,value}){
  return <div className="kpi"><span>{label}</span><b>{value}</b></div>
}

function Bar({label,value}){
  return <div className="barRow">
    <div><span>{label}</span><b>{Math.round(value)}/25</b></div>
    <div className="bar"><i style={{width:`${value/25*100}%`}} /></div>
  </div>
}

function InfoSection({id,title,subtitle,items}){
  return <section className="card info" id={id}>
    <h2>{title}</h2>
    {subtitle&&<p className="muted">{subtitle}</p>}
    <div className="infoGrid">
      {items.map(([icon,head,text])=>
        <div className="infoItem" key={head}>
          <div className="icon">{icon}</div>
          <h3>{head}</h3>
          <p className="muted">{text}</p>
        </div>
      )}
    </div>
  </section>
}
