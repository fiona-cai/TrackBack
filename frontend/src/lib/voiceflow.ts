import {SSE, _SSEvent} from 'sse.js';

function streamResponse(message: string, setValue: React.Dispatch<React.SetStateAction<string[]>>, onComplete: () => void) {
    // TODO: add environment variables

    const url = `https://general-runtime.voiceflow.com/v2beta1/interact/${process.env.VOICEFLOW_PROJECT_ID}/${process.env.VOICEFLOW_VERSION_ID}/stream`;

    const source = new SSE(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${process.env.VOICEFLOW_API_KEY}`
      },
      payload: JSON.stringify({
        "action": {
          "type": "text",
          "payload": message
        },
        "session": {
          "sessionID": "1", // TODO
          "userID": "1" // TODO
        }
      }),
      method: "POST",
      start: false
    });

    source.addEventListener('trace', (event: _SSEvent) => {
      const payload = JSON.parse(event.data);
      console.log(payload.trace)

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