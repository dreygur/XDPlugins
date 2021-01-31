<template>
  <div>
    <div class="flex items-center justify-between">
      <div class="flex items-center">  
        <IconBase icon="account" class="mr-1 h-3 w-3"/>
        <span class="section-title font-regular text-3xs tracking-widest">ACCOUNTS</span>
      </div>
      <IconBase 
        :icon="open? 'downArrow' : 'leftArrow'"
        class="mr-1 h-3 w-3"
        @click.native.stop="open = !open"
      />
    </div>
    <div
      v-show="open"
      class="flex flex-col whitespace-no-wrap items-center mt-3"
    >
      <select @change="switchAccount($event)"
        id="account-select"
        class="w-40"
      >
        <option 
          v-for="(account, index) in accounts" 
          :key="index" 
          :value="account.id"
        >{{account.name}}</option>
      </select>
      <button uxp-variant="warning" @click="signOut()">Sign Out</button>
    </div>
  </div>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";

export default {
  name: "AccountSelect",
  components: {
    IconBase,
  },
  data() {
    return {
      open: false,
    }
  },
  computed: {
    accounts() {
      return this.$store.getters.ACCOUNTS
    },
    currentAccount() {
      return this.$store.getters.CURRENT_ACCOUNT
    }
  },
  methods: {
    switchAccount(e) {
      const accountId = e.target.value
      const account = this.accounts.find(account => account.id === accountId)
      if (account.id !== this.currentAccount.id) {
        this.$store.commit("CURRENT_ACCOUNT", account);
      }
    },
    signOut() {
      this.$store.dispatch("signOut");
    },
  },
  mounted() {
    document.getElementById('account-select').selectedIndex = 0
  },
  watch: {
    currentAccount(newValue, oldValue) {
      if (newValue.id !== oldValue.id) {
        this.$store.commit("RESET_COPY_STATE");
        this.$store.commit("RESET_IMAGE_STATE");
      }
    }
  },
}
</script>

<style scoped>

</style>