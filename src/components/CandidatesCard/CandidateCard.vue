<template>
  <div>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    >
    <md-card>
      <md-card-content>
        <md-card-media-cover>
          <md-card-media md-ratio="1:1">
            <img :src="img_src" />
          </md-card-media>

          <md-card-area>
            <md-button
              v-on:click="onClick"
              class="material-icons md-light md-48 status-info"
            >
              {{ img_work_status }}
            </md-button>
          </md-card-area>
        </md-card-media-cover>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "candidate-card",
  props: {
    id: Number,
    img_src: String,
    img_work_status: String,
    img_label: String,
    cycle: Number,
    iter: Number,
    show_batch_size: Number
  },
  data: function() {
    return {};
  },
  watch: {
    img_work_status: function() {
      let status = {
        id: this.id,
        img_src: this.img_src,
        img_work_status: this.img_work_status
      };
      this.$emit("status_make_working", status);
    }
  },
  methods: {
    onClick: function() {
      if (this.img_work_status !== "pending") {
        this.$emit("candidate_activated", this.id);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.md-card-content {
  padding: 0px;
}
.md-card-content:last-of-type {
  padding-bottom: 0;
}
.md-card {
  width: 120px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}
.material-icons.md-light {
  color: rgba(255, 255, 255, 1);
}
.material-icons.md-48 {
  font-size: 48px;
}
.md-card-media-cover .md-card-area {
  height: 100%;
  display: flex;
  position: absolute;
  // right: 0;
  // bottom: 0;
  // left: 0;
  z-index: 2;
  justify-content: space-around;
  align-items: center;
}
.status-info {
  height: 100%;
  width: 100%;
}
</style>
