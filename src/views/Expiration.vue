<script setup lang="ts">
import { RouteName } from './../router';
</script>

<template>
    <h2>Votre connexion a expiré</h2>

    <p>Vous avez été déconnecté dû à un trop grand temps d'inactivité</p>
    <RouterLink class="page-404__link" :to="{ name: RouteName.Home }">
        <img
            class="expiration__image"
            src="/src/assets/image/child-sleeping-computer-keyboard.jpg"
            alt="Enfant dormant sur un clavier d'ordinateur"
        />
    </RouterLink>
</template>

<style lang="scss" scoped>
.expiration {
    &__image {
        max-width: 100%;
    }
}
</style>
