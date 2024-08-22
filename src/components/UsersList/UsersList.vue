<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';
import { User } from '../../models/User';
import { NomRoute } from '../../router';
import lockSvg from '../../assets/icons/lock.svg?raw';
import { useLaBanqueStore } from '../../store/store';

const props = withDefaults(
    defineProps<{
        users: User[];
    }>(),
    { users: () => [] }
);

const store = useLaBanqueStore();

const userSorted = computed(() => {
    return props.users.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
});

const desactivateUser = async (
    uid: string,
    locked: boolean,
    username: string
) => {
    if (!locked && confirm(`Voulez-vous vraiment désactiver ${username}?`)) {
        store.desactivateUser(uid, true);
    } else {
        store.desactivateUser(uid, false);
    }
};
</script>

<template>
    <table class="users-list">
        <thead>
            <tr>
                <th>Nom</th>
                <th>Identifiant</th>
                <th>Administrateur</th>
                <th>Commercant</th>
                <th>Montant</th>
                <th>Désactiver</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in userSorted" :key="user.uid">
                <td>
                    <RouterLink
                        :to="{
                            name: NomRoute.AdminUpdateUser,
                            params: { uid: user.uid },
                        }"
                    >
                        {{ user.name }}
                    </RouterLink>
                </td>
                <td
                    ><RouterLink
                        :to="{
                            name: NomRoute.AdminUpdateUser,
                            params: { uid: user.uid },
                        }"
                    >
                        {{ user.username }}
                    </RouterLink></td
                >
                <td
                    ><input
                        type="checkbox"
                        name="admin"
                        :checked="user.admin"
                        disabled
                /></td>
                <td
                    ><input
                        type="checkbox"
                        name="merchant"
                        :checked="user.merchant"
                        disabled
                /></td>
                <td>{{ user.amount }}</td>
                <td
                    ><button
                        type="button"
                        class="users-list__desactived"
                        @click="
                            desactivateUser(
                                user.uid,
                                user.locked,
                                user.username
                            )
                        "
                        v-html="lockSvg"
                    ></button
                ></td>
            </tr>
        </tbody>
    </table>
</template>

<style lang="scss" scoped>
.users-list {
    width: 100%;

    &__desactived {
        width: 24px;
        height: 24px;
        padding: 2px;
        color: #fff;
    }
}
</style>
