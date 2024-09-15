import clsx from 'clsx';
import React, { useState } from 'react';

function Home() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <main>
      <div className="bg-[#4e3422] pt-20 pb-16">
        <div className="px-8 flex gap-x-5 items-center">
          <div className="rounded-full bg-[#d9d9d9] w-16 h-16"></div>
          <div className="text-white">
            <h1 className="text-4xl mb-1">Hi, !</h1>
            <div className="flex items-center gap-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 73 73" fill="none">
                <path d="M36.5 44.6765C44.232 44.6765 50.5 50.9445 50.5 58.6765V58.6765C50.5 66.4084 44.232 72.6765 36.5 72.6765V72.6765C28.768 72.6765 22.5 66.4084 22.5 58.6765V58.6765C22.5 50.9445 28.768 44.6765 36.5 44.6765V44.6765Z" fill="#f67d09"/>
                <path d="M14.5 22.6765C22.232 22.6765 28.5 28.9445 28.5 36.6765V36.6765C28.5 44.4084 22.232 50.6765 14.5 50.6765V50.6765C6.76801 50.6765 0.5 44.4084 0.5 36.6765V36.6765C0.5 28.9445 6.76801 22.6765 14.5 22.6765V22.6765Z" fill="#f67d09"/>
                <path d="M36.5 0.676453C44.232 0.676453 50.5 6.94447 50.5 14.6765V14.6765C50.5 22.4084 44.232 28.6765 36.5 28.6765V28.6765C28.768 28.6765 22.5 22.4084 22.5 14.6765V14.6765C22.5 6.94447 28.768 0.676453 36.5 0.676453V0.676453Z" fill="#f67d09"/>
                <path d="M58.5 22.6765C66.232 22.6765 72.5 28.9445 72.5 36.6765V36.6765C72.5 44.4084 66.232 50.6765 58.5 50.6765V50.6765C50.768 50.6765 44.5 44.4084 44.5 36.6765V36.6765C44.5 28.9445 50.768 22.6765 58.5 22.6765V22.6765Z" fill="#f67d09"/>
              </svg>
              <p className="text-base">56 items found</p>
            </div>
          </div>
        </div>
        <div className="relative mx-2 mt-6">
          <input type="text" className={clsx("w-full h-14 px-5", isFocused ? "rounded-t-[28px]" : "rounded-full")} placeholder="What are we finding today?" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
          <ul className={clsx("bg-white absolute top-full w-full shadow-xl rounded-b-3xl", isFocused ? "border-t" : "hidden")}>
            <li className="flex gap-x-5 p-4 items-center">
              <div className="rounded-full bg-[#eadeff] w-10 h-10 justify-center items-center flex">A</div>
              <div>
                <p className="font-normal text-lg text-left">List item</p>
                <p className="font-normal text-base text-left">Lorem ipsum...</p>
              </div>
            </li>
            <li className="flex gap-x-5 p-4 items-center">
              <div className="rounded-full bg-[#eadeff] w-10 h-10 justify-center items-center flex">A</div>
              <div>
                <p className="font-normal text-lg text-left">List item</p>
                <p className="font-normal text-base text-left">Lorem ipsum...</p>
              </div>
            </li>
            <li className="flex gap-x-5 p-4 items-center">
              <div className="rounded-full bg-[#eadeff] w-10 h-10 justify-center items-center flex">A</div>
              <div>
                <p className="font-normal text-lg text-left">List item</p>
                <p className="font-normal text-base text-left">Lorem ipsum...</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="px-3 pt-2">
        <h5 className="text-3xl font-bold">Recent Finds</h5>
        <ul className="overflow-x-auto overflow-y-hidden whitespace-nowrap w-full mt-4">
          <li className="w-52 h-64 bg-[#d9d9d9] rounded-3xl mr-3 inline-block"></li>
          <li className="w-52 h-64 bg-[#d9d9d9] rounded-3xl mr-3 inline-block"></li>
          <li className="w-52 h-64 bg-[#d9d9d9] rounded-3xl mr-3 inline-block"></li>
        </ul>
      </div>
    </main>
  );
}

export default Home;