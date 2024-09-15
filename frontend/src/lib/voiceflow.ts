import {SSE, _SSEvent} from 'sse.js';
import {v4 as uuidv4} from 'uuid';

export async function launch() {
  const userId = "1"

  const response = await fetch(
    `https://general-runtime.voiceflow.com/state/user/${userId}/interact?logs=off`,
    {
      method: 'POST',
      body: JSON.stringify({
        action: {
          type: "launch"
        },
        config: {
          tts: false,
          stripSSML: true,
          stopAll: true,
          excludeTypes: [
            "block",
            "debug",
            "flow"
          ]
        }
      }),
      headers: {
        Authorization: `ApiKey ${process.env.REACT_APP_VOICEFLOW_API_KEY}`,
        accept: 'application/json',
        'content-type': 'application/json',
        'versionID': process.env.REACT_APP_VOICEFLOW_VERSION_ID!
      }
    }
  );

  return response.json();
}

export async function getResponse(prompt: string) {
  const userId = "1"

  const response = await fetch(
    `https://general-runtime.voiceflow.com/state/user/${userId}/interact?logs=off`,
    {
      method: 'POST',
      body: JSON.stringify({
        action: {
          type: "text",
          payload: prompt
        },
        config: {
          tts: false,
          stripSSML: true,
          stopAll: true,
          excludeTypes: [
            "block",
            "debug",
            "flow"
          ]
        }
      }),
      headers: {
        Authorization: `ApiKey ${process.env.REACT_APP_VOICEFLOW_API_KEY}`,
        accept: 'application/json',
        'content-type': 'application/json',
        'versionID': process.env.REACT_APP_VOICEFLOW_VERSION_ID!
      }
    }
  );

  return response.json();
}