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
  | 'confirm'
  | 'stressLevel'
  | 'closing'
  | 'restart';

export type ChatReport = {
  text: string[];
  voice: string[];
  stress_level: number | null;
};

export type UserInputReport = {
  study_hours: number | null;
  work_hours: number | null;
  social_media_usage: number | null;
  sleep_hours?: number | null;
  step_count?: number | null;
  heart_rate?: number | null;
};
