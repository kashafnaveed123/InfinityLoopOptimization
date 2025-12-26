import React, { useEffect, useRef, useState } from "react";

const InfiniteMultiplyUI = () => {
  const [displayValue, setDisplayValue] = useState("10");
  const [running, setRunning] = useState(false);
  const [iterations, setIterations] = useState(0);
  
  // Store as: base^(exponent^superExponent)
  const baseRef = useRef(10);
  const exponentRef = useRef(1);
  const superExponentRef = useRef(0);
  
  const iterationRef = useRef(0);
  const runningRef = useRef(false);

  useEffect(() => {
    runningRef.current = running;
    
    if (!running) return;

    async function loop() {
      while (runningRef.current) {
        iterationRef.current++;
        
        // n^2 in log space means: exponent = 2 * exponent
        // But we need to handle when exponent gets too large
        
        if (superExponentRef.current === 0) {
          // Normal doubling
          exponentRef.current = 2 * exponentRef.current;
          
          // If exponent exceeds safe range, move to super-exponent
          if (exponentRef.current > 1e100) {
            superExponentRef.current = Math.log10(exponentRef.current);
            exponentRef.current = 10;
          }
        } else {
          // We're in super-exponent mode
          // Doubling in super-log space
          superExponentRef.current = superExponentRef.current + Math.log10(2);
        }

        // Update display
        setIterations(iterationRef.current);
        
        if (superExponentRef.current > 0) {
          setDisplayValue(`10^(10^${superExponentRef.current.toFixed(2)})`);
        } else if (exponentRef.current < 10) {
          const val = Math.pow(baseRef.current, exponentRef.current);
          setDisplayValue(val.toExponential(2));
        } else {
          setDisplayValue(`10^${exponentRef.current.toExponential(2)}`);
        }

        // Yield to browser
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    loop();
  }, [running]);

  const handleReset = () => {
    setRunning(false);
    runningRef.current = false;
    baseRef.current = 10;
    exponentRef.current = 1;
    superExponentRef.current = 0;
    iterationRef.current = 0;
    setDisplayValue("10");
    setIterations(0);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Infinite Self-Multiplier</h2>
        <p style={styles.subtitle}>
          Tower notation (truly infinite)
        </p>

        <div style={styles.statsBox}>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>Iterations</div>
            <div style={styles.statValue}>{iterations.toLocaleString()}</div>
          </div>
        </div>

        <div style={styles.numberBox}>
          <div style={styles.numberLabel}>Current Value:</div>
          <div style={styles.numberValue}>{displayValue}</div>
        </div>

        <div style={styles.controls}>
          <button
            style={{
              ...styles.button,
              ...styles.start,
              opacity: running ? 0.5 : 1,
              cursor: running ? "not-allowed" : "pointer",
            }}
            onClick={() => setRunning(true)}
            disabled={running}
          >
            Start
          </button>

          <button
            style={{
              ...styles.button,
              ...styles.stop,
              opacity: !running ? 0.5 : 1,
              cursor: !running ? "not-allowed" : "pointer",
            }}
            onClick={() => setRunning(false)}
            disabled={!running}
          >
            Stop
          </button>

          <button
            style={{ ...styles.button, ...styles.reset }}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        <p style={styles.info}>
          ✨ Using tower notation to go beyond JavaScript's limits
        </p>
      </div>
    </div>
  );
};

export default InfiniteMultiplyUI;

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
  },

  card: {
    width: 480,
    padding: 32,
    borderRadius: 16,
    background: "#020617",
    border: "1px solid #1e293b",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    textAlign: "center",
    color: "#e5e7eb",
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 6,
    background: "linear-gradient(135deg, #38bdf8, #818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 24,
  },

  statsBox: {
    display: "flex",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },

  statItem: {
    padding: 12,
    borderRadius: 8,
    background: "#1e293b",
    minWidth: 110,
  },

  statLabel: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 4,
  },

  statValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#38bdf8",
  },

  numberBox: {
    padding: 20,
    borderRadius: 12,
    border: "1px dashed #38bdf8",
    background: "#0a0f1e",
    marginBottom: 24,
    minHeight: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  numberLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 8,
  },

  numberValue: {
    fontSize: 18,
    fontWeight: 700,
    color: "#38bdf8",
    wordBreak: "break-all",
    fontFamily: "monospace",
    lineHeight: 1.5,
  },

  controls: {
    display: "flex",
    gap: 12,
    marginBottom: 16,
  },

  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s",
  },

  start: {
    background: "#22c55e",
    color: "#022c22",
  },

  stop: {
    background: "#ef4444",
    color: "#450a0a",
  },

  reset: {
    background: "#64748b",
    color: "#0f172a",
  },

  info: {
    fontSize: 11,
    color: "#10b981",
    margin: 0,
    fontStyle: "italic",
  },
};