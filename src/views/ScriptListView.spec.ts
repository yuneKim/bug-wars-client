import { describe, expect, it } from 'vitest';

import ScriptList from '@/components/scripts/ScriptList.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import ScriptListView from './ScriptListView.vue';

describe('ScriptListView.vue', () => {
  it('renders ScriptList component', async () => {
    const TestComponent = defineComponent({
      components: { ScriptListView },
      template: '<Suspense><ScriptListView /></Suspense>',
    });
    const wrapper = mount(TestComponent, {
      shallow: true,
      global: {
        stubs: { Suspense: false, ScriptListView: false, Button: false },
      },
    });
    await flushPromises();
    expect(wrapper.findComponent(ScriptList).exists()).toBe(true);
  });
});
