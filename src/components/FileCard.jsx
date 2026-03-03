import { XIcon } from "./Icons";

export function FileCard({ file, onRemove }) {
  const fileType = file.type.startsWith("image/") ? "img" : "pdf";
  const fileLabel = file.type.startsWith("image/") ? "IMG" : "PDF";

  return (
    <div className="file-card">
      <div className={`file-icon-wrap ${fileType}`}>
        {fileLabel}
      </div>
      <div className="file-meta">
        <div className="file-name">{file.name}</div>
        <div className="file-size">{formatBytes(file.size)}</div>
      </div>
      <button className="file-remove" onClick={onRemove}>
        <XIcon />
      </button>
    </div>
  );
}

function formatBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(2)} MB`;
}
