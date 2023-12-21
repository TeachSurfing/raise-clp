import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ClpAlertProps } from '../components/Alert/Alert';
import { User } from '../model/user.model';

type AppState = {
    user: User | null;
    alert: ClpAlertProps | null;
};
type AppActions = {
    setUser(newUser: User | null): void;
    setAlert(newUser: ClpAlertProps | null): void;
    isLoggedIn(): boolean;
};

const useAppStore = create<AppState & AppActions>()(
    persist(
        (set, get) => ({
            user: null,
            alert: null,
            setUser: (user: User | null) => set(() => ({ user })),
            setAlert: (alert: ClpAlertProps | null) => set(() => ({ alert })),
            isLoggedIn: () => !!get().user?.id
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export default useAppStore;
