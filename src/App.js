import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import Sentiment from 'sentiment';
import { Analyzer } from 'web-audio-analyser';

function App() {

  const [listening, setListening] = useState(false);
  const [confidenceData, setConfidenceData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [clarityData, setClarityData] = useState([]);


  const toggleListening = () => {
    if (listening) {
      recognition.stop();
      recognition.removeEventListener('result', handleResult);
    } else {
      recognition.addEventListener('result', handleResult);
      recognition.continuous = true;
      recognition.start();
    }
    setListening(!listening);
  };


  const handleResult = (event) => {
    const message = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    const sentiment = new Sentiment().analyze(message).comparative;
    const clarity = calculateClarity(message);

    // Set the transcript to the latest speech input
    setTranscript(message);

    // Append the latest confidence, sentiment and clarity data
    setConfidenceData(confidenceData.concat([{ message, confidence }]));
    setSentimentData(sentimentData.concat([{ message, sentiment }]));
    setClarityData(clarityData.concat([{ message, clarity }]));
  };

  // const calculateClarity = (message) => {
  //   // Split the message into words
  //   const words = message.split(' ');

  //   // Calculate the total number of syllables in the message
  //   let syllableCount = 0;
  //   words.forEach((word) => {
  //     syllableCount += countSyllables(word);
  //   });

  //   // Calculate the average number of syllables per word
  //   const avgSyllablesPerWord = syllableCount / words.length;

  //   // Calculate the clarity score
  //   const clarity = 206.835 - (1.015 * avgSyllablesPerWord) - (84.6 * (words.length / message.length));

  //   return clarity.toFixed(2);
  // };

  const calculateClarity = (message) => {
    // Split the message into words
    const words = message.split(' ');

    // Calculate the total number of syllables in the message
    let syllableCount = 0;
    words.forEach((word) => {
      syllableCount += countSyllables(word);
    });

    // Calculate the average number of syllables per word
    const avgSyllablesPerWord = syllableCount / words.length;

    // Calculate the clarity score
    const clarity = 206.835 - (1.015 * avgSyllablesPerWord) - (84.6 * (words.length / message.length));

    // Convert the clarity score to a percentage value between 0 and 100
    const clarityPercentage = (clarity / 206.835) * 100;

    return clarityPercentage.toFixed(2);
  };



  const countSyllables = (word) => {
    word = word.toLowerCase();
    if (word.length <= 3) {
      return 1;
    }
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };


  useEffect(() => {
    const confidenceCtx = document.getElementById('confidence-chart');
    const sentimentCtx = document.getElementById('sentiment-chart');
    const clarityCtx = document.getElementById('clarity-chart');

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

    // const clarityChart = new Chart(clarityCtx, {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {
    //         label: 'Clarity Score',
    //         data: clarityData.map((data) => ({ x: data.message, y: data.clarity })),
    //         backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //         borderColor: 'rgba(75, 192, 192, 1)',
    //         borderWidth: 1,
    //         pointRadius: 0,
    //       },
    //     ],
    //   },
    //   options: {
    //     scales: {
    //       x: {
    //         title: {
    //           display: true,
    //           text: 'Message',
    //         },
    //       },
    //       y: {
    //         title: {
    //           display: true,
    //           text: 'Clarity',
    //         },
    //         min: 0,
    //         max: 100,
    //       },
    //     },
    //     plugins: {
    //       legend: {
    //         display: false,
    //       },
    //     },
    //   },
    // });

    const clarityChart = new Chart(clarityCtx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Clarity Score',
            data: clarityData.map((data) => ({ x: data.message, y: data.clarity })),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
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
              text: 'Clarity (%)',
            },
            min: 0,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`,
            },
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
      clarityChart.destroy();
    };
  }, [confidenceData, sentimentData]);

  const recognition = new window.webkitSpeechRecognition();
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();


  // Listen for the onaudioprocess event to display the text in real-time
  recognition.addEventListener('audioprocess', (event) => {
    const message = event.results[0][0].transcript;
    setTranscript(message);
  });

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
      <div>
        <h2>Clarity Chart</h2>
        <canvas id="clarity-chart" width="400" height="400" />
      </div>
    </div>
  );

}

export default App;

