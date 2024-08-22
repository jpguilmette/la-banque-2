export interface User {
    id?: string;
    uid: string;
    name: string;
    username: string;
    photo: string;
    admin: boolean;
    merchant: boolean;
    amount: number;
    locked: boolean;
}
