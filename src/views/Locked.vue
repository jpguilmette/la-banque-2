<script setup lang="ts">
import { RouteName } from '../router';
import lockSvg from './../assets/icons/lock.svg?raw';
</script>

<template>
    <h2>Compte verrouillé</h2>

    <div class="locked__icon" v-html="lockSvg"></div>

    <p>
        Vous ne pouvez malheureusement pas accéder à cette page car votre compte
        a été vérouillé.
    </p>

    <p>
        <RouterLink :to="{ name: RouteName.Home }">
            Retour à l'accueil
        </RouterLink>
    </p>
</template>

<style lang="scss" scoped>
.locked {
    &__icon {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 150px;
        align-items: center;
        justify-items: center;
    }
}
</style>
