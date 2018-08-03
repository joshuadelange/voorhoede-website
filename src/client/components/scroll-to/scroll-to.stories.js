import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import ScrollTo from './scroll-to.vue'
import README from './README.md'

const stories = storiesOf('Components/Scroll To', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('scroll-to', ScrollTo)

stories.add(
  'Scroll To',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: `
    <div style="position: absolute; top: 200px; left: 50px;">
      <scroll-to />
    </div>
    `,
  }),
)
