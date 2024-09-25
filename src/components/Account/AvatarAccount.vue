<template>
  <div class="row q-pa-xl">
    <div class="column items-center justify-center text-center">
      <div class="col avatar-img">
        <img src="src/assets/logo_avaluo.svg">
      </div>
      <div class="col q-my-sm">
        <AvatarImage />
        <AvatarName />
        <AvatarEmail />
      </div>
    </div>
  </div>
</template>

<script setup>
import AvatarImage from './AvatarImage.vue';
import AvatarName from './AvatarName.vue';
import AvatarEmail from './AvatarEmail.vue';

</script>

<style lang="scss" scoped>
.avatar-img {
  width: 100%;
  max-width: 200px;
}

.q-avatar {
  width: 100%;
  height: auto;
  max-width: 100px;
  margin-bottom: 12px;
}
</style>
