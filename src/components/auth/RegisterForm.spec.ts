import type { RegisterDto } from '@/types';
import { describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import RegisterForm from './RegisterForm.vue';
import { authService } from '@/services/authService';
import type { AxiosResponse } from 'axios';


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
        const div = document.createElement('div');
        div.id = 'root';
        document.body.appendChild(div);

        const wrapper = shallowMount(RegisterForm, {
            attachTo: '#root'
        });

        const registerDto: RegisterDto = {
            username: 'some_user',
            password: 'some_password',
            email: 'some_email'
        };

        const mockResponse: AxiosResponse<any, any> = {
            data: '',
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as any,
          };

        vi.mocked(authService.register).mockResolvedValue(mockResponse)
        const usernameInput = wrapper.find('#username');
        await usernameInput.setValue(registerDto.username);
        const passwordInput = wrapper.find('#password');
        await passwordInput.setValue(registerDto.password);
        const emailInput = wrapper.find('#email');
        await emailInput.setValue(registerDto.email);

        expect((usernameInput.element as HTMLInputElement).value).toBe(registerDto.username);
        expect((passwordInput.element as HTMLInputElement).value).toBe(registerDto.password);
        expect((emailInput.element as HTMLInputElement).value).toBe(registerDto.email);

        await wrapper.find('button').trigger('click');

        expect(authService.register).toHaveBeenCalledOnce();
        wrapper.unmount();
    });


});