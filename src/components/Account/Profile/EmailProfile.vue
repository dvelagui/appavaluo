<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <label>Correo Electronico</label>
  <q-input disable readonly outlined :label="userData?.email" />
</template>

<script setup>
import { useDatabaseStore } from 'src/stores/database';
import { computed } from 'vue';

const useDatabase = useDatabaseStore();
const userData = computed(() => useDatabase.userData);

</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

label {
  font-family: 'Source Sans Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;
  letter-spacing: -0.01em;
  color: #6B7082;
  padding: 12px 0;
}
</style>
