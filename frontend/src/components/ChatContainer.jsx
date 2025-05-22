import React from 'react'
import { useChatStore } from "../store/useChatStore";
import { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';

const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading,selectedUser} = useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  if (isMessagesLoading) return <div>Loading... </div>

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <p>messages ...</p>

      <MessageInput />

      
    </div>
  )
}

export default ChatContainer
