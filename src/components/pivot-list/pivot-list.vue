<template>
  <section class="pivot-list">
    <div
      v-if="hasBorderTop"
      class="pivot-list__border grid"
    />
    <div
      v-for="(pivot, index) in pivots"
      :key="index"
      class="pivot-list__item grid"
      :class="{
        'pivot-list__item--has-background': pivotHasBackground(index),
        'pivot-list__item--narrow': pivotNarrow,
      }"
    >
      <div
        class="pivot-list__item-content"
        :class="{
          'pivot-list__item-content--full-width': itemContentIsFullWidth(pivot),
          'pivot-list__item-content--narrow': itemContentIsNarrow(pivot),
        }"
      >
        <contact-form
          v-if="isContactForm(pivot)"
          :contact-person="pivot.contactPerson"
          :title="pivot.title || $t('lets_discuss')"
        />
        <div
          v-else
          class="pivot-list__item-text"
        >
          <h2
            v-if="pivot.title && !isNewsletterForm(pivot)"
            class="pivot-list__item-heading h3"
          >
            {{ pivot.title }}
          </h2>

          <rich-text-block
            v-if="pivot.body"
            :text="pivot.body"
            :large-text="true"
            class="pivot-list__item-body"
          />

          <app-button
            v-if="pivot.links[0]?.__typename === 'ExternalLinkRecord'"
            @click="trackLink(pivot.links[0].url)"
            :label="pivot.links[0].title"
            :to="pivot.links[0].url"
            external
          />

          <app-button
            v-else-if="pivot.links[0]?.__typename === 'InternalLinkRecord'"
            :label="pivot.links[0].title"
            :to="getDatoNuxtRoute(pivot.links[0].link)"
          />

          <newsletter-form
            v-if="isNewsletterForm(pivot)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    setup() {
      const { getDatoNuxtRoute } = useDatoNuxtRoute()

      return { getDatoNuxtRoute }
    },
    props: {
      pivots: {
        type: Array,
        required: true,
      },
      pivotNarrow: {
        type: Boolean,
        default: false,
      },
      canHaveBorderTop: {
        type: Boolean,
        default: true,
      },
      lastItemHasBackground: {
        type: Boolean,
        default: true,
      }
    },
    computed: {
      hasBorderTop() {
        const firstItemHasBackground = this.pivotHasBackground(0)
        return this.canHaveBorderTop && !firstItemHasBackground
      }
    },
    methods: {
      pivotHasBackground(pivotIndex) {
        const lastPivotIndex = this.pivots.length - 1

        return (this.lastItemHasBackground && pivotIndex === lastPivotIndex)
      },
      itemContentIsFullWidth(pivot) {
        return (
          this.isContactForm(pivot)
          || this.isNewsletterForm(pivot)
        )
      },
      itemContentIsNarrow(pivot) {
        return !this.itemContentIsFullWidth(pivot) && this.pivotNarrow
      },
      isContactForm(pivot) {
        return pivot.formType && pivot.formType === 'contact'
      },
      isNewsletterForm(pivot) {
        return pivot.formType && pivot.formType === 'newsletter'
      },
      trackLink (href) {
        useTrackEvent(
          'Click on Schedule Meeting',
          { props: { url: href, }, },
        );
      },
    },
  }
</script>

<style>
  .pivot-list {
    position: relative;
    grid-column: var(--grid-page);
  }

  .pivot-list__item--has-background {
    background-color: var(--bg-pastel);
  }

  .pivot-list__item-content--full-width {
    grid-column: var(--grid-page);
  }

  .pivot-list__item-content {
    padding-top: var(--spacing-large);
    padding-bottom: var(--spacing-big);
  }

  .pivot-list .newsletter-form {
    padding: 0;
  }

  .pivot-list__item-text {
    text-align: center;
  }

  .pivot-list__item-heading {
    margin-bottom: var(--spacing-medium);
  }

  .pivot-list__item-body {
    margin-top: 0;
    margin-bottom: var(--spacing-large);
  }

  @media (min-width: 720px) {
    /* Seperate element to make sure the border isn't dependent on the width of the first pivot */
    .pivot-list__border::before {
      content: '';
      border-top: 1px solid var(--very-dim);
      grid-column: var(--grid-content);
    }

    .pivot-list__item-content--narrow {
      grid-column: var(--grid-content-narrow);
    }
  }

  @media (min-width: 1100px) {
    .pivot-list__item-content--narrow {
      grid-column-start: 14;
      grid-column-end: 38;
    }
  }
</style>
