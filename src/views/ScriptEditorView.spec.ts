import { describe, expect, it } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import { default as ScriptEditor, default as ScriptEditorView } from './ScriptEditorView.vue';

describe('ScriptEditorView.vue', () => {
  it('renders ScriptEditor component', () => {
    const wrapper = shallowMount(ScriptEditorView);
    expect(wrapper.findComponent(ScriptEditor).exists()).toBe(true);
  });
});
