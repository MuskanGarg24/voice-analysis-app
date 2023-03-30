import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

function App() {
  const [listening, setListening] = useState(false);
  const [confidenceData, setConfidenceData] = useState([]);
  const [transcript, setTranscript] = useState('');

  const toggleListening = () => {
    if (listening) {
      recognition.stop();
      recognition.removeEventListener('result', handleResult);
    } else {
      recognition.addEventListener('result', handleResult);
      recognition.start();
    }
    setListening(!listening);
  };

  const handleResult = (event) => {
    const message = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    setConfidenceData(confidenceData.concat([{ message, confidence }]));
    setTranscript(message);
  };

  useEffect(() => {
    const ctx = document.getElementById('confidence-chart');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Confidence Level',
            data: confidenceData.map((data) => ({ x: data.message, y: data.confidence })),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            pointRadius: 0,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Message',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Confidence',
            },
            min: 0,
            max: 1,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
    return () => chart.destroy();
  }, [confidenceData]);

  const recognition = new window.webkitSpeechRecognition();

  return (
    <div className="App">
      <h1>Voice Confidence Chart</h1>
      <div>
        <button onClick={toggleListening}>
          {listening ? 'Stop Listening' : 'Start Listening'}
        </button>
      </div>
      <div>
        <p>{transcript}</p>
        <canvas id="confidence-chart" width="400" height="200"></canvas>
      </div>
    </div>
  );
}

export default App;
