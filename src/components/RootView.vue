<template>
  <div class="content">
    <h1>{{ title }}</h1>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-20">
        <md-card>
          <md-card-content>
            <customizing-card
              v-on:candidates_update="candidates_update"
              v-on:layout_switch="layout_switch"
            />
          </md-card-content>
        </md-card>
      </div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-80">
        <md-card>
          <md-card-content>
            <operation-card ref="operation_card" />
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "root-view",
  props: {
    title: String
  },
  data: function() {
    return {};
  },
  methods: {
    candidates_update: function(data) {
      this.$refs.operation_card.candidates_update(data);
    },
    layout_switch: function(data) {
      this.$refs.operation_card.layout_switch(data);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.content {
  margin: 0 250px;
}
</style>
