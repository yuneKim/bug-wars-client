<script setup lang="ts">
import { authService } from '@/services/authService';
import { useRouter } from 'vue-router';

const router = useRouter();
const token = router.currentRoute.value.params.emailToken;
const username = router.currentRoute.value.params.username;

const response = await authService.verifyEmail(username[0], token[0]);

if (response.data){
    //valid
} else {
    //not valid
}
</script>

<template>
    <div>
       <p>You are Verified</p>
    </div>
</template>

<style scoped>
p {
    color: white;
}
</style>