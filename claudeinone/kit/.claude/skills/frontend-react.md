# React

Modern React development with hooks, composition patterns, and performance optimization.

## Core Patterns

### Hooks & State Management
```typescript
// useState for local component state
const [count, setCount] = useState(0);

// useEffect for side effects
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);

// useCallback for memoized callbacks
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []);

// useMemo for expensive computations
const expensive = useMemo(() => complexCalculation(data), [data]);
```

### Component Composition
- **Functional components**: Prefer over class components
- **Custom hooks**: Extract reusable logic into hooks
- **Compound components**: Share state within component tree
- **Render props**: Alternative pattern for logic sharing
- **Context API**: For global state (theme, auth, user)

### Performance Optimization
- **React.memo**: Prevent unnecessary re-renders
- **useCallback/useMemo**: Optimize function/value references
- **Code splitting**: Lazy load routes and components with React.lazy()
- **Key prop**: Properly identify list items for reconciliation
- **Profiler API**: Measure component performance

### State Management Patterns
- **useState**: Local component state
- **useContext + useState**: Simple global state
- **Zustand/Jotai**: Lightweight state libraries
- **Redux Toolkit**: Complex application state
- **Server state (React Query)**: API caching and synchronization

## Best Practices

1. **Component Structure**
   - One component per file (or related components in directory)
   - Use descriptive names following PascalCase convention
   - Keep components focused and single-responsibility

2. **Hook Rules**
   - Only call hooks at top level of component
   - Call hooks from React functions, not regular functions
   - Use ESLint plugin to enforce rules

3. **Prop Drilling Prevention**
   - Use Context API for global state
   - Split components to avoid deep prop drilling
   - Consider state management library for complex apps

4. **Rendering Performance**
   - Avoid object/function creation in render
   - Use keys correctly in lists
   - Profile with React DevTools before optimizing

5. **Error Handling**
   - Use Error Boundaries for error containment
   - Try-catch in event handlers and async code
   - Provide user-friendly error messages

## Common Patterns

### Custom Hook Pattern
```typescript
function useFormInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  return {
    bind: { value, onChange: e => setValue(e.target.value) },
    value,
    clear: () => setValue(''),
  };
}
```

### Context + Reducer Pattern
```typescript
const AppContext = createContext();

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
```

### Conditional Rendering
```typescript
// Good patterns
{condition && <Component />}
{condition ? <ComponentA /> : <ComponentB />}
{list.length > 0 ? <List items={list} /> : <Empty />}
```

## Testing

Use React Testing Library:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

test('button click updates count', () => {
  render(<Counter />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(screen.getByText(/Count: 1/i)).toBeInTheDocument();
});
```

## Resources

- [React Official Docs](https://react.dev)
- [React Hooks API](https://react.dev/reference/react)
- [React Testing Library](https://testing-library.com/react)
- [Performance Optimization Guide](https://react.dev/learn/render-and-commit)
