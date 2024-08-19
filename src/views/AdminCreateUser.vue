<script setup lang="ts">
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Notification from './../components/Notification/Notification.vue'
import { NotificationType } from './../components/Notification/Notification.def'

enum ValidationState  {
    mint,
    valid,
    invalid
}

const name = ref('');
const nameValidationState = ref(ValidationState.mint);
const username = ref('');
const usernameValidationState = ref(ValidationState.mint);
const usernameAlreadyUsed = ref(false);
const password = ref('');
const passwordValidationState = ref(ValidationState.mint);
const administrator = ref(false);
const commercant = ref(false);
const notificationOpen = ref(false);
const notificationType = ref<NotificationType>();
const notificationContent = ref('');

const createUser = async () => {
    try {
        if (validateUserInfo()) {
            if (administrator.value && !confirm('Cet utilisateur sera un ADMINISTRATEUR. Cliquez Ok pour confirmer sinon il sera un utilisateur régulier')) {
                administrator.value = false;
            }

            if (commercant.value && !confirm('Cet utilisateur sera un COMMERCANT. Cliquez Ok pour confirmer sinon il sera un utilisateur régulier')) {
                commercant.value = false;
            }

            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, `${username.value}@labanque.com`, password.value);

            // TODO: Ajouter cet utilisateur à Firestore <uid, nom affiché, identifiant, photo, admin?, entrepreneur?> (Voir si je gère l'erreur)
            const user = userCredential.user;
            console.log('****', user)
        }
    } catch (error) {
        const errorCode = (error as {code: string}).code;

        notificationType.value = NotificationType.Error;

        if (errorCode === 'auth/email-already-in-use') {
            notificationContent.value = 'Cet identifiant est déjà utilisé. Choisissiez en un autre.'
        } else if (errorCode === 'auth/email-already-in-use') {
            notificationContent.value = 'Ce mot de passe est trop faible. Rendez le plus complexe.'
        } else {
            notificationContent.value = `Une erreur inattendue est arrivée. Veuillez noter ce code d'erreur: ${errorCode}`
        }

        notificationOpen.value = true;
    };
}

const validateUserInfo = () => {
    if (nameValidationState.value === ValidationState.mint) {
        nameValidationState.value =  ValidationState.invalid;
    }    
    if (usernameValidationState.value === ValidationState.mint) {
        usernameValidationState.value =  ValidationState.invalid;
    }    
    if (passwordValidationState.value === ValidationState.mint) {
        passwordValidationState.value =  ValidationState.invalid;
    }

    return nameValidationState.value === ValidationState.valid &&
        usernameValidationState.value === ValidationState.valid &&
        passwordValidationState.value === ValidationState.valid;
}

const setNameValidationState = () => {
    if (name.value.length < 0) {
        nameValidationState.value = ValidationState.invalid;
    } else {
        nameValidationState.value = ValidationState.valid;
    }
}

const setUsernameValidationState = () => {
    const regEx = new RegExp('^[a-zA-Z0-9.-]*$');
    if (!regEx.test(username.value)) {
        usernameValidationState.value = ValidationState.invalid;
    } else {
        usernameValidationState.value = ValidationState.valid;
    }
    usernameAlreadyUsed.value = false;
}

const setPasswordValidationState = () => {
    if (password.value.length < 6) {
        passwordValidationState.value = ValidationState.invalid;
    } else {
        passwordValidationState.value = ValidationState.valid;
    }
}

</script>

<template>
    {{ notificationOpen }}
    <Notification :type="notificationType" v-model:open="notificationOpen">{{ notificationContent }}</Notification>
    <h2>Création d'un utilisateur</h2>
    <form @submit.prevent="createUser">
        <div class="field-group">
            <label for="name">Nom affiché</label>
            <input type="text" id="name" v-model="name" :class="{'error': nameValidationState === ValidationState.invalid}" @change="setNameValidationState">
            <div class="error-description" v-if="nameValidationState === ValidationState.invalid">Ce champs est obligatoire</div>
        </div>
        <div class="field-group">
            <label for="username">Identifiant de connexion</label>
            <div>
                <input type="text" id="username" v-model="username" :class="{'error': usernameValidationState === ValidationState.invalid}" @change="setUsernameValidationState">
                @labanque.com
            </div>
            <div class="info">Un seul mot, sans espace, sans accent et sans caratères spéciaux</div>
            <div class="error-description" v-if="usernameValidationState === ValidationState.invalid">Ce nom d'utilisateur contient des caractères interdits.</div>
            <div class="error-description" v-if="usernameAlreadyUsed">Cet identifiant est déjà utilisé.</div>
        </div>
        <div class="field-group">
            <label for="password">Mot de passe</label>
            <input type="password" id="password" v-model="password" :class="{'error': passwordValidationState === ValidationState.invalid }" @change="setPasswordValidationState">
            <div class="info">Minimum 6 caractères</div>
            <div class="error-description" v-if="passwordValidationState === ValidationState.invalid">Ce mot de passe n'est pas assez sécuritaire.</div>
        </div>
        <div class="field-group">
            <label for="administrator">L'utilisateur est un administrateur?</label>
            <input type="checkbox" id="administrator" v-model="administrator">
        </div>
        <div class="field-group">
            <label for="commercant">L'utilisateur est un commercant?</label>
            <input type="checkbox" id="commercant" v-model="commercant">
        </div>
        <div class="buttons-group">
            <button type="submit">Créer utilisateur</button>
            <button type="reset">Annuler</button>
        </div>
    </form>
</template>

<style scoped>
.field-group,
.buttons-group {
    margin-top: 1rem;
}

label {
    display: block;
}

.info {
    font-size: 0.75rem;
}

.error {
    background-color: #c00;
}

.error-description {
    color: #c00;
}

</style>
