<template>
  <div class="text-h6">{{ userData?.name }}</div>
</template>

<script setup>
import { useDatabaseStore } from 'src/stores/database';
import { ref, computed } from 'vue';

const useDatabase = useDatabaseStore()
const userData = computed(() => useDatabase.userData)

</script>

<style lang="scss" scoped>


</style>
