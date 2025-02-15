import { createContext, ReactNode, useContext, useReducer } from 'react';

type UserType = {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
};

interface State {
  readonly user: UserType | null;
  readonly isAuthenticated: boolean;
}

const initialState: State = {
  user: null,
  isAuthenticated: false,
};

export const loginAction = (user: UserType) =>
  ({
    type: 'login',
    payload: user,
  }) as const;

export const logoutAction = () =>
  ({
    type: 'logout',
  }) as const;

type Actions = ReturnType<typeof loginAction> | ReturnType<typeof logoutAction>;

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'login':
      return {
        user: {
          ...action.payload,
          name: FAKE_USER.name,
          avatar: FAKE_USER.avatar,
        },
        isAuthenticated: true,
      };
    case 'logout':
      return {
        ...state,
        isAuthenticated: false,
      };

    default:
      throw new Error('Unknown action type');
  }
}

type AuthContextType = {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (user: UserType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const FAKE_USER = {
  name: 'Vy',
  email: 'vy@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

function AuthProvider({ children }: { children: ReactNode }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(user: UserType) {
    if (
      user.email === FAKE_USER.email &&
      user.password === FAKE_USER.password
    ) {
      dispatch(loginAction(user));
    }
  }

  function logout() {
    if (isAuthenticated) {
      dispatch(logoutAction());
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('AuthContext was used outside of the AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
