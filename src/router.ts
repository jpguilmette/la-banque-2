import { createWebHistory, createRouter } from 'vue-router'
import HomeView from './components/HelloWorld.vue'
import Connexion from './components/Connexion.vue'
import AdminCreateUser from './views/AdminCreateUser.vue'

export enum NomRoute {
  Accueil = 'accueil',
  AdminCreateUser = 'admin-create-user',
  Connexion = 'connexion',
  Deconnexion = 'deconnexion',
  Expiration = 'expiration',
  Test = 'test',
  Page404 = 'page-404',
}

const routes = [
  { path: '/', name: NomRoute.Accueil, component: HomeView}, 
  { path: '/connexion', name: NomRoute.Connexion, component: Connexion },
  { path: '/admin/creation-utilisateur', name: NomRoute.AdminCreateUser, component: AdminCreateUser },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router