import Vue from 'vue'
import App from './App.vue'

// VueMaterial
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import global from "@/components/DataStore.vue"
Vue.prototype.GLOBAL = global

import { CustomizingCard, CandidatesCard, WorkspaceCard, OperationCard } from "@/components/index.js";

Vue.component("customizing-card", CustomizingCard);
Vue.component("candidates-card", CandidatesCard);
Vue.component("workspace-card", WorkspaceCard);
Vue.component("operation-card", OperationCard)

Vue.config.productionTip = false

Vue.use(VueMaterial)

new Vue({
  render: h => h(App),
}).$mount('#app')
