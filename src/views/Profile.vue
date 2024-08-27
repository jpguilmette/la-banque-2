<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { NotificationType } from './../components/Notification/Notification.def';
import { useLaBanqueStore } from '../store/store';
import Loading from './../components/Loading/Loading.vue';
import {
    LA_BANQUE_ERROR_EVENT_NAME,
    LaBanqueError,
    LaBanqueErrorEventDetail,
} from '../models/LaBanqueError';
import { useCurrentUser } from '../composables/currentUser';
import IconsList from './../components/IconsList/IconsList.vue';
import { LA_BANQUE_CURRENT_USER_EVENT_NAME, User } from '../models/User';

const noUserFound = ref(false);
const iconsListOpen = ref(false);

const store = useLaBanqueStore();
const { currentUser } = useCurrentUser();

const props = defineProps<{
    uid: string;
}>();

onMounted(async () => {
    const user = await store.getUser(props.uid);

    if (!user) {
        noUserFound.value = true;

        const customEvent = new CustomEvent<LaBanqueErrorEventDetail>(
            LA_BANQUE_ERROR_EVENT_NAME,
            {
                detail: {
                    type: NotificationType.Warning,
                    content: 'Utilisateur non trouvé. Informer un responsable.',
                },
            }
        );
        window.dispatchEvent(customEvent);
    } else {
        currentUser.value = user;
    }
});

const toggleIconsList = () => {
    iconsListOpen.value = !iconsListOpen.value;
};

const changeIcon = (icon: string) => {
    iconsListOpen.value = false;
    if (currentUser.value) {
        currentUser.value.photo = icon;
        updateUser(currentUser.value);
    }
};

const updateUser = async (user: User) => {
    try {
        await store.updateUser(user);

        const customEvent = new CustomEvent<User>(
            LA_BANQUE_CURRENT_USER_EVENT_NAME,
            {
                detail: user,
            }
        );
        window.dispatchEvent(customEvent);
    } catch (error) {
        const errorCode = (error as LaBanqueError).code;

        const content = `Une erreur inattendue est arrivée. Veuillez noter ce code d'erreur: ${errorCode}`;
        const type = NotificationType.Error;

        const customEvent = new CustomEvent<LaBanqueErrorEventDetail>(
            LA_BANQUE_ERROR_EVENT_NAME,
            {
                detail: {
                    type,
                    content,
                },
            }
        );
        window.dispatchEvent(customEvent);
    }
};

const photo = computed(
    () =>
        new URL(`/src/assets/${currentUser.value?.photo}.png`, import.meta.url)
            .href
);
</script>

<template>
    <Loading v-if="!currentUser && !noUserFound" />
    <div v-else-if="noUserFound">
        <h2>Utilisateur non trouvé</h2>
        <img
            src="/src/assets/image/missing-profile.png"
            class="profile__not-found-img"
        />
    </div>
    <template v-else>
        <h2>Bonjour {{ currentUser?.name }}</h2>
        <p class="profile__username">[{{ currentUser?.username }}]</p>
        <div class="profile__amount">
            <label class="profile__amount-label" for="amount">
                Dans votre compte, vous avez présentement :
            </label>
            <p class="profile__amount-value">{{ currentUser?.amount }} $</p>
        </div>
        <form>
            <div class="field-group profile__photo">
                <label for="name">Changer votre image de profil: </label>
                <button type="button" @click.prevent="toggleIconsList">
                    <img :src="photo" alt="Image du profil" />
                </button>
            </div>
            <IconsList
                class="profile__photo-icons-list"
                :open="iconsListOpen"
                :icon="currentUser?.photo"
                @icon-selected="changeIcon"
            />
            <div class="field-group profile__theme">
                <label for="name">
                    Modifier le thème: (À venir prochainement)
                </label>
                <ul class="profile__theme-list">
                    <li>
                        <input
                            type="radio"
                            name="theme"
                            id="theme-light"
                            value="light"
                            disabled
                        />
                        <label for="theme-light">Clair</label>
                    </li>
                    <li>
                        <input
                            type="radio"
                            name="theme"
                            id="theme-dark"
                            value="dark"
                            disabled
                        />
                        <label for="theme-dark">Sombre</label>
                    </li>
                </ul>
            </div>
        </form>
        <br /><br />
    </template>
</template>

<style lang="scss" scoped>
.profile {
    &__not-found-img {
        display: flex;
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
    }

    &__username {
        position: relative;
        top: -1rem;
        margin-top: 0;
        font-size: 1em;
        color: #666;
    }

    &__amount {
        padding: 1rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        background-color: #f68755;
        border-radius: 15px;
        margin-bottom: 1rem;
    }

    &__amount-label {
        font-size: 1.75em;
    }

    &__amount-value {
        width: 100px;
        padding: 0;
        margin: 0;
        font-size: 1.75em;
    }

    &__photo {
        position: relative;
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;

        button {
            font-size: 0em;
            padding: 0.5rem;
        }

        img {
            width: 36px;
            height: 36px;
        }
    }

    &__theme-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            display: flex;
            gap: 0.5rem;
            color: #958984;
        }
    }
}
</style>
