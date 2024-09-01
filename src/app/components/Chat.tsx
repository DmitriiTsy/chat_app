import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import ChatHistory from './ChatHistory';
import MessageInput from './MessageInput';
import UsernameInput from './UsernameInput';
import { Message } from '../components/types/Message';
import MessageItem from './messages/MessageItem';

const Chat: React.FC = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [isUsernameConfirmed, setIsUsernameConfirmed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchMessages();
    const channel = supabase.channel('public:messages');
  
    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) console.error('Error fetching messages:', error);
    else setMessages(data || []);
  };

  const handleUsernameConfirmed = (confirmedUsername: string, confirmedUserId: number) => {
    setUsername(confirmedUsername);
    setUserId(confirmedUserId);
    setIsUsernameConfirmed(true);
  };

  return (
    <div className="flex">
      <ChatHistory messages={messages} />
      <div className="w-3/4 flex flex-col">
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
        </div>
        <div className="p-4">
          {!isUsernameConfirmed ? (
            <UsernameInput onUsernameConfirmed={handleUsernameConfirmed} />
          ) : (
            <MessageInput username={username} userId={userId} onMessageSent={fetchMessages} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;