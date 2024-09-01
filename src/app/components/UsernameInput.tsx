import React, { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { InputInfo, InputType } from './types/Message';

interface UsernameInputProps {
  onUsernameConfirmed: (username: string, userId: number) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ onUsernameConfirmed }) => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const handleConfirmUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {

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
        type={InputType.TEXT}
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
        {InputInfo.SUBMIT}
      </button>
    </form>
  );
};

export default UsernameInput;