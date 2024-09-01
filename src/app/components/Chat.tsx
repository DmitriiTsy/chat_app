import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';

interface Message {
  id: number;
  created_at: string;
  user_id: number;
  username: string;
  text: string;
}

const Chat: React.FC = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isUsernameConfirmed, setIsUsernameConfirmed] = useState(false);
  const [isChatHistoryVisible, setIsChatHistoryVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [usernameError, setUsernameError] = useState('');

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

  const handleConfirmUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Check if username exists
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('username', username.trim())
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking username:', error);
        setUsernameError('An error occurred. Please try again.');
      } else if (data) {
        setUsernameError('This nickname is already taken. Please choose another one.');
      } else {
        // Username is available, create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({ username: username.trim() })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          setUsernameError('An error occurred while creating your user. Please try again.');
        } else {
          setIsUsernameConfirmed(true);
          setUsernameError('');
          setUserId(newUser.id);
        }
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUsernameConfirmed && message.trim() && userId) {
      const { error } = await supabase
        .from('messages')
        .insert({ 
          user_id: userId,
          username: username,
          text: message 
        });
      if (error) console.error('Error sending message:', error);
      else setMessage('');
      fetchMessages()
    }
  };

  return (
    <div className="flex">
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
      <div className="w-3/4 flex flex-col">
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <span className="font-bold">{msg.username}: </span>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="p-4">
          {!isUsernameConfirmed ? (
            <form onSubmit={handleConfirmUsername} className="flex flex-col">
              <input
                type="text"
                placeholder="Enter your nickname"
                className="flex-grow p-2 mb-2 border rounded text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && (
                <p className="text-red-500 mb-2">{usernameError}</p>
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                placeholder="Type your message"
                className="flex-grow p-2 mr-2 border rounded text-black"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;