<template>
  <div>
    <h1>認証</h1>
    <v-text-field v-model="host"
      label="サーバードメイン(mstdn.jp, pawoo.net など)"
    ></v-text-field>
    <v-btn @click="createApp">アプリケーショントークン払い出し</v-btn>
    <v-btn @click="authUser">ユーザー認証</v-btn>
    <v-text-field v-model="authToken"
      label="トークンをここに貼り付ける"
    ></v-text-field>
    <p>accessToken: {{ accessToken }}</p>
    <v-btn @click="obtainToken">OAuthトークン払い出し</v-btn>
    <v-btn @click="verifyAccount">Verify</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data: () => {
    return {
      host: '',
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
    authUser () {
      const requestQuery =
        '?response_type=code' +
        `&client_id=${this.applicationToken.client_id}` +
        '&redirect_uri=urn:ietf:wg:oauth:2.0:oob' +
        '&scope=read'
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
