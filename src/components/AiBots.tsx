import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message as ChatMessage,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import HighlightOffRoundedIcon from "../assets/icon-nav-home.svg";

interface IMessage {
  message: string;
  sender: "user" | "ChatGPT";
  direction?: "incoming" | "outgoing";
}

interface AiBotProps {
  onClose: () => void;
}

const AiBotUrl = process.env.REACT_APP_AIBOT_API_KEY;

const systemMessage = {
  role: "system",
  content: "Explain things like you're talking to a warm and flirty finance consultant with 10 years of experience.",
};

const AiBot = ({ onClose }: AiBotProps) => {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      message: "Hello! Ask me anything, I’m your personal finance buddy! 💖",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message: string) => {
    if (!message.trim()) return; // Prevent empty messages

    const newMessage: IMessage = { message, sender: "user", direction: "outgoing" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    await processMessageToChatGPT([...messages, newMessage]);
  };

  async function processMessageToChatGPT(chatMessages: IMessage[]) {
    let apiMessages = chatMessages.map((msg) => ({
      role: msg.sender === "ChatGPT" ? "assistant" : "user",
      content: msg.message,
    }));

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    try {
      if (!AiBotUrl) {
        throw new Error("Missing OpenAI API key! Check your environment variables.");
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AiBotUrl}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging log

      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Invalid response from OpenAI API");
      }

      const botResponse: IMessage = {
        message: data.choices[0].message.content,
        sender: "ChatGPT",
        direction: "incoming",
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: "Oops! Something went wrong. Try again. 🤖", sender: "ChatGPT", direction: "incoming" },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="relative p-4 bg-white shadow-lg rounded-xl w-[500px] h-[550px] border border-gray-300">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-2 text-gray-700 hover:text-red-500 transition"
        aria-label="Close"
      >
        <img src={HighlightOffRoundedIcon} alt="Close" className="w-6 h-6" />
      </button>

      {/* Chat UI */}
      <div className="relative h-[480px] w-full rounded-lg overflow-hidden">
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="Your finance buddy is typing... 💬" /> : null}
              className="p-4"
            >
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  model={{
                    message: message.message,
                    direction: message.direction!,
                    position: "single",
                  }}
                />
              ))}
            </MessageList>

            {/* Message Input */}
            <MessageInput
              placeholder="Type your message here..."
              onSend={handleSend}
              className="rounded-lg border-gray-300 focus:border-blue-500"
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};

export default AiBot;
