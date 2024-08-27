import { createWebHistory, createRouter } from 'vue-router';
import Home from './views/Home.vue';
import Connection from './views/Connection.vue';
import AdminCreateUser from './views/AdminCreateUser.vue';
import AdminUpdateUser from './views/AdminUpdateUser.vue';
import { User } from './models/User';
import Profile from './views/Profile.vue';
import Expiration from './views/Expiration.vue';
import Page404 from './views/page404.vue';
import PlaygroundRoutes from './views/PlaygroundRoutes.vue';
import Legals from './views/Legals.vue';
import AdminUsersList from './views/AdminUsersList.vue';
import Soon from './views/Soon.vue';

export enum RouteName {
    Home = 'home',
    Connection = 'connection',
    Deconnexion = 'deconnexion',
    Profile = 'profile',
    Legals = 'legals',
    PlaygroundRoutes = 'playground-routes',
    AdminUsersList = 'admin-users-list',
    AdminCreateUser = 'admin-create-user',
    AdminUpdateUser = 'admin-update-user',
    Expiration = 'expiration',
    MissingPrivilege = 'missing-privilege',
    Page404 = 'page-404',
    Soon = 'soon',
}

const routes = [
    {
        path: '/',
        name: RouteName.Home,
        component: Home,
        meta: { unauthenticated: true },
    },
    {
        path: '/connection',
        name: RouteName.Connection,
        component: Connection,
        meta: { unauthenticated: true },
    },
    {
        path: '/expiration',
        name: RouteName.Expiration,
        component: Expiration,
        meta: { unauthenticated: true },
    },
    {
        path: '/profil/:uid',
        name: RouteName.Profile,
        component: Profile,
        meta: {},
        props: true,
    },
    {
        path: '/parcours',
        name: RouteName.PlaygroundRoutes,
        component: PlaygroundRoutes,
        meta: { unauthenticated: true },
    },
    {
        path: '/notes-legales',
        name: RouteName.Legals,
        component: Legals,
        meta: { unauthenticated: true },
    },
    {
        path: '/soon',
        name: RouteName.Soon,
        component: Soon,
        meta: { unauthenticated: true },
    },
    {
        path: '/admin/utilisateur',
        name: RouteName.AdminUsersList,
        component: AdminUsersList,
        meta: { role: 'admin' },
    },
    {
        path: '/admin/creation-utilisateur',
        name: RouteName.AdminCreateUser,
        component: AdminCreateUser,
        meta: { role: 'admin' },
    },
    {
        path: '/admin/utilisateur/:uid',
        name: RouteName.AdminUpdateUser,
        component: AdminUpdateUser,
        meta: { role: 'admin' },
        props: true,
    },
    {
        path: '/:pathMatch(.*)*',
        name: RouteName.Page404,
        component: Page404,
        meta: { unauthenticated: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _from, next) => {
    let user: User | null = null;
    const userSession = sessionStorage.getItem('user');

    if (userSession) {
        user = JSON.parse(userSession);
    }

    if (!(to.meta.unauthenticated || user)) {
        next({
            name: RouteName.Connection,
            query: { redirect: to.name?.toString() },
        });
        return;
    }

    if (to.meta.role === 'admin' && !user?.admin) {
        next({ name: RouteName.MissingPrivilege });
        return;
    }

    if (to.meta.role === 'merchant' && !user?.merchant) {
        next({ name: RouteName.Home });
        return;
    }

    next();
});

export default router;
