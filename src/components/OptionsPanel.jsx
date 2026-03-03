export function OptionsPanel({
  ecLevel,
  setEcLevel,
  qrSize,
  setQrSize,
  fgColor,
  setFgColor,
  bgColor,
  setBgColor,
  margin,
  setMargin,
  fgRef,
  bgRef,
}) {
  return (
    <div className="options-grid">
      <div className="field">
        <span className="field-label">Corrección</span>
        <select
          className="field-select"
          value={ecLevel}
          onChange={(e) => setEcLevel(e.target.value)}
        >
          <option value="L">L — 7%</option>
          <option value="M">M — 15%</option>
          <option value="Q">Q — 25%</option>
          <option value="H">H — 30%</option>
        </select>
      </div>
      <div className="field">
        <span className="field-label">Tamaño</span>
        <div className="slider-wrap">
          <input
            type="range"
            className="slider"
            min={128}
            max={512}
            step={8}
            value={qrSize}
            onChange={(e) => setQrSize(+e.target.value)}
          />
          <span className="slider-val">{qrSize}</span>
        </div>
      </div>
      <div className="field">
        <span className="field-label">Color QR</span>
        <div className="color-row">
          <div
            className="color-swatch"
            style={{ background: fgColor }}
            onClick={() => fgRef.current.click()}
          />
          <input
            ref={fgRef}
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
          />
          <input
            className="field-input"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
      </div>
      <div className="field">
        <span className="field-label">Fondo</span>
        <div className="color-row">
          <div
            className="color-swatch"
            style={{
              background: bgColor,
              border: bgColor === "#ffffff" ? "1px solid #333" : undefined,
            }}
            onClick={() => bgRef.current.click()}
          />
          <input
            ref={bgRef}
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
          <input
            className="field-input"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
      </div>
      <div className="field full">
        <span className="field-label">Margen (módulos)</span>
        <div className="slider-wrap">
          <input
            type="range"
            className="slider"
            min={0}
            max={8}
            step={1}
            value={margin}
            onChange={(e) => setMargin(+e.target.value)}
          />
          <span className="slider-val">{margin}</span>
        </div>
      </div>
    </div>
  );
}
