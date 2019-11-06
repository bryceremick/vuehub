<template>
  <div :id="`${repoName}-repo-chart`" class="repo-chart-wrap"></div>
</template>

<script>
import Api from "../../services/Api";
import MG from "metrics-graphics";

export default {
  name: "RepoChart",
  props: {
    username: {
      type: String,
      required: true
    },
    repoName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      commitData: [],
      isRequestDone: false,
      authHeader: {
        headers: {
          Authorization: "Bearer " + this.$GH_TOKEN //the token is a variable which holds the token
        }
      }
    };
  },
  mounted() {
    Api()
      .get(`/repos/${this.username}/${this.repoName}/stats/commit_activity`, this.authHeader)
      .then(res => {
         this.commitData = res.data;
        // this.isRequestDone = true;

        res.data.forEach(element => {
          element.week = new Date(element.week * 1000);
        });

        MG.data_graphic({
          data: res.data,
          full_width: true,
          // full_height: true,
          title: "Commit Activity",
          // width: 400,
          // target: document.getElementById(`${this.repoName}-repo-chart`),
          // width: 500,
          height: 115,
          buffer: 0,
          top: 40,
          bottom: 5,
          right: 5,
          left: 35,
          inflator: 10/7,
          show_years: false,
          show_secondary_x_label: false,
          x_axis: false,
          // center_title_full_width: true,
          target: `#${this.repoName}-repo-chart`,
          x_accessor: "week",
          y_accessor: "total"
        });
      });
  },
  computed: {},
  methods: {
    getCommitData: function() {
      Api()
        .get(`/repos/${this.username}/${this.repoName}/stats/commit_activity`, this.authHeader)
        .then(res => {
          this.commitData = res.data;
          this.isRequestDone = true;
        });
    }
  }
};
</script>

<style lang="scss">
 @import '../../node_modules/metrics-graphics/dist/metricsgraphics';

.repo-chart-wrap {
  width: 100%;
  height: 100%;

  // border: 1px solid red;
}
</style>