<script setup lang="ts">
</script>
<template>
    <div class="register-form-container">
        <h1 class="register-header">Register</h1>
        <form class="register-form">
            <input type="text" name="username" id="username" placeholder="username">
            <input type="password" name="password" id="password" placeholder="password">
            <input type="password" name="confirm-password" id="confirm-password" placeholder="confirm password">
            <input type="email" name="email" id="email" placeholder="email">
            <input type="button" value="Register">
        </form>
    </div>
</template>

<style scoped>
.register-header {
    text-align: center;
}
.register-form-container {
    display: block;
    margin: 0 auto;
    width: 300px;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>