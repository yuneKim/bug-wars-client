import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import GameLobby from './GameLobby.vue';

describe('GameLobby.vue', () => {
    it('displays text', () => {
        const wrapper = shallowMount(GameLobby);
        expect(wrapper.find('h1').text()).toBe('Game Lobby');
    })
})