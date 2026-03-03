import { UploadIcon } from "./Icons";

export function DropZone({ mode, dragging, onDragOver, onDragLeave, onDrop, onClick, fileRef, accept, onChange }) {
  return (
    <div
      className={`drop-zone ${dragging ? "dragging" : ""}`}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <UploadIcon />
      <div className="drop-text">
        <strong>Arrastra y suelta</strong> o haz clic para seleccionar
        <br />
        <span style={{ fontSize: "11px" }}>
          {mode === "image"
            ? "PNG, JPG, GIF, WEBP, SVG"
            : mode === "pdf"
              ? "Archivos PDF"
              : "Texto o URL"}{" "}
          — máx. 5 MB
        </span>
      </div>
      <div className="drop-formats">
        {mode === "image"
          ? "FORMATOS DE IMAGEN"
          : mode === "pdf"
            ? "DOCUMENTO PDF"
            : "TEXTO O URL"}
      </div>
      <input
        ref={fileRef}
        type="file"
        className="file-input"
        accept={accept}
        onChange={onChange}
      />
    </div>
  );
}
