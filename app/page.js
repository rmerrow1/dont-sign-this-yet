"use client";

import { useMemo, useState } from "react";
import { calculateDealScore } from "../lib/scoring";
import "./globals.css";

const initial = {
  condition:"new", price:30000, market:30000, apr:6.5, term:48, down:5000, credit:"prime",
  tradeValue:0, tradeOwed:0, addons:0, fees:300, income:6000, savings:15000,
  expenses:3500, insurance:160, fuel:140, maintenance:70
};

const money = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);

export default function Home() {
  const [form,setForm] = useState(initial);
  const [marketSource,setMarketSource] = useState("multiple");
  const [calculated,setCalculated] = useState(true);
  const result = useMemo(()=>calculateDealScore(form),[form]);

  const validation = useMemo(() => {
    const errors = [];
    const required = [
      ["price", "vehicle price", "greater than $0"],
      ["market", "estimated fair market value", "greater than $0"],
      ["income", "monthly take-home pay", "greater than $0"],
      ["expenses", "monthly essential expenses", "greater than $0"]
    ];
    const optional = [
      ["apr", "APR"], ["down", "down payment"], ["tradeValue", "trade-in value"],
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
      if (!raw || !Number.isFinite(value) || value < 0) {
        errors.push(`Enter a valid ${label}.`);
      }
    }

    return errors;
  }, [form]);

  const update=(key,value)=>{
    setForm(f=>({...f,[key]:value}));
    setCalculated(false);
  };

  const calculate=()=>{
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
const reserveMonths = Math.max(0,(Number(form.savings)||0)-(Number(form.down)||0))/expenses;

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

if(reserveMonths < 1){
  scoreReasons.push(
    "After the down payment, your listed savings provide less than one month of essential expenses. Consider how much cash you want to keep available after buying the vehicle."
  );
}

if(result.score < 70 && scoreReasons.length === 0){
  scoreReasons.push(
    "Several deal factors are weighing on the score. Review the price, financing, fees and affordability numbers before signing."
  );
}

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
        <span>Version 1.0 engine</span>
      </div>
    </div>

    <section className="hero">
      <div>
        <div className="eyebrow">UNDERSTAND THE NUMBERS BEFORE YOU COMMIT</div>
        <h1>Before you sign, make sure the deal makes sense.</h1>
        <p>Enter the numbers from your vehicle deal. We'll analyze price, financing, affordability, and deal structure.</p>
      </div>
    </section>

    <div className="container" id="calculator">
      <div className="appGrid">

        <section className="card formCard">
          <h2>Calculate Your Deal</h2>
          <p className="muted">You can use approximate numbers. This is a decision-support tool—not financial or legal advice.</p>

          <Section title="🚙 Vehicle">
            <div className="formGrid">
              <div className="field">
                <label>Vehicle condition</label>
                <div className="seg">
                  <button className={form.condition==="new"?"selected":""} onClick={()=>update("condition","new")}>New</button>
                  <button className={form.condition==="used"?"selected":""} onClick={()=>update("condition","used")}>Used</button>
                </div>
              </div>

              <Field label="Vehicle price ($)" id="price" value={form["price"]} onChange={value => update("price", value)}/>
              <Field label="Estimated fair market value ($)" id="market" value={form["market"]} onChange={value => update("market", value)}/>
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
          </Section>

          <Section title="🔄 Trade-In">
            <div className="formGrid">
              <Field label="Trade-in value ($)" id="tradeValue" value={form["tradeValue"]} onChange={value => update("tradeValue", value)}/>
              <Field label="Amount still owed ($)" id="tradeOwed" value={form["tradeOwed"]} onChange={value => update("tradeOwed", value)}/>
            </div>
          </Section>

          <Section title="📋 Deal extras">
            <div className="formGrid">
              <Field label="Dealer add-ons ($)" id="addons" value={form["addons"]} onChange={value => update("addons", value)}/>
              <Field label="Dealer fees ($)" id="fees" value={form["fees"]} onChange={value => update("fees", value)}/>
            </div>
          </Section>

          <Section title="👤 Your affordability picture">
            <div className="formGrid">
              <Field label="Monthly take-home pay ($)" id="income" value={form["income"]} onChange={value => update("income", value)}/>
              <Field label="Liquid savings ($)" id="savings" value={form["savings"]} onChange={value => update("savings", value)}/>
              <Field label="Monthly essential expenses ($)" id="expenses" value={form["expenses"]} onChange={value => update("expenses", value)}/>
              <Field label="Monthly insurance ($)" id="insurance" value={form["insurance"]} onChange={value => update("insurance", value)}/>
              <Field label="Monthly fuel ($)" id="fuel" value={form["fuel"]} onChange={value => update("fuel", value)}/>
              <Field label="Monthly maintenance reserve ($)" id="maintenance" value={form["maintenance"]} onChange={value => update("maintenance", value)}/>
            </div>
          </Section>

          <button className="calculate" onClick={calculate} disabled={validation.length>0}>
            Calculate My Deal Score →
          </button>
        </section>

        <aside className="results" id="results">
          <section className="card scoreCard">
            <div className="resultsTop">
              <span className="eyebrow dark">YOUR DEAL SCORE</span>
              <span className="live">● LIVE ENGINE</span>
            </div>

            <div className={`scoreRing ${calculated?result.color:"neutral"}`}>
              <div>
                <div className="score">{calculated?result.score:"—"}</div>
                <div className="out">out of 100</div>
              </div>
            </div>

            <div className="verdict">{calculated?result.verdict:"SCORE NEEDS UPDATING"}</div>

            <p className="muted">
              {calculated
                ?"Review the strengths and concerns below before making your decision."
                :"You changed a deal number. Tap Calculate My Deal Score to update the score."}
            </p>

            {validation.length>0 &&
              <div className="validation">
                <b>Please check your numbers:</b>
                <ul>{validation.map((e,i)=><li key={i}>{e}</li>)}</ul>
              </div>
            }

            <div className={calculated ? "resultsData" : "resultsData stale"}>
              <div className="staleNotice">
                Your deal changed. The figures below are from the last calculation.
              </div>

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

            {calculated && result.caps.length>0 &&
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

            {calculated &&
  <div className="next">
    <h3>Why this score</h3>
    <p className="muted"><strong>Market value confidence:</strong> {marketConfidence}</p><ul>
      {scoreReasons.slice(0,4).map((reason,i)=><li key={i}>{reason}</li>)}
    </ul>

    <h3>What to do next</h3>
    <ul>
      {nextSteps.map((s,i)=><li key={i}>{s}</li>)}
    </ul>
  </div>
}
          </section>
        </aside>
      </div>

      <InfoSection
        id="learn"
        title="📚 Learn the Numbers"
        subtitle="The score is easier to understand when you know what it is measuring."
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
        id="tips"
        title="💡 Before You Sign"
        items={[
          ["1️⃣","Get the out-the-door price","Separate the vehicle price from taxes, fees, add-ons, and financing."],
          ["2️⃣","Don't negotiate only payment","A lower payment can be created by extending the loan."],
          ["3️⃣","Compare financing","An outside loan quote gives you a useful benchmark."]
        ]}
      />

      <section className="card info" id="about">
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
