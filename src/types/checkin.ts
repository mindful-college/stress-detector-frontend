export type Conversation = {
  id: string;
  isChatbot: boolean;
  text?: string;
  audio?: object;
  showIcon?: number;
};

export type ChatbotKey = 
    'init' | 'greeting' | 'followup' | 'text' | 'voice' | 'study_hours' | 'studyError' | 
    'work_hours' | 'workError' | 'confirm' | 'stress_level' | 'closing' | 'restart';

export type Report = {
    text: string[];
    voice: string[];
    study_hours: number | null;
    work_hours: number | null;
    stress_level: number | null;
}
