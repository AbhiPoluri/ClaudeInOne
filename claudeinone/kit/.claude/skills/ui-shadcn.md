# shadcn/ui

High-quality React component library built on Radix UI and Tailwind CSS for accessible interfaces.

## Setup

```bash
npx shadcn-ui@latest init

# Choose your preferences:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
```

## Install Components

```bash
# Single component
npx shadcn-ui@latest add button

# Multiple components
npx shadcn-ui@latest add button input card dialog

# All components
npx shadcn-ui@latest add --all
```

## Button Component

```tsx
import { Button } from '@/components/ui/button';

export default function ButtonDemo() {
  return (
    <div className="flex gap-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>

      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}
```

## Form with Input Components

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function FormExample() {
  const [email, setEmail] = useState('');

  return (
    <Card className="w-full max-w-md p-6">
      <form onSubmit={(e) => {
        e.preventDefault();
        console.log('Submitting:', email);
      }}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </div>
      </form>
    </Card>
  );
}
```

## Dialog Component

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

export default function DialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## Dropdown Menu

```tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function DropdownExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Modal/Sheet (Side Panel)

```tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

export default function SheetExample() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Settings</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Make changes to your account settings here.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          {/* Settings content */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

## Select Component

```tsx
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function SelectExample() {
  const [value, setValue] = useState('');

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="guest">Guest</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

## Tabs Component

```tsx
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

export default function TabsExample() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div>Account settings here</div>
      </TabsContent>
      <TabsContent value="password">
        <div>Password settings here</div>
      </TabsContent>
    </Tabs>
  );
}
```

## Alert Component

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AlertExample() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please sign in again.
      </AlertDescription>
    </Alert>
  );
}
```

## Data Table

```tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

export default function TableExample() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Toast Notifications

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function ToastExample() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: 'Success',
          description: 'Your changes have been saved.',
          variant: 'default'
        });
      }}
    >
      Show Toast
    </Button>
  );
}
```

## Themeing with CSS Variables

```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;

    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.6%;

    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 100%;

    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;

    --muted: 0 0% 89.5%;
    --muted-foreground: 0 0% 45.1%;

    --accent: 0 0% 9%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;

    --border: 0 0% 89.5%;
    --input: 0 0% 89.5%;
    --ring: 0 0% 3.6%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.6%;
    --foreground: 0 0% 98%;
    /* ... more dark variables ... */
  }
}
```

## Custom Component Usage

```tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>View your analytics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Status</span>
          <Badge>Active</Badge>
        </div>
        <Button className="w-full">View Details</Button>
      </CardContent>
    </Card>
  );
}
```

## Best Practices

✅ **Use headless** - Base components on Radix UI for accessibility
✅ **Customize with CSS** - Modify colors in globals.css CSS variables
✅ **Combine components** - Build complex UIs from simple primitives
✅ **Type-safe** - Full TypeScript support out of the box
✅ **Accessible** - All components follow WAI-ARIA standards
✅ **Dark mode** - Built-in dark mode support via CSS classes
✅ **Responsive** - Mobile-first design with Tailwind breakpoints

## Common Patterns

- Always use the `asChild` prop for custom triggers
- Nest components properly (Dialog > DialogContent > DialogHeader)
- Use `className` for Tailwind customization
- Import icons from `lucide-react` for consistency
- Combine multiple components for complex UIs

## When to Use shadcn/ui

✅ Next.js projects
✅ Need accessible components
✅ Want customizable UI library
✅ TypeScript projects
✅ Tailwind CSS styling

❌ Non-React projects
❌ Need pre-built templates
❌ Simple static sites

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Component Gallery](https://ui.shadcn.com/docs/components/accordion)
- [Radix UI Docs](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
