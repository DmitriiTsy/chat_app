import React, { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { InputInfo, InputType } from './types/Message';

interface MessageInputProps {
  username: string;
  userId: number | null;
  onMessageSent: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ username, userId, onMessageSent }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && userId) {
      const { error } = await supabase
        .from('messages')
        .insert({ 
          user_id: userId,
          username: username,
          text: message 
        });
      if (error) console.error('Error sending message:', error);
      else {
        setMessage('');
        onMessageSent();
      }
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex">
      <input
        type={InputType.TEXT}
        placeholder="Type your message"
        className="flex-grow p-2 mr-2 border rounded text-black"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {InputInfo.SEND}
      </button>
    </form>
  );
};

export default MessageInput;