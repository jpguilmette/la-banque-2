<script setup lang="ts">
import { defineModel, defineProps, withDefaults, computed, watch } from 'vue'
import { NotificationType } from './Notification.def'
import SvgClose from './../../assets/icons/close.svg?raw'
import SvgSuccess from './../../assets/icons/success.svg?raw'
import SvgInfo from './../../assets/icons/info.svg?raw'
import SvgWarning from './../../assets/icons/warning.svg?raw'
import SvgError from './../../assets/icons/error.svg?raw'

const open = defineModel('open', { type: Boolean, default: true })

let timeout: number;

const props = withDefaults(defineProps<{
    type?: NotificationType;
    open: boolean
}>(), {type: NotificationType.Success});

const notificationIcon = computed(() => {
  switch (props.type) {
    case NotificationType.Success: 
      return SvgSuccess
    case NotificationType.Info: 
      return SvgInfo
    case NotificationType.Warning: 
      return SvgWarning
    case NotificationType.Error: 
      return SvgError
  }
})

const close = () => {
  open.value = false;
}

watch(open, (newValue) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  if (newValue) {
    timeout = window.setTimeout(() => {
      open.value = false
    }, 5000);
  }
})

</script>

<template>
  {{ open }}
  <div v-if="props.open" :class="`notification ${props.type}`">
    <div class="notification__icon" v-html="notificationIcon"></div>
    <div class="notification__content"><slot /></div>
    <button class="notification__close" @click="close" v-html="SvgClose"></button>
  </div>
</template>

<style lang="scss" scoped>
.notification {
  position: fixed;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  padding: 8px;
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  transition: 300ms;

  &.success {
    color: #0ad406;
    border-color: #24f10675;
    background-color: #07954250;
    box-shadow: 0 0 2px #42be65;

    &:hover {
      color: #011801;
      background-color: #079542;
    }
  }

  &.info {
    color: #0396ff;
    border-color: #062cf175;
    background-color: #07499550;
    box-shadow: 0 0 2px #0396ff;

    &:hover {
      background-color: #074995
    }
  }

  &.warning {
    color: #f1c21b;
    border-color: #f18e06cf;
    background-color: #dc800129;
    box-shadow: 0 0 2px #ffb103;

    &:hover {
      color: #443708;
      background-color: #dc8001;
    }
  }

  &.error {
    color: #ff0303;
    border-color: #f10606cf;
    background-color: #dc110129;
    box-shadow: 0 0 2px #ff0303;

    &:hover {
      color: #fd9a9a;
      background-color: #dc1101;
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
