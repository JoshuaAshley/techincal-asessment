import React, { useRef, useState, useEffect, useCallback } from "react";
import { Howl } from 'howler';
import "./App.css";

const App = () => {
  const canvasRef = useRef(null);
  const soundRef = useRef(null);
  const [list] = useState([
    { prize: "50", color: "#007BFF" },
    { prize: "100", color: "#005f9e" },
    { prize: "500", color: "#007BFF" },
    { prize: "1000", color: "#005f9e" },
    { prize: "5000", color: "#007BFF" },
    { prize: "10K", color: "#005f9e" },
    { prize: "50K", color: "#007BFF" },
    { prize: "100K", color: "#005f9e" },
    { prize: "250K", color: "#007BFF" },
    { prize: "500K", color: "#005f9e" }
  ]);
  const [rotate, setRotate] = useState(0);
  const [easeOut, setEaseOut] = useState(3);
  const [, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [, setLastPlayedAngle] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['Tick.wav'], // Adjust the path as needed
      loop: true,
      volume: 0.5,
    });
  }, []);

  const setInitialRotation = useCallback(() => {
    const initialRotation = (360 / list.length) * 0;
    setRotate(initialRotation);
  }, [list.length]);

  const renderWheel = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const numOptions = list.length;
    const arcSize = (2 * Math.PI) / numOptions;

    setAngle(arcSize);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let angle = 0;
    for (let i = 0; i < numOptions; i++) {
      const { prize, color } = list[i];
      renderSector(ctx, i + 1, prize, angle, arcSize, color, x, y, 75);
      angle += arcSize;
    }
  }, [list]);

  const renderSector = (ctx, idx, text, start, arc, color, x, y, radius) => {
    const startAngle = start;
    const endAngle = start + arc;
    const sectorAngle = idx * arc;
    const baseSize = radius * 3.33;
    const textRadius = baseSize - 150;

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.lineWidth = radius * 2;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.save();
    ctx.translate(
      baseSize + Math.cos(sectorAngle - arc / 2) * textRadius,
      baseSize + Math.sin(sectorAngle - arc / 2) * textRadius
    );
    ctx.rotate(sectorAngle - arc / 2 + Math.PI / 2);

    const xOffset = -ctx.measureText(text).width / 2 - 10;
    const yOffset = 8;

    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text, xOffset, yOffset);
    ctx.restore();

    ctx.restore();
  };

  const spin = () => {
    setEaseOut(3);
    setHasSpun(false);

    let stopIndex = null;
    if (selectedPrize) {
      stopIndex = list.findIndex(item => item.prize === selectedPrize);
      if (stopIndex === -1) {
        stopIndex = Math.floor(Math.random() * list.length);
      }
    } else {
      stopIndex = Math.floor(Math.random() * list.length);
    }

    const angleForStop = stopIndex * -(360 / list.length);
    const totalSpin = 360 * 3 + angleForStop;

    setRotate(totalSpin);
    setSpinning(true);
    setResult(stopIndex);
    soundRef.current.play();
  };

  useEffect(() => {
    setInitialRotation();
    renderWheel();
  }, [setInitialRotation, renderWheel]);

  const reset = () => {
    setRotate(0);
    setEaseOut(0);
    setResult(null);
    setSpinning(false);
    setHasSpun(false);
    setSelectedPrize(null);
    setLastPlayedAngle(null);
    soundRef.current.stop(); // Stop playing sound when resetting
  };

  const handlePrizeSelection = prize => {
    setSelectedPrize(prize);
  };

  const handleTransitionEnd = () => {
    setSpinning(false);
    setHasSpun(true);
    soundRef.current.stop(); // Stop playing sound when spinning ends
  };

  return (
    <div className="App">
      <h1>Spinning Prize Wheel React</h1>
      <span id="selector">&#9660;</span>
  
      {/* Wrap the canvas in a div for the border */}
      <div className="canvas-container">
        <canvas
          id="wheel"
          width="500"
          height="500"
          ref={canvasRef}
          style={{
            transform: `rotate(${rotate - 108}deg)`,
            transition: `transform ${easeOut}s ease-out`
          }}
          onTransitionEnd={handleTransitionEnd}
        />
      </div>
  
      <div className="prize-buttons">
        {list.map((item, index) => (
          <button
            key={index}
            className={`prize-button ${selectedPrize === item.prize ? 'selected' : ''}`}
            onClick={() => handlePrizeSelection(item.prize)}
          >
            {item.prize}
          </button>
        ))}
      </div>
  
      {!spinning && !hasSpun ? (
        <button type="button" id="spin" onClick={spin}>
          Spin
        </button>
      ) : (
        <button type="button" id="reset" onClick={reset}>
          Reset
        </button>
      )}
  
      <div className="display">
        <span id="readout">
          {hasSpun && result !== null ? "YOU WON: R " + list[result].prize : ""}
        </span>
      </div>
    </div>
  );
}  

export default App;