import { api } from "../configs/axios";

export const getCommentDetail = (id) => {
    return api.get(`/comments/${id}`)
}

export const postComment = (data) => {
    return api.post('/comments',data)
  }
  
  export const updateComment = (data) => {
    return api.put('/comments',data)
  }
  
  export const deleteComment = (id) => {
    return api.patch(`/comments/${id}`)
  }