<template>
  <div class="q-pa-xl column items-start justify-start">
    <h4 class="title text-center">Perfil del usuario</h4>
    <!-- <p class="subtitle q-mt-md">Estas afiliado a la empresa ...</p> -->
  </div>
  <div class="q-pa-sm q-pl-md-xl">
    <div class="row items-center justify-start q-mb-xl">
      <div class="col-12 col-md-3 q-pa-md text-center">
        <AvatarImage style="width: 120px; height: 120px;" />
      </div>
      <div class="col-12 col-md-4">
        <ChangeImage />
      </div>
    </div>
    <div class="row items-center justify-start q-my-xl">
      <div class="col-12 col-md-4 q-px-md">
        <NameProfile />
      </div>
      <div class="col-12 col-md-4 q-px-md">
        <EmailProfile />
      </div>
    </div>
    <div class="row items-center justify-start q-my-xl">
      <div class="col-12 col-md-4 q-px-md">
        <PhoneProfile />
      </div>
      <div class="col-12 col-md-4 q-px-md">
        <PasswordProfile />
      </div>
    </div>
  </div>
</template>

<script setup>
import AvatarImage from 'src/components/Account/AvatarImage.vue';
import ChangeImage from 'src/components/Account/Profile/ChangeImage.vue';
import NameProfile from 'src/components/Account/Profile/NameProfile.vue';
import EmailProfile from 'src/components/Account/Profile/EmailProfile.vue';
import PhoneProfile from 'src/components/Account/Profile/PhoneProfile.vue';
import PasswordProfile from 'src/components/Account/Profile/PwdProfile.vue';

</script>

<style lang="scss" scoped>
p,
.file-dp {
  margin: 0;
}
</style>
