# Firebase & Firestore

Google's real-time database for rapid development.

## Setup

```bash
npm install firebase firebase-admin
```

## Client SDK

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ...
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create/Set
await setDoc(doc(db, 'users', 'user123'), {
  email: 'user@example.com',
  name: 'John Doe',
  createdAt: new Date()
});

// Read single
const userDoc = await getDoc(doc(db, 'users', 'user123'));
if (userDoc.exists()) {
  console.log(userDoc.data());
}

// Read multiple
const userQuery = query(
  collection(db, 'users'),
  where('status', '==', 'active'),
  orderBy('createdAt', 'desc')
);
const querySnapshot = await getDocs(userQuery);

querySnapshot.forEach(doc => {
  console.log(doc.id, doc.data());
});

// Update
await updateDoc(doc(db, 'users', 'user123'), {
  name: 'Jane Doe'
});

// Delete
await deleteDoc(doc(db, 'users', 'user123'));
```

## Real-time Listeners

```typescript
import { onSnapshot } from 'firebase/firestore';

// Listen to single document
const unsubscribe = onSnapshot(
  doc(db, 'users', 'user123'),
  (doc) => {
    console.log('Current data:', doc.data());
  }
);

// Listen to collection
onSnapshot(
  query(
    collection(db, 'messages'),
    where('conversationId', '==', 'conv123'),
    orderBy('createdAt')
  ),
  (snapshot) => {
    snapshot.forEach(doc => {
      console.log(doc.data());
    });
  }
);

// Stop listening
unsubscribe();
```

## Transactions

```typescript
import { runTransaction } from 'firebase/firestore';

await runTransaction(db, async (transaction) => {
  const userDoc = await transaction.get(doc(db, 'users', 'user1'));
  const balance = userDoc.data().balance;

  transaction.update(doc(db, 'users', 'user1'), {
    balance: balance - 100
  });

  transaction.update(doc(db, 'users', 'user2'), {
    balance: (await transaction.get(doc(db, 'users', 'user2'))).data().balance + 100
  });
});
```

## Firebase Authentication

```typescript
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const auth = getAuth();

// Sign up
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const user = userCredential.user;

// Sign in
await signInWithEmailAndPassword(auth, email, password);

// Sign out
await signOut(auth);

// Listen to auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user.uid);
  } else {
    console.log('User logged out');
  }
});
```

## Admin SDK (Server-side)

```typescript
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

// Server-side operations
await db.collection('users').doc('user123').set({
  email: 'user@example.com',
  admin: true
}, { merge: true });

// Batch operations
const batch = db.batch();
batch.set(db.collection('users').doc('user1'), { status: 'active' });
batch.set(db.collection('users').doc('user2'), { status: 'active' });
await batch.commit();
```

## Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /public/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Best Practices

✅ **Security rules** - Enforce access control
✅ **Indexes** - Create for complex queries
✅ **Denormalization** - Store related data together
✅ **Real-time listeners** - Efficient subscriptions
✅ **Pagination** - Use startAfter for large datasets

## Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase CLI](https://firebase.google.com/docs/cli)
