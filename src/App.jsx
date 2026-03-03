import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DropZone } from "./components/DropZone";
import { FileCard } from "./components/FileCard";
import { TextInput } from "./components/TextInput";
import { OptionsPanel } from "./components/OptionsPanel";
import { QRResult } from "./components/QRResult";

const NAYUKI_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";

function useNayukiQR() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.QRCode) {
      Promise.resolve().then(() => setReady(true));
      return;
    }
    const script = document.createElement("script");
    script.src = NAYUKI_CDN;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);
  return ready;
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

export default function QRGenerator() {
  const nayukiReady = useNayukiQR();
  const [mode, setMode] = useState("image");
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState(null);

  const [ecLevel, setEcLevel] = useState("H");
  const [qrSize, setQrSize] = useState(300);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [margin, setMargin] = useState(2);

  const fileRef = useRef();
  const fgRef = useRef();
  const bgRef = useRef();
  const canvasRef = useRef();

  const accept =
    mode === "image"
      ? "image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
      : "application/pdf";

  const reset = () => {
    setFile(null);
    setTextContent("");
    setImgPreview(null);
    setQrData(null);
    setError("");
  };

  const onModeChange = (m) => {
    setMode(m);
    reset();
  };

  const handleFile = async (f) => {
    if (!f) return;
    const isImage = f.type.startsWith("image/");
    const isPDF = f.type === "application/pdf";
    if (mode === "image" && !isImage) {
      setError(
        "Por favor selecciona una imagen válida (PNG, JPG, GIF, WEBP, SVG)."
      );
      return;
    }
    if (mode === "pdf" && !isPDF) {
      setError("Por favor selecciona un archivo PDF válido.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("El archivo no debe superar 5 MB.");
      return;
    }
    setError("");
    setFile(f);
    setTextContent("");
    setQrData(null);
    if (isImage) {
      const b64 = await fileToBase64(f);
      setImgPreview(b64);
    } else {
      setImgPreview(null);
    }
  };

  const handleTextChange = (text) => {
    setTextContent(text);
    setFile(null);
    setImgPreview(null);
    setQrData(null);
    setError("");
  };

  const onInputChange = (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const generateQR = useCallback(async () => {
    if (!nayukiReady) return;
    if (!file && !textContent) {
      setError("Selecciona un archivo o ingresa texto/URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let content = "";

      if (textContent) {
        content = textContent;
      } else if (file) {
        const b64 = await fileToBase64(file);
        content = b64;
        if (b64.length > 2900) {
          content = `FILE:${file.name}|SIZE:${file.size}|TYPE:${file.type}|PARTIAL:${b64.slice(0, 500)}`;
        }
      }

      const div = document.createElement("div");
      new window.QRCode(div, {
        text: content,
        width: qrSize,
        height: qrSize,
        colorDark: fgColor,
        colorLight: bgColor,
        correctLevel: window.QRCode.CorrectLevel[ecLevel],
      });

      await new Promise((r) => setTimeout(r, 100));
      const srcCanvas = div.querySelector("canvas");
      if (!srcCanvas) throw new Error("No se pudo generar el QR.");

      const out = canvasRef.current || document.createElement("canvas");
      const total = qrSize + margin * 2 * (qrSize / srcCanvas.width) * 4;
      out.width = total;
      out.height = total;
      const ctx = out.getContext("2d");
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, total, total);
      const pad = (total - qrSize) / 2;
      ctx.drawImage(srcCanvas, pad, pad, qrSize, qrSize);

      setQrData({
        canvas: out,
        size: qrSize,
        ecLevel,
        version: "auto",
        dataLen: content.length,
      });
    } catch (e) {
      setError("Error generando el QR: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  }, [file, textContent, nayukiReady, ecLevel, qrSize, fgColor, bgColor, margin]);

  const download = (format) => {
    if (!qrData) return;
    const c = qrData.canvas;
    if (format === "png" || format === "jpg") {
      const url = c.toDataURL(format === "jpg" ? "image/jpeg" : "image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${file ? file.name : "text"}.${format}`;
      a.click();
    } else if (format === "svg") {
      const size = c.width;
      const imgData = c.toDataURL("image/png");
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><image href="${imgData}" width="${size}" height="${size}"/></svg>`;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${file ? file.name : "text"}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    if (qrData && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = qrData.canvas.width;
      canvasRef.current.height = qrData.canvas.height;
      ctx.drawImage(qrData.canvas, 0, 0);
    }
  }, [qrData]);

  const renderInputSection = () => {
    if (textContent) {
      return (
        <TextInput
          value={textContent}
          onChange={handleTextChange}
          onRemove={() => {
            setTextContent("");
            setQrData(null);
          }}
        />
      );
    }

    if (mode === "text") {
      return (
        <TextInput
          value={textContent}
          onChange={handleTextChange}
          onRemove={() => {
            setTextContent("");
            setQrData(null);
          }}
        />
      );
    }

    if (file) {
      return (
        <>
          <FileCard file={file} onRemove={reset} />
          {imgPreview && (
            <img src={imgPreview} alt="preview" className="img-thumb" />
          )}
        </>
      );
    }

    return (
      <DropZone
        mode={mode}
        dragging={dragging}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileRef.current.click()}
        fileRef={fileRef}
        accept={accept}
        onChange={onInputChange}
      />
    );
  };

  return (
    <>
      <div className="app">
        <Header />

        <main className="main">
          <div className="panel">
            <div className="section-label">Entrada</div>

            <div className="tabs">
              <button
                className={`tab ${mode === "image" ? "active" : ""}`}
                onClick={() => onModeChange("image")}
              >
                Imagen
              </button>
              <button
                className={`tab ${mode === "pdf" ? "active" : ""}`}
                onClick={() => onModeChange("pdf")}
              >
                PDF
              </button>
              <button
                className={`tab ${mode === "text" ? "active" : ""}`}
                onClick={() => onModeChange("text")}
              >
                Texto/URL
              </button>
            </div>

            {renderInputSection()}

            {error && <div className="error-msg">⚠ {error}</div>}

            <div className="section-label">Configuración</div>
            <OptionsPanel
              ecLevel={ecLevel}
              setEcLevel={setEcLevel}
              qrSize={qrSize}
              setQrSize={setQrSize}
              fgColor={fgColor}
              setFgColor={setFgColor}
              bgColor={bgColor}
              setBgColor={setBgColor}
              margin={margin}
              setMargin={setMargin}
              fgRef={fgRef}
              bgRef={bgRef}
            />

            <button
              className={`btn-generate ${loading ? "loading" : ""}`}
              onClick={generateQR}
              disabled={(!file && !textContent) || !nayukiReady || loading}
            >
              {loading ? (
                <>
                  <div className="spinner" /> Generando...
                </>
              ) : !nayukiReady ? (
                "Cargando motor..."
              ) : (
                "Generar QR"
              )}
            </button>
          </div>

          <div className="panel">
            <div className="section-label">Resultado</div>
            <QRResult
              qrData={qrData}
              canvasRef={canvasRef}
              download={download}
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
