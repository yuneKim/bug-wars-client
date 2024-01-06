import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import LandingPage from './LandingPage.vue';

describe('LandingPage.vue', () => {
    it('displays text', () => {
        const wrapper = shallowMount(LandingPage);
        expect(wrapper.find('[data-test="gameLobby"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="scriptEditor"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="howToPlay"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="credits"]').exists()).toBe(true);
    })
})