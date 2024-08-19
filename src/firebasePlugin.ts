import { App } from 'vue';
import { firebaseApp } from './firebaseConfig';

const firebasePlugin = {
    install(app: App) {
        app.provide('firebase', firebaseApp);
    },
};

export default firebasePlugin;
