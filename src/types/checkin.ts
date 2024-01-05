export type Conversation = {
  id: string;
  isChatbot: boolean;
  text?: string;
  audio?: object;
  showIcon?: number;
};

export type ChatbotKey =
  | 'init'
  | 'greeting'
  | 'followup'
  | 'text'
  | 'voice'
  | 'studyHours'
  | 'studyError'
  | 'workHours'
  | 'workError'
  | 'confirm'
  | 'stressLevel'
  | 'closing'
  | 'restart';

export type Report = {
  text: string[];
  voice: string[];
  study_hours: number | null;
  work_hours: number | null;
  step_count: number | null;
  sleep_hours: number | null;
  heart_rate: number | null;
  social_media_usage: number | null;
  stress_level: number | null;
};
