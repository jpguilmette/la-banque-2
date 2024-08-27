<script setup lang="ts">
import { RouteName } from './../router';
</script>

<template>
    <h2>Erreur 404...</h2>

    <RouterLink class="page-404__link" :to="{ name: RouteName.Home }">
        <img
            class="page-404__image"
            src="/src/assets/image/page-404-la-big-com.jpg"
            alt="Cette page n'existe
        pas"
        />
    </RouterLink>
</template>

<style lang="scss" scoped>
.page-404 {
    &__image {
        max-width: 100%;
    }
}
</style>
