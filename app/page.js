"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";


export default function Home() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Generate ONCE
  const [participantId] = useState(`PC-${Date.now()}`);
  const [participantName, setParticipantName] = useState("");

  const [responses, setResponses] = useState({
    primary_role: "",
    data_usage_frequency: "",
    decision_example: "",
    tools_used: [],
    chart_confidence: "",
    genai_experience: "",
    genai_use_cases: [],
    structured_data_access: "",
    data_sources: [],
    data_challenges: [],
    business_question: "",
    skill_levels: {},
    learning_preferences: [],
    expected_outcome: "",
    success_definition: "",
    weekly_commitment: "",
  });

  /* ---------- HELPERS ---------- */

  const toggleArray = (key, value) => {
    setResponses((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const toggleLearningPreference = (value) => {
    setResponses((prev) => {
      if (
        prev.learning_preferences.includes(value) ||
        prev.learning_preferences.length < 2
      ) {
        return {
          ...prev,
          learning_preferences: prev.learning_preferences.includes(value)
            ? prev.learning_preferences.filter((v) => v !== value)
            : [...prev.learning_preferences, value],
        };
      }
      alert("You can select up to 2 options only");
      return prev;
    });
  };

  /* ---------- SUBMIT ---------- */

  const submitSurvey = async () => {
    if (!participantName.trim()) {
      alert("Please enter your name");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("survey_responses").insert([
      {
        participant_id: participantId,
        participant_name: participantName,
        responses: responses,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Submission failed");
    } else {
      setStep(6);
    }
  };

  /* ---------- SUCCESS ---------- */

  if (step === 6) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-2">🎉 Survey Submitted</h1>
          <p>Thank you for your response!</p>
        </div>
      </div>
    );
  }

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex justify-center items-center p-4">
      <div className="bg-white max-w-3xl w-full rounded-xl shadow-xl p-8">

        <h1 className="text-2xl font-bold mb-6">
          Pre-Course Survey: Harnessing the Power of Data
        </h1>

        {/* STEP 0 */}
        {step === 0 && (
          <>
            <label className="label">Participant Name</label>
            <input
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="input"
              placeholder="Enter your name"
            />
            <button className="btn" onClick={() => setStep(1)}>
              Start Survey →
            </button>
          </>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="section">Section 1: About You</h2>

            <select className="input" onChange={(e) => setResponses({ ...responses, primary_role: e.target.value })}>
              <option value="">Your role</option>
              <option>Operations</option>
              <option>Finance</option>
              <option>Sales / Marketing</option>
              <option>HR</option>
              <option>Technology / IT</option>
              <option>Leadership / Management</option>
              <option>Other</option>
            </select>

            <select className="input" onChange={(e) => setResponses({ ...responses, data_usage_frequency: e.target.value })}>
              <option value="">Data usage frequency</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Occasionally</option>
              <option>Rarely</option>
            </select>

            <textarea
              className="input"
              placeholder="Decision you make using data"
              onChange={(e) => setResponses({ ...responses, decision_example: e.target.value })}
            />

            <button className="btn" onClick={() => setStep(2)}>Next →</button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="section">Section 2: Data & Tools</h2>

            {["Excel / Google Sheets","Charts or dashboards","SQL","Python or R","BI tools"].map((tool) => (
              <label key={tool} className="check">
                <input type="checkbox" onChange={() => toggleArray("tools_used", tool)} /> {tool}
              </label>
            ))}

            <button className="btn" onClick={() => setStep(3)}>Next →</button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="section">Section 3: Data Availability</h2>

            <select className="input" onChange={(e) => setResponses({ ...responses, structured_data_access: e.target.value })}>
              <option value="">Structured data access?</option>
              <option>Yes</option>
              <option>No</option>
              <option>Not sure</option>
            </select>

            <textarea
              className="input"
              placeholder="Business question data could answer"
              onChange={(e) => setResponses({ ...responses, business_question: e.target.value })}
            />

            <button className="btn" onClick={() => setStep(4)}>Next →</button>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h2 className="section">Section 4: Skill Comfort</h2>

            {["Tables","Charts","Trends","Asking questions","Explaining insights"].map((skill) => (
              <select
                key={skill}
                className="input"
                onChange={(e) =>
                  setResponses((prev) => ({
                    ...prev,
                    skill_levels: { ...prev.skill_levels, [skill]: e.target.value },
                  }))
                }
              >
                <option value="">{skill}</option>
                <option>Not comfortable</option>
                <option>Somewhat comfortable</option>
                <option>Comfortable</option>
              </select>
            ))}

            <button className="btn" onClick={() => setStep(5)}>Next →</button>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <h2 className="section">Section 5: Learning Preferences</h2>

            {["Live explanations","Hands-on practice","Case studies","Guided exercises","Self-paced learning"].map((p) => (
              <label key={p} className="check">
                <input type="checkbox" onChange={() => toggleLearningPreference(p)} /> {p}
              </label>
            ))}

            <select className="input" onChange={(e) => setResponses({ ...responses, weekly_commitment: e.target.value })}>
              <option value="">Weekly commitment</option>
              <option>Less than 3 hours</option>
              <option>3–5 hours</option>
              <option>5–8 hours</option>
              <option>More than 8 hours</option>
            </select>

            <button className="btn bg-green" onClick={submitSurvey} disabled={loading}>
              {loading ? "Submitting..." : "Submit Survey"}
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .input { width:100%; padding:10px; margin-bottom:12px; border:1px solid #ddd; border-radius:6px; }
        .btn { background:#6366f1; color:white; padding:10px 20px; border-radius:6px; margin-top:10px; }
        .bg-green { background:#16a34a; }
        .section { font-weight:bold; margin-bottom:10px; }
        .label { font-weight:500; margin-bottom:6px; display:block; }
        .check { display:block; margin-bottom:6px; }
      `}</style>
    </div>
  );
}
