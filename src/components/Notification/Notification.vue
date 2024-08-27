<script setup lang="ts">
import { defineModel, defineProps, withDefaults, computed, watch } from 'vue';
import { NotificationType } from './Notification.def';
import SvgClose from './../../assets/close.svg?raw';
import SvgSuccess from './../../assets/success.svg?raw';
import SvgInfo from './../../assets/info.svg?raw';
import SvgWarning from './../../assets/warning.svg?raw';
import SvgError from './../../assets/error.svg?raw';

const open = defineModel('open', { type: Boolean, default: true });

let timeout: number;

const props = withDefaults(
    defineProps<{
        type?: NotificationType;
    }>(),
    { type: NotificationType.Success }
);

const notificationIcon = computed(() => {
    switch (props.type) {
        case NotificationType.Success:
            return SvgSuccess;
        case NotificationType.Info:
            return SvgInfo;
        case NotificationType.Warning:
            return SvgWarning;
        case NotificationType.Error:
            return SvgError;
    }
});

const close = () => {
    open.value = false;
};

watch(open, (newValue) => {
    if (timeout) {
        clearTimeout(timeout);
    }

    if (newValue) {
        timeout = window.setTimeout(() => {
            open.value = false;
        }, 5000);
    }
});
</script>

<template>
    <div v-if="open" :class="`notification ${props.type}`">
        <div class="notification__icon" v-html="notificationIcon"></div>
        <div class="notification__content"><slot /></div>
        <button
            class="notification__close"
            @click="close"
            v-html="SvgClose"
        ></button>
    </div>
</template>

<style lang="scss" scoped>
.notification {
    position: fixed;
    top: 16px;
    left: 16px;
    right: 16px;
    display: flex;
    padding: 8px;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid;
    transition: 300ms;

    &.success {
        color: #011801;
        border-color: #24f42475;
        background-color: #24f42450;
        box-shadow: 0 0 2px #42be65;

        &:hover {
            background-color: #24f424;
        }
    }

    &.info {
        color: #0396ff;
        border-color: #062cf175;
        background-color: #07499550;
        box-shadow: 0 0 2px #0396ff;

        &:hover {
            background-color: #074995;
        }
    }

    &.warning {
        color: #181801;
        border-color: #f4f424cf;
        background-color: #f4f42470;
        box-shadow: 0 0 2px #ffb103;

        &:hover {
            background-color: #f4f424;
        }
    }

    &.error {
        color: #fff;
        border-color: #f42424cf;
        background-color: #f4242470;
        box-shadow: 0 0 2px #ff0303;

        &:hover {
            background-color: #f42424;
        }
    }

    &__icon {
        display: flex;
        flex-basis: 24px;
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }

    &__content {
        display: flex;
        flex: 1;
        font-size: 16px;
    }

    &__close {
        display: flex;
        flex-basis: 24px;
        width: 24px;
        height: 24px;
        margin-left: 8px;
        border: none;
        padding: 2px;
        background: none;
    }
}
</style>
