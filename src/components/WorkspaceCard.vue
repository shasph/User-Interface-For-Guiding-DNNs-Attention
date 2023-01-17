<template>
  <div style="height: 730px;">
    <md-card>
      <md-card-content>
        <md-card-media-cover
          md-solid
          v-if="img_work_status==='pending'"
        >
          <md-card-media>
            <img
              id="img_worksapce"
              :src="img_src"
              v-on:click.left="onRetreivePos"
              v-on:click.right.prevent="onRetreiveNeg"
              v-on:click.middle.prevent="onRetreiveClear"
            />
          </md-card-media>
          <md-card>
            <md-field
              :md-inline=true
              style="margin: 0"
            >
              <label>Label</label>
              <span class="md-prefix">Label</span>
              <md-input
                v-model="label"
                readonly
              ></md-input>
            </md-field>
          </md-card>
        </md-card-media-cover>
      </md-card-content>
    </md-card>
    <div v-if="train">
      <!-- <div class="md-layout-item md-size-50 label_content">
        <md-card>
          <div>Gaussian radius</div>
          <input
            type="range"
            min="0"
            max="224"
            v-model.number="gaussian_radius"
          > {{gaussian_radius}}
        </md-card>
      </div> -->
      <!-- <div class="md-layout-item md-size-50"> -->
      <md-button
        v-on:click="onSave"
        class="md-raised md-primary"
        :disabled="operation==='Refining'||operation==='Clearing'"
      >{{operation}}</md-button>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "workspace-card",
  props: {},
  data: function() {
    return {
      click_based: true,
      train: true,
      id: Number,
      img_src: String,
      img_work_status: String,
      active_candidate_id: Number,
      operation: "Confirm",
      // gaussian_radius: 64,
      show_batch_size: 16,
      label: ""
    };
  },
  mounted: function() {},
  methods: {
    onSave: function() {
      console.log("onSave");
      this.img_work_status = "done";
    },
    getActiveCandidate: function(active_candidate_id) {
      this.show_batch_size = active_candidate_id.show_batch_size;
      if (this.train) {
        let active_candidate = this.GLOBAL.imgs_candidates[
          active_candidate_id.active_id % active_candidate_id.show_batch_size
        ];
        this.id = active_candidate.id;
        this.img_src = active_candidate.img_src;
        this.img_work_status = active_candidate.img_work_status;
        this.label = active_candidate.label;
      } else {
        let active_candidate = this.GLOBAL.imgs_test[
          active_candidate_id.active_id % active_candidate_id.show_batch_size
        ];
        this.id = active_candidate.id;
        this.img_src = active_candidate.img_src;
        this.img_work_status = active_candidate.img_work_status;
        this.label = active_candidate.label;
      }
    },
    onRetreivePos: function(event) {
      this.onRetreive(event, "left_click");
    },
    onRetreiveNeg: function(event) {
      this.onRetreive(event, "right_click");
    },
    onRetreiveClear: function(event) {
      event.preventDefault();
      this.onRetreive(event, "middle_click");
    },
    onRetreive: function(event, retreive_type) {
      let img = document.getElementById("img_worksapce");
      let self = this;
      let mouse_operation = {
        click_type: retreive_type,
        click_position_x: (
          (img.naturalWidth / img.width) *
          event.offsetX
        ).toFixed(0),
        click_position_y: (
          (img.naturalWidth / img.width) *
          event.offsetY
        ).toFixed(0)
      };
      if (retreive_type == "middle_click") {
        this.operation = "Clearing";
      } else {
        this.operation = "Refining";
      }
      axios
        .post("http://localhost:5000/refine_cam", {
          request_type: "refine_cam",
          img_id: this.id,
          // gaussian_radius: this.gaussian_radius,
          mouse_operation: mouse_operation
        })
        .then(function(response) {
          if (response.data.response_type === "refine_cam") {
            let refined_cam_img = response.data.refined_cam_img;
            self.img_src = refined_cam_img.img_src;
            self.$emit("cam_refined", refined_cam_img);
            self.operation = "Confirm";
          } else {
            self.operation = "Confirm";
          }
        })
        .catch(function(error) {
          console.log(error);
          // self.operation = "Confirm";
        });
    },
    // onSetGaussianRadius: function(radius) {
    //   this.gaussian_radius = radius;
    // },
    layout_switch: function(bool_layout) {
      this.train = bool_layout;
      this.reset();
    },
    reset: function() {
      this.id = 0;
      this.img_src = "";
      this.img_work_status = "";
      this.active_candidate_id = 0;
      this.operation = "Confirm";
      this.gaussian_radius = 64;
    }
  },
  watch: {
    img_work_status: function() {
      this.GLOBAL.imgs_candidates[
        this.id % this.show_batch_size
      ].img_work_status = this.img_work_status;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.md-button {
  width: 90%;
  height: 50px;
  font-size: 26px;
}
.md-card-content {
  height: 680px;
}
.md-prefix {
  text-align: left;
  width: 50px;
}
.md-field {
  padding: 0px;
  height: 46px;
  min-height: 46px;
}
.md-input {
  text-align: center;
  width: 105px;
  min-height: 46px;
}
</style>
