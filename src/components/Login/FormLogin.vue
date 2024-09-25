<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <section class="row justify-start items-center" style="max-width: 400px;">
    <div class="col-12">
      <q-btn outline class="btn-google q-my-sm" icon="mdi-gmail" color="info" :label="`${btnSubmit} con Google`"
        @click="onLoginWithGoogle" />
    </div>
    <div class="col-12">
      <article class="q-mt-lg">
        <p>ó {{ btnSubmit }} con tu Email</p>
      </article>
    </div>
    <q-form class="col-12 q-mt-sm" @submit.prevent="onLogin">
      <q-input v-if="btnSubmit === 'Regístrate'" v-model="nickname" filled type="text" label="Nombre *" lazy-rules
        :rules="[val => val && val.length > 0 || 'Por favor, ingresa tu nombre']" />
      <q-input v-model="email" filled type="email" label="Correo electrónico *" lazy-rules
        :rules="[val => val && val.length > 0 || 'Por favor, ingresa un email valido']" />

      <q-input v-model="password" filled type="password" label="Contraseña *" lazy-rules :rules="[
        val => val !== null && val !== '' || 'Por favor, ingresa una contraseña valida',
      ]" />
      <slot></slot>
      <div>
        <q-btn class="btn-simple" :label="btnSubmit" type="submit" :disable="userStore.loading" />
      </div>
    </q-form>
  </section>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/users';

const email = ref('');
const password = ref('');
const name = ref('');
const rol = ref('user'); // Default role for registration
const userStore = useUserStore();
const loading = userStore.loading;
const router = useRouter(); // <- Inicializa el router aquí
const props = defineProps({
  btnSubmit: {
    type: String,
    default: null
  }
})

const { btnSubmit } = toRefs(props);
const onLogin = async () => {
  await userStore.login(email.value, password.value, router); // <- Pasa el router como argumento
};

const onRegister = async () => {
  await userStore.register(email.value, password.value, name.value, rol.value, router); // <- Pasa el router como argumento
};

const onLoginWithGoogle = async () => {
  await userStore.loginWithGoogle(router); // <- Pasa el router aquí también si lo usas en Google login
};

</script>

<style lang="scss" scoped>
.q-btn {
  text-transform: uppercase;
  width: 100%;
}

.btn-google {
  max-width: 300px;
  min-width: 300px;
}

.btn-simple {
  max-width: 200px;
  min-width: 200px;
  text-align: center;
}
</style>
