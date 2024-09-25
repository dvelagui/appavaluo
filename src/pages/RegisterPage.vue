<template>
  <div class="row justify-center items-start">
    <section class="row column justify-center items-center col-12 col-sm-6">
      <!-- <div class="text-center q-mt-xl">
        <a href="https://www.avaluoenlinea.com/" target="_blank">
          <img class="img-logo" alt="Avaluo En Linea" src="../assets/logo_avaluo.svg" />
        </a>
      </div> -->
      <div class="text-center q-mt-xl q-mb-md">
        <h3 class="login-h3 text-left">Crear Cuenta</h3>
        <p class="login-p text-left">Ingresa tus datos y crea tu cuenta</p>
      </div>
      <FormLogin :btnSubmit="btnSubmit">
        <div class="row justify-start items-center q-my-md">
          <div class="col-2 text-left">
            <q-toggle v-model="accept" />
          </div>
          <div class="col-10 text-left">
            <a class="login-terms text-primary" href="/terminosycondiciones">Acepto terminos y condiciones</a>
          </div>
        </div>
      </FormLogin>
      <p class="q-mt-md">¿Ya tienes cuenta? <span class="text-primary cursor-pointer"
          @click="router.push(`/inicio-sesion`)"> Inicia Sesión</span></p>

    </section>
  </div>
</template>

<script setup>
import FormLogin from "src/components/Login/FormLogin.vue";
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/users';


const userStore = useUserStore();
const router = useRouter();
const btnSubmit = ref('Regístrate');
const accept = ref(false);


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

.login-terms {
  font-family: 'Source Sans Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 120%;
  letter-spacing: -0.01em;
  text-decoration: none;
}
</style>
