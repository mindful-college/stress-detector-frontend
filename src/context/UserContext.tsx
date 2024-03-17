import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { User, AverageReportData, Permission } from '../types/user';

type AppState = {
  user: User | null;
  averageReportData: AverageReportData | null;
  permission: Permission | null;
};

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_AVERAGE_REPORT_DATA'; payload: AverageReportData }
  | { type: 'SET_PERMISSION'; payload: Permission }
  | { type: 'REMOVE_USER' }
  | { type: 'UPDATE_USERNAME'; payload: string }
  | { type: 'UPDATE_POINTS'; payload: number };
type AppContextProps = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
};

export const UserContext = createContext<AppContextProps | null>(null);

export const userReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'SET_AVERAGE_REPORT_DATA':
      return { ...state, averageReportData: action.payload };
    case 'SET_PERMISSION':
      return { ...state, permission: action.payload };
    case 'REMOVE_USER':
      return { ...state, user: null };
    case 'UPDATE_USERNAME':
      return { ...state, user: { ...state.user, name: action.payload } };
    case 'UPDATE_POINTS':
      return { ...state, user: { ...state.user, points: action.payload } };
    default:
      return state;
  }
};

export const initialUser = {
  user: null,
  averageReportData: {
    stepCounts: 6000,
    sleepHours: 8,
    studyHours: 5,
    workHours: 4,
    heartRate: 80,
    socialMediaUsage: 3,
  },
  permission: null,
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUser);
  const contextValue = { state, dispatch };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUserContext = (): AppContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};
