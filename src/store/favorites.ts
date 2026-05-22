import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesState {
  ids: string[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggle: (id: string) => Promise<void>;
  has: (id: string) => boolean;
}

const KEY = '@fordvision/favorites';

export const useFavorites = create<FavoritesState>((set, get) => ({
  ids: [],
  hydrated: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) set({ ids: JSON.parse(raw) });
    } catch {}
    set({ hydrated: true });
  },
  toggle: async (id) => {
    const ids = get().ids.includes(id)
      ? get().ids.filter((x) => x !== id)
      : [...get().ids, id];
    set({ ids });
    await AsyncStorage.setItem(KEY, JSON.stringify(ids));
  },
  has: (id) => get().ids.includes(id),
}));
