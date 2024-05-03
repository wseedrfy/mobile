import { List, Image } from "antd-mobile";
import style from "./index.module.less";
import { ChatRequest, Session } from "@/services/chatApi";
import { useEffect, useState } from "react";
import { useUserContext } from "@/hooks/userHooks";
import dayjs from "dayjs";
import { useGoTo } from "@/hooks";
import { ROUTE_KEY } from "@/routes/menus";

export const ChatList = () => {
  const { go } = useGoTo();
  const { store } = useUserContext();
  const userId = store.id;
  const [chatRequest, setChatRequest] = useState<ChatRequest | null>(null);
  const [chatList, setChatList] = useState<any>([]);
  const role = "customer";

  // 从服务器获取所有的信息
  useEffect(() => {
    const chatRequest: ChatRequest = new ChatRequest(role, userId);
    chatRequest.get_all_sessions().then((res) => setChatList(res));
    setChatRequest(chatRequest);
  }, []);

  console.log(chatList, "123");

  const formatTime = (time: string) => {
    return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
  };

  const getMessages = (sessionId: string) => {
    go(ROUTE_KEY.CHAT, { id: sessionId });
  };

  return (
    <div className={style.chatListContainer}>
      <List header="聊天列表">
        {chatList.map((item: Session) => (
          <List.Item
            key={item.id}
            prefix={
              <Image
                src={item.logo}
                style={{ borderRadius: 20 }}
                fit="cover"
                width={40}
                height={40}
              />
            }
            description={formatTime(item.createdTime)}
            clickable
            onClick={() => getMessages(item.id)}
          >
            {item.name}
          </List.Item>
        ))}
      </List>
    </div>
  );
};
