<script setup lang="ts">
import { RouteName } from '../router';
</script>

<template>
    <h2>Page non accessible</h2>

    <p>Vous n'avez pas les privilèges suffisants pour accéder à cette page.</p>
    <p>
        <RouterLink :to="{ name: RouteName.Home }">
            Retour à l'accueil
        </RouterLink>
    </p>
</template>

<style scoped></style>
