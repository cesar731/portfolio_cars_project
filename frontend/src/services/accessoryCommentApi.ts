// frontend/src/services/accessoryCommentApi.ts
import api from './api';

export interface Comment {
  id: number;
  user_id: number;
  username: string;
  content: string;
  created_at: string;
  replies: Comment[];
}

export const createAccessoryComment = async (
  accessoryId: number,
  content: string,
  parent_id?: number
): Promise<Comment> => {
  const res = await api.post(`/accessories/${accessoryId}/comments`, {
    content,
    parent_id,
  });
  return res.data;
};

export const getAccessoryComments = async (accessoryId: number): Promise<Comment[]> => {
  const res = await api.get(`/accessories/${accessoryId}/comments`);
  return res.data;
};