<template>
    <LeftColumn />
    <div class="content">
        <ProfileChip class="content__profile-chip" />

        <main class="content__body">
            <RouterView />
        </main>

        <Notification :type="notificationType" v-model:open="notificationOpen">
            {{ notificationContent }}
        </Notification>

        <div class="content__version">Version: Alpha</div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { useLaBanqueStore } from './store/store';
import Notification from './components/Notification/Notification.vue';
import {
    LA_BANQUE_ERROR_EVENT_NAME,
    LaBanqueError,
    LaBanqueErrorEventDetail,
} from './models/LaBanqueError';
import { NotificationType } from './components/Notification/Notification.def';
import { useDisconnect } from './composables/disconnected';
import ProfileChip from './components/ProfileChip/ProfileChip.vue';
import LeftColumn from './components/leftColumn/leftColumn.vue';
import { RouteName } from './router';
import { useRouter } from 'vue-router';

const store = useLaBanqueStore();
const disconnect = useDisconnect();
const router = useRouter();

const notificationOpen = ref(false);
const notificationType = ref(NotificationType.Info);
const notificationContent = ref('');

const handleErrorEvent = (
    event: CustomEvent<LaBanqueErrorEventDetail>
): void => {
    notificationType.value = event.detail.type;
    notificationContent.value = event.detail.content;
    notificationOpen.value = true;
};

const inactivityTime = () => {
    const resetTimer = () => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            const user = sessionStorage.getItem('user');
            if (user) {
                disconnect();
                router.push({ name: RouteName.Expiration });
            }
        }, 60000);
    };

    let timeoutId: number;
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;
};

onMounted(async () => {
    window.addEventListener(
        LA_BANQUE_ERROR_EVENT_NAME,
        handleErrorEvent as EventListener,
        false
    );

    try {
        await store.getUsers();
        inactivityTime();
    } catch (error) {
        const customEvent = new CustomEvent<LaBanqueErrorEventDetail>(
            LA_BANQUE_ERROR_EVENT_NAME,
            {
                detail: {
                    type: NotificationType.Error,
                    content: `Erreur de chargement! Veuillez noter ce code d'erreur: [ ${
                        (error as LaBanqueError).code
                    } ]`,
                },
            }
        );
        window.dispatchEvent(customEvent);
    }
});

onUnmounted(() => {
    window.removeEventListener(
        LA_BANQUE_ERROR_EVENT_NAME,
        handleErrorEvent as EventListener
    );
});
</script>

<style lang="scss" scoped>
.content {
    width: 100%;
    height: 100%;
    overflow-x: hidden;

    &__body {
        display: block;
        padding: 50px;
    }

    &__version {
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 10px;
        background-color: #f4652450;
        color: white;
    }

    @media screen and (max-width: 991px) {
        overflow: visible;
        &__profile-chip {
            display: none;
        }

        &__body {
            padding: 10px;
        }
    }
}
</style>
