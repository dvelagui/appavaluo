<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div class="q-pa-xl column items-start justify-start">
    <h4 class="title text-center">¡Hola {{ userData?.name }}!</h4>
    <p class="subtitle q-mt-md">Administra y gestiona tu información en cualquier momento.</p>
  </div>
  <section v-if="loaded" class="q-px-xl row wrap items-start justify-start q-gutter-md">

    <CardsHome v-for="card in visibleCards" :key="card.id" :card-img="card.img" :card-title="card.title"
      :card-text="card.text" :card-url="card.url" :card-btn="card.btn" />


  </section>
</template>

<script setup>
import CardsHome from "src/components/Dashboard/CardsHome.vue";
import { useDatabaseStore } from "src/stores/database";
import { ref, computed, watch, onMounted } from "vue";

const useDatabase = useDatabaseStore();
const userData = computed(() => useDatabase.userData)
const userRole = ref(null)
const visibleCards = ref([])
const loaded = ref(false)

const rolePermissions = {
  admin: ['account', 'users'],
  supervisor: ['account'],
  inspector: ['account'],
  user: ['account'],
};

const allCards = [
  { id: 'account', img: 'fa-solid fa-user', title: 'Datos personaless', text: 'Actualiza tu información cuando lo necesites.', url: 'mi-cuenta', btn: 'Ver perfil' },
  { id: 'users', img: 'fa-solid fa-users', title: 'Agregar Inspector', text: 'Agrega los inspectores o supervisores de tu empresa.', url: 'agregar-usuario', btn: 'Agregar' },
];

watch(userData, (val) => {
  userRole.value = userData.value?.role
  visibleCards.value = allCards.filter(card => rolePermissions[userRole.value]?.includes(card.id));
  loaded.value = true
})

onMounted(() => {
  userRole.value = userData.value?.role
  visibleCards.value = allCards.filter(card => rolePermissions[userRole.value]?.includes(card.id));
  loaded.value = true
})


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
