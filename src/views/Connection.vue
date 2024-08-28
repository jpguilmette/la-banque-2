<script setup lang="ts">
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useLaBanqueStore } from '../store/store';
import { ref } from 'vue';
import {
    LA_BANQUE_ERROR_EVENT_NAME,
    LaBanqueError,
    LaBanqueErrorEventDetail,
} from '../models/LaBanqueError';
import { NotificationType } from '../components/Notification/Notification.def';
import { LA_BANQUE_CURRENT_USER_EVENT_NAME, User } from '../models/User';
import { useRoute, useRouter } from 'vue-router';
import { RouteName } from '../router';
import { LaBanqueDomain } from './../app';

const route = useRoute();
const router = useRouter();

const username = ref('');
const password = ref('');

const connection = async (event: Event) => {
    event.preventDefault();
    const store = useLaBanqueStore();
    const auth = getAuth();

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            `${username.value}${LaBanqueDomain}`,
            password.value
        );

        const uid = userCredential.user.uid;

        const currentUser = await store.getUser(uid);

        sessionStorage.setItem('user', JSON.stringify(currentUser));

        const customEvent = new CustomEvent<User>(
            LA_BANQUE_CURRENT_USER_EVENT_NAME,
            {
                detail: currentUser,
            }
        );
        window.dispatchEvent(customEvent);

        const redirect = route.query.redirect as string;
        if (redirect) {
            router.push({ name: redirect, params: { uid } });
        } else {
            router.push({
                name: RouteName.Profile,
                params: { uid },
            });
        }
    } catch (err) {
        const error = err as LaBanqueError;

        const type = NotificationType.Error;
        let content = '';

        switch (error.code) {
            case 'auth/invalid-email':
                content = "Le nom d'utilisateur n'est pas valide";
                break;
            case 'auth/user-disabled':
                content = 'Ce compte est désactivé';
                break;
            case 'auth/user-not-found':
                content =
                    "Cette adresse courriel n'existe pas dans notre système. Veuillez réessayer.";
                break;
            case 'auth/missing-password':
                content = 'Le Mot de passe est manquant';
                break;
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                content =
                    "Nous n'avons pas réussi à vous connecter. Vérifiez votre nom d'utilisateur, votre mot de passe et réessayez.";
                break;
            default:
                content = error.message;
                break;
        }

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
</script>

<template>
    <h2>Se connecter</h2>

    <form @submit="connection">
        <div class="field-group">
            <label for="username">Nom d'utilisateur</label>
            <input
                type="text"
                id="username"
                v-model="username"
                autocomplete="on"
            />
        </div>
        <div class="field-group">
            <label for="password">Mot de passe</label>
            <input
                type="password"
                id="password"
                v-model="password"
                autocomplete="on"
            />
        </div>
        <div class="buttons-group">
            <button type="submit">Connexion</button>
        </div>
    </form>
</template>

<style scoped></style>
