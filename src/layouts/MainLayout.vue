<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
          Avaluo En Linea
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Show q-drawer only if user is logged in -->
    <q-drawer v-if="isLoggedIn" show-if-above v-model="leftDrawerOpen" side="left">
      <EssentialLink />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useDatabaseStore } from 'src/stores/database';

// Access the user store and router
const useDatabase = useDatabaseStore();

const leftDrawerOpen = ref(false)
const isLoggedIn = computed(() => !!useDatabase.userData)

// Function to toggle the drawer
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
