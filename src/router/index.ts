import LoginView from '@/views/LoginView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RegisterView from '../views/RegisterView.vue';
import LandingPageView from '@/views/LandingPageView.vue';
import GameLobbyView from '@/views/GameLobbyView.vue';
import HowToPlayView from '@/views/HowToPlayView.vue';
import CreditsView from '@/views/CreditsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPageView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/script-editor',
      name: 'scriptEditor',
      component: () => import('@/components/scriptEditor/ScriptEditor.vue'),
    },
    {
      path: '/game-lobby',
      name: 'gameLobby',
      component: GameLobbyView,
    },
    {
      path: '/how-to-play',
      name: 'howToPlay',
      component: HowToPlayView,
    },
    {
      path: '/credits',
      name: 'credits',
      component: CreditsView,
    }
  ],
});

export default router;
