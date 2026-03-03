export function Header() {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-mark">
          {[...Array(9)].map((_, i) => (
            <span key={i} />
          ))}
        </div>
        <span className="logo-title">
          QR<em>Dan</em>
        </span>
      </div>
      <span className="header-tag">Daniel D.</span>
    </header>
  );
}
