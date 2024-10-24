<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div v-ripple="true" class="column justify-between items-center">
    <q-list v-if="loaded">
      <AvatarAccount class="q-mb-md" />
      <q-item v-for="link in visibleLinks" :key="link.id" clickable @click="router.push(link.url)">
        <q-item-section avatar>
          <q-icon :name="link.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ link.title }}</q-item-label>
        </q-item-section>
      </q-item>

    </q-list>
    <div class="col q-my-xl">
      <a @click="logOut">Cerrar Sesión <q-icon name="fa-solid fa-arrow-right-to-bracket" /></a>
    </div>
  </div>
</template>

<script setup>
import AvatarAccount from './Account/AvatarAccount.vue';
import { useDatabaseStore } from "src/stores/database";
import { useUserStore } from "src/stores/users";
import { useRouter } from 'vue-router';
import { ref, computed, watch, onMounted } from "vue";

const useDatabase = useDatabaseStore()
const userStore = useUserStore()
const router = useRouter();
const userRole = ref(null)
const visibleLinks = ref([])
const loaded = ref(false)

const rolePermissions = {
  admin: ['home', 'profile', 'requestsInspection', 'calendar'],
  supervisor: ['home', 'profile'],
  inspector: ['home', 'profile', 'calendar'],
  user: ['home', 'profile', 'requestsInspection'],
};

const allLinks = [
  { id: 'home', icon: 'fa-solid fa-user', title: 'Inicio', url: '/' },
  { id: 'profile', icon: 'fa-solid fa-users', title: 'Perfil', url: '/mi-cuenta' },
  { id: 'requestsInspection', icon: 'fa-solid fa-file-lines', title: 'Solicitar Inspección', url: '/solicitud-inspeccion' },
  { id: 'calendar', icon: 'fa-solid fa-calendar-days', title: 'Calendario', url: '/calendario-inspecciones' },
];
const logOut = async () => {
  try {
    await userStore.logout()  // Assuming userStore has a logout method implemented
    router.push('/inicio-sesion')     // Redirect to login page after logout
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

onMounted(async () => {
  await useDatabase.fetchUserData(useDatabase.userData.uid);
  userRole.value = useDatabase.userData.role
  visibleLinks.value = allLinks.filter(link => rolePermissions[userRole.value]?.includes(link.id));
  loaded.value = true
})

</script>

<style lang="scss" scoped>
.q-item__label,
a {
  font-family: 'Source Sans Pro';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.01em;
  color: #6B7082;
}

a {
  cursor: pointer;
}

.q-item__section--avatar {
  min-width: 40px;
}

.q-item__section--side {
  padding-left: 16px;
}

.q-icon {
  font-size: 18px;
  color: #6B7082;
}
</style>
