import { useAuthStore } from '@/stores/auth';
import CreditsView from '@/views/CreditsView.vue';
import GameLobbyView from '@/views/GameLobbyView.vue';
import HowToPlayView from '@/views/HowToPlayView.vue';
import LandingPageView from '@/views/LandingPageView.vue';
import LoginView from '@/views/LoginView.vue';
import ScriptListView from '@/views/ScriptListView.vue';
import { storeToRefs } from 'pinia';
import { createRouter, createWebHashHistory } from 'vue-router';
import RegisterView from '../views/RegisterView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPageView,
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: '/script-editor/:id?',
      name: 'scriptEditor',
      component: () => import('@/views/ScriptEditorView.vue'),
    },
    {
      path: '/game-lobby',
      name: 'gameLobby',
      component: GameLobbyView,
      meta: { requiresAuth: false },
    },
    {
      path: '/how-to-play',
      name: 'howToPlay',
      component: HowToPlayView,
      meta: { requiresAuth: false },
    },
    {
      path: '/credits',
      name: 'credits',
      component: CreditsView,
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/scripts',
      name: 'scripts',
      component: ScriptListView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const { user } = storeToRefs(useAuthStore());
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);

  if (requiresAuth && !user.value.roles.includes('ROLE_USER')) {
    return { name: 'login' };
  }
});

export default router;
