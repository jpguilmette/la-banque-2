<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouteName } from '../router';
import { useCurrentUser } from '../composables/currentUser';
const { currentUser } = useCurrentUser();

onMounted(async () => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
        currentUser.value = JSON.parse(sessionUser);
    }
});

const uid = computed(() => currentUser.value?.uid ?? 'NOT_FOUND');
</script>

<template>
    <h2 class="home-title">Bienvenue<br />sur l'app de La banque</h2>

    <div class="home-template">
        <RouterLink
            class="home-box"
            :to="{ name: RouteName.Profile, params: { uid } }"
            >Mon profil</RouterLink
        >
        <RouterLink class="home-box" :to="{ name: RouteName.PlaygroundRoutes }"
            >Parcours</RouterLink
        >
        <RouterLink class="home-box" :to="{ name: RouteName.Legals }"
            >Notes légales</RouterLink
        >
    </div>
</template>

<style scoped>
.home-title {
    text-align: center;
}

.home-template {
    display: flex;
    justify-content: space-around;
    margin-top: 50px;
}

.home-box {
    width: 200px;
    height: 200px;
    background-color: #f46524;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;
}

@media screen and (max-width: 991px) {
    .home-template {
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .home-box {
        width: 100%;
        height: 125px;
    }
}
</style>
