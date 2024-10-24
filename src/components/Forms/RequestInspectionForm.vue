<template>
  <div class="q-pa-md">
    <h4>Solicitud de Inspección</h4>

    <q-form @submit="submitRequest">

      <!-- Datos de la propiedad -->
      <q-input v-model="property.address" label="Dirección de la propiedad" filled />
      <q-input v-model="property.type" label="Tipo de propiedad" filled />
      <q-input v-model="property.description" label="Descripción" filled type="textarea" />

      <!-- Calendario de selección de fecha -->
      <q-date v-model="inspection.date" label="Seleccione la fecha" :options="availableDates" :locale="colombianDate" />

      <!-- Selector de hora -->
      <q-time v-model="inspection.time" label="Seleccione la hora" format24h />

      <!-- Enviar solicitud -->
      <q-btn type="submit" label="Solicitar Inspección" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useDatabaseStore } from 'src/stores/database';

const useDatabase = useDatabaseStore();
const $q = useQuasar();
const router = useRouter();

const property = ref({
  address: '',
  type: '',
  description: ''
});

const inspection = ref({
  date: '',
  time: ''
});

const availableDates = ref(date => {
  // filtrar las fechas disponibles desde Firestore
  return true;
});

const submitRequest = async () => {
  try {
    const newRequest = {
      property: property.value,
      inspection: inspection.value,
      status: 'pending'
    };
    await useDatabase.addInspectionRequest(newRequest);

    $q.notify({
      message: 'Solicitud enviada exitosamente',
      color: 'green',
      icon: 'check'
    });

  } catch (error) {
    $q.notify({
      message: 'Error al enviar la solicitud',
      color: 'negative',
      icon: 'warning'
    });
  }
};
const colombianDate = {
  /* starting with Sunday */
  days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: 'dias'
}
</script>

<style scoped>
.q-input {
  margin-bottom: 1em;
}
</style>
