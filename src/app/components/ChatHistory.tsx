import React, { useState } from 'react';
import { Message } from '../components/types/Message';

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const [isChatHistoryVisible, setIsChatHistoryVisible] = useState(false);

  return (
    <div className={`bg-gray-400 p-4 overflow-y-auto transition-all duration-300 rounded-xl`}>
      <h2 className="text-xl font-bold mb-4">Chat History
        <button
          onClick={() => setIsChatHistoryVisible(!isChatHistoryVisible)}
          className="text-sm bg-blue-500 text-white px-2 py-1 rounded ml-2"
        >
          {isChatHistoryVisible ? 'Hide' : 'Show'}
        </button>
      </h2>
      {isChatHistoryVisible && (
        <div>
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <span className="font-bold">{msg.username}: </span>
              {msg.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;