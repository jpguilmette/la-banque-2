import { LA_BANQUE_CURRENT_USER_EVENT_NAME } from '../models/User';

export const useDisconnect = () => {
    const disconnect = () => {
        sessionStorage.removeItem('user');
        const customEvent = new CustomEvent<null>(
            LA_BANQUE_CURRENT_USER_EVENT_NAME,
            {
                detail: null,
            }
        );
        window.dispatchEvent(customEvent);
    };

    return disconnect;
};
