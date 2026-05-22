import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Role = 'admin' | 'client';

interface Session {
  email: string;
  name: string;
  role: Role;
}

interface AuthState {
  session: Session | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const KEY = '@fordvision/session';

const credentials: Record<string, { password: string; session: Session }> = {
  'admin@ford.com': {
    password: 'admin',
    session: { email: 'admin@ford.com', name: 'Larissa Andrade', role: 'admin' },
  },
  'cliente@ford.com': {
    password: 'cliente',
    session: { email: 'cliente@ford.com', name: 'Rafael Mendes', role: 'client' },
  },
};

export const useAuth = create<AuthState>((set) => ({
  session: null,
  hydrated: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) set({ session: JSON.parse(raw) });
    } catch {}
    set({ hydrated: true });
  },
  signIn: async (email, password) => {
    await new Promise((r) => setTimeout(r, 350));
    const entry = credentials[email.trim().toLowerCase()];
    if (!entry || entry.password !== password.trim().toLowerCase()) {
      return { ok: false, error: 'Credenciais inválidas' };
    }
    await AsyncStorage.setItem(KEY, JSON.stringify(entry.session));
    set({ session: entry.session });
    return { ok: true };
  },
  signOut: async () => {
    await AsyncStorage.removeItem(KEY);
    set({ session: null });
  },
}));
