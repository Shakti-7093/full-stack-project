export interface User {
    id: string;
    name: string;
    email: string;
    roles: string;
    token: string | null;
}

export interface UserState {
    user: User[];
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}