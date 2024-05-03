/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Rate, Space, Toast , Card, Button, TextArea  } from 'antd-mobile'
import { SmileOutline } from 'antd-mobile-icons'
import { AntOutline, RightOutline } from 'antd-mobile-icons'
import styles from './index.module.less'
import { useUserContext } from '@/hooks/userHooks'
import { useParams } from 'react-router-dom'
import { useCreateComment } from '@/services/comment'
import { v4 as uuidv4 } from "uuid";
import { useGoTo } from '@/hooks'
/**
* 提交评价
*/
const PostComment = (prop:any) => {
  const {  courseCoverUrl,courseName,orgId } = useParams();
  const courseCoverPath  = localStorage.getItem(String(courseCoverUrl));
  const { store } = useUserContext();
  const [ value, setValue] = useState('')
  const [ score, setScore ] = useState(0)
  const { back } = useGoTo();

  console.log("1234",courseCoverUrl,courseName,orgId,courseCoverPath);
  console.log("学生id",store.id);
  console.log("学生头像",store.avatar);
  console.log("学生姓名",store.name);


  useEffect(()=>{

  },[])

  const onClick = () => {
    Toast.show('点击了卡片')
  }

  const onHeaderClick = () => {
    Toast.show('点击了卡片Header区域')
  }

  const onBodyClick = () => {
    Toast.show('点击了卡片Body区域')
  }

  const onChangeRate = (val:any) =>{
    setScore(val.toString())
  }

  const onChangeComment = (val:any) =>{
    setValue(val)
  }

  const [edit, editLoading] = useCreateComment();

  const createCallback = (createState:any)=>{
    console.log("createState",createState);
    if (createState) {
      Toast.show({
        icon: 'success',
        content: '评价成功',
      })
      back()
    }else{
      Toast.show({
        icon: 'fail',
        content: '评价失败',
      })
    }
  }

  const onSubmit = () =>{
    console.log("111时间",new Date().toString());
    
    if (score == 0){
      Toast.show('请点击评分')
    }else if(value == ''){
      Toast.show('请完成评论')
    }else{
      const values = {
        score:score,
        comment:value
      }
      if (values) {
        const newValues = {
          ...values,
          id:uuidv4().toString(),
          courseName:courseName,
          courseCoverUrl:courseCoverPath,
          orgId:orgId,
          createDate:new Date().toString(),
          studentId:store.id,
          studentName:store.name||'小明'
        };
        edit(newValues,createCallback);
        
      }
    }
  }
  return (
    <div>
        <Card
          title={
            <div style={{ fontWeight: 'normal' }}>
              <AntOutline style={{ marginRight: '4px', color: '#1677ff' }} />
              {courseName}
            </div>
          } 
          onBodyClick={onBodyClick}
          onHeaderClick={onHeaderClick}
          style={{ borderRadius: '10px' }}
        >
          <div className={styles.content} onClick={ e => e.stopPropagation()}>

            <Rate style={{  "--star-size" : '30px' }} onChange={val => { 

              onChangeRate(val)} 
            } />

          </div>

        </Card>
        <Card
          title={
            <div style={{ fontWeight: 'normal' }}>
              <AntOutline style={{ marginRight: '4px', color: '#1677ff' }} />
              请输入文字评价
            </div>
          } 
          onBodyClick={onBodyClick}
          onHeaderClick={onHeaderClick}
          style={{ borderRadius: '10px',height:'80vh' }}
        >
          <div className={styles.content} onClick={ e => e.stopPropagation()}>
            <TextArea
              rows={15}
              placeholder='请输入内容'
              value={value}
              onChange={val => onChangeComment(val)}
            />
            <Button
              style={{width:"90vw"}}
              color='primary'
              onClick={() => {
                onSubmit()
              }}
            >
              提交
            </Button>
          </div>

        </Card>
    </div>
  );
};

export default PostComment;
