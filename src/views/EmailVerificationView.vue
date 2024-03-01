<script setup lang="ts">
import { authService } from '@/services/authService';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const token = router.currentRoute.value.params.emailToken;
const username = router.currentRoute.value.params.username;

let message = ref('');
let message2 = ref('');
let message3 = ref('');

authService.verifyEmail(username[0], token[0]).then((response) => {
    const isVerified = response.data;
    console.log(response);
    if (isVerified) {
        message.value = 'Your email is verified.';
        message2.value = 'Welcome to Bug Wars!';
    } else {
        message.value = 'You are not verified.';
        message3.value = 'Verification link is expired.';
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
       <p class="email-message"> {{ message3 }}</p>
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