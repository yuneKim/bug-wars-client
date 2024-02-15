<script setup lang="ts">
import { authService } from '@/services/authService';
import { onMounted, ref } from 'vue';
import type { UserProfileResponse } from '@/types/index';
import defaultProfilePicture from '@/assets/profile-images/profile-default.png';

const authError = ref('');
const profilePicture = ref('');

const userProfile = ref<UserProfileResponse>({
  username: '',
  profileName: '',
  email: '',
  profilePicture: '',
  scriptAmount: 0,
});

onMounted(async () => {
  try {
    await fetchUserProfile();
  } catch (error) {
    authError.value = 'Failed to fetch user profile';
  }
});

async function fetchUserProfile() {
  try {
    const user = await authService.getUserProfile();
    userProfile.value = user;
    updateProfilePicture(user.profilePicture);
  } catch (error) {
    authError.value = 'Failed to fetch user profile';
  }
}

function updateProfilePicture(pictureUrl: string) {
  profilePicture.value = pictureUrl || defaultProfilePicture;
}

window.addEventListener('profilePictureUpdated', (event: Event) => {
  const customEvent = event as CustomEvent<{ profilePicture: string }>;
  updateProfilePicture(customEvent.detail.profilePicture);
});
</script>

<template>
  <div class="profile-page-container">
    <div class="profile-details">
      <h1 class="profile-header">User Profile</h1>

      <div class="form-group">
        <label class="label" id="username" for="username">Username: {{ userProfile.username }}</label>
      </div>
      <div class="form-group">
        <label class="label" id="profile-name" for="profile-name">Profile Name: {{ userProfile.profileName }}</label>
      </div>
      <div class="form-group">
        <label class="label" id="email" for="email">Email: {{ userProfile.email }}</label>
      </div>
      <div class="form-group">
        <label class="label" id="scriptAmount" for="scriptAmount">Script Count: {{ userProfile.scriptAmount }}</label>
      </div>
      <div class="form-group">
        <label class="label" id="profile-picture" for="profile-picture">Profile Picture:</label>
        <img v-if="profilePicture !== null" :src="profilePicture" alt="Profile Picture" />
        <img v-else :src="defaultProfilePicture" alt="Default Profile Picture" />
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
  text-align: center;
  color: #fff;
}

.profile-page-container a {
  text-align: center;
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
  top: -115px;
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
  border-radius: 8px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  color: #fff;
}

@media screen and (max-width: 600px){
  .profile-page-container {
    padding-inline: 10px;
    margin-block: 50px;
  }
}
</style>
