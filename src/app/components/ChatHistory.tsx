import React, { useState } from 'react';
import { Message } from '../components/types/Message';
import MessageItem from './messages/MessageItem';

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
            <MessageItem key={msg.id} message={msg} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;