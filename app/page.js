"use client";

import { useMemo, useState } from "react";
import { calculateDealScore } from "../lib/scoring";
import "./globals.css";

const initial = {
  condition:"new", price:"", market:"", apr:"", term:"", down:"", credit:"prime",
  tradeValue:"", tradeOwed:"", addons:"", fees:"", income:"", savings:"",
  expenses:"", insurance:"", fuel:"", maintenance:""
};

const money = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);

export default function Home() {
  const [form,setForm] = useState(initial);
  const [marketSource,setMarketSource] = useState("multiple");
  const [calculated,setCalculated] = useState(false);
  const [attempted,setAttempted] = useState(false);
  const [worksheetTransferred,setWorksheetTransferred] = useState(false);
  const result = useMemo(()=>calculateDealScore(form),[form]);

  const useWorksheet = (worksheet) => {
  setForm(prev => ({
    ...prev,
    price: worksheet.price,
    apr: worksheet.apr,
  term: worksheet.term,
    down: worksheet.down,
    tradeValue: worksheet.tradeValue,
    tradeOwed: worksheet.tradeOwed,
    addons: worksheet.addons,
    fees: worksheet.fees
  }));

  setCalculated(false);
  setAttempted(false);
setWorksheetTransferred(true);
  document.getElementById("calculator")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};

  const validation = useMemo(() => {
    const errors = [];
    const required = [
      ["price", "vehicle price", "greater than $0"],
      ["market", "estimated fair market value", "greater than $0"],
      ["income", "monthly take-home pay", "greater than $0"],
    ["expenses", "monthly essential expenses", "greater than $0"],
      ["term", "loan term", "greater than 0"],
["apr", "APR", "greater than $0"]
    ];
    const optional = [
     
  ["down", "down payment"], ["tradeValue", "trade-in value"],
      ["tradeOwed", "amount still owed"], ["addons", "dealer add-ons"], ["fees", "dealer fees"],
      ["savings", "liquid savings"], ["insurance", "monthly insurance"], ["fuel", "monthly fuel"],
      ["maintenance", "monthly maintenance reserve"]
    ];

    for (const [key, label, rule] of required) {
      const value = Number(form[key]);
      if (!String(form[key] ?? "").trim() || !Number.isFinite(value) || value <= 0) {
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

    return errors;
  }, [form]);
  const scoreReady = calculated && validation.length === 0;

  const update=(key,value)=>{
    setForm(f=>({...f,[key]:value}));
  
  };

  const calculate=()=>{
  setAttempted(true);
  if (validation.length) return;
    setCalculated(true);
    document.getElementById("results")?.scrollIntoView({behavior:"smooth",block:"start"});
  };

const progress = Math.round(Object.values(form).filter(v=>String(v)!=="").length/Object.keys(initial).length*100);

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
const reserveMonths = form.savings !== "" ? Math.max(0,(Number(form.savings)||0)-(Number(form.down)||0))/expenses : null;

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
        <span>Deal details: {progress}% complete</span>
       
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
{worksheetTransferred && (
  <div className="beforeCalculator">
    <strong>✓ Your worksheet numbers have been transferred.</strong>
    <p>Review the numbers below, complete the remaining required fields, then calculate your deal score.</p>
  </div>
)}
          
 <div className="beforeCalculator">
  <strong>📋 Before you enter your numbers, get these from the dealer:</strong>
  <ul>
    <li>Vehicle selling price</li>
    <li>Out-the-door price</li>
    <li>Trade-in value and exact loan payoff</li>
    <li>Down payment</li>
    <li>Dealer add-ons and fees</li>
    <li>APR and loan term</li>
    <li>Monthly payment</li>
  </ul>
</div> <Section title="🚙 Vehicle">
            <div className="formGrid">
              <div className="field">
                <label>Vehicle condition</label>
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
  <div className="marketGuide">
  <strong>💡 Need help estimating market value?</strong>

  <p>
    Before entering a market value, compare this vehicle using its exact
    year, make, model, trim, mileage and condition.
  </p>

 <div className="marketSource">
  <label htmlFor="marketSource"><strong>How did you estimate the market value?</strong></label>
  <select
    id="marketSource"
    value={marketSource}
    onChange={e => setMarketSource(e.target.value)}
  >
    <option value="multiple">I compared multiple sources</option>
    <option value="kbb">Kelley Blue Book</option>
    <option value="edmunds">Edmunds</option>
    <option value="jdpower">J.D. Power</option>
    <option value="other">Another source</option>
    <option value="unsure">I'm not sure</option>
  </select>
</div> <div className="marketLinks">
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
</div>
          </Section>

          <Section title="💰 Financing">
            <div className="formGrid">
              <Field label="APR (%)" id="apr" value={form["apr"]} onChange={value => update("apr", value)}/>

              <div className="field">
                <label>Loan term</label>
             <select value={form.term} onChange={e=>update("term",Number(e.target.value))}>
             <option value="" disabled>Select loan term</option>
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
          <div className="financeGuide">
  <strong>💡 Check the financing before you sign</strong>

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
</div>
          </Section>

          <Section title="🔄 Trade-In">
            <div className="formGrid">
              <Field label="Trade-in value ($)" id="tradeValue" value={form["tradeValue"]} onChange={value => update("tradeValue", value)}/>
              <Field label="Amount still owed ($)" id="tradeOwed" value={form["tradeOwed"]} onChange={value => update("tradeOwed", value)}/>
            </div><div className="tradeGuide">
  <strong>💡 Check your trade-in carefully</strong>

  <p>
    Compare your trade-in's value with what you still owe on the old loan.
    If you owe more than the vehicle is worth, the difference is negative
    equity and may be added to your new loan.
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
</div>
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

          <button className="calculate" onClick={calculate}>
            Calculate My Deal Score →
          </button>
        </section>

        <aside className="results" id="results">
          <section className="card scoreCard">
            <div className="resultsTop">
              <span className="eyebrow dark">YOUR DEAL SCORE</span>
     
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
      {!(Number(form.price) > 0) && <li>Vehicle price</li>}
      {!(Number(form.market) > 0) && <li>Estimated fair market value</li>}
      {!(Number(form.income) > 0) && <li>Monthly take-home pay</li>}
      {!(Number(form.expenses) > 0) && <li>Monthly essential expenses</li>}
        {!(Number(form.apr) > 0) && <li>APR</li>}
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
           

              <div className="kpis">
                <Kpi label="Monthly payment" value={money(result.monthly)}/>
                <Kpi label="Amount financed" value={money(result.financed)}/>
                <Kpi label="Estimated interest" value={money(result.interest)}/>
                <Kpi label="Benchmark APR" value={result.benchmark.toFixed(1)+"%"}/>
              </div>

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
          ["%","APR","APR is the cost of borrowing. We compare it with an estimated benchmark based on vehicle condition and credit profile."],
          ["📅","Loan Term","A lower payment can hide a much longer loan and significantly more interest."],
          ["↘️","Negative Equity","Rolling old debt into a new loan can make the new deal much more expensive."],
          ["➕","Add-ons","Optional products can add thousands. Ask what each item costs and whether it is required."],
          ["🛡️","Category Floors","Weak categories retain a small floor so different bad deals do not all collapse to zero."],
          ["🚨","Critical Red Flags","Certain severe risks can cap the overall score because strengths elsewhere should not completely cancel them out."]
        ]}
      />

    

      
          
         <InfoSection
  id="questions"
  title="🗣️ Questions to Ask at the Dealership"
  items={[
    ["1️⃣","What is the total out-the-door price?","Ask for the complete price, including taxes, fees, add-ons, and other charges."],
    ["2️⃣","What is my APR and loan term?","Ask for the exact interest rate and number of months, not just the monthly payment."],
    ["3️⃣","How much will I pay in interest?","Ask for the total finance charge and total amount you will pay over the life of the loan."],
    ["4️⃣","What are you giving me for my trade?","Ask for the trade-in value and the exact payoff amount on your old loan."],
    ["5️⃣","Which add-ons are optional?","Ask what each add-on costs and whether you can decline it."],
    ["6️⃣","Can I take the paperwork home to review?","You should be able to review the final numbers before signing."]
  ]}
/><DealWorksheet onUseInCalculator={useWorksheet} /> <section className="card info" id="about">
        <h2>About Don't Sign This Yet</h2>
        <p><b>We're not here to tell you what to do. We're here to help you understand what you're agreeing to.</b></p>
        <p className="muted">
          This tool organizes the information you enter and highlights areas that appear worth reviewing. It does not guarantee that a deal is good or bad and cannot replace reading your contract or obtaining professional advice.
        </p>
        <details>
          <summary>About the provisional Version 1.0 engine</summary>
          <p>
            Version 1.0 uses four categories: Vehicle Deal, Financing, Affordability, and Deal Structure. Each contributes up to 25 points. Category floors and critical score caps are applied after category calculations.
          </p>
        </details>
      </section>
    </div>

    <footer>
      © 2026 Don't Sign This Yet · Provisional Version 1.0 scoring engine · Decision-support tool only
    </footer>
  </main>;
}


