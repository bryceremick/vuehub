<template>
  <div class="repo-main-wrap">
    <div v-for="(repo, index) in sortedRepos" :key="index">
      <p>{{repo.name}}</p>
    </div>
  </div>
</template>

<script>
import Api from "@/services/Api";

export default {
  name: "ListRepos",
  props: {
    username: {
      type: String,
      required: true,
    },
    sort_by: {
      type: String,
      required: false,
      default: () => "stars_count",
      validator: value => {
        // The value must match one of these strings
        return ['forks_count', 'watchers_count', 'stargazers_count'].indexOf(value) !== -1
      }
    },
  },
  data() {
    return {
      repos: []
    };
  },
  mounted() {
    Api()
      .get(`/users/${this.username}/repos?sort=created`)
      .then(response => {
        // this.repos = response.data;
        this.repos = response.data;
      });

  },
  computed: {
    sortedRepos: function () {
      return this.repos.slice().sort(this.compare(this.sort_by));
    }
  },
  methods: {
    compare: function(property) {
      var sortOrder = 1;
      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function(a, b) {
        // next line works with strings and numbers
        var result = a[property] < b[property] ? 1 : a[property] > b[property] ? -1 : 0;
        return result * sortOrder;
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
