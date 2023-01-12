<template>
  <div style="height: 770px;">
    <md-card>
      <md-card-header>
        <div class="md-title">Fine-tune</div>
      </md-card-header>
      <md-card-content>
        <!-- <md-field :md-inline=true>
          <label>Experiment ID</label>
          <span class="md-prefix">Experiment ID</span>
          <md-input v-model="experiment_id"></md-input>
        </md-field> -->
        <md-field :md-inline=true>
          <label>Learning rate</label>
          <span class="md-prefix">Learning rate</span>
          <md-input v-model="learnings_rate"></md-input>
        </md-field>
        <md-field :md-inline=true>
          <label>Batch size</label>
          <span class="md-prefix">Batch size</span>
          <md-input v-model="batch_size"></md-input>
        </md-field>
        <md-field :md-inline=true>
          <label>Epoch</label>
          <span class="md-prefix">Epoch</span>
          <md-input v-model="epoch"></md-input>
        </md-field>
        <md-field :md-inline=true>
          <label>Weight decay</label>
          <span class="md-prefix">Weight decay</span>
          <md-input v-model="weight_decay"></md-input>
        </md-field>
        <md-field :md-inline=true>
          <label>Candidates</label>
          <span class="md-prefix">Candidates</span>
          <md-input v-model="show_batch_size"></md-input>
        </md-field>
        <md-field>
          <label for="candidates_sampling_strategy">Strategy</label>
          <md-select
            v-model="candidates_sampling_strategy"
            name="candidates_sampling_strategy"
            id="candidates_sampling_strategy"
          >
            <md-option value="entropy">Entropy</md-option>
            <md-option value="diversity">Diversity</md-option>
            <md-option value="attention">Attention</md-option>
            <md-option value="random">Random</md-option>
          </md-select>
        </md-field>
        <md-field>
          <label for="dataset">Dataset</label>
          <md-select
            v-model="dataset"
            name="dataset"
            id="dataset"
          >
            <md-option value="toy">Toy</md-option>
            <md-option value="coco-2017">COCO-2017</md-option>
            <md-option value="celeba">CelebA</md-option>
            <md-option value="awa2">AwA2</md-option>
          </md-select>
        </md-field>
        <md-radio
          v-model="click_based"
          :value="true"
        >Click UI</md-radio>
        <md-radio
          v-model="click_based"
          :value="false"
        >Polygon UI</md-radio>
        <md-radio
          v-model="train"
          :value="true"
        >Train</md-radio>
        <md-radio
          v-model="train"
          :value="false"
        >Test</md-radio>
        <md-button
          style="width=60px"
          class="md-primary md-raised"
          v-on:click="onOp"
          :disabled="operation==='Starting'||operation==='Stopping'||operation==='Waiting'"
        >{{operation}}</md-button>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "customizing-card",
  props: {},
  data: () => ({
    experiment_id: "01",
    learnings_rate: 0.01,
    batch_size: 128,
    epoch: 150,
    weight_decay: 0.0001,
    show_batch_size: 128,
    candidates_sampling_strategy: "attention",
    dataset: "coco-2017",
    train: true,
    click_based: true,
    operation: "Start",
    status: "Stopped"
  }),
  methods: {
    onOp: function() {
      let self = this;
      if (this.operation == "Start" && this.train) {
        this.operation = "Starting";
        axios
          .post("http://localhost:5000/start", {
            request_type: "start",
            experiment_id: self.experiment_id,
            learnings_rate: self.learnings_rate,
            batch_size: self.batch_size,
            epoch: self.epoch,
            weight_decay: self.weight_decay,
            show_batch_size: self.show_batch_size,
            batch_labeling: self.batch_labeling,
            candidates_sampling_strategy: self.candidates_sampling_strategy,
            dataset: self.dataset,
            train: self.train,
            annotation_method: self.click_based
          })
          .then(function(response) {
            if (response.data.response_type === "started") {
              self.GLOBAL.imgs_candidates = response.data.candidates;
              self.status = "Started";
              self.$emit("candidates_update", {
                train: self.train,
                cycle: response.data.cycle,
                iter: response.data.iter,
                batch_size: self.batch_size,
                show_batch_size: response.data.show_batch_size
              });
              self.operation = "Stop";
            } else {
              self.operation = "Start";
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } else if (this.operation == "Test" && !this.train) {
        this.operation = "Waiting";
        axios
          .post("http://localhost:5000/test", {
            request_type: "test"
          })
          .then(function(response) {
            if (response.data.response_type === "test") {
              self.GLOBAL.imgs_test = response.data.candidates;
              self.status = "Finished";
              self.$emit("candidates_update", {
                train: self.train,
                img_batch_size: response.data.img_batch_size
              });
              self.operation = "Stop";
            } else {
              throw Error("Failed to start. Please contact the server admin.");
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        this.operation = "Stopping";
        axios
          .post("http://localhost:5000/stop", {
            request_type: "stop"
          })
          .then(function(response) {
            if (response.data.response_type === "stopped") {
              self.GLOBAL.imgs_candidates = [];
              self.status = "Stopped";
              self.operation = "Start";
            } else {
              self.operation = "Stop";
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    onStop: function() {}
  },
  watch: {
    train: function() {
      this.$emit("layout_switch", {
        train: this.train
      });
      if (this.train) {
        this.operation = "Start";
      } else {
        this.operation = "Test";
      }
    },
    click_based: function() {
      let annotation_method = this.click_based ? "click" : "polygon";
      axios
          .post("http://localhost:5000/annotation_style", {
            request_type: "annotation_style",
            annotation_method: annotation_method
          })
          .catch(function(error) {
            console.log(error);
          });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.md-prefix {
  text-align: left;
  width: 172px;
}

.md-input {
  text-align: center;
  width: 105px;
}

.md-card-content:last-of-type {
  padding-bottom: 20px;
}
.md-card-content {
  font-size: 16px;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
</style>