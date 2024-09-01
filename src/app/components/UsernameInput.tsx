import React, { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

interface UsernameInputProps {
  onUsernameConfirmed: (username: string, userId: number) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ onUsernameConfirmed }) => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

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
          onUsernameConfirmed(username.trim(), newUser.id);
        }
      }
    }
  };

  return (
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
  );
};

export default UsernameInput;