<template>
  <div class="q-pa-md items-center justify-center">
    <div class="q-px-sm q-py-xl column items-start justify-start">
      <h4 class="title text-center">Registrar Usuario</h4>
    </div>
    <div class="col-12">
      <q-card class=" my-card" flat>
        <div class="row items-center justify-between">
          <div class="col-12 q-px-lsm">
            <label class="label-invitado q-mb-md">Escriba datos del nuevo inspector:</label>
            <div class="q-mt-md">

              <q-form class="q-gutter-md row justify-start items-center" @submit="promptPassword = true">
                <div class="col-12 col-md-2">
                  <q-input v-model="name" filled label="Nombre" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Ingrese nombre']" />
                </div>
                <div class="col-12 col-md-3">
                  <q-input v-model="email" filled type="email" label="Correo electronico" lazy-rules :rules="[
                    val => val !== null && val !== '' || 'Ingrese un correo electronico'
                  ]" />
                </div>
                <div class="col-12 col-md-2">
                  <q-input v-model="password" filled type="password" label="Contraseña *" lazy-rules :rules="[
                    val => val !== null && val !== '' || 'Por favor, ingresa una contraseña valida',
                  ]" />

                </div>
                <div class="col-12 col-md-2">
                  <q-select v-model="role" filled :options="roles" label="Rol de usuario" lazy-rules :rules="[
                    val => val !== null && val !== '' || 'Ingrese un correo electronico'
                  ]" />
                </div>
                <div class="col-12 col-md-2">
                  <q-btn label="Crear Usuario" type="submit" color="info" />
                </div>
              </q-form>
            </div>
          </div>
        </div>
      </q-card>
    </div>
    <UserList />
  </div>
  <q-dialog v-model="promptPassword" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Confirma tu contraseña</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="passwordAdmin" autofocus @keyup.enter="prompt = false" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn flat label="Confirmar" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import UserList from './UserList.vue';
import { useQuasar, QSpinnerGears } from 'quasar'
import { useUserStore } from "src/stores/users";
import { useRouter, useRoute } from 'vue-router';
import { ref } from "vue";

const userStore = useUserStore();
const router = useRouter();
const $q = useQuasar()
const current = ref(1)
const name = ref('');
const email = ref('');
const password = ref('')
const passwordAdmin = ref('')
const promptPassword = ref(false)
const role = ref('')
const avatar = ref("https://firebasestorage.googleapis.com/v0/b/avaluo-en-linea-colombia.appspot.com/o/user-default%2Fprofile-default.png?alt=media&token=88dc6558-2399-4416-8710-3489531fb39d");

const roles = [
  {
    label: 'Inspector',
    value: 'inspector'
  },
  {
    label: 'Supervisor',
    value: 'supervisor'
  }
]


const onSubmit = async () => {
  promptPassword.value = false
  $q.loading.show(
    {
      spinner: QSpinnerGears,
      spinnerColor: 'primary',
      spinnerSize: 150,
      backgroundColor: 'black',
      message: 'Agregando nuevo usuario',
      messageColor: 'white'
    }
  )
  await userStore.register(email.value, password.value, name.value, role.value.value, router, true, passwordAdmin.value);
  $q.loading.hide()
  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'Usuario Creado'
  });
  name.value = ''
  email.value = ''
  password.value = ''
  role.value = ''

}



</script>

<style lang="scss" scoped>
.label-invitado {
  font-family: "Source Sans Pro";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #6B7082;
}

.q-table thead {
  background: #F7F9FD;
}

.q-table thead th {
  font-family: 'Source Sans Pro';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #6B7082;
}
</style>
