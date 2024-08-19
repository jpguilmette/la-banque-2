<script setup lang="ts">
    import { NomRoute } from './../router';
</script>

<template>
  <nav>
    <ul>
        <li><RouterLink to="/">Accueil</RouterLink></li>
        <li><RouterLink :to="{name: NomRoute.Connexion}">Se connecter</RouterLink></li>
        <li>Admin
            <ul>
                <li><RouterLink :to="{name: NomRoute.AdminCreateUser}">Créer un compte</RouterLink></li>
            </ul>
        </li>
    </ul>
  </nav>
</template>

<style scoped>
</style>
