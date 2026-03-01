import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    isLoggedIn: boolean;
    login: (id: string, pw: string) => boolean;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            login: (id, pw) => {
                if (id === 'geek' && pw === 'qwer123!@#') {
                    set({ isLoggedIn: true });
                    return true;
                }
                return false;
            },
            logout: () => set({ isLoggedIn: false }),
        }),
        {
            name: 'admin-auth-storage',
        },
    ),
);
