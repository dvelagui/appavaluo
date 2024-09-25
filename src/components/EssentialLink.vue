<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div v-ripple="true" class="column justify-between items-center">
    <q-list>
    <AvatarAccount/>
      <q-item :disable="plan" class="q-mt-md" clickable @click="router.push('/')">
        <q-item-section avatar>
          <q-icon name="fa-sharp fa-solid fa-house" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Inicio</q-item-label>
        </q-item-section>
      </q-item>
      <q-item :disable="plan" clickable @click="router.push(`/mi-cuenta`)">
        <q-item-section avatar>
          <q-icon name="fa-solid fa-user" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Perfil</q-item-label>
        </q-item-section>
      </q-item>
      <q-item :disable="plan" clickable @click="reportes()">
        <q-item-section avatar>
          <q-icon name="fa-solid fa-file-lines" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Reportes</q-item-label>
        </q-item-section>
      </q-item>
      <q-item :disable="plan" clickable @click="router.push(`/avaluo`)">
        <q-item-section avatar>
          <q-icon name="fa-regular fa-newspaper" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Solicitar Avaluo</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="useDatabase.userData?.rol != 'agente' && useDatabase.userData?.typeUser === 'empresas'"
        :disable="plan" clickable @click="router.push(`/administracion`)">
        <q-item-section avatar>
          <q-icon name="fa-solid fa-gear" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Administración</q-item-label>
        </q-item-section>
      </q-item>

      <q-item  clickable
        @click="router.push(`/PQRS`)">
        <q-item-section avatar>
          <q-icon name="fa-regular fa-lightbulb" />
        </q-item-section>
        <q-item-section>
          <q-item-label>PQRS</q-item-label>
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
//import { reportDatabaseStore } from "src/stores/reports";
import { useUserStore } from 'src/stores/users';
import { useRouter } from 'vue-router';
import { ref, watch } from "vue";

const useDatabase = useDatabaseStore();
//const useReportDatabase = reportDatabaseStore()
const userStore = useUserStore();
const router = useRouter();
const plan = ref(false);



const logOut = async () => {
  try {
    await userStore.logout()  // Assuming userStore has a logout method implemented
    router.push('/inicio-sesion')     // Redirect to login page after logout
  } catch (error) {
    console.error('Logout failed:', error)
  }
}


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
