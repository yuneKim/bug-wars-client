import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import GameLobbyView from './GameLobbyView.vue';

describe('GameLobbyView.vue', () => {
    it('renders GameLobby component', () => {
        const wrapper = shallowMount(GameLobbyView);
        expect(wrapper.findComponent(GameLobbyView).exists()).toBe(true);
    })
})