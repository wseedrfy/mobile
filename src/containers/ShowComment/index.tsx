/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Rate, Space, Toast , Card, Button, TextArea, Skeleton, List ,Image } from 'antd-mobile'
import { SmileOutline } from 'antd-mobile-icons'
import { AntOutline, RightOutline } from 'antd-mobile-icons'
import styles from './index.module.less'
import { useUserContext } from '@/hooks/userHooks'
import { useParams } from 'react-router-dom'
import { useCreateComment, useGetComment } from '@/services/comment'
import { v4 as uuidv4 } from "uuid";
import { useGoTo } from '@/hooks'
/**
* 渲染评论列表
*/
const ShowComment = (prop:any) => {
  const { orgId } = useParams();
  const { back } = useGoTo();
  const { loading,data,averageScore } = useGetComment(String(orgId))
  console.log("data",data);

  const changeTime = (e:any)=>{
    let a = new Date(e).toISOString().slice(0, 10)
    console.log(a,"a");
    
    return "1"
  }

  const change = (e:any)=>{
    let date = new Date(e)
    let noDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
    console.log(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),"a");

    return noDate
  }

  return (
    <div>
        {
          loading?
          <div>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={1} animated />
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={15} animated />
          </div>:
          (
          <div>
            <Card
              title={
                <div style={{ fontWeight: 'normal' }}>
                  <AntOutline style={{ marginRight: '4px', color: '#1677ff' }} />
                  平均评分 {averageScore} 分
                </div>
              } 
              style={{ borderRadius: '10px' }}
            >
              <div className={styles.content} onClick={ e => e.stopPropagation()}>
                <Rate allowHalf readOnly value={averageScore} style={{  "--star-size" : '30px' }}/>
              </div>

            </Card>
            <div>
              <List header='评分列表'>
                {data?.map(item => (
                  <List.Item
                    key={item.id}
                    description={
                      <div style={{'marginTop':'10px'}}>
                        {item.comment}
                      </div>
                    }
                    title={
                      <div className='bigBox'>

                        <div className='bigBox_box' style={{"display":"flex","flexDirection":'row'}}>
                          <div className='bImageigBox_box_left'><Image fit='cover' width={40} height={40} style={{ borderRadius: 5 }} src={item.courseCoverUrl}/></div>
                          <div className='bigBox_box_right' style={{"marginLeft":'10px','display':"flex","alignItems":'center','justifyContent':'center'}}>
                            <div className='bigBox_box_right_top'>{item.courseName}</div>
                          </div>
                        </div>

                        <div className='bigBox_box' style={{"display":"flex","flexDirection":'row',"marginTop":"10px"}}>
                          <div className='bImageigBox_box_left' style={{'display':"flex","alignItems":'center','justifyContent':'center'}}><Image fit='cover' width={22} height={22} style={{ borderRadius: 20 }} src={item.courseCoverUrl}/></div>
                          <div className='bigBox_box_right' style={{"marginLeft":'10px'}}>
                            <div className='bigBox_box_right_top' style={{"fontSize":'12px','display':"flex","alignItems":'center',}}>{item.studentName}</div>
                            <div className='bigBox_box_right_bottom' style={{'display':"flex","alignItems":'center'}}>
                              <Rate allowHalf readOnly value={Number(item.score)} style={{  "--star-size" : '8px' }}/>
                            </div>
                          </div>
                        </div>


                      <div>
                
                      </div>
                    </div>
                    }
                    extra={
                      <div>{change(item.createDate)=='NaN/NaN/NaN'?"2024/5/1":change(item.createDate)}</div>
                    }
                  >

                  </List.Item>
                ))}
              </List>
            </div>
          </div>
          )
        }


    </div>
  );
};

export default ShowComment;
