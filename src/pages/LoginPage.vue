<template>
  <div class="row justify-center items-start">

    <section class="row column justify-center items-center col-12 col-sm-6">
      <!-- <div class="text-center q-mt-xl">
        <a href="https://www.avaluoenlinea.com/" target="_blank">
          <img class="img-logo" alt="Avaluo En Linea" src="../assets/logo_avaluo.svg" />
        </a>
      </div> -->
      <div class="col-12 d-flex justify-end q-mt-sm" style="margin-left: 50%;">
        <q-btn v-if="profile === 'cliente'" class="cursor-pointer btn-simple" @click="setProfile('inspector')">Soy
          Inspector</q-btn>
        <q-btn v-if="profile === 'inspector'" class="cursor-pointer btn-simple" @click="setProfile('cliente')"> Soy
          Cliente </q-btn>
      </div>
      <div class="text-center q-mt-md q-mb-md">
        <h3 class="login-h3 text-left">Ingreso</h3>
        <p class="login-p text-left">Ingresa a tu cuenta</p>
      </div>

      <FormLogin :btnSubmit="btnSubmit" :profile="profile">
        <p><span class="text-primary cursor-pointer" @click="prompt = true">¿Olvidaste tu
            contraseña?</span></p>
      </FormLogin>
      <p v-show="profile != 'inspector'" class="q-mt-md">¿No tienes cuenta? <span class="text-primary cursor-pointer"
          @click="router.push('/registro')">
          Regístrate</span></p>

    </section>
  </div>
</template>

<script setup>
import FormLogin from "src/components/Login/FormLogin.vue";
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/users';
import { provide } from "vue";

const profile = ref('cliente');
const router = useRouter();
const btnSubmit = ref('Inicia Sesión');

const setProfile = (role) => {
  profile.value = role;
}

provide('profile', profile);
</script>

<style lang="scss" scoped>
.login-h3 {
  font-family: 'Source Sans Pro';
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 100%;
  letter-spacing: -0.01em;
  color: #282A33;
}

.login-p {
  font-family: 'Source Sans Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 120%;
  letter-spacing: -0.01em;
  color: #6B7082;
  margin-top: 8px;
}

.btn-simple {
  max-width: 200px;
  min-width: 200px;
  text-align: center;
  margin: 20px;
}
</style>
