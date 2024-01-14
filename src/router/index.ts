import { useAuthStore } from '@/stores/auth';
import LandingPageView from '@/views/LandingPageView.vue';
import { storeToRefs } from 'pinia';
import { createRouter, createWebHashHistory } from 'vue-router';

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
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
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
      component: () => import('@/views/GameLobbyView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/how-to-play',
      name: 'howToPlay',
      component: () => import('@/views/HowToPlayView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/credits',
      name: 'credits',
      component: () => import('@/views/CreditsView.vue'),
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
      component: () => import('@/views/ScriptListView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const { setPostLoginDestination } = useAuthStore();
  const { user } = storeToRefs(useAuthStore());
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);

  if (requiresAuth && !user.value.roles.includes('ROLE_USER')) {
    setPostLoginDestination(to.name != null && to.name !== 'login' ? to.name : 'home');
    return { name: 'login' };
  }
});

export default router;
