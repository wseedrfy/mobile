import { v4 as uuidv4 } from "uuid";
import { io, Socket } from "socket.io-client";


interface IMessage {
  messageId: string;
  sessionId: string;
  role: "customer" | "agent";
  message: string;
  userId: string;
  data?: any;
  time?: string;
  type?: "message" | "card";
}


interface StartSessionResp {
  status: "success" | "error";
  message: string;
  data: {
    sessionId: string
  }
}
export default class ChatService {
  private socket: Socket;
  private sessionId: string;
  private isAgent: boolean;
  private messageList: IMessage[] = [];
  private userId: string;
  private organizationId: string;
  private data: any = null;


  constructor(
    isAgent: boolean,
    userId: string,
    organizationId: string,
    sessionId: string | null
  ) {
  
    if (sessionId) {
      this.sessionId = sessionId;
    } else {
      this.sessionId = uuidv4().toString();
    }

    this.isAgent = isAgent;
    this.userId = userId;
    this.organizationId = organizationId;
    this.socket = io("http://localhost:4000");
    this.bindEvents();
  }

  private messageLocks: string[] = [];

  public getIsAgent() {
    return this.isAgent;
  }

  public getSessionId() {
    return this.sessionId;
  }

  private setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  public setMessageList(message: IMessage[]) {
    this.messageList = message;
  }

  public getMessageList(): IMessage[] {  
    console.log(this.messageList[-1],'new');
    
    return this.messageList;
  }

  public setData(data: any) {
    this.data = data;
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public bindEvents() {
    this.socket.on("connect", () => {
      console.log("连接到了服务器");
      this.startSession();
    });
    this.socket.on("disconnect", () => {
      console.log("断开了连接");
      this.startSession();
    });
    this.socket.on("sessionStarted", (data: any) => {
      console.log("Session started:", data);
      console.log(data);
    });

    this.socket.on("agentMessage", (message: IMessage) => {
      console.log("收到对方信息:", message);
      if (this.messageLocks.includes(message.messageId)) {
        console.log(121312);

        return;
      }
      // this.messageList.push(message);

    });

    this.socket.on("customerMessage", (message: IMessage) => {
      console.log("收到对方信息:", message);
      if (this.messageLocks.includes(message.messageId)) {
        return;
      }
      // this.messageList.push(message);
      console.log(this.messageList);
    });
  }

  private getMessageBody(message: string): IMessage {
    return {
      messageId: uuidv4().toString(),
      sessionId: this.sessionId,
      message: message,
      role: this.isAgent ? "agent" : "customer",
      time: new Date().toLocaleTimeString(),
      data: null,
      userId: this.userId,
      type: "message",
    };
  }

  private getCardMessageBody(): IMessage {
    return {
      messageId: uuidv4().toString(),
      sessionId: this.sessionId,
      message: "",
      role: this.isAgent ? "agent" : "customer",
      time: new Date().toLocaleTimeString(),
      data: this.data,
      userId: this.userId,
      type: "card",
    };
  }

  private startSession() {
    console.log({
      sessionId: this.sessionId,
      isAgent: this.isAgent,
      userId: this.userId,
      organizationId: this.organizationId,
    },"startSession11111");
    
    this.socket.emit(
      "startSession",
      {
        sessionId: this.sessionId,
        isAgent: this.isAgent,
        userId: this.userId,
        organizationId: this.organizationId,
      },
      (response: StartSessionResp) => {
        if (response.status === "error") {
          console.error(response.message);
        } else {
          // 设置返回的 sessionId
          if (response.data.sessionId){
            this.setSessionId(response.data.sessionId);
            console.log("Session started:", response.data.sessionId);
          }
        }
      }
    );
  }

  public sendCustomerMessage(message: string, type: "card" | "message") {
    console.log("调用");

    if (this.isAgent) {
      throw new Error("Agent cannot send customer messages");
    }
    // 封装
    let messageBody: IMessage;
    if (type === "card") {
      messageBody = this.getCardMessageBody();
    } else {
      messageBody = this.getMessageBody(message);
    }
    this.messageList.push(messageBody);
    this.socket.emit("customerMessage", messageBody, (response: any) => {
      if (response.status === "error") {
        console.error(response.message);
        // 处理发送消息失败的逻辑
      } else {
        console.log(response.message);
      }
    });
  }

  public sendAgentMessage(message: string, type: "card" | "message") {
    if (!this.isAgent) {
      throw new Error("Customer cannot send agent messages");
    }
    // 封装
    let messageBody: IMessage;
    if (type === "card") {
      messageBody = this.getCardMessageBody();
    } else {
      messageBody = this.getMessageBody(message);
    }
    this.messageList.push(messageBody);
    this.socket.emit("agentMessage", messageBody, (response: any) => {
      if (response.status === "error") {
        console.error(response.message);
        // 处理发送消息失败的逻辑
      } else {
        console.log(response.message);
      }
    });
  }
}
