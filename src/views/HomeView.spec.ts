import { describe, expect, it } from 'vitest';

import HelloWorld from '@/components/HelloWorld.vue';
import { mount } from '@vue/test-utils';

describe('HomeView', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Hello Vitest' } });
    expect(wrapper.text()).toContain('Hello Vitest');
  });
});
