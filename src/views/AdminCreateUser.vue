<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { NotificationType } from './../components/Notification/Notification.def';
import { useLaBanqueStore } from '../store/store';
import { User } from '../models/User';
import {
    LA_BANQUE_ERROR_EVENT_NAME,
    LaBanqueError,
    LaBanqueErrorEventDetail,
} from '../models/LaBanqueError';
import { useRouter } from 'vue-router';
import { RouteName } from '../router';
import { LaBanqueDomain } from '../app';

enum ValidationState {
    mint,
    valid,
    invalid,
}

const name = ref('');
const nameValidationState = ref(ValidationState.mint);
const username = ref('');
const usernameValidationState = ref(ValidationState.mint);
const usernameAlreadyUsed = ref(false);
const password = ref('');
const passwordValidationState = ref(ValidationState.mint);
const copypassword = ref('');
const copypasswordValidationState = ref(ValidationState.mint);
const administrator = ref(false);
const merchant = ref(false);

const store = useLaBanqueStore();
const router = useRouter();

const createUser = async () => {
    try {
        if (validateUserInfo()) {
            if (
                administrator.value &&
                !confirm(
                    'Cet utilisateur sera un ADMINISTRATEUR. Cliquez Ok pour confirmer sinon il sera un utilisateur régulier'
                )
            ) {
                administrator.value = false;
            }

            if (
                merchant.value &&
                !confirm(
                    'Cet utilisateur sera un COMMERCANT. Cliquez Ok pour confirmer sinon il sera un utilisateur régulier'
                )
            ) {
                merchant.value = false;
            }

            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                `${username.value}${LaBanqueDomain}`,
                password.value
            );

            const user: User = {
                uid: userCredential.user.uid,
                name: name.value,
                username: username.value,
                photo: 'smiley-empty',
                admin: administrator.value,
                merchant: merchant.value,
                amount: 0,
                locked: false,
            };

            await store.addUser(user);

            name.value = '';
            username.value = '';
            password.value = '';
            copypassword.value = '';
            administrator.value = false;
            merchant.value = false;

            const customEvent = new CustomEvent<LaBanqueErrorEventDetail>(
                LA_BANQUE_ERROR_EVENT_NAME,
                {
                    detail: {
                        type: NotificationType.Success,
                        content: `L'utilisateur ${user.name} à été ajouté`,
                    },
                }
            );
            window.dispatchEvent(customEvent);
        }
    } catch (error) {
        const errorCode = (error as LaBanqueError).code;

        let content = '';
        const type = NotificationType.Error;

        if (errorCode === 'auth/email-already-in-use') {
            content =
                'Cet identifiant est déjà utilisé. Choisissiez en un autre.';
            usernameAlreadyUsed.value = true;
        } else if (errorCode === 'auth/email-already-in-use') {
            content =
                'Ce mot de passe est trop faible. Rendez le plus complexe.';
            passwordValidationState.value = ValidationState.invalid;
        } else {
            content = `Une erreur inattendue est arrivée. Veuillez noter ce code d'erreur: ${errorCode}`;
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

const validateUserInfo = () => {
    if (nameValidationState.value === ValidationState.mint) {
        nameValidationState.value = ValidationState.invalid;
    }
    if (usernameValidationState.value === ValidationState.mint) {
        usernameValidationState.value = ValidationState.invalid;
    }
    if (passwordValidationState.value === ValidationState.mint) {
        passwordValidationState.value = ValidationState.invalid;
    }
    if (copypasswordValidationState.value === ValidationState.mint) {
        copypasswordValidationState.value = ValidationState.invalid;
    }

    return (
        nameValidationState.value === ValidationState.valid &&
        usernameValidationState.value === ValidationState.valid &&
        passwordValidationState.value === ValidationState.valid &&
        copypasswordValidationState.value === ValidationState.valid
    );
};

const setNameValidationState = () => {
    if (name.value.length < 0) {
        nameValidationState.value = ValidationState.invalid;
    } else {
        nameValidationState.value = ValidationState.valid;
    }
};

const setUsernameValidationState = () => {
    const regEx = new RegExp('^[a-zA-Z0-9.-]*$');
    if (!regEx.test(username.value)) {
        usernameValidationState.value = ValidationState.invalid;
    } else {
        usernameValidationState.value = ValidationState.valid;
    }
    usernameAlreadyUsed.value = false;
};

const setPasswordValidationState = () => {
    if (password.value.length < 6) {
        passwordValidationState.value = ValidationState.invalid;
    } else {
        passwordValidationState.value = ValidationState.valid;
    }
};

const setCopyPasswordValidationState = () => {
    if (copypassword.value === '') {
        copypasswordValidationState.value = ValidationState.mint;
    } else {
        copypasswordValidationState.value =
            password.value === copypassword.value
                ? ValidationState.valid
                : ValidationState.invalid;
    }
};

const cancel = () => {
    router.push({ name: RouteName.Home });
};
</script>

<template>
    <h2>Ajouter un utilisateur</h2>

    <form @submit.prevent="createUser">
        <div class="field-group">
            <label for="name">Nom affiché</label>
            <input
                type="text"
                id="name"
                v-model="name"
                :class="{
                    error: nameValidationState === ValidationState.invalid,
                }"
                @change="setNameValidationState"
            />
            <div
                class="error-description"
                v-if="nameValidationState === ValidationState.invalid"
                >Ce champs est obligatoire</div
            >
        </div>
        <div class="field-group">
            <label for="username">Identifiant de connexion</label>
            <div>
                <input
                    type="text"
                    id="username"
                    v-model="username"
                    :class="{
                        error:
                            usernameValidationState ===
                                ValidationState.invalid || usernameAlreadyUsed,
                    }"
                    @change="setUsernameValidationState"
                />
                {{ LaBanqueDomain }}
            </div>
            <div class="info"
                >Un seul mot, sans espace, sans accent et sans caratères
                spéciaux</div
            >
            <div
                class="error-description"
                v-if="usernameValidationState === ValidationState.invalid"
                >Ce nom d'utilisateur contient des caractères interdits.</div
            >
            <div class="error-description" v-if="usernameAlreadyUsed"
                >Cet identifiant est déjà utilisé.</div
            >
        </div>
        <div class="field-group">
            <label for="password">Mot de passe</label>
            <input
                type="password"
                id="password"
                v-model="password"
                :class="{
                    error: passwordValidationState === ValidationState.invalid,
                }"
                @change="setPasswordValidationState"
            />
            <div class="info">Minimum 6 caractères</div>
            <div
                class="error-description"
                v-if="passwordValidationState === ValidationState.invalid"
                >Ce mot de passe n'est pas assez sécuritaire.</div
            >
        </div>
        <div class="field-group">
            <label for="copypassword">Réécrire le mot de passe</label>
            <input
                type="password"
                id="copypassword"
                v-model="copypassword"
                :class="{
                    error:
                        copypasswordValidationState === ValidationState.invalid,
                }"
                @change="setCopyPasswordValidationState"
            />
            <div
                class="error-description"
                v-if="copypasswordValidationState === ValidationState.invalid"
            >
                Vous devez copier exactement le mot de passe.
            </div>
        </div>
        <div class="field-group">
            <label for="administrator"
                >L'utilisateur est un administrateur?</label
            >
            <input type="checkbox" id="administrator" v-model="administrator" />
        </div>
        <div class="field-group">
            <label for="merchant">L'utilisateur est un commercant?</label>
            <input type="checkbox" id="merchant" v-model="merchant" />
        </div>
        <div class="buttons-group">
            <button type="submit">Créer utilisateur</button>
            <button type="reset" @click="cancel">Annuler</button>
        </div>
    </form>
</template>

<style scoped></style>
