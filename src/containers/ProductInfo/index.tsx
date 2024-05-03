import { useParams } from 'react-router-dom';
import { useProductInfo } from '@/services/product';
import { TCourse } from '@/utils/types';
import { useMemo } from 'react';
import Hr from '@/components/Hr';
import { Grid, Result, Skeleton } from 'antd-mobile';
import style from './index.module.less';
import BaseInfo from './components/BaseInfo';
import CourseInfo from './components/CourseInfo';
import BuyBottom from './components/BuyBottom';
import { KoubeiFill, PlayOutline, RightOutline } from 'antd-mobile-icons';
import { useGoTo } from '@/hooks';
import { ROUTE_KEY } from '@/routes/menus';
import { T } from 'vitest/dist/types-2b1c412e';

/**
* 商品详情
*/
const ProductInfo = () => {
  const { id } = useParams();
  const { data } = useProductInfo(id || '');
  const { go } = useGoTo();
  
  const courses = useMemo(() => {
    const cs: Record<string, TCourse> = {};
    data?.cards?.forEach((item) => {
      cs[item.course.id] = {
        ...item.course,
        cardName: cs[item.course.id] ? (`${cs[item.course.id].cardName} / ${item.name}`) : item.name,
      };
    });
    return Object.values(cs);
  }, [data?.cards]);

  const lookComment = () =>{
    console.log("点击了");
    let orgId = String(data?.org.id)
    go(ROUTE_KEY.SHOW_COMMENT,{
      orgId:orgId
    })
  }

  console.log("data是",data);
  console.log("courses是",courses);

  if (!data) {
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
      <BaseInfo data={data} />
      <Hr />
       <Grid columns={1} gap={8} className={style.sale}>
         <Grid.Item onClick={()=>lookComment()}>
         <KoubeiFill />查看评分与评论<RightOutline />
         </Grid.Item>
       </Grid>
      <Hr />
      <CourseInfo data={courses} />
      <BuyBottom data={data} />
    </div>
  );
};

export default ProductInfo;
