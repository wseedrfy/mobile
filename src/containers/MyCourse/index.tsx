/* eslint-disable */
import {
  Button,
  Card,
  DotLoading, Grid, Image, Modal, Space, Steps, Tag, Toast,
} from 'antd-mobile';
import { useCancelSubscribeCourse, useScheduleRecords } from '@/services/schedule';
import dayjs from 'dayjs';
import { DAY_FORMAT, SCHEDULE_STATUS } from '@/utils/constants';
import { useGoTo } from '@/hooks';
import { ROUTE_KEY } from '@/routes/menus';
import style from './index.module.less';
import { stringify } from 'querystring';

const { Step } = Steps;

/**
* 我的课程表
*/
const MyCourse = () => {
  const { data, loading, refetch } = useScheduleRecords();
  const { cancel, loading: cancelLoading } = useCancelSubscribeCourse();
  const { go } = useGoTo();

  console.log("data1111111",data);
  

  if (loading) {
    return <DotLoading />;
  }
  // 取消预约的课程，必须是未开始的课程才能取消
  const cancelSubscribeHandler = async (id: string) => {
    const result = await Modal.confirm({
      content: '确定要取消预约吗？一旦取消不能重复预约了！',
    });
    if (result) {
      const res = await cancel(id);
      if (res?.code === 200) {
        Toast.show({
          content: res.message,
        });
        refetch();
        return;
      }
      Toast.show({
        content: res?.message,
      });
    }
  };

  const goToComment = (id: string,item:any) => {
    console.log("id",id);
    console.log("item",item);
    
    // go(ROUTE_KEY.POST_COMMENT,{
    //   item:JSON.stringify(item)
    // })
    localStorage.setItem('courseImagePath', item.course.coverUrl);
    go(ROUTE_KEY.POST_COMMENT,{

      courseName:item.course.name,
      orgId:item.org.id,
      courseCoverUrl:"courseImagePath",

    })
  }

  return (
    <div className={style.container}>
      <Steps
        direction="vertical"
      >
        {data?.map((item) => (
          <Step
            key={item.id}
            icon={(
              <img
                src={item.org?.logo}
                alt="logo"
                className={style.logo}
                onClick={() => go(ROUTE_KEY.ORG_INFO, {
                  id: item.org.id,
                })}
              />
            )}
            title={(
              <Space justify="between" block>
                <span>
                  {dayjs(item.schedule.schoolDay).format(DAY_FORMAT)}
                &nbsp;
                  {item.schedule.startTime}
                  -
                  {item.schedule.endTime}
                </span>
                <Tag
                  color={SCHEDULE_STATUS[item.status][1]}
                >
                  {SCHEDULE_STATUS[item.status][2]}
                </Tag>
              </Space>
            )}
            description={(
              <Card>
                <Grid
                  columns={13}
                  gap={10}
                >
                  <Grid.Item span={4}>
                    <Image
                      src={item.course.coverUrl}
                      className={style.coverUrl}
                    />
                  </Grid.Item>
                  <Grid.Item span={6}>
                    <div className={style.name}>
                      {item.course.name}
                    </div>
                    <div className={style.teacher}>
                      老师：
                      {item.schedule.teacher?.name}
                    </div>
                  </Grid.Item>
                  <Grid.Item span={3}>
                    {SCHEDULE_STATUS.NO_DO[0] === item.status
                     ? (
                     <Button
                       fill="none"
                       color="primary"
                       loading={cancelLoading}
                       onClick={() => cancelSubscribeHandler(item.id)}
                     >
                       取消
                     </Button>
                     ):
                     (SCHEDULE_STATUS.FINISH[0] === item.status &&
                      <Button
                       fill="none"
                       color="primary"
                       loading={cancelLoading}
                       onClick={() => goToComment(item.id,item)}
                     >
                       去评价 
                     </Button>
                     )
                    }
                  </Grid.Item>
                </Grid>
              </Card>
            )}
          />
        ))}
      </Steps>
    </div>
  );
};

export default MyCourse;
