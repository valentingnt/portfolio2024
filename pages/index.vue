<script setup lang="ts">
import type { NavbarData } from '~/components/layout/Navbar.vue';
import type { BigTitleData } from '~/components/ui/BigTitle.vue';
import type { LinkData } from '~/components/ui/Link.vue';

type Tag = {
  id: string
  name: string
}

type ProjectSubInfoData = {
  title: string
  tags: Tag[]
  link: LinkData
}

interface HomePageData {
  bigTitle: BigTitleData
  link: LinkData
  // text: string
  // starsPattern: string
  // projectsSubInfo: ProjectSubInfoData[]
}

interface HomePageProps extends HomePageData { }

defineProps<HomePageProps>()

const MOCK_DATA: HomePageData = {
  bigTitle: {
    title: 'Développeur créatif.',
    subtitle: 'Valentin Genest'
  },
  link: {
    text: 'Contactez-moi',
  },
}
</script>

<template>
  <div class="HomePage">
    <div class="container">
      <UiBigTitle v-bind="MOCK_DATA.bigTitle" />
      <UiLink v-bind="MOCK_DATA.link" />

      <img class="stars" src="~/assets/img/stars.svg" />

      <p class="text">
        Je suis un individu qui a été décrit par certaines personnes comme étant quelqu'un qui n'attire pas spécialement
        l'attention. On dit de moi que ma simplicité est remarquable, ce qui ne me distingue guère des autres. Mon
        caractère est essentiellement basique, sans traits inhabituels ou distinctifs particuliers. Je mène une existence
        modeste, dépourvue d'extravagance ou de singularité apparente. Ma personnalité s'accorde harmonieusement avec les
        attentes générales, sans susciter d'opinions fortes. Ma banalité est telle que je me fonds aisément dans le
        paysage quotidien, sans laisser une empreinte mémorable ou provoquer des réactions intenses de la part des autres.
        Je suis perçu comme un individu tout à fait ordinaire, me fondant discrètement dans la norme sociale sans chercher
        à attirer l'attention. Mon existence s'écoule dans une routine discrète, rythmée par des activités ordinaires et
        des interactions sans éclat. Je ne suis ni une source d'inspiration ni une figure marquante. Ma modestie est si
        prononcée que je me confonds aisément avec la masse, sans jamais revendiquer une place particulière. Mon chemin se
        dessine sur les sentiers battus, sans dévier vers des horizons audacieux ou extravagants. Je suis simplement là,
        anonyme parmi tant d'autres, observant le monde qui m'entoure sans y laisser une empreinte indélébile. Mon
        quotidien se déploie dans une routine paisible, privilégiant la familiarité plutôt que les aventures audacieuses.
        Mes goûts et mes intérêts reflètent cette neutralité, favorisant les plaisirs simples et les activités
        conventionnelles. Je trouve satisfaction dans les petites joies de la vie ordinaire, les conversations ordinaires
        et les moments sans prétention. Mon existence se nourrit de la routine rassurante, où le confort de la
        prévisibilité l'emporte sur l'excitation de l'inconnu. Les événements qui ponctuent ma vie sont modestes, se
        déroulant dans les limites de l'ordinaire et ne s'aventurant que rarement vers des expériences exceptionnelles.
        Ainsi, je suis moi, un être qui évolue dans la sobriété, où la simplicité règne en maître. Je suis le témoin
        discret des jours qui s'écoulent, sans chercher à troubler l'ordre établi. Ma banalité est ma force tranquille, me
        préservant des tumultes de l'extraordinaire. Je suis le calme au milieu de la tempête, l'équilibre au sein de la
        frénésie. Ma vie peut sembler dépourvue de couleurs vives, mais c'est dans cette palette de nuances neutres que je
        trouve mon épanouissement. Je suis moi, l'antithèse de l'exubérance, un être qui embrasse avec sérénité la
        normalité. Les feux des projecteurs ne m'enivrent pas, car je préfère savourer la quiétude des instants modestes.
        Je suis l'artisan humble qui façonne sa destinée dans les silences ordinaires. Je trouve la beauté dans
        l'ordinaire, dans les détails discrets qui échappent aux regards superficiels. Ainsi, je poursuis ma route, humble
        parmi les humbles, sans chercher à briller mais à être en phase avec le monde qui m'entoure. Je suis moi, un
        individu qui trouve la plénitude dans l'authenticité de ma simplicité.
      </p>

    </div>
  </div>
</template>

<style scoped lang="scss">
.HomePage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .container {
    @extend %grid;
    @extend %container;

    margin-top: 72px;

    .BigTitle {
      margin-top: 20px;
      grid-column: 1 / span 5;
      grid-row: 1;

      @media screen and (min-width: $screen-mobile) {
        grid-column: 2 / span 4;
      }
    }

    .Link {
      margin-top: 32px;
      grid-column: 1 / span 3;
      grid-row: 2;

      @media screen and (min-width: $screen-mobile) {
        grid-column: 2 / span 2;
      }
    }

    .stars {
      display: none;
      grid-row: 3;

      @media screen and (min-width: $screen-tablet) {
        display: block;
        /* margin-top: 32px; */
        grid-column: 6 / -1;
      }

    }

    .text {
      margin-top: 50%;
      grid-column: 1 / -1;

      color: var(--color-black);

      text-align: justify;
      font-family: "DM Mono";
      font-size: 7px;
      font-style: italic;
      font-weight: 500;
      line-height: normal;
      grid-row: 4;

      @media screen and (min-width: $screen-mobile) {
        grid-column: 2 / span 3;
      }
    }
  }

}
</style>