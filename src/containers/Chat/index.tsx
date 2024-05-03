import { useState, useEffect, useCallback } from "react";
import ChatService from "@/services/chat";
import { Button, Input, DotLoading } from "antd-mobile";
import { useParams } from "react-router-dom";
import { useProductInfo } from "@/services/product";
import { LocationOutline, LinkOutline } from "antd-mobile-icons";
import { useUserContext } from "@/hooks/userHooks";
import ChatProductCard from "@/components/chatProductCard";
import { ChatRequest } from "@/services/chatApi";

import style from "./index.module.less";
import dayjs from "dayjs";

interface Message {
  messageId: string | undefined;
  sessionId: string;
  role: "customer" | "agent";
  type: "message" | "card";
  message: string;
  userId: string;
  data?: any;
  time?: string;
}

export const Chat = () => {
  const { id, productId } = useParams();
  const isAgent = false;
  const role = "customer";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatService, setChatService] = useState<ChatService | null>(null);
  const { data } = useProductInfo(productId || ""); // 查询商品的信息
  const { store } = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const studentId = store.id;

  const chatRequest = new ChatRequest(role, studentId);

  useEffect(() => {
    const fetchMessages = async () => {
      let organizationId: string;
      let sessionId: string | null = null;
      if (productId) {
        // 属于商品咨询
        organizationId = id!;
      } else {
        // 属于聊天列表
        sessionId = id!;
      }
      const chatService = new ChatService(
        isAgent,
        studentId,
        organizationId!,
        sessionId
      );
      setChatService(chatService);
        if (chatRequest && chatService) {
          setIsLoading(true);
          const res = await chatRequest.get_all_messages(
            chatService.getSessionId()
          );

          const transformedArray = res.map((item) => ({
            messageId: item.id,
            sessionId: item.sessionId,
            role: item.role,
            message: item.message,
            userId: item.senderId,
            data: item.data !== "null" ? JSON.parse(item.data) : undefined,
            time: dayjs(item.createdTime).format("YYYY-MM-DD HH:mm:ss"),
            type:
              item.type === "message" || item.type === "card"
                ? item.type
                : undefined,
          }));

          chatService!.setMessageList(transformedArray);
          setIsLoading(false);
        }
    };

    fetchMessages();

    return () => {
      if (chatService) {
        chatService.disconnect();
      }
    };
  }, []);


  const receiveMessage = useCallback(() => {
    
    console.log("轮询获取聊天记录");

    chatRequest.get_all_messages(chatService!.getSessionId()).then((res) => {
      console.log(res.map((item) => ({
          messageId: item.id,
          sessionId: item.sessionId,
          role: item.role,
          message: item.message,
          userId: item.senderId,
          type: item.type,
          data: item.data ? JSON.parse(item.data) : undefined,
        })))
      
      setMessages(
        res.map((item) => ({
          messageId: item.id,
          sessionId: item.sessionId,
          role: item.role,
          message: item.message,
          userId: item.senderId,
          type: item.type,
          data: item.data ? JSON.parse(item.data) : undefined,
        }
      ))
      );
    });
  }, [chatService, setMessages]);

  useEffect(() => {
    const timer = setInterval(() => {
      receiveMessage();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [receiveMessage]);

  // 发送信息的方法
  const sendMessage = () => {
    if (chatService && message) {
      // 封装好 message 发过去
      if (!chatService.getIsAgent()) {
        chatService.sendCustomerMessage(message, "message");
      } else {
        chatService.sendAgentMessage(message, "message");
      }
      if (chatService) {
        let lastMessage = chatService.getMessageList();
        let newMessageList;
        if (lastMessage.length != 0) {
          newMessageList = [...messages, lastMessage[-1]]
        }
      }
      receiveMessage();
      setMessage("");
    }
  };

  // 消息列表滚动到底部
  // useEffect(() => {
  //   const chatMessages = document.querySelector(`.${style.chatMessages}`);
  //   if (chatMessages) {
  //     chatMessages.scrollTop = chatMessages.scrollHeight;
  //   }
  // }, [messages]);

  const insertProductCard = () => {
    if (chatService) {
      // 设置 data
      chatService.setData(data);
      chatService.sendCustomerMessage("", "card");
      chatService.setData(null);
    }

    receiveMessage();
    setMessage("");
  };

  return (
    <div className={style.chatContainer}>
      {isLoading && <DotLoading />}
      <div className={style.chatMessages}>
        {messages.map((msg, index) => (
          <div key={index} className={style.messageWrapper}>
            {msg.type === "card" ? (
              <ChatProductCard data={msg.data} />
            ) : (
              <div
                className={
                  msg.role === "customer"
                    ? style.customerMessage
                    : style.agentMessage
                }
              >
                {msg.message}
                <div className={style.messageTime}>{msg.time}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={style.inputContainer}>
        {productId && (
          <Button size="small" onClick={() => insertProductCard()}>
            <LinkOutline />
          </Button>
        )}
        <Input
          className={style.inputComponent}
          value={message}
          onChange={(value) => setMessage(value)}
          placeholder="请输入消息..."
        />
        <Button
          className={style.sendMessageButton}
          onClick={sendMessage}
          color="primary"
          size="small"
        >
          <LocationOutline />
        </Button>
      </div>
    </div>
  );
};
