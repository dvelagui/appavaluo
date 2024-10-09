<template>
  <div class="q-pa-md items-center justify-center">
    <div class="col-12">
      <q-card class=" my-card" flat>
        <div class="row items-center justify-between">
          <div class="col-12 q-pa-lg">
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
                  <q-btn label="Crear Usuario" type="submit" color="primary" />
                </div>
              </q-form>

            </div>
          </div>
        </div>

        <!--  <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Fecha de ingreso</th>
              <th class="text-left">Nombre</th>
              <th class="text-left">Correo electrónico</th>
              <th class="text-center">Teléfono</th>
              <th class="text-center">Perfil</th>
              <th class="text-center">Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="agent in useDatabase.documentsAgent" :key="agent.id">
              <UsuariosLista :id="agent.uid" :date="agent.date" :name="agent.nickname" :email="agent.email"
                :phone="agent.phone" :rol="agent.rol" />
            </tr>
          </tbody>
        </q-markup-table> -->
      </q-card>
    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination v-model="current" :max="1" />
    </div>
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
.title {
  font-family: 'Source Sans Pro';
  font-style: normal;
  font-weight: 600;
  font-size: 48px;
  line-height: 100%;
  letter-spacing: -0.01em;
  color: #282A33;
  margin-top: 48px;
  margin-bottom: 48px;
}

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
