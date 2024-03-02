<script setup lang="ts">
import { authService } from '@/services/authService';
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const router = useRoute();
const token = router.params.emailToken?.toString();
const username = router.params.username?.toString();

let message = ref('');
let message2 = ref('');

authService.verifyEmail(username, token).then((response) => {
    const isVerified = response.data;
    console.log('response', response);
    if (isVerified) {
        message.value = 'Your email is verified.';
        message2.value = 'Welcome to Bug Wars!';
    } else {
        message.value = 'You are not verified.';
}
}).catch((error) => {
    message.value = 'You are not verified.';
    console.log(error);
})

</script>

<template>
    <div class="flex">
       <p class="email-message"> {{ message2 }}</p>
       <p class="email-message"> {{ message }}</p>
    </div>
</template>

<style scoped>
.email-message {
    color: white;
    font-family: Oxanium, Arial, Helvetica, sans-serif;
    font-size: 1.7rem;
}
.flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 5%;
}
</style>