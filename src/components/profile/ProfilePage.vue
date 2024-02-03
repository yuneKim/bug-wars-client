
import type { scriptService } from '@/services/scriptService';
<script setup lang="ts">
import { authService } from '@/services/authService';
import { scriptService } from '@/services/scriptService';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import type { UserProfileResponse } from '@/types/index';

const router = useRouter();
const authError = ref('');

const user = ref<UserProfileResponse>({
  username: '',
  email: '',
  profilePicture: '',
  scriptAmount: 0,
});

onMounted(async () => {
  try {
    const userProfile = await authService.getUserProfile();
    user.value = userProfile;
  } catch (error) {
    authError.value = 'Failed to fetch user profile';
  }
});
</script>

<template>
    <div class="profile-page-container">
        <div class="profile-details">
            <h1 class="profile-header">User Profile</h1>

            <div class="form-group">
                <label class="label" for="username">Username:</label>
                <p>{{  user.username  }}</p>
            </div>
            <div class="form-group">
                <label class="label" for="email">Email:</label>
                <p>{{  user.email }}</p>
            </div>
            <div class="form-group">
                <label class="label" for="profile-picture">Profile Picture</label>
                <img :src="user.profilePicture" alt="Profile Picture" />
            </div>
            <div class="form-group">
                <label class="label" for="scriptAmount">Amount of Scripts:</label>
                <p>{{ user.scriptAmount }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-page-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  padding-block: 150px;
}

.profile-details {
  margin: 0 auto;
  margin-block: auto;
  width: 100%;
  max-width: 400px;
  text-transform: uppercase;
  border: 0.5px solid white;
  background-color: rgba(18, 18, 18, 0.85);
  border-radius: 2px;
  position: relative;
  top: -75px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px; /* Adjust padding as needed */
  color: #fff;
}

.label {
  font-weight: bold;
  margin-bottom: 15px;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.profile-header {
  text-align: center;
  color: #fff;
}
</style>