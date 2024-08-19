

<template>
  <h1>La banque</h1>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <Navigation />

  <main style="border: 1px solid #fff;">
    <RouterView />
  </main>

</template>

<script lang="ts" setup>
import Navigation from './components/Navigation.vue'

  // import { useRouter } from 'vue-router'
  
  // const router = useRouter();

  const utilisateur = sessionStorage.getItem("utilisateur");

  if (!utilisateur) {
    // router.push({name: NomRoute.Connexion})
  }

// import HelloWorld from './components/HelloWorld.vue'
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
