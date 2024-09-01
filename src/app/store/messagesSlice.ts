import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: number;
}

interface MessagesState {
  messages: Message[];
}

const initialState: MessagesState = {
  messages: [],
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ user: string; text: string }>) => {
      state.messages.push({
        id: state.messages.length + 1,
        user: action.payload.user,
        text: action.payload.text,
        timestamp: Date.now(),
      });
    },
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;