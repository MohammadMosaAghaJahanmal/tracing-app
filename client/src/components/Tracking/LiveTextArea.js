import React, { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "../../utils/debounce";
import { saveLiveText } from "../../utils/tracking";

const countWords = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;

export default function LiveTextArea({ fieldKey = "main", placeholder = "Type here..." }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("Idle");
  const [version, setVersion] = useState(1);

  const startRef = useRef(null);
  const lastRef = useRef(null);
  const keysRef = useRef(0);

  const chars = value.length;
  const words = countWords(value);

  const autosave = useMemo(
    () =>
      debounce(async (text) => {
        const now = Date.now();
        if (!startRef.current) startRef.current = now;
        if (!lastRef.current) lastRef.current = now;

        const duration = now - startRef.current;
        const keystrokes = keysRef.current;
        const minutes = Math.max(0.01, duration / 60000);
        const speed = keystrokes / minutes; // keys per minute

        setStatus("Type More...");
        try {
          await saveLiveText({
            field_key: fieldKey,
            version,
            content: text,
            keystrokes,
            typing_duration_ms: duration,
            typing_speed_kpm: Number(speed.toFixed(2))
          });
          setStatus("Wanna Type More?");
          setVersion((v) => v + 1);
        } catch {
          setStatus("Failed");
        }
      }, 500),
    [fieldKey, version]
  );

  const onChange = (e) => {
    const text = e.target.value;
    setValue(text);
    autosave(text);
  };

  useEffect(() => {
    const onKey = () => {
      keysRef.current += 1;
      lastRef.current = Date.now();
      setStatus("Typing...");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="liveBox">
      <textarea className="textarea" value={value} onChange={onChange} placeholder={placeholder} />
      <div className="liveMeta">
        <div>Chars: <b>{chars}</b> | Words: <b>{words}</b></div>
        <div className="badge">{status}</div>
      </div>
    </div>
  );
}
