"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

async function initProfile(user: User) {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    const emailPrefix = user.email?.split("@")[0] ?? user.uid.slice(0, 8);
    await setDoc(userRef, {
      username: emailPrefix,
      displayName: user.displayName ?? emailPrefix,
      bio: "",
      photoURL: user.photoURL ?? "",
    });
  } else if (!snapshot.data().photoURL && user.photoURL) {
    await updateDoc(userRef, { photoURL: user.photoURL });
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await initProfile(firebaseUser);
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    getRedirectResult(auth).catch(() => {});

    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    await signInWithRedirect(auth, googleProvider);
  }

  async function signOutUser() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
