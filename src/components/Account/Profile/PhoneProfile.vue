<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <label>Teléfono Contacto</label>
  <q-input standout readonly outlined :label="userData?.phone">
    <template #after>
      <div class="cursor-pointer">
        <q-icon name="mdi-pencil" />
        <q-popup-edit v-slot="scope" v-model="phone" :validate="val => val.length > 5">
          <q-input v-model="scope.value" type="tel" autofocus dense :model-value="scope.value"
            hint="Telefono de Contacto" :rules="[
              val => scope.validate(val) || 'Por favor ingrese celular valido', val => val !== null && val !== '' || 'ingrese celular valido'
            ]">
            <template #after>
              <q-btn flat dense color="negative" icon="cancel" @click.stop.prevent="scope.cancel" />

              <q-btn flat dense color="positive" icon="check_circle"
                :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value"
                @click.stop.prevent="scope.set" />
            </template>
          </q-input>
        </q-popup-edit>
      </div>
    </template>
  </q-input>
</template>

<script setup>
import { useDatabaseStore } from 'src/stores/database';
import { ref, computed, watch } from 'vue';

const phone = ref("");
const useDatabase = useDatabaseStore();

const userData = computed(() => useDatabase.userData)

watch(phone, () => {
  useDatabase.UpdateUserData(userData.value?.phone, phone.value, userData.value?.uid, userData.value)
})

</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

label {
  font-family: 'Source Sans Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;
  letter-spacing: -0.01em;
  color: #6B7082;
  padding: 12px 0;
}
</style>
