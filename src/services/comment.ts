import { GET_CARDS, GET_USE_CARDS } from '@/graphql/card';
import { CREATE_COMMENT, GET_COMMENT_BYORGID } from '@/graphql/comment';
import { TBaseComment, TCardRecordsQuery, TCommentsQuery } from '@/utils/types';
import { useMutation, useQuery } from '@apollo/client';

/**
 *  获取当前机构的评论
 */
export const useGetComment = (orgId:string) => {
  const { loading, data } = useQuery<TCommentsQuery>(GET_COMMENT_BYORGID, {
    variables: {
      page: {
        pageSize: 100,
        pageNum: 1,
      },
      orgId: orgId
    },
  });
  let averageScore = 0
  if (data) {
    console.log("数据",data);
    let sum  = 0
    for (let i = 0; i < data?.getCommentsByOrgId.data.length; i++) {
      const score = Number(data?.getCommentsByOrgId.data[i].score)
      sum = sum + score
    }
    averageScore = sum/(data?.getCommentsByOrgId.data.length)
  }

  return {
    loading,
    data: data?.getCommentsByOrgId.data,
    averageScore
  };
};

/**
 *  新增评论数据
 */
export const useCreateComment = (): [handleCreate: Function, loading: boolean] => {
  const [create, { loading }] = useMutation(CREATE_COMMENT);

  const handleCreate = async (
    params: TBaseComment,
    callback: (isReload: boolean) => void,
  ) => {
    const res = await create({
      variables: {
        params,
      },
    });
    //核实一下 createComment 有无创建成功
    if (res.data.createComment.code === 200) {
      console.log(res.data.createComment.message);
      callback(true);
      return;
    }
    console.log(res.data.createComment.message);
  };

  return [handleCreate, loading];
};