import { useState } from "react";
import { Chunk, streamResponse } from "../lib/voiceflow";

type Message = {
	content: string;
	author: string;
};

function Chat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [streamingMessage, setStreamingMessage] = useState<Chunk[]>([]);
	const [messageInput, setMessageInput] = useState("");

	const sendMessage = () => {
		setMessages((messages) => [...messages, {content: messageInput, author: "User"}])

		streamResponse(messageInput, setStreamingMessage, (finalValue) => {
			console.log("streaming message", streamingMessage);

			if (finalValue === null) {
				setMessages((messages) => [...messages, {content: [...streamingMessage].sort((a, b) => a.time - b.time).join(""), author: "AI"}]);
			} else {
				setMessages((messages) => [...messages, {content: [...finalValue].sort((a, b) => a.time - b.time).join(""), author: "AI"}]);
			}
			setStreamingMessage([]);
		});

		setMessageInput("");
	}

	return (
		<main>
			<div>
				{messages.map((message) => (
					<div>
						{message.content}
					</div>
				))}
				{[...streamingMessage].sort((a: Chunk, b: Chunk) => a.time - b.time).join("")}
			</div>
			<div className="absolute bottom-0 w-full mb-5 rounded-xl">
				<input type="text" placeholder="Type to start chatting..." className="p-3 mr-5" value={messageInput} onChange={(event) => setMessageInput(event.target.value)} />
				<button onClick={() => sendMessage()}>&#8626;</button>
			</div>
		</main>
	)
}

export default Chat;