import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
  type UserCredential,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ApiError } from "@/lib/api/client";
import { updateProfile } from "@/lib/api/profile";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  getIdToken: () => Promise<string | null>;
  signUpWithEmail: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signInWithGoogle: () => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function firebaseErrorCode(err: unknown): string {
  return err && typeof err === "object" && "code" in err
    ? String((err as { code: string }).code)
    : "";
}

async function createOrSignInWithEmail(
  email: string,
  password: string,
): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (firebaseErrorCode(err) !== "auth/email-already-in-use") {
      throw err;
    }
    // Same email/password: finish signup after a failed profile step or duplicate submit.
    return signInWithEmailAndPassword(auth, email, password);
  }
}

function mapFirebaseError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled.";
    default:
      return "Something went wrong. Try again.";
  }
}

async function ensureWebPersistence() {
  const auth = getFirebaseAuth();
  await setPersistence(auth, browserLocalPersistence);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured());

  useEffect(() => {
    let mounted = true;
    if (!isFirebaseConfigured()) {
      setIsLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    void (async () => {
      try {
        await ensureWebPersistence();
      } finally {
        if (!mounted) return;
        const auth = getFirebaseAuth();
        unsubscribe = onAuthStateChanged(auth, (next) => {
          setUser(next);
          setIsLoading(false);
        });
      }
    })();

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  const getIdToken = useCallback(async () => {
    if (!user) return null;
    return user.getIdToken();
  }, [user]);

  const signUpWithEmail = useCallback(
    async (username: string, email: string, password: string) => {
      const trimmedEmail = email.trim();
      const normalizedUsername = username.trim().toLowerCase();

      let credential: UserCredential;
      try {
        credential = await createOrSignInWithEmail(trimmedEmail, password);
      } catch (err) {
        return {
          ok: false as const,
          error: mapFirebaseError(firebaseErrorCode(err)),
        };
      }

      try {
        const token = await credential.user.getIdToken();
        await updateProfile(normalizedUsername, token);
        return { ok: true as const };
      } catch (err) {
        if (err instanceof ApiError) {
          return { ok: false as const, error: err.message };
        }
        return {
          ok: false as const,
          error:
            "Your account exists, but we couldn't save your username. Sign in and try again.",
        };
      }
    },
    [],
  );

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { ok: true as const };
    } catch (err) {
      return {
        ok: false as const,
        error: mapFirebaseError(firebaseErrorCode(err)),
      };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { ok: true as const };
    } catch (err) {
      return {
        ok: false as const,
        error: mapFirebaseError(firebaseErrorCode(err)),
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      getIdToken,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signOut,
    }),
    [
      user,
      isLoading,
      getIdToken,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
