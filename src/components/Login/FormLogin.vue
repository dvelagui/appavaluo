<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <section class="row justify-start items-center" style="max-width: 400px;">
    <div v-show="profile != 'inspector'" class="col-12">
      <q-btn outline class="btn-google q-my-sm" icon="mdi-gmail" color="info" :label="`${btnSubmit} con Google`"
        @click="onLoginWithGoogle" />
    </div>
    <div class="col-12">
      <article class="q-mt-lg">
        <p>{{ btnSubmit }} con tu Email</p>
      </article>
    </div>
    <q-form class="col-12 q-mt-sm" @submit.prevent="onSubmit">
      <q-input v-if="btnSubmit === 'Regístrate'" v-model="name" filled type="text" label="Nombre *" lazy-rules
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
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/users';
import { ref, toRefs } from 'vue';

const userStore = useUserStore();
const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');

const props = defineProps({
  btnSubmit: {
    type: String,
    default: null
  },
  profile: {
    type: String,
    default: null
  }
})

const { btnSubmit } = toRefs(props);

const onSubmit = async () => {
  if (btnSubmit.value === 'Regístrate') {
    await userStore.register(email.value, password.value, name.value, 'user', router, false, 'admin');
  } else {
    await userStore.login(email.value, password.value, router);
  }
}

const onLoginWithGoogle = async () => {
  await userStore.loginWithGoogle(router);
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
