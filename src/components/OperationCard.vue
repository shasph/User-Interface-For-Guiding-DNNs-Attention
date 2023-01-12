<template>
  <div
    class="content"
    style="margin: 0px;"
  >
    <div class="md-layout">
      <div class="md-layout-item md-size-50">
        <md-card>
          <md-card-content>
            <candidates-card
              ref="candidates_card"
              v-on:workspace_update="workspace_update"
              v-on:finetune="finetune"
            />
          </md-card-content>
        </md-card>
      </div>
      <div class="md-layout-item md-size-50">
        <md-card>
          <md-card-content>
            <workspace-card ref="workspace_card" />
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import CandidatesCard from "./CandidatesCard/CandidatesCard.vue";
import WorkspaceCard from "./WorkspaceCard.vue";
export default {
  name: "operation-card",
  props: {},
  components: {
    "candidates-card": CandidatesCard,
    "workspace-card": WorkspaceCard
  },
  data: function() {
    return {
      train: true
    };
  },
  mounted() {},
  methods: {
    workspace_update: function(active_id) {
      this.$refs.workspace_card.getActiveCandidate(active_id);
    },
    finetune: function() {
      this.$refs.workspace_card.reset();
    },
    candidates_update: function(data) {
      this.$refs.candidates_card.getCandidateInitiated(data);
    },
    layout_switch: function(data) {
      this.train = data.train;
      this.$refs.candidates_card.getCandidateInitiated({
        train: data.train
      });
      this.$refs.workspace_card.layout_switch(data.train);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>