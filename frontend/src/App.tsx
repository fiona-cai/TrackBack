import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Chunk, streamResponse } from './lib/voiceflow';
import Chat from './components/chat';

function App() {
  // testing code
  // const [value, setValue] = useState<Chunk[]>([]);

  // useEffect(() => {
  //   streamResponse("Hello!", setValue, () => {});
  // }, []);

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const percentageInterval = setInterval(() => {
        setPercentage((percentage) => {
          if (percentage >= 100) {
            clearInterval(percentageInterval);
            return 100;
          } else {
            return percentage + 1;
          }
        });
      }, 20)
    }, 1000)
  })

  return (
    
    
    <div className="App">
      {/* <div className='welcome'>
        <svg xmlns="http://www.w3.org/2000/svg" width="73" height="73" viewBox="0 0 73 73" fill="none" className="logo">
          <path d="M36.5 44.6765C44.232 44.6765 50.5 50.9445 50.5 58.6765V58.6765C50.5 66.4084 44.232 72.6765 36.5 72.6765V72.6765C28.768 72.6765 22.5 66.4084 22.5 58.6765V58.6765C22.5 50.9445 28.768 44.6765 36.5 44.6765V44.6765Z" fill="#926247"/>
          <path d="M14.5 22.6765C22.232 22.6765 28.5 28.9445 28.5 36.6765V36.6765C28.5 44.4084 22.232 50.6765 14.5 50.6765V50.6765C6.76801 50.6765 0.5 44.4084 0.5 36.6765V36.6765C0.5 28.9445 6.76801 22.6765 14.5 22.6765V22.6765Z" fill="#926247"/>
          <path d="M36.5 0.676453C44.232 0.676453 50.5 6.94447 50.5 14.6765V14.6765C50.5 22.4084 44.232 28.6765 36.5 28.6765V28.6765C28.768 28.6765 22.5 22.4084 22.5 14.6765V14.6765C22.5 6.94447 28.768 0.676453 36.5 0.676453V0.676453Z" fill="#926247"/>
          <path d="M58.5 22.6765C66.232 22.6765 72.5 28.9445 72.5 36.6765V36.6765C72.5 44.4084 66.232 50.6765 58.5 50.6765V50.6765C50.768 50.6765 44.5 44.4084 44.5 36.6765V36.6765C44.5 28.9445 50.768 22.6765 58.5 22.6765V22.6765Z" fill="#926247"/>
        </svg>
        <h1 className="text-brown-90 title">TrackBack</h1>
        <p className="percentage">{percentage}%</p>
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        {/* testing code */}
        {/* <p>{[...value].sort((a: Chunk, b: Chunk) => a.time - b.time).join("")}</p> */}
      {/* </header> */}
      <Chat />
    </div>
    
  );
}

export default App;
