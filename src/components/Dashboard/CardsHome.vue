<template>
  <q-card class="column card-home card">
    <q-icon :name="cardImg" style="width: 100%; display: block;"></q-icon>
    <div class="card-body q-my-lg">
      <h5 class="card-home_h5 card-title">{{ cardTitle }}</h5>
      <p class="card-home_p card-text">
        {{ cardText }}
      </p>
      <q-btn class="q-mt-lg" color="primary" :label="cardBtn" @click="router.push(toUrl)"></q-btn>
    </div>
  </q-card>
</template>

<script setup>
import { useDatabaseStore } from "../../stores/database";
import { useRouter, useRoute } from 'vue-router';
import { toRefs, ref, onMounted } from "vue";

const useDatabase = useDatabaseStore();
const router = useRouter();

const props = defineProps({
  cardImg: {
    type: String,
    default: null
  },
  cardTitle: {
    type: String,
    default: null
  },
  cardText: {
    type: String,
    default: null
  },
  cardBtn: {
    type: String,
    default: null
  },
  cardUrl: {
    type: String,
    default: null
  },
});

const toUrl = ref('');
const { cardImg, cardTitle, cardUrl, cardText, cardBtn } = toRefs(props);


onMounted(() => {
  if (cardUrl.value.includes('https')) {
    toUrl.value = cardUrl.value
  } else {
    toUrl.value = `/${cardUrl.value}`
  }
})
</script>

<style lang="scss" scoped>
.card-home {
  width: 100%;
  max-width: 250px;
  height: 322px;
  padding: 40px 32px 10px 32px;
  border-radius: 16px;
  border: none;
  justify-content: center;
}

.q-icon {
  font-size: 24px;
  color: $primary;
  background-color: #f092d0;
  padding: 10px;
  border-radius: 50%;
  background: #F9E6F1;
  width: 100%;
  max-width: 40px;
  height: 40px;
}

.card-home_img {
  width: 70px;
  text-align: center;
  margin: 0 auto;
}

.card-home_h5 {
  font-weight: 600;
  font-size: 20px;
  line-height: 120%;
  letter-spacing: -0.01em;
  color: #282a33;
}

.card-home_p {
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: -0.01em;
  color: #6b7082;
}

.card-text2 {
  font-size: 12px;
}

@media (max-width: 1250px) {
  .card-home {
    padding: 20px;
  }

}
</style>
