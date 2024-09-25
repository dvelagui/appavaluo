<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <q-btn outline class="q-my-sm" icon="mdi-gmail" color="info" :label="`${btnGoogle} con Google`"
    @click="accessGoogle" />
</template>

<script setup>
import { useUserStore } from 'src/stores/users';
import { userDatabaseStore } from "src/stores/database"
import { toRefs, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QSpinnerPuff, useQuasar } from 'quasar'

const $q = useQuasar();
const userStore = useUserStore();
const useDatabase = userDatabaseStore();
const router = useRouter();
const usertype = ref('admin');
const userPlan = ref('free');

const props = defineProps({
  btnGoogle: {
    type: String,
    default: null
  }
});

const { btnGoogle } = toRefs(props);

const accessGoogle = async () => {
  if (!userStore.loadingUser) {
    $q.loading.show(
      {
        spinner: QSpinnerPuff,
        spinnerColor: 'primary',
        spinnerSize: 250,
        backgroundColor: 'black',
        message: 'Autenticando Usuario',
        messageColor: 'white'
      }
    )
    await userStore.registerGoogle(usertype.value, userPlan.value);
    await useDatabase.getUserData()
    router.push('/')
    $q.loading.hide()
  }
}

</script>

<style lang="scss" scoped>
.q-btn {
  text-transform: uppercase;
  width: 100%;
  max-width: 300px;
  min-width: 300px;
}
</style>
