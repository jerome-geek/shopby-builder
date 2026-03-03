import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    login: (id: string, pw: string) => boolean;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            token: null,
            login: (id, pw) => {
                if (id === 'geek' && pw === 'qwer123!@#') {
                    set({ isLoggedIn: true, token: 'mock-admin-token-12345' });
                    return true;
                }
                return false;
            },
            logout: () => set({ isLoggedIn: false, token: null }),
        }),
        {
            name: 'admin-auth-storage',
        },
    ),
);
