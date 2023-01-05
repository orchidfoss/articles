(function (exports) {
  "use strict";

  exports.viewFunction["content"] = () => {
    window.history.pushState({ html: "", pageTitle: "" }, "", "?");
    if (navigator.onLine) {
      setTimeout(() => {
        openContentView("loading-screen", false);
      });
      posts.innerHTML = "";

      OrchidServices.getArticles("articles", function (id, data) {
        openContentView("content", false);
        createPostCard(data, id, false);
        if (currentPost == id) {
          showPostInfo(data, id);
        }
      });
    }
  };

  var currentPost = "";
  var posts = document.getElementById("posts");

  var paramString = location.search.substring(1);
  var queryString = new URLSearchParams(paramString);
  if (location.search !== "") {
    for (let pair of queryString.entries()) {
      switch (pair[0]) {
        case "post":
          currentPost = pair[1];
          break;

        default:
          break;
      }
    }
  }
})(window);
