import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getResponse, launch } from "../lib/voiceflow";

type Message = {
	content: string;
	author: string;
	image?: string;
};

function Chat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [messageInput, setMessageInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [searchParams] = useSearchParams();
	const msgContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		async function launchChat() {
			await launch();
			const initialMsg = searchParams.get("initialMsg");
			if (initialMsg) {
				setIsLoading(true);
				const findRes = await getResponse(initialMsg);
				setIsLoading(false);
				for (const trace of findRes) {
					if (trace.type === "text") {
						if (trace.payload.message.includes("Chunk ID")) {
							const lines = trace.payload.message.split("\n");
							const frame = lines[0].split(": ")[1];
							const chunk = lines[1].split(": ")[1];

							try {
								const response = await fetch(
									`${process.env.REACT_APP_BACKEND_API}/${chunk}/${frame}`,
									{ method: "GET" }
								);
								if (response.ok) {
									const blob = await response.blob();
									const imageUrl = URL.createObjectURL(blob);
									setMessages((messages) => [
										{
											content: "Image from video:",
											author: "AI",
											image: imageUrl,
										},
										...messages,
									]);
								} else {
									console.error("Failed to fetch image");
								}
							} catch (error) {
								console.error("Error fetching image:", error);
							}
						} else {
							setMessages((messages) => [
								{
									content: trace.payload.message,
									author: "AI",
								},
								...messages,
							]);
						}
					}
				}
			}
		}
		launchChat();
	}, []);

	const sendMessage = async () => {
		setMessages((messages) => [
			{ content: messageInput, author: "User" },
			...messages,
		]);

		const prompt = messageInput;
		setMessageInput("");
		setIsLoading(true);
		const newTraces = await getResponse(prompt);
		setIsLoading(false);

		for (const trace of newTraces) {
			console.log(trace.payload.message);
			if (trace.type === "text") {
				if (trace.payload.message.includes("Chunk ID")) {
					const lines = trace.payload.message.split("\n");
					const frame = lines[0].split(": ")[1];
					const chunk = lines[1].split(": ")[1];

					try {
						const response = await fetch(
							`${process.env.REACT_APP_BACKEND_API}/${chunk}/${frame}`,
							{ method: "GET" }
						);
						if (response.ok) {
							const blob = await response.blob();
							const imageUrl = URL.createObjectURL(blob);
							setMessages((messages) => [
								{
									content: "Image from video:",
									author: "AI",
									image: imageUrl,
								},
								...messages,
							]);
						} else {
							console.error("Failed to fetch image");
						}
					} catch (error) {
						console.error("Error fetching image:", error);
					}
				} else {
					setMessages((messages) => [
						{
							content: trace.payload.message,
							author: "AI",
						},
						...messages,
					]);
				}
			}
		}
	};

	return (
		<main className="flex flex-col h-screen">
			{/* ... (header code remains the same) ... */}
			<div
				className="flex gap-y-10 px-5 overflow-auto pt-5 pb-10 flex-1 flex-col-reverse"
				ref={msgContainer}
			>
				{isLoading && <div className="loader"></div>}
				{messages.map((message, i) => (
					<div
						key={i}
						className={clsx(
							"p-5 rounded-3xl flex gap-x-5",
							message.author === "User"
								? "bg-[#4d3426] text-white flex-row-reverse"
								: "bg-[#e5deda] text-black",
							{
								"speech-bubble-right":
									message.author === "User" &&
									((i > 0 &&
										messages[i - 1].author === "AI") ||
										i === 0),
								"speech-bubble-left":
									message.author === "AI" &&
									((i > 0 &&
										messages[i - 1].author === "User") ||
										i === 0),
							}
						)}
					>
						{/* ... (avatar code remains the same) ... */}
						<div className="flex-1">
							<p className="text-base text-left font-normal">
								{message.content}
							</p>
							{message.image && (
								<img
									src={message.image}
									alt="Video frame"
									className="mt-2 max-w-full h-auto rounded"
								/>
							)}
						</div>
					</div>
				))}
			</div>
			<div className="bottom-0 w-screen pb-10 rounded-t-3xl flex px-5 items-center pt-2 shadow-gray-100 shadow-xl bg-white">
				<input
					type="text"
					placeholder="Type to start chatting..."
					className="h-12 mr-5 rounded-full bg-[#f6f3f2] flex-1 px-3"
					value={messageInput}
					onChange={(event) => setMessageInput(event.target.value)}
					onKeyDown={(event) => {
						if (event.code === "Enter") {
							sendMessage();
						}
					}}
				/>
				<button
					onClick={() => sendMessage()}
					className="bg-[#a0b16e] text-white rounded-full w-12 h-12 flex items-center justify-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="#FFF"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m7.49 12-3.75 3.75m0 0 3.75 3.75m-3.75-3.75h16.5V4.499"
						/>
					</svg>
				</button>
			</div>
		</main>
	);
}

export default Chat;