function DealWorksheet({ onUseInCalculator }) {
 const [data, setData] = useState({
  price: "",
taxes: "",
titleRegistration: "",
otherGovernmentFees: "",
outTheDoor: "",
  tradeValue: "",
    tradeOwed: "",
    down: "",
    addons: "",
    fees: "",
    apr: "",
    term: "",
    payment: ""
  });

  const update = (key) => (value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const price = Number(data.price) || 0;
  const outTheDoor = Number(data.outTheDoor) || 0;
  const tradeValue = Number(data.tradeValue) || 0;
  const tradeOwed = Number(data.tradeOwed) || 0;
  const down = Number(data.down) || 0;
  const addons = Number(data.addons) || 0;
  const fees = Number(data.fees) || 0;
  const taxes = Number(data.taxes) || 0;
const titleRegistration = Number(data.titleRegistration) || 0;
const otherGovernmentFees = Number(data.otherGovernmentFees) || 0;

const calculatedOutTheDoor =
  price +
  taxes +
  titleRegistration +
  otherGovernmentFees +
  addons +
  fees;
  const outTheDoorDifference = outTheDoor - calculatedOutTheDoor;
  const apr = Number(data.apr) || 0;
  const term = Number(data.term) || 0;
  const payment = Number(data.payment) || 0;

  const negativeEquity = Math.max(0, tradeOwed - tradeValue);
  const estimatedFinanced = Math.max(
    0,
    price + addons + fees + negativeEquity - down
  );

  const estimatedPayment =
    apr > 0 && term > 0 && estimatedFinanced > 0
      ? estimatedFinanced *
        (apr / 1200) /
        (1 - Math.pow(1 + apr / 1200, -term))
      : 0;

  const checks = [];
if (outTheDoor > 0 && calculatedOutTheDoor > 0 && Math.abs(outTheDoorDifference) > 25) {
  const direction = outTheDoorDifference > 0 ? "higher" : "lower";
  checks.push(
    `The stated out-the-door price is ${money(Math.abs(outTheDoorDifference))} ${direction} than the calculated amount. Ask the dealer to explain the difference and verify the taxes, title/registration, fees, and add-ons.`
  );
}
  if (price > 0 && addons > price * 0.15) {
    checks.push("Dealer add-ons are more than 15% of the vehicle price.");
  }

  if (price > 0 && negativeEquity >= price * 0.25) {
    checks.push("Negative equity is at least 25% of the vehicle price.");
  }

  if (apr > 0 && apr >= 15) {
    checks.push("The APR is high enough to warrant comparing another financing offer.");
  }

  if (term >= 84) {
    checks.push("The loan term is 84 months or longer.");
  }

 if (payment > 0 && estimatedPayment > 0) {
  const difference = Math.abs(payment - estimatedPayment);

  if (difference > 25) {
    const direction =
      payment < estimatedPayment
        ? "lower"
        : "higher";

    checks.push(
      `The stated payment is about ${money(difference)} ${direction} than our estimate. Ask the dealer to explain the difference and verify the amount financed, APR, term, and any credits or fees.`
    );
  }
}

 const hasNumbers =
  price > 0 ||
  outTheDoor > 0 ||
  tradeValue > 0 ||
    tradeOwed > 0 ||
    down > 0 ||
    addons > 0 ||
    fees > 0 ||
    apr > 0 ||
    term > 0 ||
    payment > 0;

  return (
    <section className="card info" id="worksheet">
      <h2>📋 Deal Worksheet</h2>
      <p>
        Enter the numbers from the dealer's worksheet or buyer's order.
        This tool checks the math and highlights numbers worth reviewing.
      </p>

<div className="grid">
<div className="worksheetField">
  <Field label="Vehicle price ($)" id="ws-price" value={data.price} onChange={update("price")} />
  <p className="muted">Usually listed as the vehicle selling price or cash price.</p>
</div>

<div className="worksheetField">
  <Field label="Out-the-door price ($)" id="ws-otd" value={data.outTheDoor} onChange={update("outTheDoor")} />
  <p className="muted">
  This is the total price you're being asked to pay before financing, including the vehicle price, taxes, title/registration, dealer fees and add-ons.
</p>
</div> 
  <div className="worksheetField">
  <Field label="Taxes ($)" id="ws-taxes" value={data.taxes} onChange={update("taxes")} />
  <p className="muted">Enter the sales tax shown on the dealer's paperwork.</p>
</div>

<div className="worksheetField">
  <Field label="Title & registration ($)" id="ws-title-registration" value={data.titleRegistration} onChange={update("titleRegistration")} />
  <p className="muted">Enter title, registration and tag charges shown on the paperwork.</p>
</div>

<div className="worksheetField">
  <Field label="Other government fees ($)" id="ws-government-fees" value={data.otherGovernmentFees} onChange={update("otherGovernmentFees")} />
  <p className="muted">Enter any other required government charges shown on the paperwork.</p>
</div>                                                                                           

<div className="worksheetField">
  <Field label="Trade-in value ($)" id="ws-trade-value" value={data.tradeValue} onChange={update("tradeValue")} />
  <p className="muted">Look for the amount the dealer is giving you for your trade.</p>
</div>

<div className="worksheetField">
  <Field label="Old loan payoff ($)" id="ws-trade-owed" value={data.tradeOwed} onChange={update("tradeOwed")} />
  <p className="muted">Find the exact payoff amount for your existing vehicle loan.</p>
</div>

<div className="worksheetField">
  <Field label="Down payment ($)" id="ws-down" value={data.down} onChange={update("down")} />
  <p className="muted">Enter the cash you're putting toward the purchase.</p>
</div>

<div className="worksheetField">
  <Field label="Dealer add-ons ($)" id="ws-addons" value={data.addons} onChange={update("addons")} />
  <p className="muted">Look for optional products or services added to the deal.</p>
</div>

<div className="worksheetField">
  <Field label="Dealer fees ($)" id="ws-fees" value={data.fees} onChange={update("fees")} />
  <p className="muted">Check the buyer's order for dealer or processing fees.</p>
</div>

<div className="worksheetField">
  <Field label="APR (%)" id="ws-apr" value={data.apr} onChange={update("apr")} />
  <p className="muted">Find the annual percentage rate on the financing disclosure.</p>
</div>

<div className="worksheetField">
  <Field label="Loan term (months)" id="ws-term" value={data.term} onChange={update("term")} />
  <p className="muted">Enter the number of monthly payments, such as 60 or 72.</p>
</div>

<div className="worksheetField">
  <Field label="Stated monthly payment ($)" id="ws-payment" value={data.payment} onChange={update("payment")} />
  <p className="muted">Enter the monthly payment shown on the dealer's paperwork.</p>
</div>
      </div>

      {hasNumbers && (
        <div className="next">
          <h3>Numbers to double-check</h3>
       {Number(data.outTheDoor) > 0 && (
  <p>
    <strong>Out-the-door price:</strong> {money(Number(data.outTheDoor))}
  </p>
)}

          {negativeEquity > 0 && (
            <p>
              <strong>Negative equity:</strong> {money(negativeEquity)}
            </p>
          )}

          {estimatedFinanced > 0 && (
            <p>
              <strong>Estimated amount financed:</strong> {money(estimatedFinanced)}
            </p>
          )}
{calculatedOutTheDoor > 0 && (
  <p>
    <strong>Calculated out-the-door price:</strong> {money(calculatedOutTheDoor)}
  </p>
)}
          {estimatedPayment > 0 && (
            <p>
              <strong>Estimated monthly payment:</strong> {money(estimatedPayment)}
            </p>
          )}

          {checks.length > 0 ? (
            <ul>
              {checks.map((check, i) => (
                <li key={i}>{check}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">
              No specific calculation warning was triggered by the numbers entered.
              Review the complete paperwork before signing.
            </p>
          )}
        </div>
      )}

     {hasNumbers && (
  <button
    type="button"
    className="primary"
    onClick={() => onUseInCalculator(data)}
  >
    Use These Numbers in Calculator
  </button>
)} <p className="muted">
        This worksheet is a math and review tool. It does not determine whether
        a deal is good or bad and does not replace reviewing your contract.
      </p>
    </section>
  );
}function Field({ label, id, type = "number", value, onChange, children }) {
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
