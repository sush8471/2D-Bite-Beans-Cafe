import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <span className="script-label">Lost in the sketchbook</span>
      <h1 className="heading-lg">That page isn’t on the menu</h1>
      <p className="body-text" style={{ marginTop: '0.75rem', maxWidth: '44ch' }}>
        The link may be old, or the page may have moved. Head back to the cafe.
      </p>
      <Link href="/" className="btn btn--primary" style={{ marginTop: '1.75rem' }}>
        Back to home
      </Link>
    </div>
  );
}
