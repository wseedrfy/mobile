/* eslint-disable */
import Home from '@/containers/Home';
import My from '@/containers/My';
import OrgInfo from '@/containers/OrgInfo';
import ProductInfo from '@/containers/ProductInfo';
import Buy from '@/containers/Buy';
import EditInfo from '@/containers/EditInfo';
import OrderCourse from '@/containers/OrderCourse';
import MyCard from '@/containers/MyCard';
import MyCourse from '@/containers/MyCourse';
import { ROUTE_KEY } from './menus';
import { Chat } from '@/containers/Chat';
import { ChatList } from '@/containers/ChatList';
import PostComment from '@/containers/PostComment';
import ShowComment from '@/containers/ShowComment';


export const ROUTE_COMPONENT = {
  [ROUTE_KEY.HOME]: Home,
  [ROUTE_KEY.MY]: My,
  [ROUTE_KEY.ORG_INFO]: OrgInfo,
  [ROUTE_KEY.PRODUCT_INFO]: ProductInfo,
  [ROUTE_KEY.BUY]: Buy,
  [ROUTE_KEY.EDIT_INFO]: EditInfo,
  [ROUTE_KEY.ORDER_COURSE]: OrderCourse,
  [ROUTE_KEY.MY_CARD]: MyCard,
  [ROUTE_KEY.MY_COURSE]: MyCourse,
  [ROUTE_KEY.CHAT]: Chat,
  [ROUTE_KEY.CHAT_LIST]: ChatList,
  [ROUTE_KEY.CHAT_PRODUCT]: Chat,
  [ROUTE_KEY.POST_COMMENT]: PostComment,
  [ROUTE_KEY.SHOW_COMMENT]: ShowComment
};
