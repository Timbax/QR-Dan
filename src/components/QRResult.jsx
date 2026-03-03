import { DlIcon, QREmptyIcon } from "./Icons";

export function QRResult({ qrData, canvasRef, download }) {
  return (
    <>
      {!qrData ? (
        <div className="output-empty">
          <QREmptyIcon />
          <p>El QR aparecerá aquí</p>
        </div>
      ) : (
        <div className="qr-result">
          <div className="qr-canvas-wrap">
            <canvas ref={canvasRef} />
          </div>

          <div className="qr-info">
            <div className="qr-info-item">
              <div className="qr-info-label">Tamaño</div>
              <div className="qr-info-value">{qrData.size}px</div>
            </div>
            <div className="qr-info-item">
              <div className="qr-info-label">Corrección</div>
              <div className="qr-info-value">Nivel {qrData.ecLevel}</div>
            </div>
            <div className="qr-info-item">
              <div className="qr-info-label">Datos</div>
              <div className="qr-info-value">{qrData.dataLen} ch</div>
            </div>
          </div>

          <div className="download-row">
            <button className="btn-dl" onClick={() => download("png")}>
              <DlIcon /> PNG
            </button>
            <button className="btn-dl" onClick={() => download("jpg")}>
              <DlIcon /> JPG
            </button>
            <button className="btn-dl" onClick={() => download("svg")}>
              <DlIcon /> SVG
            </button>
          </div>
        </div>
      )}
    </>
  );
}
