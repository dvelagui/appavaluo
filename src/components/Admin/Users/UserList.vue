<template>
  <div class="q-pa-xl column items-start justify-start">
    <h4 class="title text-center">Usuarios Registrados</h4>
  </div>
  <div class="q-pa-md items-center justify-center">
    <div class="col-12">
      <div class="q-pa-xl">
        <q-table v-model:pagination="pagination" flat bordered :rows="rows" :columns="columns" row-key="id"
          :filter="filter" rows-per-page-label="Registros por pagina" :table-header-style="tableAdmin">
          <template #pagination="scope">
            <q-btn v-if="scope.pagesNumber > 2" icon="first_page" color="black" round dense flat
              :disable="scope.isFirstPage" @click="scope.firstPage" />

            <q-btn icon="chevron_left" color="black" round dense flat :disable="scope.isFirstPage"
              @click="scope.prevPage" />

            <q-btn icon="chevron_right" color="black" round dense flat :disable="scope.isLastPage"
              @click="scope.nextPage" />

            <q-btn v-if="scope.pagesNumber > 2" icon="last_page" color="black" round dense flat
              :disable="scope.isLastPage" @click="scope.lastPage" />
          </template>
          <template #body="props">
            <q-tr :props="props">
              <q-td key="date" :props="props">
                {{ props.row.date }}
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
              <q-td key="role" :props="props">
                {{ props.row.role }}
                <q-popup-edit v-slot="scope" v-model="typeUser" title="Cambiar tipo de usuario">
                  <q-input v-model="scope.value" type="text" :model-value="scope.value" dense autofocus
                    hint="Nuevo Rol">
                    <template #after>
                      <q-btn flat dense color="negative" icon="cancel" @click.stop.prevent="scope.cancel" />
                      <q-btn flat dense color="positive" icon="check_circle" @click.stop.prevent="scope.set" />
                    </template>
                  </q-input>
                </q-popup-edit>
              </q-td>
              <q-td key="plan" :props="props">
                {{ props.row.plan }}
                <q-popup-edit v-slot="scope" v-model="plan" title="Cambiar plan actual">
                  <q-input v-model="scope.value" type="text" :model-value="scope.value" dense autofocus
                    hint="free, basico, profesional, avanzado">
                    <template #after>
                      <q-btn flat dense color="negative" icon="cancel" @click.stop.prevent="scope.cancel" />
                      <q-btn flat dense color="positive" icon="check_circle" @click.stop.prevent="scope.set" />
                    </template>
                  </q-input>
                </q-popup-edit>
              </q-td>
              <q-td key="reportes" :props="props">
                {{ props.row.reportes }}
                <q-popup-edit v-slot="scope" v-model="reportes" title="Cambiar # de ACMs">
                  <q-input v-model="scope.value" type="number" :model-value="scope.value" dense autofocus
                    hint="Ingresar numero de ACM">
                    <template #after>
                      <q-btn flat dense color="negative" icon="cancel" @click.stop.prevent="scope.cancel" />
                      <q-btn flat dense color="positive" icon="check_circle" @click.stop.prevent="scope.set" />
                    </template>
                  </q-input>
                </q-popup-edit>
              </q-td>
              <q-td key="id" :props="props"><q-btn color="primary" label="Ver usuario"
                  @click="router.push(`/administrador/usuario/${props.row.id}`)"></q-btn>
              </q-td>

            </q-tr>
          </template>
          <template #top-left>
            <q-input v-model="filter" dense debounce="500" placeholder="Search">
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template #top-right>
            <q-btn color="primary" icon-right="archive" label="Descargar *csv" no-caps @click="exportTable" />
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userDatabaseAdmin } from "../../stores/dbAdmin";
import { paymentsData } from "../../stores/payments";
import { userDatabaseStore } from 'src/stores/database';
import { exportFile, useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue'

const useAdmin = userDatabaseAdmin();
const usePayments = paymentsData();
const router = useRouter();
const columns = ref()
const columnsAdmin = ref()
const rows = ref()
const rowsAdmin = ref()
const filter = ref('')
const $q = useQuasar()
const plan = ref('')
const reportes = ref('')
const typeUser = ref('')
const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 2,
  rowsPerPage: 10,
  rowsPerPageLabel: 'Registros por pagina'
  // rowsNumber: xx if getting data from a server
})
const data = 'admin'
const tableAdmin = {
  backgroundColor: '#ca1d80',
  color: 'white',
  fontSiza: '30px'
}

columns.value = [
  {
    name: 'date',
    label: 'Fecha Creación',
    align: 'left',
    field: 'date',
    sortable: true
  },
  {
    name: 'email',
    label: 'Email Usuario',
    align: 'left',
    field: 'email',
    sortable: true
  },
  { name: 'typeUser', align: 'center', label: 'Tipo de Usuario', field: 'typeUser', sortable: true },
  { name: 'plan', align: 'center', label: 'Plan Actual', field: 'plan', sortable: true },
  { name: 'reportes', align: 'center', label: 'Reportes Plan', field: 'reportes', sortable: true },
  { name: 'id', align: 'center', label: '', field: 'id', },
]

rows.value = []
useAdmin.getUserData(data, '1')
usePayments.getPaymentsDate()
//console.log(new Date(usePayments.documentsPay.date).toLocaleDateString());

rowsAdmin.value = useAdmin.documents

const wrapCsvValue = (val, formatFn, row) => {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  return `"${formatted}"`
}
const exportTable = () => {
  // naive encoding to csv format
  const content = [columns.value.map(col => wrapCsvValue(col.label))].concat(
    rowsAdmin.value.map(row => columns.value.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[col.field === void 0 ? col.name : col.field],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    'table-export.csv',
    content,
    'text/csv'
  )

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}

watch(plan, () => {
  console.log(useAdmin.documents);
  useAdmin.UpdateUserData(useAdmin.documents?.plan, plan.value, useAdmin.documents?.id)
})



</script>

<style scoped>
.q-td {
  font-size: 16px;
  border: 1px solid #ca1d7f5f;
}
</style>
