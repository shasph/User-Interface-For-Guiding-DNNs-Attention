<template>
  <div style="height: 730px;">
    <md-card>
      <md-card-content>
        <div class="md-scrollbar md-layout md-alignment-center-left">
          <div
            class="md-layout-item"
            v-for="img in imgs"
            :key="img.id"
          >
            <candidate-card
              :id="img.id"
              :img_work_status="img.img_work_status"
              :img_src="img.img_src"
              :img_label="img.label"
              :show_batch_size="show_batch_size"
              v-on:candidate_activated="getCandidateActivated"
              :cycle="cycle"
              :iter="iter"
            />
          </div>
        </div>
      </md-card-content>
    </md-card>
    <md-button
      v-if="train"
      class="md-raised md-accent"
      v-on:click="onFinetune"
      :disabled="operation==='Fine-tuning'"
    >{{operation}}</md-button>
  </div>
</template>

<script>
import CandidateCard from "./CandidateCard.vue";
import axios from "axios";
export default {
  name: "candidates-card",
  props: {},
  components: { "candidate-card": CandidateCard },
  data: function() {
    return {
      train: true,
      imgs: [],
      cycle: 1,
      iter: 1,
      active_candidate_id: Number,
      operation: "Next",
      show_batch_size: 16,
      batch_size: 64
    };
  },
  methods: {
    onFinetune: function() {
      this.operation = "Waiting";
      this.imgs = [];
      this.$emit("finetune");
      let self = this;
      axios
        .post("http://localhost:5000/finetune", {
          request_type: "finetune"
        })
        .then(function(response) {
          if (response.data.response_type === "finetune") {
            self.GLOBAL.imgs_candidates = response.data.candidates;
            self.show_batch_size = response.data.show_batch_size;
            self.cycle = response.data.cycle;
            self.iter = response.data.iter;
            if (self.iter === self.batch_size / self.show_batch_size) {
              self.operation = "Fine-tune";
            } else {
              self.operation = "Next";
            }
          } else {
            self.operation = "Next";
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getCandidateActivated: function(active_id) {
      if (
        this.imgs[this.active_candidate_id % this.show_batch_size] &&
        this.imgs[this.active_candidate_id % this.show_batch_size]
          .img_work_status !== "done"
      ) {
        this.imgs[
          this.active_candidate_id % this.show_batch_size
        ].img_work_status = "";
      }
      this.active_candidate_id = active_id;
      this.imgs[active_id % this.show_batch_size].img_work_status = "pending";
      this.$emit("workspace_update", {
        active_id: active_id,
        show_batch_size: this.show_batch_size
      });
    },
    getCandidateInitiated: function(data) {
      if (data.train) {
        this.train = data.train;
        this.show_batch_size = this.GLOBAL.imgs_candidates.length;
        this.imgs = this.GLOBAL.imgs_candidates;
        this.cycle = data.cycle;
        this.iter = data.iter;
        this.batch_size = data.batch_size;
      } else {
        this.train = data.train;
        this.show_batch_size = this.GLOBAL.imgs_test.length;
        this.imgs = this.GLOBAL.imgs_test;
        this.batch_size = data.batch_size;
      }
    }
  },
  watch: {
    iter: function() {
      this.imgs = this.GLOBAL.imgs_candidates;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.md-scrollbar {
  height: 642px;
  overflow: scroll;
  display: flex;
  flex-wrap: wrap;
}
.md-button {
  width: 200px;
  height: 50px;
  font-size: 26px;
}
.fine-tune {
  text-align: center;
}
.md-card-content {
  height: 680px;
}
</style>