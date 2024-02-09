<script setup lang="ts">
import { ref } from 'vue';
import { authService } from '@/services/authService';

const editedUser = ref({
  username: 'test',
  email: '',
  newPassword: '******',
  confirmPassword: '******', 
  profilePicture: '',
});


const authError = ref('');
const profilePicture = ref('');

const profileImages = ref([
  { name: 'Image 1', url: '@/assets/profile-images/profile-image1.png' },
  { name: 'Image 2', url: '@/assets/profile-images/profile-image2.png' },
  { name: 'Image 3', url: '@/assets/profile-images/profile-image3.png' },
  { name: 'Image 4', url: '@/assets/profile-images/profile-image4.png' },
  { name: 'Image 5', url: '@/assets/profile-images/profile-image5.png' },
  { name: 'Image 6', url: '@/assets/profile-images/profile-image6.png' },
  { name: 'Image 7', url: '@/assets/profile-images/profile-image7.png' },
])

function updateProfile() {
  if (editedUser.value.newPassword !== editedUser.value.confirmPassword) {
    authError.value = 'Password and Confirm Password do not match.';
    return;
  }

  authService.updateUserProfile(editedUser.value)
    .then(() => {
      authError.value = 'Profile updated successfully.';
    })
    .catch((error) => {
      authError.value = error.response ? error.response.data.message : 'An error occurred.';
    });
}

authService.getUserProfile().then(user => {
  profilePicture.value = user.profilePicture;
});

</script>

<template>
    <div class="profile-settings-container">
      <div class="profile-settings-details">
      <h1 class="profile-settings-header">Profile Settings</h1>
  
      <div class="form-group">
        <label class="label" for="username">Username:</label>
        <input v-model="editedUser.username" type="text" id="username" name="username"/>
      </div>
  
      <div class="form-group">
        <label class="label" for="email">Email:</label>
        <input v-model="editedUser.email" type="email" id="email" name="email"/>
      </div>
  
      <div class="form-group">
        <label class="label" for="new-password">New Password:</label>
        <input v-model="editedUser.newPassword" type="password" id="new-password" name="new-password"/>
      </div>
  
      <div class="form-group">
        <label class="label" for="confirm-password">Confirm Password:</label>
        <input v-model="editedUser.confirmPassword" type="password" id="confirm-password" name="confirm-password"/>
      </div>
  
      <div class="form-group">
        <label class="label" for="profile-picture">Profile Picture:</label>
        <select v-model="editedUser.profilePicture" id="profile-picture" name="profile-picture">
          <option v-for="(image, index) in profileImages" :key="index" :value="image.url">{{ image.name }}</option>
        </select>
      </div>
  
      <div class="form-group">
        <button class="update-profile-btn" @click="updateProfile">SAVE CHANGES</button>
      </div>
  
      <div v-if="authError.length > 0" class="error-message">{{ authError }}</div>
    </div>
  </div>
  </template>

<style scoped>
.profile-settings-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  padding-block: 125px;
}

.profile-settings-details {
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
  padding: 10px;
  color: #fff;
}

.label {
  font-weight: bold;
  margin-bottom: 15px;
}

input {
  padding: 5px;
  border: 1px solid #ccc;
  background-color: rgba(18, 18, 18, 0.85);
  color: #fff;
  border-radius: 4px;
}

.update-profile-btn {
  padding: 10px;
  background-color: #721000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.update-profile-btn:hover {
  transition: ease-in-out 0.2s;
  background-color: #560c00;
}

.profile-settings-header {
  text-align: center;
  color: #fff;
}

@media screen and (max-width: 600px){
  .profile-settings-container {
    display: grid;
  }
}

</style>
