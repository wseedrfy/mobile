import { useProducts } from '@/services/product';
import {
  ErrorBlock, Grid, InfiniteScroll, PullToRefresh,
  Skeleton,
} from 'antd-mobile';
import { useGoTo } from '@/hooks';
import { ROUTE_KEY } from '@/routes/menus';
import ProductCard from '../ProductCard';
import style from './index.module.less';

interface IProps {
  name: string; // 搜索的关键字
  type: string; // 商品分类
}

/**
* 商品列表
*/
const ProductList = ({
  name,
  type,
}: IProps) => {
  const {
    data, onRefresh, hasMore, loadMore,isloading
  } = useProducts(name, type);
  const { go } = useGoTo();
  if (data && data.length === 0) {
    return <ErrorBlock status="empty" />;
  }
  const goProductInfo = (id: string) => {
    go(ROUTE_KEY.PRODUCT_INFO, { id });
  };
  if (isloading) {
    return (
    <div>
      <Skeleton.Title animated />
      <Skeleton.Paragraph lineCount={1} animated />
      <Skeleton.Title animated />
      <Skeleton.Paragraph lineCount={15} animated />
    </div>
    );
  }
  return (
    <div className={style.container}>
      <PullToRefresh onRefresh={onRefresh}>
        <Grid columns={2} gap={10}>
          {
        data?.map((item) => (
          <Grid.Item key={item.id} onClick={() => goProductInfo(item.id)}>
            <ProductCard data={item} />
          </Grid.Item>
        ))
      }
        </Grid>
      </PullToRefresh>
      <InfiniteScroll hasMore={hasMore} loadMore={loadMore} />
    </div>
  );
};

export default ProductList;
