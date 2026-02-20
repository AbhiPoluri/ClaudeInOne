# Frontend State Management

## Overview
Patterns for managing client-side state: React Context for simple cases, Zustand for complex shared state.

## React Context + useReducer

```tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';

interface State { user: User | null; theme: 'light' | 'dark'; }
type Action = { type: 'SET_USER'; user: User } | { type: 'TOGGLE_THEME' } | { type: 'LOGOUT' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.user };
    case 'TOGGLE_THEME': return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'LOGOUT': return { ...state, user: null };
    default: return state;
  }
}

const AppContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { user: null, theme: 'light' });
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
```

## Zustand

```bash
npm install zustand
```

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStore {
  user: User | null;
  theme: 'light' | 'dark';
  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      theme: 'light',
      setUser: (user) => set({ user }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      logout: () => set({ user: null }),
    }),
    { name: 'app-store' }
  )
);

// Usage in component
function Navbar() {
  const { user, logout } = useAppStore();
  return user ? <button onClick={logout}>Logout {user.name}</button> : null;
}
```

## React Query for Server State

```bash
npm install @tanstack/react-query
```

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: () => fetch('/api/users').then(r => r.json()) });
}

function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput) =>
      fetch('/api/users', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
```

## Best Practices
- Server state (API data) → React Query or SWR
- Client-only UI state (modals, theme) → Zustand or Context
- Avoid putting server responses in Context/Zustand
- Use Zustand `persist` middleware for theme/preferences only

## Resources
- [Zustand docs](https://zustand.docs.pmnd.rs)
- [TanStack Query](https://tanstack.com/query/latest)
