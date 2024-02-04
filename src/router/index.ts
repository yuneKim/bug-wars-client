import { useAuthStore } from '@/stores/auth';
import LandingPageView from '@/views/LandingPageView.vue';
import { storeToRefs } from 'pinia';
import { START_LOCATION, createRouter, createWebHashHistory } from 'vue-router';

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
    {
      path: '/demo',
      name: 'demo',
      component: () => import('@/views/DemoView.vue'),
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach(async (to, from) => {
  const { setPostLoginDestination, loadUserFromLocalStorage } = useAuthStore();
  const { user } = storeToRefs(useAuthStore());
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);

  if (from === START_LOCATION) {
    if (requiresAuth) {
      await loadUserFromLocalStorage();
    } else {
      loadUserFromLocalStorage();
    }
  }

  if (requiresAuth && !user.value.roles.includes('ROLE_USER')) {
    setPostLoginDestination(to.name != null && to.name !== 'login' ? to.name : 'home');
    return { name: 'login' };
  } else if (!['login', 'register'].includes(to.name as string)) {
    setPostLoginDestination('home');
  }
});

export default router;
