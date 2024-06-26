import {
  GET_PRODUCT, GET_PRODUCTS, GET_PRODUCTS_BY_ORG_ID, GET_PRODUCT_TYPES,
} from '@/graphql/product';
import { DEFAULT_PAGE_SIZE, DEFAULT_TYPE } from '@/utils/constants';
import {
  IProduct, TProductQuery, TProductTypeQuery, TProductsQuery,
} from '@/utils/types';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Toast } from 'antd-mobile';
import { useEffect, useRef, useState } from 'react';

export const useProductTypes = () => {
  const { data, loading } = useQuery<TProductTypeQuery>(GET_PRODUCT_TYPES);

  return {
    data: data?.getProductTypes.data || [],
    loading,
  };
};

// 获取当前定位
export const getPosition = () => new Promise<{ latitude: number; longitude: number }>((r) => {
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    r({ latitude, longitude });
  }, () => {
    r({ latitude: 0, longitude: 0 });
  }, {
    timeout: 3000,
    maximumAge: 1000 * 60 * 30,
  });
});
/**
 * 获取商品列表
 * @param pageNum
 * @param pageSize
 * @param type
 */
export const useProducts = (
  name = '',
  type = '',
) => {
  const pn = useRef(1);
  const [hasMore, setHasMore] = useState(true);
  const [isloading, setIsloading] = useState(true);
  const [data, setData] = useState<IProduct[]>([]);
  const [get] = useLazyQuery<TProductsQuery>(GET_PRODUCTS);

  const init = async (pageNum = 1,toast:any) => {

    const {
      latitude,
      longitude,
    } = await getPosition();
    const res = await get({
      fetchPolicy: 'network-only',
      variables: {
        name,
        type: type === DEFAULT_TYPE ? '' : type,
        latitude,
        longitude,
        page: {
          pageNum,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      },
      onCompleted() {
        if (toast) {
          toast.close();
        }
      },
    });
    return res.data?.getProductsForH5.data || [];
  };

  const onRefreshHandler = async () => {
    const toast = Toast.show({
      icon: 'loading',
      content: '加载中…',
    });
    setIsloading(true)
    // 重新初始化设置
    pn.current = 1;
    const res = await init(1,toast);
    // 这里要提前对于更多值(hasMore)加一个判断，
    // 防止切换 type 的时候，hasMore 没有变成默认值
    if (res.length < DEFAULT_PAGE_SIZE) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    setData(res);
    setIsloading(false)
  };

  useEffect(() => {
    onRefreshHandler();
  }, [name, type]);

  const loadMoreHandler = async () => {
    const res = await init(pn.current + 1,null);
    if (res.length > 0) {
      pn.current += 1;
      setHasMore(true);
      setData((old) => [...old, ...res]);
    } else {
      setHasMore(false);
    }
  };

  return {
    onRefresh: onRefreshHandler,
    loadMore: loadMoreHandler,
    hasMore,
    data,
    isloading
  };
};

export const useProductsByOrgId = (orgId: string) => {
  const { data } = useQuery<TProductsQuery>(
    GET_PRODUCTS_BY_ORG_ID,
    {
      variables: {
        orgId,
      },
    },
  );

  return data?.getProductsByOrgIdForH5.data;
};

/**
 * 获取单个商品
 * @param id
 * @returns
 */
export const useProductInfo = (id?: string) => {
  const { data, loading } = useQuery<TProductQuery>(GET_PRODUCT, {
    variables: {
      id,
    },
  });

  return { data: data?.getProductInfo.data, loading };
};
