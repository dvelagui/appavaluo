<template>
  <div class="q-px-sm q-py-xl column items-start justify-start">
    <h4 class="title text-center">Usuarios Registrados</h4>
  </div>
  <div class="q-px-sm items-center justify-center">
    <div class="col-12">
      <div class="q-px-sm">
        <q-input v-model="filter" dense debounce="500" placeholder="Buscar usuario" class="q-mb-md">
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn color="info" icon-right="archive" label="Descargar CSV" no-caps @click="exportTable" class="q-mb-md" />
        <q-table :rows="filteredRows" :columns="columns" row-key="id" flat bordered v-model:pagination="pagination"
          :rows-per-page-options="[5, 10, 25]">
          <template #body="props">
            <q-tr :props="props">
              <q-td key="date" :props="props">
                {{ formatDate(props.row.date) }}
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="email" :props="props">
                {{ props.row.email }}
              </q-td>
              <q-td key="phone" :props="props">
                {{ props.row.phone }}
              </q-td>
              <!-- Editable Role -->
              <q-td key="role" :props="props">
                {{ props.row?.role.charAt(0).toUpperCase() + props.row.role.slice(1) }}
                <q-popup-edit v-model="props.row.role" title="Actualizar perfil" v-slot="scope">
                  <q-select type="text" v-model="scope.value" :options="roles" dense autofocus>
                    <template #after>
                      <q-btn flat dense color="negative" icon="cancel" @click.stop.prevent="scope.cancel" />

                      <q-btn flat dense color="positive" icon="check_circle"
                        :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value"
                        @click.stop.prevent="updateField(props.row.role, scope.value, props.row)" />
                    </template>
                  </q-select>
                </q-popup-edit>
              </q-td>
              <!-- Editable Supervisor -->
              <q-td key="adminEmail" :props="props">
                {{ props.row?.adminEmail }}
                <q-popup-edit v-model="props.row.adminEmail" title="Email Nuevo Supervisor" v-slot="scope">
                  <q-input type="text" v-model="scope.value" dense autofocus>
                    <template #after>
                      <q-btn flat dense color="negative" icon="cancel" @click.stop.prevent="scope.cancel" />

                      <q-btn flat dense color="positive" icon="check_circle"
                        :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value"
                        @click.stop.prevent="updateField(props.row.adminEmail, scope.value, props.row)" />
                    </template>
                  </q-input>
                </q-popup-edit>
              </q-td>
              <q-td key="id" :props="props">
                <q-btn color="info" label="Ver" @click="viewUser(props.row.id)" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDatabaseStore } from 'src/stores/database';
import { ref, computed, onMounted, watch } from 'vue';
import { exportFile, useQuasar } from 'quasar';
import { onUpdated } from 'vue';

const useDatabase = useDatabaseStore();
const $q = useQuasar();
const filter = ref('');
const pagination = ref({
  page: 1,
  rowsPerPage: 10, // default rows per page
  sortBy: 'name',
  descending: false,
});
const userData = computed(() => useDatabase.userData)
const roles = ['inspector', 'supervisor'];
const rows = ref([]);
const columns = ref([
  { name: 'date', label: 'Fecha Creación', align: 'left', field: 'date', sortable: true },
  { name: 'name', label: 'Nombre', align: 'left', field: 'name', sortable: true },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
  { name: 'phone', label: 'Teléfono', align: 'left', field: 'phone', sortable: true },
  { name: 'role', label: 'Tipo de Usuario', align: 'center', field: 'role', sortable: true },
  { name: 'adminEmail', label: 'Supervisor', align: 'center', field: 'adminEmail', sortable: true },
  { name: 'id', label: 'Ver Usuario', align: 'center', field: 'id' }
]);
// Computed property to filter rows based on search query
const filteredRows = computed(() => {
  const searchTerm = filter.value.toLowerCase();
  if (!searchTerm) return rows.value;
  return rows.value.filter(row =>
    row.name.toLowerCase().includes(searchTerm) ||
    row.email.toLowerCase().includes(searchTerm)
  );
});

// Format date
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString();
};

// Save role change
const updateField = async (field, value, userdata) => {
  useDatabase.UpdateUserData(field, value, userdata.uid, userdata)
  rows.value = await useDatabase.fetchInspectors();
  $q.notify({
    message: `Se actualizo correctamente el campo`,
    color: 'positive',
    icon: 'check_circle'
  });
};



// Export table to CSV
const wrapCsvValue = (val) => {
  let formatted = val == null ? '' : String(val);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
};

const exportTable = () => {
  const content = [
    columns.value.map(col => wrapCsvValue(col.label))
  ].concat(
    rows.value.map(row => columns.value.map(col => wrapCsvValue(row[col.field === void 0 ? col.name : col.field])).join(','))
  ).join('\r\n');

  const status = exportFile('usuarios.csv', content, 'text/csv');

  if (status !== true) {
    $q.notify({
      message: 'No se pudo descargar el archivo CSV',
      color: 'negative',
      icon: 'warning'
    });
  }
};

// Function to view user details (just an example, assuming you have a route set up)
const viewUser = (id) => {
  router.push(`/usuario/${id}`);
};

onMounted(async () => {
  rows.value = await useDatabase.fetchInspectors();
});

onUpdated(async () => {
  rows.value = await useDatabase.fetchInspectors();
});

</script>

<style scoped>
.q-td {
  font-size: 16px;
  border: 1px solid var(--q-soft);
}
</style>
