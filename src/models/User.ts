export const LA_BANQUE_CURRENT_USER_EVENT_NAME = 'LaBanqueCurrentUser';

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
