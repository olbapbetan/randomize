import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [options, setOptions] = useState([]);
  const [checkedOptions, setCheckedOptions] = useState([]);
  const [winner, setWinner] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Function to parse URL parameters and set options if present
    const urlParams = new URLSearchParams(window.location.search);
    const optionsFromUrl = urlParams.get('options');
    if (optionsFromUrl) {
      const newOptions = optionsFromUrl.split(',').map((option) => option.trim());
      console.log(newOptions)
      setOptions(newOptions);
      setCheckedOptions([...checkedOptions, ...newOptions]);
    }
  }, []);

  useEffect(() => {
    // Update URL parameters whenever options change
    const urlParams = new URLSearchParams();
    urlParams.set('options', options.join(','));
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
  }, [options]);

  const handleAddOption = (event) => {
    event.preventDefault();
    const newOption = event.target.option.value.trim();
    if (newOption !== '' && !options.includes(newOption)) {
      setOptions([...options, newOption]);
      setCheckedOptions([...checkedOptions, newOption]);
      event.target.option.value = '';
    }
  };

  const handleCheckOption = (event, option) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setCheckedOptions([...checkedOptions, option]);
    } else {
      setCheckedOptions(checkedOptions.filter((item) => item !== option));
    }
  };

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
      <form onSubmit={handleAddOption}>
        <input type="text" name="option" />
        <button type="submit">Add option</button>
      </form>
      <div>
        <h2>Options</h2>
        <ul>
          {options.map((option) => (
            <li key={option}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckOption(e, option)}
                  checked={checkedOptions.includes(option)}
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSpin} disabled={isSpinning || checkedOptions.length === 0}>
        Choose one
      </button>
      {isSpinning && <div><h3>Choosing a winner in {countdown} s</h3></div>}
      {winner && !isSpinning && <p>The winner is: {winner}</p>}
    </div>
  );
}

export default App;
