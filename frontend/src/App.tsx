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
      <div className='welcome'>
        <svg xmlns="http://www.w3.org/2000/svg" width="73" height="73" viewBox="0 0 73 73" fill="none" className="logo">
          <path d="M36.5 44.6765C44.232 44.6765 50.5 50.9445 50.5 58.6765V58.6765C50.5 66.4084 44.232 72.6765 36.5 72.6765V72.6765C28.768 72.6765 22.5 66.4084 22.5 58.6765V58.6765C22.5 50.9445 28.768 44.6765 36.5 44.6765V44.6765Z" fill="#926247"/>
          <path d="M14.5 22.6765C22.232 22.6765 28.5 28.9445 28.5 36.6765V36.6765C28.5 44.4084 22.232 50.6765 14.5 50.6765V50.6765C6.76801 50.6765 0.5 44.4084 0.5 36.6765V36.6765C0.5 28.9445 6.76801 22.6765 14.5 22.6765V22.6765Z" fill="#926247"/>
          <path d="M36.5 0.676453C44.232 0.676453 50.5 6.94447 50.5 14.6765V14.6765C50.5 22.4084 44.232 28.6765 36.5 28.6765V28.6765C28.768 28.6765 22.5 22.4084 22.5 14.6765V14.6765C22.5 6.94447 28.768 0.676453 36.5 0.676453V0.676453Z" fill="#926247"/>
          <path d="M58.5 22.6765C66.232 22.6765 72.5 28.9445 72.5 36.6765V36.6765C72.5 44.4084 66.232 50.6765 58.5 50.6765V50.6765C50.768 50.6765 44.5 44.4084 44.5 36.6765V36.6765C44.5 28.9445 50.768 22.6765 58.5 22.6765V22.6765Z" fill="#926247"/>
        </svg>
        <h1 className="text-brown-90 title">TrackBack</h1>
        <p className="percentage">{percentage}%</p>
        <div className='orange-frame z-10'>
          <svg className='z-12' xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M18 22C21.866 22 25 25.134 25 29C25 32.866 21.866 36 18 36C14.134 36 11 32.866 11 29C11 25.134 14.134 22 18 22Z" fill="white"/>
            <path d="M7 11C10.866 11 14 14.134 14 18C14 21.866 10.866 25 7 25C3.13401 25 2.37484e-07 21.866 1.5299e-07 18C6.84959e-08 14.134 3.13401 11 7 11Z" fill="white"/>
            <path d="M18 1.5299e-07C21.866 6.84959e-08 25 3.13401 25 7C25 10.866 21.866 14 18 14C14.134 14 11 10.866 11 7C11 3.13401 14.134 2.37484e-07 18 1.5299e-07Z" fill="white"/>
            <path d="M29 11C32.866 11 36 14.134 36 18C36 21.866 32.866 25 29 25C25.134 25 22 21.866 22 18C22 14.134 25.134 11 29 11Z" fill="white"/>
          </svg>
          <h2 className='text-white text-left'>“I've lost my equilibrium, my car keys, and my pride.”</h2>
          <h3 className='text-white'>— Tom Waits</h3>
        </div>
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
        </a>
      </header>
      <Chat />
    </div>
    
  );
}

setTimeout(function() {
  window.location.replace('../home');
}, 5000);

export default App;
