# Expo (React Native)

## Overview
Expo provides a managed workflow for React Native apps targeting iOS, Android, and web.

## Setup

```bash
npx create-expo-app@latest my-app --template blank-typescript
cd my-app
npx expo start
```

## Core Components

```tsx
// app/(tabs)/index.tsx
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Pressable
        style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
        onPress={() => router.push('/details')}
      >
        <Text style={styles.btnText}>Go to Details</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  btn: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});
```

## Expo Router File Structure

```
app/
├── _layout.tsx       # Root layout with providers
├── (tabs)/
│   ├── _layout.tsx   # Tab bar config
│   ├── index.tsx     # Home tab
│   └── profile.tsx   # Profile tab
├── (auth)/
│   ├── login.tsx
│   └── signup.tsx
└── [id].tsx          # Dynamic route
```

## API with React Query

```tsx
import { useQuery } from '@tanstack/react-query';

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });
}

export function UserList() {
  const { data, isLoading, error } = useUsers();
  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading users</Text>;
  return <FlatList data={data} keyExtractor={i => i.id} renderItem={({ item }) => <Text>{item.name}</Text>} />;
}
```

## EAS Build & Submit

```bash
npm install -g eas-cli && eas login
eas build:configure
eas build --platform ios --profile production
eas submit --platform ios
```

## Best Practices
- Use Expo Router for file-based navigation
- Use `expo-secure-store` for tokens, never AsyncStorage
- Test on real devices early — simulators miss important native behaviors
- Use EAS Update for OTA JavaScript updates

## Resources
- [Expo docs](https://docs.expo.dev)
- [Expo Router](https://expo.github.io/router/docs)
