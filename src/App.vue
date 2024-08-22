<template>
    <h1>La banque</h1>
    <p> <strong>Current route path:</strong> {{ $route.fullPath }} </p>
    <Navigation />

    <main style="border: 1px solid #fff">
        <RouterView />
    </main>

    <Notification :type="notificationType" v-model:open="notificationOpen">
        {{ notificationContent }}
    </Notification>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue';
import Navigation from './components/Navigation.vue';
import { useLaBanqueStore } from './store/store';
import Notification from './components/Notification/Notification.vue';
import {
    LA_BANQUE_ERROR_EVENT_NAME,
    LaBanqueError,
    LaBanqueErrorEventDetail,
} from './models/LaBanqueError';
import { NotificationType } from './components/Notification/Notification.def';

const store = useLaBanqueStore();

// const utilisateur = sessionStorage.getItem('utilisateur');

const notificationOpen = ref(false);
const notificationType = ref(NotificationType.Info);
const notificationContent = ref('');

const handleCustomEvent = (
    event: CustomEvent<LaBanqueErrorEventDetail>
): void => {
    notificationType.value = event.detail.type;
    notificationContent.value = event.detail.content;
    notificationOpen.value = true;
};

// if (!utilisateur) {
//     // router.push({name: NomRoute.Connexion})
// }

onMounted(async () => {
    window.addEventListener(
        LA_BANQUE_ERROR_EVENT_NAME,
        handleCustomEvent as EventListener,
        false
    );

    try {
        await store.getUsers();
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
        handleCustomEvent as EventListener
    );
});
</script>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
