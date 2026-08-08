function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#0f0f0f',
      color: '#e0e0e0',
      margin: 0,
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 300, letterSpacing: '-0.02em' }}>
        Whitt Graph UI
      </h1>
      <p style={{ color: '#888', fontSize: '1.1rem' }}>
        Voice + Mouse · Infinite Canvas · Fish-Eye Graph
      </p>
      <p style={{ color: '#555', fontSize: '0.9rem', marginTop: '2rem' }}>
        Hello World — scaffolding ready.
      </p>
    </div>
  )
}

export default App
