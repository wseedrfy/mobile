import { IProduct } from '@/utils/types';
import { Grid } from 'antd-mobile';
import { TeamFill } from 'antd-mobile-icons';
import { useGoTo } from '@/hooks';
import { ROUTE_KEY } from '@/routes/menus';
import style from "./index.module.less";

interface IProps {
  data: IProduct
}
/**
*  购买课程工具bar
*/
const BuyBottom = ({
  data,
}: IProps) => {
  const { go } = useGoTo();
  const goBuy = () => {
    go(ROUTE_KEY.BUY, {
      id: data.id,
    });
  };
  const goChat = () => {
    // 这个地方跳过去是携带商品信息的
    go(ROUTE_KEY.CHAT_PRODUCT, {
      id: data.org.id,
      productId: data.id
    })
  }

  return (
    <>
      <Grid columns={10} className={style.container}>
        <Grid.Item span={4}>
          <span className={style.preferentialPrice}>
            ￥{data.preferentialPrice}
          </span>
          <span className={style.originalPrice}>￥{data.originalPrice}</span>
        </Grid.Item>
        <Grid.Item span={2}>
          <div onClick={() => goChat()}>
            <TeamFill className={style.tel} />
          </div>
        </Grid.Item>
        <Grid.Item span={4} className={style.buyButton} onClick={goBuy}>
          立即抢购
        </Grid.Item>
      </Grid>
    </>
  );
};

export default BuyBottom;
