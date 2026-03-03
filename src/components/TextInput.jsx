import { useState } from "react";
import { LinkIcon, TextIcon } from "./Icons";

export function TextInput({ value, onChange, onRemove }) {
  const [inputMode, setInputMode] = useState("text");

  const handleModeChange = (mode) => {
    setInputMode(mode);
    if (mode === "url" && !value.startsWith("http")) {
      onChange("https://");
    } else if (mode === "text" && value.startsWith("https://")) {
      onChange("");
    }
  };

  return (
    <div className="text-input-container">
      <div className="text-mode-tabs">
        <button
          className={`text-mode-btn ${inputMode === "text" ? "active" : ""}`}
          onClick={() => handleModeChange("text")}
        >
          <TextIcon /> Texto
        </button>
        <button
          className={`text-mode-btn ${inputMode === "url" ? "active" : ""}`}
          onClick={() => handleModeChange("url")}
        >
          <LinkIcon /> URL
        </button>
      </div>
      <textarea
        className="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={inputMode === "url" ? "https://ejemplo.com" : "Escribe tu texto aquí..."}
        rows={4}
      />
      <button className="text-remove-btn" onClick={onRemove}>
        <span>✕</span> Eliminar texto
      </button>
    </div>
  );
}
