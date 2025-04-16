import React from "react";

const ChatWithSeller = () => {
  return (
    <div className="flex flex-col w-full bg-gray-100 p-6 rounded-lg shadow-lg mb-6 md:mb-0">
      <div className="items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-center">Chat with Seller</h2>
      </div>
      <div className="h-[300px] md:h-[400px] bg-slate-300 rounded-lg mb-4 flex items-center justify-center">
        "Chat Area"
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWithSeller;
