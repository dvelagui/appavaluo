<template>
  <section class="row justify-center items-start q-pa-xl">
    <div class="col-12 col-md-5 text-center">
      <div class="q-pa-md">
        <q-date v-model="selectedDate" :options="isDateAvailable" :events="events" event-color="green"
          :locale="colombianDate" />
      </div>
    </div>

    <div class="col-12 col-md-5">
      <div v-scroll="onScroll">
        <q-tab-panels v-model="selectedDate" animated transition-prev="jump-up" transition-next="jump-up"
          style="max-height: 400px;">
          <q-tab-panel v-for="inspection in inspections" :key="inspection.date" :name="inspection.date">
            <div class="scroll shadow-2" style="max-height: 400px; overflow-y: auto;"
              v-if="inspection.title === 'Disponible'">
              <div v-for="time in availableTimes" :key="time">
                <q-card class="card-calendar card-available">
                  <q-card-section>
                    <div class="text-available">Horario Disponible</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-actions align="right">
                    <q-btn flat round icon="event" />
                    <q-btn flat>
                      {{ time }}
                    </q-btn>
                    <q-btn flat color="primary">
                      Cambiar Disponibilidad
                    </q-btn>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
            <div v-else class="scroll shadow-2" style="max-height: 400px; overflow-y: auto;">
              <div v-for="time in availableTimes" :key="time">
                <q-card v-if="time === inspection.time" class="card-calendar card-unavailable">
                  <q-card-section>
                    <div class="text-unavailable">{{ inspection.title }}</div>
                    <div class="text-subtitle2">{{ inspection.description }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-actions align="right">
                    <q-btn flat round icon="event" />
                    <q-btn flat>
                      {{ time }}
                    </q-btn>
                    <q-btn flat color="primary">
                      Cancelar
                    </q-btn>
                    <q-btn flat color="primary">
                      Realizar inspección
                    </q-btn>
                  </q-card-actions>
                </q-card>
                <q-card v-else class="card-calendar">
                  <q-card-section>
                    <div class="text-h6">Horario Disponible</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-actions align="right">
                    <q-btn flat round icon="event" />
                    <q-btn flat>
                      {{ time }}
                    </q-btn>
                    <q-btn flat color="primary">
                      Cambiar Disponibilidad
                    </q-btn>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCalendarStore } from 'src/stores/calendar';
import { useDatabaseStore } from 'src/stores/database';
import { ref, onMounted } from 'vue';
import { debounce } from 'quasar';

const databaseStore = useDatabaseStore();
const calendarStore = useCalendarStore();
const selectedDate = ref(new Date().toISOString().split('T')[0].replace(/-/g, '/'));
const availableTimes = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
const events = ref([]);
const inspections = ref([]);
const isDateAvailable = ref([]);

const onScroll = debounce(() => { console.log('scrolled') }, 200)

const colombianDate = {
  days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: 'dias'
}
const generateAvailableDates = () => {
  const currentYear = new Date().getFullYear()
  const availableDays = [0, 1, 2, 3, 4, 5]
  const dates = []
  const currentDate = new Date()

  while (currentDate.getFullYear() === currentYear) {

    const dayOfWeek = currentDate.getDay()
    if (availableDays.includes(dayOfWeek)) {
      const formattedDate = currentDate.toISOString().split('T')[0].replace(/-/g, '/')
      dates.push(formattedDate)
    }
    currentDate.setDate(currentDate.getDate() + 1) // Avanzar al siguiente día
  }

  isDateAvailable.value = dates

  inspections.value = [{
    date: '2024/10/22',
    time: '10:00',
    title: 'Condominio Eco del rio',
    description: 'Calle 2 No 3 - 02 Barrio Centro - Jenesano, Boyaca.'

  }, {
    date: '2024/10/24',
    time: '16:00',
    title: 'Edificio Enmanuel',
    description: 'Carrera 50 No. 39a 85 sur Villa sonia - Cundinamarca.'

  }]

  events.value = inspections.value.map((inspection) => {
    return inspection.date
  })

  fillInspections(isDateAvailable.value)

}

const fillInspections = (dates) => {
  dates.forEach(date => {
    const exists = inspections.value.some(inspection => inspection.date === date);
    if (!exists) {
      inspections.value.push({
        date: date,
        time: '00:00',
        title: 'Disponible',
        description: 'Fecha disponible'
      });
    }
  });
}

onMounted(generateAvailableDates);
</script>

<style lang="scss" scoped>
.card-calendar {
  width: 100%;
}

.card-available {
  background-color: aliceblue;
}

.card-available {
  background-color: #26a69a;
}

.text-unavailable {
  font-size: 1.25rem;
  font-weight: 500;
  font-style: italic;
  line-height: 2rem;
  letter-spacing: 0.0125em;
  opacity: 0.20;
}

.text-available {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em;
}
</style>
