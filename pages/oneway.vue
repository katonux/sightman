<template>
  <div>
    <h1>お前が片思いしてるヤツ</h1>
    <v-btn v-on:click="createApp">アプリケーショントークン払い出し</v-btn>
    <v-btn v-on:click="authUser">ユーザー認証</v-btn>
    <v-btn v-on:click="obtainToken">OAuthトークン払い出し</v-btn>
    <v-text-field v-model="authToken"
      label="トークンをここに貼り付ける"
    ></v-text-field>
    <p>アクセストークン: {{ accessToken }}</p>
    <v-btn v-on:click="verifyAccount">Verify</v-btn>
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
      authToken: '',
      accessToken: '',
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
      const requestQuery =
        `?response_type=code` +
        `&client_id=${this.applicationToken.client_id}` +
        `&redirect_uri=urn:ietf:wg:oauth:2.0:oob` +
        `&scope=read`
      window.open(`https://${this.host}/oauth/authorize${requestQuery}`)
    },
    async obtainToken () {
      const requestData = {
        'client_id': this.applicationToken.client_id,
        'client_secret': this.applicationToken.client_secret,
        'redirect_uri': 'urn:ietf:wg:oauth:2.0:oob',
        'scope': 'read',
        'code': this.authToken,
        'grant_type': 'authorization_code'
      }
      await this.$http.$post(`https://${this.host}/oauth/token`, requestData)
        .then((res: any) => {
          console.log(res)
          if (res.access_token) {
            this.accessToken = res.access_token
          }
        })
    },
    async verifyAccount () {
      // 認証トークンをグローバルセット
      console.log(this.accessToken)
      this.$http.setToken(this.accessToken, 'Bearer')
      await this.$http.$get(`https://${this.host}/api/v1/accounts/verify_credentials`)
        .then(res => {console.log(res)})
        .catch(err => {console.error(err.body)})
    }
  },
})
</script>
