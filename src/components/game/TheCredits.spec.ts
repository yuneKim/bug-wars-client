import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TheCredits from './TheCredits.vue';

describe('TheCredits.vue', () => {
    it('displays text', () => {
        const wrapper = shallowMount(TheCredits);
        expect(wrapper.find('h3').text()).toBe('Yune Kim - Tech Lead');
    })
})