<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div class="q-pa-xl column items-start justify-start">
    <h4 class="title text-center">¡Hola {{ userData?.name }}!</h4>
    <p class="subtitle q-mt-md">Administra y gestiona tu información en cualquier momento.</p>
  </div>
  <section class="q-px-xl row wrap items-start justify-start q-gutter-md">

    <CardsHome card-img="fa-solid fa-file" card-title="Datos personales" card-text="Actualiza tu información cuando lo necesites."
      card-url="mi-cuenta" card-btn="Ver perfil" />

  </section>
</template>

<script setup>
import CardsHome from "src/components/Dashboard/CardsHome.vue";
import { useDatabaseStore } from "src/stores/database";
import { ref, computed } from "vue";

const useDatabase = useDatabaseStore();
const userData = computed(() => useDatabase.userData)

</script>

<style lang="scss" scoped>
.title {
  font-family: 'Source Sans Pro';
  font-style: normal;
  font-weight: 600;
  font-size: 48px;
  line-height: 100%;
  letter-spacing: -0.01em;
  color: #282A33;
}

.subtitle {
  font-family: 'Source Sans Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 120%;
  letter-spacing: -0.01em;
  color: #6B7082;
}

.text-avaluo {
  font-family: 'Comfortaa';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  text-align: center;
  letter-spacing: -0.01em;
  color: #FFFFFF;
}

.text-subtitle2 {
  font-family: 'Comfortaa';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 120%;
  text-align: center;
  letter-spacing: -0.01em;
  color: #FFFFFF;
}

.container {
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
}


.my-card {
  width: 100%;
  height: 100%;
  max-width: 250px;
  min-height: 300px;
}
</style>
