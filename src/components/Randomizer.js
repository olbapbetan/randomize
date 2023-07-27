import React, { useState, useEffect } from 'react';

function Randomizer({paramOptions}) {
  const [checkedOptions, setCheckedOptions] = useState(paramOptions);
  const [winner, setWinner] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSpin = () => {
    setWinner('')
    const awaitingTime = 3;

    if (checkedOptions.length > 0) {
      setIsSpinning(true);
      setCountdown(awaitingTime);

      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * checkedOptions.length);
        setWinner(checkedOptions[randomIndex]);
        setIsSpinning(false);
      }, awaitingTime * 1000);
    } else {
      setWinner('No options selected.');
    }
  };

  return (
    <div className="App">
      <h1>Randomizer</h1>
      <button id="choose" onClick={handleSpin} disabled={isSpinning || checkedOptions.length === 0}>
        Choose one
      </button>
      {isSpinning && <div><h3>Choosing a winner in {countdown} s</h3></div>}
      {winner && !isSpinning && <p>The winner is: {winner}</p>}
    </div>
  );
}

export default Randomizer;