<template>
  <div v-if="isAllDataFetched" class="repo-card">
    <div class="repo-card-head">
      <div class="repo-card-head-left">
        <p>{{repo.name}}</p>
      </div>
      <div class="repo-card-head-right">
        <div class="repo-card-language-wrap"><p>{{repo.language}}</p></div>
      </div>
    </div>

    <div class="repo-card-body">
      <p>{{repo.description}}</p>
    </div>

    <div class="repo-card-recent-activity">
      <!-- <div class="recent-commit">
        <div class="commit-date">
          <p>{{parseDate(commits[0].commit.committer.date)}}</p>
        </div>
        <div class="commit-message">
          <p>{{truncate(commits[0].commit.message, 30)}}</p>
        </div>
      </div>

      <div class="recent-issue">
        <div class="issue-number">
          <p>{{issues[0].number}}</p>
        </div>
        <div class="issue-title">
          <p>{{issues[0].title}}</p>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import Api from "@/services/Api";
import moment from "moment-timezone";

export default {
  name: "RepoCard",
  props: {
    username: {
      type: String,
      required: true
    },
    repoName: {
      type: String,
      required: true
    },
    extended: {
      type: Boolean,
      required: false,
      default: () => true
    }
    // sort_by: {
    //   type: String,
    //   required: false,
    //   default: () => "stars_count",
    //   validator: value => {
    //     // The value must match one of these strings
    //     return (
    //       ["forks_count", "watchers_count", "stargazers_count"].indexOf(
    //         value
    //       ) !== -1
    //     );
    //   }
    // }
  },
  data() {
    return {
      repo: {},
      commits: [],
      issues: [],
      isRepoRequestDone: false,
      isCommitsRequestDone: false,
      isIssuesRequestDone: false,
      token: "2f90461014f435b5a9aab27330deaa0bfff9c417",
      remaningRequests: 0,
      totalRequestsAllowed: 0,
      authHeader: {
        headers: {
          Authorization: "Bearer " + "2f90461014f435b5a9aab27330deaa0bfff9c417" //the token is a variable which holds the token
        }
      }
    };
  },
  mounted() {
    // func to calculate how many requests you have left
    this.rateLimit();

    this.repoGetRequest();
    this.commitsGetRequest();
    this.issuesGetRequest();
  },
  computed: {
    isAllDataFetched: function() {
      return (
        this.isRepoRequestDone &&
        this.isCommitsRequestDone &&
        this.isIssuesRequestDone
      );
    }
  },
  methods: {
    // compare: function(property) {
    //   var sortOrder = 1;
    //   if (property[0] === "-") {
    //     sortOrder = -1;
    //     property = property.substr(1);
    //   }
    //   return function(a, b) {
    //     // next line works with strings and numbers
    //     var result =
    //       a[property] < b[property] ? 1 : a[property] > b[property] ? -1 : 0;
    //     return result * sortOrder;
    //   };
    // },
    repoGetRequest: function() {
      // get request for repo
      Api()
        .get(`/repos/${this.username}/${this.repoName}`, this.authHeader)
        .then(res => {
          this.repo = res.data;
          this.isRepoRequestDone = true;
        });
    },
    commitsGetRequest: function() {
      Api()
        .get(
          `/repos/${this.username}/${this.repoName}/commits`,
          this.authHeader
        )
        .then(commits => {
          this.commits = commits.data;
          this.isCommitsRequestDone = true;
        });
    },
    issuesGetRequest: function() {
      Api()
        .get(`/repos/${this.username}/${this.repoName}/issues`, this.authHeader)
        .then(issues => {
          this.issues = issues.data;
          this.isIssuesRequestDone = true;
        });
    },
    rateLimit: function() {
      Api()
        .get("/rate_limit", this.authHeader)
        .then(res => {
          this.remaningRequests = res.data.resources.core.remaining;
          this.totalRequestsAllowed = res.data.resources.core.limit;

          console.log(
            `${this.remaningRequests}/${this.totalRequestsAllowed} GH api requests remaining`
          );
        });
    },
    parseDate: function(dateString) {
      return moment(dateString).format("ddd, hA");
    },
    truncate(str, num) {
      if (str == "") {
        return str;
      }
      if (str.length <= num) {
        return str;
      }
      // Return str truncated with '...' concatenated to the end of str.
      return str.slice(0, num) + "...";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.repo-card {
  display: grid;
  float: left;
  margin: 10px;
  width: 500px;
  // min-width: 400px;
  height: 375px;
  color: #4a4a4a;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 20px;
  background-color: #fff;
  grid-template-columns: 1fr;
  grid-auto-rows: 15% 1fr 60%;
  grid-template-areas:
    "head"
    "body"
    "foot";

  .repo-card-head {
    grid-area: head;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: #0e1fa5;

    .repo-card-head-left {
      // border: 1px solid green;
      width: 70%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 10px;
      p {
        font-size: 25px;
        font-weight: 800;
        margin-left: 20px;
        color: #fff;
      }
    }
    .repo-card-head-right {
      // border: 1px solid green;
      width: 30%;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .repo-card-language-wrap{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;

        padding: 3px 10px;
        min-width: 50px;
        border-radius: 100px;
        background-color: #f1e05a;
        p {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        padding: 0;
        color: #2c3e50;
      }
      }
    }
  }

  .repo-card-body {
    grid-area: body;
    display: flex;
    justify-content: center;
    align-items: center;
    // border: 1px solid blue;
  }
  
  .repo-card-recent-activity {
    grid-area: foot;
    // border: 1px solid purple;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    p {
      margin: 0px;
      padding: 0px;
    }

    .recent-commit {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      width: 100%;
      .commit-date {
        width: 30%;
        p {
          font-size: 12px;
        }
      }
      .commit-message {
        width: 60%;
        p {
          font-size: 12px;
        }
      }
    }
    .recent-issue {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      width: 100%;

      .issue-number {
        width: 30%;
        p {
          font-size: 12px;
        }
      }
      .issue-title {
        width: 60%;
        p {
          font-size: 12px;
        }
      }
    }
  }
}

/* 
  ##Device = Desktops
  ##Screen = 1281px to higher resolution desktops
*/

@media (min-width: 1281px) {
  //CSS
}

/* 
  ##Device = Laptops, Desktops
  ##Screen = B/w 1025px to 1280px
*/

@media (min-width: 1025px) and (max-width: 1280px) {
  //CSS
}

/* 
  ##Device = Tablets, Ipads (portrait)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) {
  //CSS
}

/* 
  ##Device = Tablets, Ipads (landscape)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  //CSS
}

/* 
  ##Device = Low Resolution Tablets, Mobiles (Landscape)
  ##Screen = B/w 481px to 767px
*/

@media (min-width: 481px) and (max-width: 767px) {
  //CSS
}

/* 
  ##Device = Most of the Smartphones Mobiles (Portrait)
  ##Screen = B/w 320px to 479px
*/

@media (min-width: 320px) and (max-width: 480px) {
  .repo-card {
    width: 90%;
    height: 400px;
  }
}
</style>
