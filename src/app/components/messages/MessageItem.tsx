import React from 'react';
import { Message } from '../types/Message';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div className="mb-2">
      <span className="font-bold">{message.username}: </span>
      {message.text}
    </div>
  );
};

export default MessageItem;