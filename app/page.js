"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Survey() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [data, setData] = useState({
    participant_id: `PC-${Date.now()}`,
    learning_preferences: [],
  });

  const update = (k, v) => setData({ ...data, [k]: v });

  const toggle = (k, v) => {
    const arr = data[k] || [];
    update(k, arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  };

  const submit = async () => {
    await supabase.from("survey_responses").insert([
      { participant_id: data.participant_id, responses: data }
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

        {/* STEP 0 – PARTICIPANT */}
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
              <button className="primary" onClick={() => setStep(1)}>Start →</button>
            </div>
          </>
        )}

        {/* SECTION 1 */}
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

            <label>
              Briefly describe one decision you make (or support) using data today
            </label>
            <textarea
              placeholder="Example: Sales forecasting, budgeting, demand planning..."
              onChange={e => update("data_decision_example", e.target.value)}
            />

            <div className="nav">
              <button className="secondary" onClick={() => setStep(0)}>← Back</button>
              <button className="primary" onClick={() => setStep(2)}>Next →</button>
            </div>
          </>
        )}

        {/* SECTION 2 */}
        {step === 2 && (
          <>
            <label>Which tools have you used before?</label>
            <div className="option-grid">
              {[
                "Excel / Google Sheets",
                "Charts or dashboards",
                "SQL",
                "Python or R",
                "BI tools (Power BI / Tableau / Looker)",
                "None of the above",
              ].map(v => (
                <div
                  key={v}
                  className={`option-card ${data.tools?.includes(v) ? "selected" : ""}`}
                  onClick={() => toggle("tools", v)}
                >
                  <input type="checkbox" checked={data.tools?.includes(v)} readOnly />
                  {v}
                </div>
              ))}
            </div>

            <label>How confident are you interpreting charts or summaries?</label>
            <div className="option-grid">
              {["Very confident", "Somewhat confident", "Not confident"].map(v => (
                <div
                  key={v}
                  className={`option-card ${data.chart_confidence === v ? "selected" : ""}`}
                  onClick={() => update("chart_confidence", v)}
                >
                  <input type="radio" checked={data.chart_confidence === v} readOnly />
                  {v}
                </div>
              ))}
            </div>

            <label>Generative AI experience</label>
            <select onChange={e => update("genai_experience", e.target.value)}>
              <option value="">Select</option>
              <option>I have not used Generative AI tools</option>
              <option>I have used them a few times</option>
              <option>I use them occasionally for work</option>
              <option>I use them regularly</option>
              <option>I am aware but haven’t used them</option>
            </select>

            {data.genai_experience &&
              data.genai_experience !== "I have not used Generative AI tools" && (
                <>
                  <label>GenAI use cases</label>
                  <div className="option-grid">
                    {[
                      "Writing or summarizing content",
                      "Understanding or explaining data",
                      "Brainstorming ideas or problem-solving",
                      "Coding or technical assistance",
                      "Creating presentations or visuals",
                      "Other",
                    ].map(v => (
                      <div
                        key={v}
                        className={`option-card ${data.genai_use_cases?.includes(v) ? "selected" : ""}`}
                        onClick={() => toggle("genai_use_cases", v)}
                      >
                        <input type="checkbox" checked={data.genai_use_cases?.includes(v)} readOnly />
                        {v}
                      </div>
                    ))}
                  </div>
                </>
              )}

            <div className="nav">
              <button className="secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="primary" onClick={() => setStep(3)}>Next →</button>
            </div>
          </>
        )}

        {/* SECTION 3 */}
        {step === 3 && (
          <>
            <label>Do you currently have access to structured data?</label>
            <select onChange={e => update("structured_data_access", e.target.value)}>
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
              <option>Not sure</option>
            </select>

            <label>Where does this data usually exist?</label>
            <div className="option-grid">
              {["Excel files", "CRM / ERP systems", "Databases", "Reports / PDFs", "Not sure"].map(v => (
                <div
                  key={v}
                  className={`option-card ${data.data_sources?.includes(v) ? "selected" : ""}`}
                  onClick={() => toggle("data_sources", v)}
                >
                  <input type="checkbox" checked={data.data_sources?.includes(v)} readOnly />
                  {v}
                </div>
              ))}
            </div>

            <label>What are your biggest challenges with data today?</label>
            <div className="option-grid">
              {[
                "Data is messy or inconsistent",
                "Data exists but is not used",
                "Don’t know what insights to look for",
                "Don’t trust the data",
                "Lack of time or skills",
              ].map(v => (
                <div
                  key={v}
                  className={`option-card ${data.data_challenges?.includes(v) ? "selected" : ""}`}
                  onClick={() => toggle("data_challenges", v)}
                >
                  <input type="checkbox" checked={data.data_challenges?.includes(v)} readOnly />
                  {v}
                </div>
              ))}
            </div>

            <label>What is one real business question you wish data could help answer today?</label>
            <textarea onChange={e => update("business_question", e.target.value)} />

            <div className="nav">
              <button className="secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="primary" onClick={() => setStep(4)}>Next →</button>
            </div>
          </>
        )}

        {/* SECTION 4 */}
        {step === 4 && (
          <>
            {[
              "Understanding tables & spreadsheets",
              "Interpreting charts & dashboards",
              "Identifying trends or patterns",
              "Asking the right business questions",
              "Explaining insights to others",
            ].map(skill => (
              <div key={skill}>
                <label>{skill}</label>
                <div className="option-grid">
                  {["Not comfortable", "Somewhat comfortable", "Comfortable"].map(level => (
                    <div
                      key={level}
                      className={`option-card ${data[skill] === level ? "selected" : ""}`}
                      onClick={() => update(skill, level)}
                    >
                      <input type="radio" checked={data[skill] === level} readOnly />
                      {level}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="nav">
              <button className="secondary" onClick={() => setStep(3)}>← Back</button>
              <button className="primary" onClick={() => setStep(5)}>Next →</button>
            </div>
          </>
        )}

        {/* SECTION 5 */}
        {step === 5 && (
          <>
            <label>How do you prefer to learn? (Select up to 2)</label>
            <div className="option-grid">
              {[
                "Live explanations with examples",
                "Hands-on practice with datasets",
                "Case studies from real businesses",
                "Step-by-step guided exercises",
                "Self-paced reading or videos",
              ].map(option => {
                const selected = data.learning_preferences;
                const isChecked = selected.includes(option);

                return (
                  <div
                    key={option}
                    className={`option-card ${isChecked ? "selected" : ""}`}
                    onClick={() => {
                      if (isChecked) {
                        update(
                          "learning_preferences",
                          selected.filter(v => v !== option)
                        );
                      } else if (selected.length < 2) {
                        update("learning_preferences", [...selected, option]);
                      }
                    }}
                  >
                    <input type="checkbox" checked={isChecked} readOnly />
                    {option}
                  </div>
                );
              })}
            </div>

            <label>What do you expect to gain most from this course?</label>
            <select onChange={e => update("expected_outcome", e.target.value)}>
              <option value="">Choose an option</option>
              <option>Confidence working with data</option>
              <option>Ability to make better decisions</option>
              <option>Hands-on experience with tools</option>
              <option>Understanding how data applies to my role</option>
              <option>Exposure to AI / Generative AI use cases</option>
            </select>

            <label>At the end of this course, how would you define success?</label>
            <select onChange={e => update("success_definition", e.target.value)}>
              <option value="">Choose an option</option>
              <option>I can independently analyze data</option>
              <option>I can ask better business questions</option>
              <option>I can clearly explain insights</option>
              <option>I can use data effectively in my daily role</option>
              <option>I can build basic reports or dashboards</option>
            </select>

            <label>How much time can you commit weekly?</label>
            <select onChange={e => update("weekly_commitment", e.target.value)}>
              <option value="">Choose an option</option>
              <option>Less than 3 hours</option>
              <option>3–5 hours</option>
              <option>5–8 hours</option>
              <option>More than 8 hours</option>
            </select>

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
