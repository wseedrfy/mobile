import { gql } from '@apollo/client';

export const GET_COMMENT_BYORGID = gql`
  query getCommentsByOrgId($page: PageInput!,$orgId:String!) {
    getCommentsByOrgId(page: $page,orgId:$orgId) {
      code
      message
      page {
        total
        pageNum
        pageSize
      }
      data {
        id
        score
        comment
        courseName
        courseCoverUrl
        orgId
        createDate
        studentId
        studentName
      }
    }
  }
`;

// 新增机构评论
export const CREATE_COMMENT = gql`
  mutation createComment($params: PartialCommentInput!) {
    createComment(params: $params){
      code
      message
    }
  }
  `;
