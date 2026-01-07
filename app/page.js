"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Survey() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [data, setData] = useState({
    participant_id: `PC-${Date.now()}`,
    participant_name: "",
    learning_preferences: [],
  });

  const update = (k, v) => setData({ ...data, [k]: v });

  const toggle = (k, v) => {
    const arr = data[k] || [];
    update(k, arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  };

  const submit = async () => {
    await supabase.from("survey_responses").insert([
      {
        participant_id: data.participant_id,
        participant_name: data.participant_name,
        responses: data,
      },
    ]);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="card">
          <h2>🎉 Thank you!</h2>
          <p>Your response has been successfully submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="header">
        <h1>📘 Pre-Course Survey</h1>
        <p className="subtext">
          Harnessing the Power of Data · Estimated time: 5–8 minutes
        </p>
        <div className="progress">Step {step + 1} of 6</div>
      </div>

      <div className="card">

        {/* STEP 0 */}
        {step === 0 && (
          <>
            <label>Participant Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              onChange={e => update("participant_name", e.target.value)}
            />

            <label>Participant ID (auto-generated)</label>
            <input value={data.participant_id} disabled />

            <div className="nav">
              <span />
              <button className="primary" onClick={() => setStep(1)}>
                Start →
              </button>
            </div>
          </>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <label>Your primary role in the organization</label>
            <select onChange={e => update("primary_role", e.target.value)}>
              <option value="">Select role</option>
              <option>Operations</option>
              <option>Finance</option>
              <option>Sales / Marketing</option>
              <option>HR</option>
              <option>Technology / IT</option>
              <option>Leadership / Management</option>
              <option>Other</option>
            </select>

            <label>How often do you work with data?</label>
            <select onChange={e => update("data_frequency", e.target.value)}>
              <option value="">Select</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Occasionally</option>
              <option>Rarely</option>
            </select>

            <label>Decision you make using data</label>
            <textarea onChange={e => update("decision_example", e.target.value)} />

            <div className="nav">
              <button className="secondary" onClick={() => setStep(0)}>← Back</button>
              <button className="primary" onClick={() => setStep(2)}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <label>Which tools have you used?</label>
            <div className="option-grid">
              {[
                "Excel / Google Sheets",
                "Charts or dashboards",
                "SQL",
                "Python or R",
                "BI tools",
              ].map(v => (
                <div
                  key={v}
                  className={`option-card ${data.tools?.includes(v) ? "selected" : ""}`}
                  onClick={() => toggle("tools", v)}
                >
                  <input type="checkbox" readOnly checked={data.tools?.includes(v)} />
                  {v}
                </div>
              ))}
            </div>

            <div className="nav">
              <button className="secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="primary" onClick={() => setStep(3)}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <label>Access to structured data?</label>
            <select onChange={e => update("structured_data_access", e.target.value)}>
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
              <option>Not sure</option>
            </select>

            <label>Business question data could answer</label>
            <textarea onChange={e => update("business_question", e.target.value)} />

            <div className="nav">
              <button className="secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="primary" onClick={() => setStep(4)}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            {[
              "Understanding tables & spreadsheets",
              "Interpreting charts & dashboards",
              "Identifying trends",
              "Asking business questions",
              "Explaining insights",
            ].map(skill => (
              <div key={skill}>
                <label>{skill}</label>
                <select onChange={e => update(skill, e.target.value)}>
                  <option value="">Select</option>
                  <option>Not comfortable</option>
                  <option>Somewhat comfortable</option>
                  <option>Comfortable</option>
                </select>
              </div>
            ))}

            <div className="nav">
              <button className="secondary" onClick={() => setStep(3)}>← Back</button>
              <button className="primary" onClick={() => setStep(5)}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <label>How do you prefer to learn? (Max 2)</label>
            <div className="option-grid">
              {[
                "Live explanations",
                "Hands-on practice",
                "Case studies",
                "Guided exercises",
                "Self-paced learning",
              ].map(v => {
                const selected = data.learning_preferences;
                const checked = selected.includes(v);

                return (
                  <div
                    key={v}
                    className={`option-card ${checked ? "selected" : ""}`}
                    onClick={() => {
                      if (checked)
                        update("learning_preferences", selected.filter(x => x !== v));
                      else if (selected.length < 2)
                        update("learning_preferences", [...selected, v]);
                    }}
                  >
                    <input type="checkbox" checked={checked} readOnly />
                    {v}
                  </div>
                );
              })}
            </div>

            <div className="nav">
              <button className="secondary" onClick={() => setStep(4)}>← Back</button>
              <button className="primary" onClick={submit}>Submit Survey</button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
