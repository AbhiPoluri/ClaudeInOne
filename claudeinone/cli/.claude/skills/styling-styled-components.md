# styled-components

CSS-in-JS library for component-scoped styling with full JavaScript support.

## Setup

```bash
npm install styled-components
npm install -D @types/styled-components
```

## Basic Usage

```typescript
import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>;
}
```

## Props & Theming

```typescript
const StyledInput = styled.input<{ hasError: boolean }>`
  width: 100%;
  padding: 10px;
  border: 2px solid ${props => props.hasError ? '#dc3545' : '#ddd'};
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#007bff'};
    box-shadow: 0 0 5px ${props => props.hasError ? 'rgba(220, 53, 69, 0.5)' : 'rgba(0, 123, 255, 0.5)'};
  }
`;

export function FormInput({ error, ...props }) {
  return <StyledInput hasError={!!error} {...props} />;
}
```

## Global Styles

```typescript
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }

  button {
    font-family: inherit;
  }
`;

export function App() {
  return (
    <>
      <GlobalStyles />
      <MyComponent />
    </>
  );
}
```

## Theme Provider

```typescript
import { ThemeProvider } from 'styled-components';

const lightTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    danger: '#dc3545',
    background: '#ffffff',
    text: '#333333'
  }
};

const darkTheme = {
  colors: {
    primary: '#0d6efd',
    secondary: '#6c757d',
    danger: '#dc3545',
    background: '#1a1a1a',
    text: '#ffffff'
  }
};

export function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyles />
      <MyComponent onToggleTheme={() => setIsDark(!isDark)} />
    </ThemeProvider>
  );
}
```

## Complex Components

```typescript
const Card = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 10px;
`;

const CardContent = styled.p`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
`;

export function UserCard({ user }) {
  return (
    <Card>
      <CardTitle>{user.name}</CardTitle>
      <CardContent>{user.bio}</CardContent>
    </Card>
  );
}
```

## Extending Styles

```typescript
const BaseButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
`;

const PrimaryButton = styled(BaseButton)`
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;

const DangerButton = styled(BaseButton)`
  background-color: #dc3545;
  color: white;

  &:hover {
    background-color: #c82333;
  }
`;
```

## Best Practices

✅ **Theme Provider** - Centralize color/style values
✅ **Extend components** - Reuse styles
✅ **Component API** - Pass props for customization
✅ **Performance** - Use React.memo for styled components
✅ **TypeScript** - Strong typing for props

## Resources

- [styled-components Docs](https://styled-components.com/)
- [Emotion (alternative)](https://emotion.sh/)
