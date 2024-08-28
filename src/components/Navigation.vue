<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useCurrentUser } from '../composables/currentUser';
import { LA_BANQUE_CURRENT_USER_EVENT_NAME } from '../models/User';
import { RouteName } from './../router';
import SvgBars from './../assets/bars.svg?raw';
import SvgClose from './../assets/close.svg?raw';
import Contacts from './Contacts/Contacts.vue';
import { useDisconnect } from './../composables/disconnected';
import { useRouter } from 'vue-router';

const { currentUser, handleCurrentUserEvent } = useCurrentUser();
const router = useRouter();
const disconnect = useDisconnect();

const navOpen = ref(false);

const onClick = () => {
    navOpen.value = !navOpen.value;
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
const onDisconnect = () => {
    navOpen.value = false;
    disconnect();
    router.push({ name: RouteName.Home });
};

const uid = computed(() => currentUser.value?.uid ?? 'NOT_FOUND');
const admin = computed(() => currentUser.value?.admin ?? false);
const photo = computed(
    () =>
        new URL(`/src/assets/${currentUser.value?.photo}.png`, import.meta.url)
            .href
);
const menuIcon = computed(() => (navOpen.value ? SvgClose : SvgBars));
</script>

<template>
    <img
        v-if="currentUser"
        :class="{ open: navOpen }"
        :src="photo"
        class="navigation__photo"
    />
    <a
        @click.prevent="onClick"
        class="navigation__button"
        v-html="menuIcon"
    ></a>

    <nav class="navigation" :class="{ open: navOpen }">
        <div class="navigation__profile">
            <template v-if="currentUser">
                <div class="navigation__profile-identity">
                    <img :src="photo" class="navigation__profile-photo" />
                    <RouterLink
                        :to="{
                            name: RouteName.Profile,
                            params: { uid: currentUser.uid },
                        }"
                        @click="navOpen = false"
                        class="navigation__profile-name"
                    >
                        {{ currentUser.name }}
                    </RouterLink>
                </div>
                <a
                    @click.prevent="onDisconnect"
                    class="navigation__profile-disconnect"
                >
                    Déconnexion
                </a>
            </template>
            <template v-else>
                <RouterLink
                    to="/connection"
                    class="navigation__profile-connect"
                    @click="navOpen = false"
                >
                    Se connecter
                </RouterLink>
            </template>
        </div>
        <ul>
            <li>
                <RouterLink
                    :to="{ name: RouteName.Home }"
                    @click="navOpen = false"
                >
                    Accueil
                </RouterLink>
            </li>
            <li>
                <RouterLink
                    :to="{ name: RouteName.Profile, params: { uid } }"
                    @click="navOpen = false"
                >
                    Mon profil
                </RouterLink>
            </li>
            <li>
                <RouterLink
                    :to="{ name: RouteName.PlaygroundRoutes }"
                    @click="navOpen = false"
                >
                    Parcours
                </RouterLink>
            </li>
            <li>
                <RouterLink
                    :to="{ name: RouteName.Legals }"
                    @click="navOpen = false"
                >
                    Notes légales
                </RouterLink>
            </li>
        </ul>
        <template v-if="admin">
            <h2>Admin</h2>
            <ul>
                <li>
                    <RouterLink
                        :to="{ name: RouteName.AdminUsersList }"
                        @click="navOpen = false"
                    >
                        Les utilisateurs
                    </RouterLink>
                </li>
                <li>
                    <RouterLink
                        :to="{ name: RouteName.AdminCreateUser }"
                        @click="navOpen = false"
                    >
                        Ajouter un utilisateur
                    </RouterLink>
                </li>
            </ul>
        </template>
        <Contacts class="navigation__contacts" />
    </nav>
</template>

<style lang="scss" scoped>
.navigation {
    &__button,
    &__photo,
    &__profile,
    &__contacts {
        display: none;
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    li {
        margin: 0;
        padding: 6px 0;
    }

    a {
        color: #143642;
        text-transform: uppercase;
        transition: color 200ms ease;
    }

    a:hover {
        color: #e0f0f5;
    }

    h2 {
        font-size: 1.5em;
        margin: 12px 0 0;
    }

    @media screen and (max-width: 991px) {
        max-height: 0;
        overflow: hidden;
        transition: max-height 300ms;
        width: 100%;

        &.open {
            max-height: 100vh;
        }

        &__button {
            color: #fff;
            display: block;
            width: 32px;
            height: 32px;
            cursor: pointer;

            &:hover {
                filter: drop-shadow(0 0 4px #fff);
                transition: filter 200ms ease;
            }
        }

        &__photo {
            display: block;
            width: 32px;
            height: 32px;

            &.open {
                display: none;
            }
        }

        &__profile {
            display: block;
            margin: 12px 0;
            padding: 12px;
            border: 1px solid #143642;
            background-color: #f68755;

            &-photo {
                width: 32px;
                height: 32px;
                border-radius: 50%;
            }

            &-identity {
                display: flex;
                gap: 10px;
                align-items: center;
                font-size: 1.8em;
            }

            &-disconnect {
                display: block;
                margin-top: 12px;
                font-size: 0.9em;
            }
        }

        &__contacts {
            display: flex;
            margin: 24px 0 12px !important;
        }
    }
}
</style>
