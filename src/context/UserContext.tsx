import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { User } from '../types/user';

type AppState = { user: User | null };
type AppAction = { type: 'SET_USER'; payload: User } | { type: 'REMOVE_USER' };
type AppContextProps = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
};

export const UserContext = createContext<AppContextProps | null>(null);

export const userReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'REMOVE_USER':
      return { ...state, user: null };
    default:
      return state;
  }
};

export const initialUser = { user: null };

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
