import { ref } from 'vue';
import { User } from '../models/User';

export const useCurrentUser = () => {
    const currentUser = ref<User | null>(null);

    const handleCurrentUserEvent = (event: CustomEvent<User>): void => {
        currentUser.value = event.detail;
    };

    return { currentUser, handleCurrentUserEvent };
};
