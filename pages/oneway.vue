<template>
  <div>
    <h1>お前が片思いしてるヤツ</h1>
    <v-btn v-on:click="createApp">アプリケーショントークン払い出し</v-btn>
    <v-btn v-on:click="authUser">OAuthトークン払い出し</v-btn>
  </div>
</template>

<script lang="ts">
import { RequestBody } from '@nuxt/http'
import Vue from 'vue'
export default Vue.extend({
  data: () => {
    return {
      host: 'meganekeesu.tokyo',
      applicationToken: {
        client_id: String,
        client_secret: String
      },
      userData: {

      }
    }
  },
  methods: {
    async createApp () {
      const requestData = {
        'client_name': 'sightman',
        'redirect_uris': 'urn:ietf:wg:oauth:2.0:oob'
      }
      const res = await this.$http.$post(`https://${this.host}/api/v1/apps`, requestData) as any
      if (res.client_id && res.client_secret) {
        console.log(res)
        this.applicationToken.client_id = res.client_id
        this.applicationToken.client_secret = res.client_secret
      }
    },
    async authUser () {
      const requestQuery = `?response_type=code&client_id=${this.applicationToken.client_id}&redirect_uri=urn:ietf:wg:oauth:2.0:oob`
      window.open(`https://${this.host}/oauth/authorize${requestQuery}`)
    }
  },
})
</script>
