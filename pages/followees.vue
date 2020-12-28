<template>
  <div>
    <v-btn @click="retriveFollowees">
      あれしてください
    </v-btn>
    <br>
    <div v-for="item in items" :key="item.id">
      <p>name: {{ item.username }}</p>
      <p>acct: {{ item.acct }}</p>
      <p>disn: {{ item.display_name }}</p>
      <br>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data: () => {
    return {
      items: [{}]
    }
  },
  methods: {
    async retriveFollowees () {
      await this.$http.$get('https://meganekeesu.tokyo/api/v1/accounts/24437/following?limit=256')
        .then(res => {
          console.log(res)
          this.items = res as Array<{}>
        })
        .catch(err => {console.error(err.body)})
    }
  }
})
</script>
