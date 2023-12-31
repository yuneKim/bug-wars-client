import type { RegisterDto } from '@/types';
import { describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import RegisterForm from './RegisterForm.vue';
import { authService } from '@/services/authService';


vi.mock('@/services/authService');

describe('RegisterForm.vue', () => {
    it('renders register form', () => {
        const wrapper = shallowMount(RegisterForm);
        expect(wrapper.findComponent(RegisterForm).exists()).toBe(true);
    });

    it('has form inputs', () => {
        const wrapper = shallowMount(RegisterForm);
        expect(wrapper.find('#username').exists()).toBe(true);
        expect(wrapper.find('#password').exists()).toBe(true);
        expect(wrapper.find('#confirm-password').exists()).toBe(true);
        expect(wrapper.find('#email').exists()).toBe(true);
    });

    it('calls register on form submit', async () => {
        const wrapper = shallowMount(RegisterForm);

        const registerDto: RegisterDto = {
            username: 'some_user',
            password: 'some_password',
            email: 'some_email'
        };

        const usernameInput = wrapper.find('#username');
        await usernameInput.setValue(registerDto.username);
        const passwordInput = wrapper.find('#password');
        await passwordInput.setValue(registerDto.password);
        const confirmPasswordInput = wrapper.find('#confirm-password');
        await confirmPasswordInput.setValue(registerDto.password);
        const emailInput = wrapper.find('#email');
        await emailInput.setValue(registerDto.email);

        expect((usernameInput.element as HTMLInputElement).value).toBe(registerDto.username);
        expect((passwordInput.element as HTMLInputElement).value).toBe(registerDto.password);
        expect((emailInput.element as HTMLInputElement).value).toBe(registerDto.email);

        await wrapper.find('form').trigger('submit');

        expect(authService.register).toHaveBeenCalledOnce();
        wrapper.unmount();
    });


});