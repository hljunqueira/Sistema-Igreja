const io = require("socket.io");

class ChatService {
  constructor(server) {
    this.io = io(server);
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      socket.on("join-room", (roomId) => {
        socket.join(roomId);
      });

      socket.on("message", async (data) => {
        const { roomId, message, userId } = data;
        await this.saveMessage(roomId, message, userId);
        this.io.to(roomId).emit("new-message", {
          message,
          userId,
          timestamp: new Date(),
        });
      });
    });
  }

  async saveMessage(roomId, message, userId) {
    // Salvar mensagem no banco de dados
  }
}

// frontend/src/components/Chat.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const Chat = ({ roomId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL);
    setSocket(newSocket);

    newSocket.emit("join-room", roomId);

    newSocket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.close();
  }, [roomId]);

  const handleSendMessage = async (message) => {
    try {
      await socket.emit("message", {
        roomId,
        message,
        userId,
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span className="username">{message.userId}</span>
            <span className="message-text">{message.message}</span>
            <span className="timestamp">{message.timestamp}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(message);
          }
        }}
      />
    </div>
  );
};
