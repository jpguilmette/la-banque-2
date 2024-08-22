import { NotificationType } from '../components/Notification/Notification.def';

export const LA_BANQUE_ERROR_EVENT_NAME = 'LaBanqueError';

export interface LaBanqueErrorEventDetail {
    type: NotificationType;
    content: string;
}

export class LaBanqueError extends Error {
    code: string;

    constructor(e: Error, code: string) {
        super(e.message);
        this.code = code;
        this.name = e.name;
        this.stack = e.stack;
    }
}
