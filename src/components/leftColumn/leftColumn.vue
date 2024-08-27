<script setup lang="ts">
import Contacts from '../Contacts/Contacts.vue';
import Navigation from '../Navigation.vue';
import { RouteName } from './../../router';
</script>

<template>
    <div class="left-column">
        <div class="left-column__inner">
            <div class="left-column__logo-text">
                <RouterLink
                    class="left-column__logo-text-link"
                    :to="{ name: RouteName.Home }"
                >
                    <img
                        class="left-column__logo"
                        src="/src/assets/icons/bank.png"
                        alt="Logo de La Banque"
                    />
                    <h1 class="left-column__text">La banque</h1>
                </RouterLink>
            </div>

            <p class="left-column__text-intro">
                Bienvenue dans la nouvelle application de La Banque. Connectez
                vous à votre compte pour en profiter au maximum. Vous pourrez y
                consulter votre compte.
            </p>
            <div class="left-column__divider"></div>
            <Navigation />
            <div class="left-column__divider"></div>
            <Contacts class="left-column__contacts" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.left-column {
    flex-basis: 25%;
    flex-shrink: 0;
    height: 100%;
    background-color: #f46524;
    overflow-x: auto;

    &__inner {
        padding: 50px 40px;
    }

    a {
        color: #e0f0f5;
    }

    a:hover {
        text-shadow: 0px 0px 4px #e0f0f5;
        transition: text-shadow 200ms ease;
    }

    &__logo-text-link {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &__logo {
        width: 100px;
        height: 100px;
    }

    &__text {
        margin-top: 0px;
        margin-bottom: 0px;
        color: #f0f0f0;
        font-size: 28px;
        line-height: 120%;
        font-weight: 600;
        text-transform: uppercase;
    }

    &__text-intro {
        margin: 20px 0;
        font-size: 12px;
    }

    &__divider {
        width: 50%;
        height: 1px;
        margin-top: 20px;
        margin-bottom: 20px;
        background-color: #143642;
    }

    @media screen and (max-width: 991px) {
        overflow-x: visible;
        flex-basis: content;

        &__inner {
            display: flex;
            flex-wrap: wrap;
            padding: 10px;
        }

        &__logo-text {
            flex: 1;
        }

        &__logo-text-link {
            flex-direction: row;
            align-items: normal;
            gap: 0.8em;
        }

        &__logo {
            width: 32px;
            height: 32px;
        }

        &__text-intro,
        &__divider,
        &__contacts {
            display: none;
        }
    }
}
</style>
