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
  const [calculated,setCalculated] = useState(true);
  const result = useMemo(()=>calculateDealScore(form),[form]);

  const validation = useMemo(() => {
    const errors = [];
    if (Number(form.price) <= 0) errors.push("Enter a vehicle price greater than $0.");
    if (Number(form.market) <= 0) errors.push("Enter an estimated fair market value greater than $0.");
    if (Number(form.income) <= 0) errors.push("Enter monthly take-home pay greater than $0.");
    if (Number(form.expenses) <= 0) errors.push("Enter monthly essential expenses greater than $0.");
    return errors;
  }, [form]);

  const update=(key,value)=>{setForm(f=>({...f,[key]:value}));setCalculated(false);};
  const calculate=()=>{
    if (validation.length) return;
    setCalculated(true);
    document.getElementById("results")?.scrollIntoView({behavior:"smooth",block:"start"});
  };
  const progress = Math.round(Object.values(form).filter(v=>String(v)!=="").length/Object.keys(initial).length*100);

  const nextSteps=[];
  if(result.caps.length) nextSteps.push("Ask the dealer to explain and improve the critical red-flag items.");
  if(result.aprDiff>=3) nextSteps.push("Compare this APR with a bank or credit-union quote.");
  if(result.term>=72) nextSteps.push("Ask for the payment and total interest with a shorter loan term.");
  if(result.addonPct>=5) nextSteps.push("Request an itemized list of every add-on and ask which ones are optional.");
  if(result.negPct>=10) nextSteps.push("Confirm exactly how much old loan balance is being rolled into this deal.");
  if(!nextSteps.length) nextSteps.push("Review the final buyer's order and financing contract before signing.");
  nextSteps.push("Take your time and ask for the paperwork to review before making a decision.");

  const Field=({label,id,type="number",children})=><div className="field"><label htmlFor={id}>{label}</label>{children || <input id={id} type={type} inputMode={type==="number"?"decimal":undefined} value={form[id]} onChange={e=>update(id,e.target.value)}/>}</div>;

  return <main>
    <header>
      <div className="nav"><div className="brand">DON'T SIGN <span>THIS YET</span></div>
        <div className="links"><a href="#calculator">Calculator</a><a href="#learn">Learn</a><a href="#tips">Tips</a><a href="#about">About</a></div>
      </div>
    </header>

    <div className="progress"><div className="progressFill" style={{width:`${progress}%`}}/><div className="progressText"><span>Deal details: {progress}% complete</span><span>Version 1.0 engine</span></div></div>

    <section className="hero"><div><div className="eyebrow">UNDERSTAND THE NUMBERS BEFORE YOU COMMIT</div><h1>Before you sign, make sure the deal makes sense.</h1><p>Enter the numbers from your vehicle deal. We'll analyze price, financing, affordability, and deal structure.</p></div></section>

    <div className="container" id="calculator">
      <div className="appGrid">
        <section className="card formCard">
          <h2>Calculate Your Deal</h2><p className="muted">You can use approximate numbers. This is a decision-support tool—not financial or legal advice.</p>

          <Section title="🚙 Vehicle"><div className="formGrid">
            <div className="field"><label>Vehicle condition</label><div className="seg"><button className={form.condition==="new"?"selected":""} onClick={()=>update("condition","new")}>New</button><button className={form.condition==="used"?"selected":""} onClick={()=>update("condition","used")}>Used</button></div></div>
            <Field label="Vehicle price ($)" id="price"/><Field label="Estimated fair market value ($)" id="market"/>
          </div></Section>

          <Section title="💰 Financing"><div className="formGrid">
            <Field label="APR (%)" id="apr"/><div className="field"><label>Loan term</label><select value={form.term} onChange={e=>update("term",Number(e.target.value))}>{[36,48,60,72,84,96].map(x=><option key={x}>{x}</option>)}</select></div>
            <Field label="Down payment ($)" id="down"/><div className="field"><label>Credit profile</label><select value={form.credit} onChange={e=>update("credit",e.target.value)}><option value="super">Excellent</option><option value="prime">Prime / Good</option><option value="near">Near Prime</option><option value="sub">Subprime</option><option value="deep">Deep Subprime</option></select></div>
          </div></Section>

          <Section title="🔄 Trade-In"><div className="formGrid"><Field label="Trade-in value ($)" id="tradeValue"/><Field label="Amount still owed ($)" id="tradeOwed"/></div></Section>
          <Section title="📋 Deal extras"><div className="formGrid"><Field label="Dealer add-ons ($)" id="addons"/><Field label="Dealer fees ($)" id="fees"/></div></Section>
          <Section title="👤 Your affordability picture"><div className="formGrid"><Field label="Monthly take-home pay ($)" id="income"/><Field label="Liquid savings ($)" id="savings"/><Field label="Monthly essential expenses ($)" id="expenses"/><Field label="Monthly insurance ($)" id="insurance"/><Field label="Monthly fuel ($)" id="fuel"/><Field label="Monthly maintenance reserve ($)" id="maintenance"/></div></Section>

          <button className="calculate" onClick={calculate} disabled={validation.length>0}>Calculate My Deal Score →</button>
        </section>

        <aside className="results" id="results">
          <section className="card scoreCard">
            <div className="resultsTop"><span className="eyebrow dark">YOUR DEAL SCORE</span><span className="live">● LIVE ENGINE</span></div>
            <div className={`scoreRing ${calculated?result.color:"neutral"}`}><div><div className="score">{calculated?result.score:"—"}</div><div className="out">out of 100</div></div></div>
            <div className="verdict">{calculated?result.verdict:"SCORE NEEDS UPDATING"}</div>
            <p className="muted">{calculated?"Review the strengths and concerns below before making your decision.":"You changed a deal number. Tap Calculate My Deal Score to update the score."}</p>
            {validation.length>0 && <div className="validation"><b>Please check your numbers:</b><ul>{validation.map((e,i)=><li key={i}>{e}</li>)}</ul></div>}

            <div className={calculated ? "resultsData" : "resultsData stale"}>
              <div className="staleNotice">Your deal changed. The figures below are from the last calculation.</div>
              <div className="kpis"><Kpi label="Monthly payment" value={money(result.monthly)}/><Kpi label="Amount financed" value={money(result.financed)}/><Kpi label="Estimated interest" value={money(result.interest)}/><Kpi label="Benchmark APR" value={result.benchmark.toFixed(1)+"%"}/></div>

              <div className="breakdown">{Object.entries(result.categories).map(([key,val])=><Bar key={key} label={{vehicle:"Vehicle Deal",finance:"Financing",affordability:"Affordability",structure:"Deal Structure"}[key]} value={val}/>)}</div>
            </div>

            {calculated && result.caps.length>0 && <div className="flags"><h3>🚨 Critical Red Flags</h3><p>Base score: <b>{result.base}/100</b>. The final score was capped because certain risks should not be canceled out by strengths elsewhere.</p><ul>{result.caps.map((c,i)=><li key={i}><b>Maximum {c.max}:</b> {c.reason}</li>)}</ul></div>}

            {calculated && <div className="next"><h3>What to do next</h3><ul>{nextSteps.slice(0,4).map((s,i)=><li key={i}>{s}</li>)}</ul></div>}
          </section>
        </aside>
      </div>

      <InfoSection id="learn" title="📚 Learn the Numbers" subtitle="The score is easier to understand when you know what it is measuring." items={[
        ["%","APR","APR is the cost of borrowing. We compare it with an estimated benchmark based on vehicle condition and credit profile."],
        ["📅","Loan Term","A lower payment can hide a much longer loan and significantly more interest."],
        ["↘️","Negative Equity","Rolling old debt into a new loan can make the new deal much more expensive."],
        ["➕","Add-ons","Optional products can add thousands. Ask what each item costs and whether it is required."],
        ["🛡️","Category Floors","Weak categories retain a small floor so different bad deals do not all collapse to zero."],
        ["🚨","Critical Red Flags","Certain severe risks can cap the overall score because strengths elsewhere should not completely cancel them out."]
      ]}/>
      <InfoSection id="tips" title="💡 Before You Sign" items={[
        ["1️⃣","Get the out-the-door price","Separate the vehicle price from taxes, fees, add-ons, and financing."],
        ["2️⃣","Don't negotiate only payment","A lower payment can be created by extending the loan."],
        ["3️⃣","Compare financing","An outside loan quote gives you a useful benchmark."]
      ]}/>
      <section className="card info" id="about"><h2>About Don't Sign This Yet</h2><p><b>We're not here to tell you what to do. We're here to help you understand what you're agreeing to.</b></p><p className="muted">This tool organizes the information you enter and highlights areas that appear worth reviewing. It does not guarantee that a deal is good or bad and cannot replace reading your contract or obtaining professional advice.</p><details><summary>About the provisional Version 1.0 engine</summary><p>Version 1.0 uses four categories: Vehicle Deal, Financing, Affordability, and Deal Structure. Each contributes up to 25 points. Category floors and critical score caps are applied after category calculations.</p></details></section>
    </div>
    <footer>© 2026 Don't Sign This Yet · Provisional Version 1.0 scoring engine · Decision-support tool only</footer>
  </main>;
}

function Section({title,children}){return <section className="section"><h3>{title}</h3>{children}</section>}
function Kpi({label,value}){return <div className="kpi"><span>{label}</span><b>{value}</b></div>}
function Bar({label,value}){return <div className="barRow"><div><span>{label}</span><b>{Math.round(value)}/25</b></div><div className="bar"><i style={{width:`${value/25*100}%`}}/></div></div>}
function InfoSection({id,title,subtitle,items}){return <section className="card info" id={id}><h2>{title}</h2>{subtitle&&<p className="muted">{subtitle}</p>}<div className="infoGrid">{items.map(([icon,head,text])=><div className="infoItem" key={head}><div className="icon">{icon}</div><h3>{head}</h3><p className="muted">{text}</p></div>)}</div></section>}
