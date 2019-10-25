<template>
  <div v-if="isAllDataFetched" class="repo-card">
    <div class="repo-card-head" :style="{ backgroundColor: repoLangColorInverted }">
      <div class="repo-card-head-left">
        <p :style="{color: $getContrastYIQ(repoLangColorInverted)}">{{repo.name}}</p>
      </div>
      <div class="repo-card-head-right">
        <img v-if="showStars" class="repo-card-star-asset" src="../../assets/star.svg" />
        <p v-if="showStars" class="repo-card-star-count">{{repo.stargazers_count}}</p>
        <div class="repo-card-language-wrap" :style="{ backgroundColor: repoLangColor }">
          <p :style="{color: $getContrastYIQ(repoLangColor)}">{{repo.language}}</p>
        </div>
      </div>
    </div>

    <div class="repo-card-body">
      <p>{{repo.description}}</p>
    </div>
    <div class="repo-card-divider">
      <div class="divider-left-line divider-line">
        <hr />
      </div>
      <div class="divider-text">
        <p>Recent Activity</p>
      </div>
      <div class="divider-right-line divider-line">
        <hr />
      </div>
    </div>
    <div class="repo-card-recent-activity">
      <div class="recent-activity-top">
        <div class="repo-card-recent-commit-wrap">
          <div class="chip-date-wrap">
            <p class="chip-date">{{parseDate(recentCommit.commit.committer.date)}}</p>
          </div>
          <div class="recent-commit-chip activity-chip">
            <div class="activity-profile-pic" :style="{backgroundImage: `url(${recentCommit.author.avatar_url})`, 
            border: `2px solid ${repoLangColor}`}"></div>
            <p class="activity-username">{{recentCommit.author.login}}</p>
            <p class="activity-details">{{recentCommit.commit.message}}</p>
            <img class="activity-icon" src="../../assets/git-commit.svg" alt="">
          </div>
        </div>

        <div class="repo-card-recent-issue-wrap">
          <div class="chip-date-wrap">
            <p class="chip-date">{{parseDate(recentIssue.created_at)}}</p>
          </div>
          <div class="recent-issue-chip activity-chip">
            <div class="activity-profile-pic" :style="{backgroundImage: `url(${recentIssue.user.avatar_url})`, 
            border: `2px solid ${repoLangColor}`}"></div>
            <p class="activity-username">{{recentIssue.user.login}}</p>
            <p class="activity-details">{{recentIssue.title}}</p>
            <img class="activity-icon" src="../../assets/alert-circle.svg"  alt="">
          </div>
        </div>
      </div>

      <div class="repo-card-activity-stats-wrap"></div>
    </div>
  </div>
</template>

<script>
import Api from "../../services/Api";
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
    },
    showStars: {
      type: Boolean,
      required: false,
      default: () => false
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
      remaningRequests: 0,
      totalRequestsAllowed: 0,
      // TODO Handle repos that have no commits/issues
      authHeader: {
        headers: {
          Authorization: "Bearer " + this.$GH_TOKEN //the token is a variable which holds the token
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
    },
    recentCommit: function() {
      return this.commits[0];
    },
    recentIssue: function() {
      return this.issues[0];
    },
    repoLangColor: function() {
      return this.$findLangColor(this.repo.language);
    },
    repoLangColorInverted: function() {
      return this.$invertColor(this.repoLangColor);
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
      return moment(dateString).format("MM/DD/YY");
      // return moment(dateString).format("MM-DD-YY, h:mma");
    },
    truncate: function(str, num) {
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
  border-radius: 10px;
  background-color: #fff;
  grid-template-columns: 1fr;
  grid-auto-rows: 15% 1fr 30px 60%;
  grid-template-areas:
    "head"
    "body"
    "divider"
    "foot";

  .repo-card-head {
    grid-area: head;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

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
      }
    }
    .repo-card-head-right {
      // border: 1px solid green;
      width: 30%;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .repo-card-star-asset {
        width: 25px;
        margin: 2px;
      }
      .repo-card-star-count {
        font-size: 20px;
        font-weight: 800;
      }

      .repo-card-language-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;

        padding: 5px 15px;
        margin-left: 15px;
        min-width: 40px;
        border-radius: 100px;
        p {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          padding: 0;
        }
      }
    }
  }

  .repo-card-body {
    grid-area: body;
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 5px 10px;

    p {
      font-size: 12px;
    }
    // border: 1px solid blue;
  }

  .repo-card-divider {
    grid-area: divider;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;

    .divider-left-line {
      width: 10%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 20px;
    }
    .divider-text {
      width: 30%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        font-size: 14px;
        font-weight: 800;
        margin: 0px;
        padding: 0px;
        transform: translateY(-2px);
      }
    }
    .divider-right-line {
      width: 60%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 20px;
    }

    .divider-line {
      hr {
        width: 100%;
        border: 0;
        height: 0;
        border-top: 1px solid rgba(0, 0, 0, 0.2);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }

  .repo-card-recent-activity {
    grid-area: foot;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0px 20px 20px 20px;

    .recent-activity-top {

      height: 50%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;


      .repo-card-recent-commit-wrap, .repo-card-recent-issue-wrap {
        height: 50%;
        width: 100%;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;

        .chip-date-wrap{
          height: 100%;
          width: 15%;
          margin-right: 5px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          // border: 1px solid red;

          p{
            margin: 0px;
            padding: 0px;
            font-weight: 600;
            font-size: 14px;
          }
        }

        .activity-chip{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: row;
          padding: 5px;
          // min-width: 50%;
          height: 30px;
          background-color: #E6E6E6;
          border-radius: 50px;

          .activity-profile-pic{
            height: 25px;
            width: 25px;
            border-radius: 100%;
            margin: 0px 1px;
            background-position: center; /* Center the image */
            background-repeat: no-repeat; /* Do not repeat the image */
            background-size: cover; 
          }
          .activity-username{
            font-size: 12px;
            font-weight: 800;
            margin: 0px 5px;
            border-right: 1px solid rgba(0, 0, 0, 0.3);
            padding-right: 10px;
          }
          .activity-details{
            font-size: 12px;
            font-weight: 400;
            margin: 0px 5px;
          }
          .activity-icon{
            width: 20px;
            margin: 0px 5px 0px 10px;
          }
        }
      }


    }

    .repo-card-activity-stats-wrap {
      height: 50%;
      width: 100%;
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
