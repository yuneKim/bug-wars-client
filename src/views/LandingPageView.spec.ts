import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import LandingPageView from './LandingPageView.vue';

describe('LandingPageView.vue', () => {
    it('renders LandingPage component', () => {
        const wrapper = shallowMount(LandingPageView);
        expect(wrapper.findComponent(LandingPageView).exists()).toBe(true);
    })
})