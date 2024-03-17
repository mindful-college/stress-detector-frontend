export type User = {
  email?: string;
  access_token?: string;
  name?: string;
  points?: number;
};

export type AverageReportData = {
  stepCounts: number | null;
  sleepHours: number | null;
  studyHours: number | null;
  workHours: number | null;
  heartRate: number | null;
  socialMediaUsage: number | null;
};

export type Permission = {
  stepCounts: boolean;
  sleepHours: boolean;
  heartRate: boolean;
  socialMediaUsage: boolean;
  notification: boolean;
};
