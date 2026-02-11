import React, { useMemo, useState } from "react";
import LiveTextArea from "../Tracking/LiveTextArea";
import { submitResponse } from "../../utils/tracking";

const countWords = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;

export default function QuestionBox({ question }) {
  const [finalText, setFinalText] = useState("");
  const [msg, setMsg] = useState("");

  const qId = question?.id || null;
  const qText = question?.text || "No active questions. Add from Admin panel.";

  // we keep a hidden “finalText” sync using onBlur from textarea wrapper
  const submit = async () => {
    const wc = countWords(finalText);
    const cc = finalText.length;
    try {
      await submitResponse({
        question_id: qId,
        question_text: qText,
        response_text: finalText,
        word_count: wc,
        char_count: cc
      });
      setMsg("Submitted ✓");
      setFinalText("");
    } catch {
      setMsg("Submit failed");
    }
  };

  return (
    <div className="card">
      <div className="qTitle">{qText}</div>

      {/* Using LiveTextArea for autosave; we also capture final text by DOM read on submit */}
      <div
        onKeyUp={(e) => {
          const ta = e.currentTarget.querySelector("textarea");
          if (ta) setFinalText(ta.value);
        }}
        onClick={(e) => {
          const ta = e.currentTarget.querySelector("textarea");
          if (ta) setFinalText(ta.value);
        }}
      >
        <LiveTextArea fieldKey="question_answer" placeholder="Any idea?" />
      </div>

      <div className="row">
        <button className="btn primary" onClick={submit}>Submit</button>
        <div className="hint">{msg}</div>
      </div>
    </div>
  );
}
