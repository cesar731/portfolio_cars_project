 
import api from './api';

export interface ConsultationRequest {
  subject?: string;
  message: string;
}

export interface ConsultationResponse {
  id: number;
  user_id: number;
  advisor_id: number | null;
  subject: string | null;
  message: string;
  status: string;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
}

export const createConsultation = async (subject: string | undefined, message: string): Promise<ConsultationResponse> => {
  const response = await api.post<ConsultationResponse>('/consultations', { subject, message });
  return response.data;
};