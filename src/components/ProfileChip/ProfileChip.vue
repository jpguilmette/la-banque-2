<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useCurrentUser } from '../../composables/currentUser';
import { useDisconnect } from '../../composables/disconnected';
import { LA_BANQUE_CURRENT_USER_EVENT_NAME } from '../../models/User';
import { RouteName } from '../../router';
import { useRouter } from 'vue-router';

const { currentUser, handleCurrentUserEvent } = useCurrentUser();
const disconnect = useDisconnect();
const router = useRouter();

const onClick = () => {
    disconnect();
    router.push({ name: RouteName.Home });
};

onMounted(async () => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
        currentUser.value = JSON.parse(sessionUser);
    }
    window.addEventListener(
        LA_BANQUE_CURRENT_USER_EVENT_NAME,
        handleCurrentUserEvent as EventListener,
        false
    );
});

onUnmounted(() => {
    window.removeEventListener(
        LA_BANQUE_CURRENT_USER_EVENT_NAME,
        handleCurrentUserEvent as EventListener
    );
});

const photo = computed(
    () =>
        new URL(`/src/assets/${currentUser.value?.photo}.png`, import.meta.url)
            .href
);
</script>

<template>
    <div class="profile-chip">
        <template v-if="currentUser">
            <img :src="photo" class="profile-chip__photo" />
            <RouterLink
                :to="{
                    name: RouteName.Profile,
                    params: { uid: currentUser.uid },
                }"
                class="profile-chip__name"
            >
                {{ currentUser.name }}
            </RouterLink>
            <a @click.prevent="onClick" class="profile-chip__disconnect">
                Déconnexion
            </a>
        </template>
        <template v-else>
            <RouterLink to="/connection">Se connecter</RouterLink>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.profile-chip {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    right: 20px;
    border-radius: 0 0 10px 10px;
    padding: 12px;
    background: #fff;
    box-shadow: 0 0 10px rgba(244, 101, 36, 0.1);

    &__photo {
        width: 32px;
        height: 32px;
        margin-right: 10px;
    }

    &__disconnect {
        margin-left: 10px;
        padding-left: 10px;
        border-left: 1px solid #e2dedd;
    }
}
</style>
