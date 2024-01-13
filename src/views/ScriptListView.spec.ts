import { describe, expect, it } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import ScriptListView from './ScriptListView.vue';
import ScriptList from '@/components/scripts/ScriptList.vue';

describe('ScriptListView.vue', () => {
  it('renders ScriptList component', () => {
    const wrapper = shallowMount(ScriptListView);
    expect(wrapper.findComponent(ScriptList).exists()).toBe(true);
  });
});
