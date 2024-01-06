import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import HowToPlayView from './HowToPlayView.vue';

describe('HowToPlayView.vue', () => {
    it('renders HowToPlay component', () => {
        const wrapper = shallowMount(HowToPlayView);
        expect(wrapper.findComponent(HowToPlayView).exists()).toBe(true);
    })
})