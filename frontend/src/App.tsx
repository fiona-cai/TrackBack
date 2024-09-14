import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Chunk, streamResponse } from './lib/voiceflow';

function App() {
  // testing code
  // const [value, setValue] = useState<Chunk[]>([]);

  // useEffect(() => {
  //   streamResponse("Hello!", setValue, () => {});
  // }, []);

  return (
    <div className="App">
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
        {/* testing code */}
        {/* <p>{[...value].sort((a: Chunk, b: Chunk) => a.time - b.time).join("")}</p> */}
      </header>
    </div>
  );
}

export default App;
