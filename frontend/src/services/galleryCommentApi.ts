// frontend/src/services/galleryCommentApi.ts
import api from './api';

export interface GalleryComment {
  id: number;
  user_id: number;
  gallery_id: number;
  content: string;
  created_at: string;
  username: string;
  replies: GalleryComment[];
}

export const createGalleryComment = async (
  galleryId: number,
  content: string,
  parent_id?: number
): Promise<GalleryComment> => {
  const response = await api.post(`/gallery/${galleryId}/comments`, {
    content,
    parent_id,
  });
  return response.data;
};

export const getGalleryComments = async (
  galleryId: number
): Promise<GalleryComment[]> => {
  const response = await api.get(`/gallery/${galleryId}/comments`);
  return response.data;
};