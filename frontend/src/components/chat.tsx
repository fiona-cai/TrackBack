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

	const updateHistory = (newItem: string) => {
		const storedHistory = localStorage.getItem('history');
		if (storedHistory === null) {
			localStorage.setItem('history', JSON.stringify([newItem]));
		} else {
			localStorage.setItem('history', JSON.stringify([...JSON.parse(storedHistory), newItem]));
		}
	};

	useEffect(() => {
		async function launchChat() {
			await launch();
			const initialMsg = searchParams.get("initialMsg");
			if (initialMsg) {
				updateHistory(initialMsg);
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
			} else if (trace.type === 'end') {
				setTimeout(() => window.location.replace('../home'), 1000);
			}
		}
	};

	return (
		<main className="flex flex-col h-screen">
			<div className="shadow-xl pt-5 rounded-b-3xl flex flex-row items-center px-5 pb-3 gap-x-3">
				<a className="rounded-full border border-[#efe8e6] w-12 h-12 flex justify-center items-center" href="/home">
					&lt;
				</a>
				<div>
					<h2 className="text-xl font-bold">{searchParams.get('initialMsg') ? searchParams.get('initialMsg') : 'New Chat'}</h2>
					<p className="text-base text-left font-normal">{new Date().toDateString()}</p>
				</div>
			</div>
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
						<div className={clsx("w-12 h-12 rounded-full flex justify-center items-center", message.author === "User" ? "bg-[#694a35]" : "bg-[#f6f3f2]")}>
							{
								message.author === "User" ? (
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
										<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 73 73" fill="none">
										<path d="M36.5 44.6765C44.232 44.6765 50.5 50.9445 50.5 58.6765V58.6765C50.5 66.4084 44.232 72.6765 36.5 72.6765V72.6765C28.768 72.6765 22.5 66.4084 22.5 58.6765V58.6765C22.5 50.9445 28.768 44.6765 36.5 44.6765V44.6765Z" fill="#926247"/>
										<path d="M14.5 22.6765C22.232 22.6765 28.5 28.9445 28.5 36.6765V36.6765C28.5 44.4084 22.232 50.6765 14.5 50.6765V50.6765C6.76801 50.6765 0.5 44.4084 0.5 36.6765V36.6765C0.5 28.9445 6.76801 22.6765 14.5 22.6765V22.6765Z" fill="#926247"/>
										<path d="M36.5 0.676453C44.232 0.676453 50.5 6.94447 50.5 14.6765V14.6765C50.5 22.4084 44.232 28.6765 36.5 28.6765V28.6765C28.768 28.6765 22.5 22.4084 22.5 14.6765V14.6765C22.5 6.94447 28.768 0.676453 36.5 0.676453V0.676453Z" fill="#926247"/>
										<path d="M58.5 22.6765C66.232 22.6765 72.5 28.9445 72.5 36.6765V36.6765C72.5 44.4084 66.232 50.6765 58.5 50.6765V50.6765C50.768 50.6765 44.5 44.4084 44.5 36.6765V36.6765C44.5 28.9445 50.768 22.6765 58.5 22.6765V22.6765Z" fill="#926247"/>
									</svg>
								)
							}
						</div>
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
