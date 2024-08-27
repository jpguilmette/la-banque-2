<script setup lang="ts">
import { IconsList } from './IconsList.def';

const open = defineModel('open', { type: Boolean, default: true });

const iconSelected = defineModel('icon', {
    type: String,
    default: 'smiley-empty',
});

const emit = defineEmits<{
    'icon-selected': [icon: string];
}>();
</script>

<template>
    <div class="overlay" :class="{ open }"></div>
    <ul class="icons-list" :class="{ open }">
        <li
            v-for="(category, index) in IconsList"
            :key="index"
            class="icons-list__category"
        >
            <h3 class="icons-list__category-title">{{ category.name }}</h3>
            <ul class="icons-list__category-list">
                <li
                    v-for="(icon, index) in category.icons"
                    :key="index"
                    class="icons-list__icon"
                >
                    <input
                        type="radio"
                        name="profile-icon"
                        class="icons-list__icon-input"
                        :checked="icon === iconSelected"
                        :id="icon"
                        @change="emit('icon-selected', icon)"
                    />
                    <label
                        :for="icon"
                        class="icons-list__icon-label"
                        :class="icon"
                    >
                        <img
                            :src="`/src/assets/icons/emoji/${icon}.png`"
                            class="icons-list__icon-img"
                            :class="{
                                selected: icon === iconSelected,
                            }"
                        />
                    </label>
                </li>
            </ul>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;

    &.open {
        display: block;
        background-color: rgba(110, 99, 94, 0.5);
    }
}
.icons-list {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    display: flex;
    max-width: 520px;
    flex-wrap: wrap;
    gap: 1rem;
    list-style: none;
    padding: 0 16px;
    margin: 1em 0 0;
    max-height: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 1001;
    transition: max-height 300ms;

    &.open {
        max-height: 400px;
        border: 1px solid #24b3f4;
    }

    &__category {
        flex: 1 1 100%;
    }

    &__category-title {
        font-size: 1.5rem;
        margin: 0 0 1rem;
    }

    &__category-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1.6rem;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    &__icon {
        flex: 0 1 48px;
    }

    &__icon-input {
        display: none;
    }

    &__icon-label {
        cursor: pointer;

        &.smiley-empty {
            img {
                border-radius: 50%;
                background-color: #fff;
            }
        }
    }

    &__icon-img {
        width: 48px;
        height: 48px;
        will-change: filter;
        transition: filter 200ms;
    }

    &__icon-img.selected,
    &__icon-img:hover {
        filter: drop-shadow(0 0 1em #24b3f4);
    }
}
</style>
