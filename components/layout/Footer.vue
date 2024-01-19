<script setup lang="ts">
export interface Link {
  title: string
  href: string
}

export interface FooterData {
  title: string
  links: Link[]
  contactText: string
  mailto: string
  legalTexts: {
    allRightsReserved: string
    developedBy: string
  }
}

export interface FooterProps extends FooterData { }

const { links } = defineProps<FooterProps>()

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="Footer">
    <div class="container">
      <div class="information-container">
        <span class="title">{{ title }}</span>
        <div class="contact-container">
          <p class="contact">{{ contactText }}</p>
          <NuxtLink class="contact-email" :to="`mailto:${mailto}`">
            {{ mailto }}
          </NuxtLink>
        </div>
      </div>

      <svg width="100%" height="1" class="divider">
        <line x1="0" y1="0" x2="100%" y2="0" stroke="currentColor" stroke-width="1" />
      </svg>

      <div class="legal-container">
        <span class="all-rights-reserved">
          © {{ currentYear }} - {{ legalTexts.allRightsReserved }}
        </span>
        <span class="developed-by">{{ legalTexts.developedBy }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.Footer {
  background-color: var(--color-black);
  color: var(--color-white);
  display: flex;
  justify-content: center;
  margin-top: 128px;

  .container {
    @extend %grid;
    @extend %container;

    padding-top: 36px;
    padding-bottom: 48px;

    @media screen and (min-width: $screen-mobile) {
      padding-top: 80px;
      padding-bottom: 96px;
    }

    .information-container {
      grid-column: 1 / -1;

      @media screen and (min-width: $screen-mobile) {
        grid-column: 2 / span 6;
      }

      .title {
        @extend %text-h1;

        font-family: var(--font-family-dm-sans-text);
        font-style: normal;
        color: var(--color-white);
        font-size: 64px;
      }

      .contact-container {
        @extend %text-h2;

        color: var(--color-white);
        display: flex;
        flex-direction: column;
        margin-top: 16px;
        gap: 4px;

        .contact {
          @extend %text-body;

          color: var(--color-white);
          font-size: 12px;
          text-transform: capitalize;
          font-style: italic;
        }

        .contact-email {
          @extend %text-body;

          color: var(--color-white);
          font-size: 12px;
          font-weight: 800;
          text-decoration: underline;
        }
      }
    }

    .divider {
      grid-column: 1 / -1;
      margin: 48px 0 16px 0;
      display: block;

      @media screen and (min-width: $screen-mobile) {
        grid-column: 2 / -2;
      }
    }

    .legal-container {
      @extend %text-body;

      color: var(--color-white);
      grid-column: 1 / -1;
      display: flex;
      gap: 24px;
      font-size: 12px;

      .all-rights-reserved {
        flex: 1;
      }

      .developed-by {
        flex: 1;
        text-align: right;
      }

      @media screen and (min-width: $screen-mobile) {
        grid-column: 2 / -2;
      }
    }
  }
}
</style>