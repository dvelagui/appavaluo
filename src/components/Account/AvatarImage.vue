<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <q-avatar>
    <img :src="userData?.photo">
      <q-inner-loading v-if="useDatabase.loadingUser ? visible = true : visible = false" :showing="visible"
      label-class="text-teal" label-style="font-size: 0.8em" />
  </q-avatar>
</template>

<script setup>
import { useDatabaseStore } from 'src/stores/database';
import { ref, computed } from 'vue';

const useDatabase = useDatabaseStore();
const visible = ref(false)
const userData = computed(() => useDatabase.userData)

</script>

<style lang="scss" scoped></style>
