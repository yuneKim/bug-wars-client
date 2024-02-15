<script setup lang="ts">
import { ref } from 'vue';
import { authService } from '@/services/authService';
import Dropdown from 'primevue/dropdown';
import defaultProfilePicture from '@/assets/profile-images/profile-default.png';
import profileImage1 from '@/assets/profile-images/profile-image1.png';
import profileImage2 from '@/assets/profile-images/profile-image2.png';
import profileImage3 from '@/assets/profile-images/profile-image3.png';
import profileImage4 from '@/assets/profile-images/profile-image4.png';
import profileImage5 from '@/assets/profile-images/profile-image5.png';
import profileImage6 from '@/assets/profile-images/profile-image6.png';
import profileImage7 from '@/assets/profile-images/profile-image7.png';

const editedUser = ref({
  profileName: '',
  email: '',
  newPassword: '******',
  confirmPassword: '******', 
  profilePicture: '',
});


const authError = ref('');

const profilePictures = [
  { name: 'Default Profile Picture', url: defaultProfilePicture, id: "0" },
  { name: 'Profile Image 1', url: profileImage1, id: "1" },
  { name: 'Profile Image 2', url: profileImage2, id: "2" },
  { name: 'Profile Image 3', url: profileImage3, id: "3" },
  { name: 'Profile Image 4', url: profileImage4, id: "4" },
  { name: 'Profile Image 5', url: profileImage5, id: "5" },
  { name: 'Profile Image 6', url: profileImage6, id: "6" },
  { name: 'Profile Image 7', url: profileImage7, id: "7" },
];

async function updateProfile() {
  if (editedUser.value.newPassword !== editedUser.value.confirmPassword) {
    authError.value = 'Password and Confirm Password do not match.';
    return;
  }

  const profileUpdateDto = {
    profileName: editedUser.value.profileName,
    email: editedUser.value.email,
    newPassword: editedUser.value.newPassword,
    confirmPassword: editedUser.value.confirmPassword,
    profilePicture: editedUser.value.profilePicture,
  };

  authService.updateUserProfile(profileUpdateDto)
    .then(() => {
      authError.value = 'Profile updated successfully.';
    })
    .catch((error) => {
      authError.value = error.response ? error.response.data.message : 'An error occurred.';
    });
}

authService.getUserProfile().then(user => {
  editedUser.value.profileName = user.profileName;
  editedUser.value.email = user.email;
  editedUser.value.profilePicture = user.profilePicture;
});

</script>

<template>
    <div class="profile-settings-container">
      <div class="profile-settings-details">
      <h1 class="profile-settings-header">Profile Settings</h1>
  
      <div class="form-group">
        <label class="label" for="profile-name">Change Profile Name: &nbsp <input v-model="editedUser.profileName" type="text" /></label>
      </div>
  
      <div class="form-group">
        <label class="label" for="email">Change Email: &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp<input v-model="editedUser.email" type="email" /></label>
      </div>
  
      <div class="form-group">
        <label class="label" for="new-password">Change Password: &nbsp &nbsp &nbsp &nbsp &nbsp<input v-model="editedUser.newPassword" type="password" /></label>
      </div>
  
      <div class="form-group">
        <label class="label" for="confirm-password">Confirm Password: &nbsp &nbsp &nbsp &nbsp<input v-model="editedUser.confirmPassword" type="password" id="confirm-password" name="confirm-password"/></label>
      </div>

      <div class="form-group">
        <label class="label" for="profile-picture">Change Profile Picture:</label>
      <Dropdown
            id="profile-image-dropdown"
            :options="profilePictures"
            optionLabel="name"
            optionValue="url"
            v-model="editedUser.profilePicture"
          >
          </Dropdown>
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
  color: #fff;
}

.profile-settings-container a {
  align-items: end;
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
    padding-inline: 10px;
    margin-block: 50px;
  }
}

</style>
