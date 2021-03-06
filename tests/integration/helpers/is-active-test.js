import { computed } from '@ember/object';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const RouterServiceMock = Service.extend({
  currentRouteName: computed('currentURL', function() {
    return this.get('currentURL').substring(1);
  }),

  isActive(routeName) {
    return this.get('currentRouteName') === routeName;
  }
});

module('helper:is-active', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:router', RouterServiceMock);
  });

  test('it renders and rerenders when currentURL changes', async function(assert) {
    const router = this.owner.lookup('service:router');

    router.set('currentURL', '/foo');
    this.set('targetRoute', 'bar');
    await render(hbs`{{is-active targetRoute}}`);

    assert.dom('*').hasText(
      'false',
      'is-active is not true when curren route is different from target route'
    );

    router.set('currentURL', '/bar');

    await settled();

    assert.dom('*').hasText('true', 'is-active is true now when URL has changed');

    router.set('currentURL', '/foo');

    await settled();

    assert.dom('*').hasText('false', 'is-active is false when URL has changed');
  });
});
