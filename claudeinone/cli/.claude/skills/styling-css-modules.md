# CSS Modules

Scoped CSS with automatic naming and no conflicts.

## Basic Usage

```module.css
/* Button.module.css */
.button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #0056b3;
}

.button.primary {
  background-color: #28a745;
}

.button.primary:hover {
  background-color: #218838;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

```jsx
// Button.jsx
import styles from './Button.module.css';

export function Button({ variant = 'primary', disabled = false, children }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

## Composition

```module.css
/* Form.module.css */
.form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.group {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.error {
  composes: input;
  border-color: #dc3545;
}

.error:focus {
  box-shadow: 0 0 5px rgba(220, 53, 69, 0.5);
}
```

```jsx
// LoginForm.jsx
import styles from './Form.module.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  return (
    <form className={styles.form}>
      <div className={styles.group}>
        <label className={styles.label}>Email</label>
        <input
          className={error ? styles.error : styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </form>
  );
}
```

## TypeScript Support

```typescript
// Button.module.css
export const button: string;
export const primary: string;
export const disabled: string;
```

```typescript
// Button.tsx
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className || ''}`}
      {...props}
    />
  );
};
```

## Mixins with PostCSS

```module.css
/* mixins.css */
@define-mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@define-mixin button-base {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

/* Component.module.css */
.container {
  @mixin flex-center;
  height: 100vh;
}

.button {
  @mixin button-base;
  background-color: #007bff;
  color: white;
}
```

## Organization Pattern

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.module.css
│   ├── Card/
│   │   ├── Card.tsx
│   │   └── Card.module.css
│   └── Form/
│       ├── Form.tsx
│       └── Form.module.css
└── styles/
    ├── globals.css
    └── variables.css
```

## Best Practices

✅ **Namespace by component** - One module per component
✅ **Avoid nesting** - Keep selectors simple
✅ **Composition** - Use composes for DRY styles
✅ **TypeScript** - Get type safety for classes
✅ **Global styles** - Use separate global file

## Resources

- [CSS Modules Spec](https://github.com/css-modules/css-modules)
- [PostCSS Documentation](https://postcss.org/)
