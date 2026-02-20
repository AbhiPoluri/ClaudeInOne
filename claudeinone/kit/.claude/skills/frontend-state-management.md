# State Management Patterns

Managing state across components.

## Context API + useReducer

```typescript
interface AppState {
  user: { id: string; name: string } | null;
  theme: 'light' | 'dark';
  notifications: Array<{ id: string; message: string }>;
}

type AppAction =
  | { type: 'SET_USER'; payload: AppState['user'] }
  | { type: 'SET_THEME'; payload: AppState['theme'] }
  | { type: 'ADD_NOTIFICATION'; payload: { id: string; message: string } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const initialState: AppState = {
  user: null,
  theme: 'light',
  notifications: []
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be within AppProvider');
  }
  return context;
}

// Usage
export function Profile() {
  const { state, dispatch } = useAppContext();

  return (
    <div>
      {state.user && <h1>{state.user.name}</h1>}
      <button onClick={() => dispatch({ type: 'SET_THEME', payload: 'dark' })}>
        Change theme
      </button>
    </div>
  );
}
```

## Zustand (Lightweight)

```typescript
import { create } from 'zustand';

interface Store {
  user: { id: string; name: string } | null;
  setUser: (user: Store['user']) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: Store['theme']) => void;
  clear: () => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  clear: () => set({ user: null, theme: 'light' })
}));

// Usage
export function Profile() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  return (
    <div>
      {user && <h1>{user.name}</h1>}
      <button onClick={() => setUser({ id: '1', name: 'John' })}>
        Set user
      </button>
    </div>
  );
}
```

## Best Practices

✅ **Normalize state** - Flatten nested structures
✅ **Separate concerns** - UI state vs app state
✅ **Avoid prop drilling** - Use context for deep trees
✅ **Memoization** - Prevent unnecessary re-renders
✅ **Persistence** - Save critical state

## Resources

- [React Context](https://react.dev/reference/react/useContext)
- [Zustand](https://github.com/pmndrs/zustand)
- [Jotai](https://jotai.org/)
