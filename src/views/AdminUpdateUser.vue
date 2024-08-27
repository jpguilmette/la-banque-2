<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NotificationType } from './../components/Notification/Notification.def';
import { useLaBanqueStore } from '../store/store';
import { User } from '../models/User';
import Loading from './../components/Loading/Loading.vue';
import {
    LA_BANQUE_ERROR_EVENT_NAME,
    LaBanqueError,
    LaBanqueErrorEventDetail,
} from '../models/LaBanqueError';
import { RouteName } from '../router';
import { useRouter } from 'vue-router';
import { LaBanqueDomain } from '../app';

enum ValidationState {
    mint,
    valid,
    invalid,
}

const editUser = ref<User>();
const name = ref('');
const nameValidationState = ref(ValidationState.mint);
const amount = ref(0);
const amountValidationState = ref(ValidationState.mint);
const administrator = ref(false);
const administratorDirty = ref(false);
const merchant = ref(false);
const merchantDirty = ref(false);
const locked = ref(false);
const lockedDirty = ref(false);

const store = useLaBanqueStore();
const router = useRouter();

const props = defineProps<{
    uid: string;
}>();

onMounted(async () => {
    editUser.value = await store.getUser(props.uid);
    name.value = editUser.value?.name!;
    amount.value = editUser.value?.amount!;
    administrator.value = editUser.value?.admin!;
    merchant.value = editUser.value?.merchant!;
    locked.value = editUser.value?.locked!;
});

const updateUser = async () => {
    try {
        if (validateUserInfo()) {
            if (
                administrator.value &&
                administratorDirty.value &&
                !confirm(
                    'Cet utilisateur sera un ADMINISTRATEUR. Cliquez Ok pour confirmer sinon il sera un utilisateur régulier'
                )
            ) {
                administrator.value = false;
            }

            if (
                merchant.value &&
                merchantDirty.value &&
                !confirm(
                    'Cet utilisateur sera un COMMERCANT. Cliquez Ok pour confirmer sinon il sera un utilisateur régulier'
                )
            ) {
                merchant.value = false;
            }

            if (
                locked.value &&
                lockedDirty.value &&
                !confirm(
                    'Cet utilisateur sera DÉSACTIVÉ. Cliquez Ok pour confirmer sinon il restera actif'
                )
            ) {
                merchant.value = false;
            }

            const user: User = {
                uid: props.uid,
                name: name.value,
                username: editUser.value?.username!,
                photo: editUser.value?.photo!,
                admin: administrator.value,
                merchant: merchant.value,
                amount: amount.value,
                locked: locked.value,
            };

            await store.updateUser(user);

            // TODO: Gestion des erreurs
            console.log('****', user);
        }
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

const validateUserInfo = () => {
    if (nameValidationState.value === ValidationState.mint) {
        nameValidationState.value = ValidationState.valid;
    }
    if (amountValidationState.value === ValidationState.mint) {
        amountValidationState.value = ValidationState.valid;
    }

    return (
        nameValidationState.value === ValidationState.valid &&
        amountValidationState.value === ValidationState.valid
    );
};

const setNameValidationState = () => {
    if (name.value.length < 0) {
        nameValidationState.value = ValidationState.invalid;
    } else {
        nameValidationState.value = ValidationState.valid;
    }
};

const setAmountValidationState = () => {
    return !isNaN(+amount.value);
};

const cancel = () => {
    router.push({ name: RouteName.AdminCreateUser });
};
</script>

<template>
    <h2>Modifier les informations</h2>
    <Loading v-if="!editUser" />

    <form v-else @submit.prevent="updateUser">
        <div
            >{{ editUser?.photo }}{{ editUser?.username
            }}{{ LaBanqueDomain }}</div
        >
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
            <label for="amount">Montant dans son compte</label>
            <input
                type="number"
                id="amount"
                v-model="amount"
                min="0"
                step=".01"
                :class="{
                    error: nameValidationState === ValidationState.invalid,
                }"
                placeholder="0.00"
                @change="setAmountValidationState"
            />
            <div
                class="error-description"
                v-if="nameValidationState === ValidationState.invalid"
            >
                Doit être un nombre
            </div>
        </div>
        <div class="field-group">
            <label for="administrator"
                >L'utilisateur est un administrateur</label
            >
            <input
                type="checkbox"
                id="administrator"
                v-model="administrator"
                @click="administratorDirty = true"
            />
        </div>
        <div class="field-group">
            <label for="merchant">L'utilisateur est un commercant</label>
            <input
                type="checkbox"
                id="merchant"
                v-model="merchant"
                @click="merchantDirty = true"
            />
        </div>
        <div class="field-group">
            <label for="desactived">L'utilisateur est desactivé</label>
            <input
                type="checkbox"
                id="desactived"
                v-model="locked"
                @click="lockedDirty = true"
            />
        </div>
        <div class="buttons-group">
            <button type="submit">Enregistrer</button>
            <button type="reset" @click="cancel">Annuler</button>
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
