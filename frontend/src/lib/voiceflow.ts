import {SSE, _SSEvent} from 'sse.js';

export type Chunk = {
  payload: {
    completion: string;
    tokens: {
      answer: number;
      query: number;
      total: number;
    };
  }
  time: number;
  type: string;
}

export function streamResponse(message: string, setValue: React.Dispatch<React.SetStateAction<Chunk[]>>, onComplete: () => void) {
  // console.log("streaming...");

  const url = `https://general-runtime.voiceflow.com/v2beta1/interact/${process.env.REACT_APP_VOICEFLOW_PROJECT_ID}/${process.env.REACT_APP_VOICEFLOW_VERSION_ID}/stream`;

  const source = new SSE(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `ApiKey ${process.env.REACT_APP_VOICEFLOW_API_KEY}`
    },
    payload: JSON.stringify({
      "action": {
        "type": "text",
        "payload": message
      },
      "session": {
        "sessionID": "7", // TODO
        "userID": "1" // TODO
      }
    }),
    method: "POST",
    start: false
  });

  source.addEventListener('trace', (event: _SSEvent) => {
    const payload = JSON.parse(event.data);
    // console.log(payload.trace)

    switch (payload.trace.type) {
      case "completion-start": {
        setValue([])
        break;
      }
      case "completion-continue": {
        setValue((val) => [...val, payload.trace.payload.completion]);
        break;
      }
      case "completion-end": {
        source.close();
        onComplete();
        break;
      }
    }
  });

  source.stream();
}