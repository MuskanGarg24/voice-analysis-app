import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import Sentiment from 'sentiment';

function App() {
  const [listening, setListening] = useState(false);
  const [confidenceData, setConfidenceData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
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
    const sentiment = new Sentiment().analyze(message).comparative;
    setConfidenceData(confidenceData.concat([{ message, confidence }]));
    setSentimentData(sentimentData.concat([{ message, sentiment }]));
    setTranscript(message);
  };

  useEffect(() => {
    const confidenceCtx = document.getElementById('confidence-chart');
    const sentimentCtx = document.getElementById('sentiment-chart');

    const confidenceChart = new Chart(confidenceCtx, {
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

    const sentimentChart = new Chart(sentimentCtx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Sentiment Analysis',
            data: sentimentData.map((data) => ({ x: data.message, y: data.sentiment })),
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
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
              text: 'Sentiment Score',
            },
            min: -1,
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

    return () => {
      confidenceChart.destroy();
      sentimentChart.destroy();
    };
  }, [confidenceData, sentimentData]);

  const recognition = new window.webkitSpeechRecognition();

  return (
    <div className="App">
      <h1>Voice Analysis Charts</h1>
      <div>
        <button onClick={toggleListening}>
          {
            listening ? 'Stop Listening' : 'Start Listening'
          }
        </button>
      </div>
      <div>
        <h2>Transcript</h2>
        <p>{transcript}</p>
      </div>
      <div>
        <h2>Confidence Chart</h2>
        <canvas id="confidence-chart" width="400" height="400" />
      </div>
      <div>
        <h2>Sentiment Chart</h2>
        <canvas id="sentiment-chart" width="400" height="400" />
      </div>
    </div>
  );

}

export default App;