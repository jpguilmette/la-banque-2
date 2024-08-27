<script setup lang="ts">
import UsersList from './../components/UsersList/UsersList.vue';
import { useLaBanqueStore } from '../store/store';
import Loading from '../components/Loading/Loading.vue';

const store = useLaBanqueStore();
</script>

<template>
    <h2>Listes des utilisateurs</h2>

    <Loading v-if="store.usersCharging" />
    <UsersList v-else :users="store.users" />
</template>

<style scoped></style>
