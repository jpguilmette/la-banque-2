<script setup lang="ts">
import SvgMessenger from './../../assets/icons/messenger.svg?raw';
import SvgTeams from './../../assets/icons/teams.svg?raw';
import SvgGoogleChat from './../../assets/icons/google-chat.svg?raw';
import SvgOutlook from './../../assets/icons/outlook.svg?raw';
import { RouteName } from './../../router';
</script>

<template>
    <ul class="contacts">
        <li>
            <a
                href="https://www.messengerkids.com"
                target="_blank"
                class="contacts__link"
                v-html="SvgMessenger"
            ></a>
        </li>
        <li>
            <!-- <a
                href=""
                target="_blank"
                class="contacts__link"
                v-html="SvgTeams"
            ></a> -->
            <router-link
                :to="{ name: RouteName.Soon }"
                class="contacts__link"
                v-html="SvgTeams"
            ></router-link>
        </li>
        <li>
            <!-- <a
                href=""
                target="_blank"
                class="contacts__link"
                v-html="SvgGoogleChat"
            ></a> -->
            <router-link
                :to="{ name: RouteName.Soon }"
                class="contacts__link"
                v-html="SvgGoogleChat"
            ></router-link>
        </li>
        <li>
            <!-- <a
                href=""
                target="_blank"
                class="contacts__link"
                v-html="SvgOutlook"
            ></a> -->
            <router-link
                :to="{ name: RouteName.Soon }"
                class="contacts__link"
                v-html="SvgOutlook"
            ></router-link>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.contacts {
    display: flex;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
        display: flex;
        gap: 12px;
        flex-direction: row;
    }

    a {
        width: 24px;
        height: 24px;
        color: #143642;
        transition: color 200ms ease;
    }

    a:hover {
        color: #e0f0f5;
    }
}
</style>
