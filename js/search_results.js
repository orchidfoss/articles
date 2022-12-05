(function (exports) {
  "use strict";

  var history = JSON.parse(localStorage.getItem("ws.articles.searchHistory")) || [];

  var searchbox = document.getElementById("searchbox");
  var searchboxInput = document.getElementById("searchbox-input");
  var searchResults = document.getElementById("search-results");

  searchboxInput.addEventListener("keydown", () => {
    setTimeout(() => {
      refreshList();
    });
  });

  searchbox.addEventListener("submit", (evt) => {
    evt.preventDefault();
    addHistory(searchboxInput.value);
  });

  function addHistory(value) {
    if (searchboxInput.value !== "") {
      if (history.indexOf(value) !== -1) {
        history = history.filter((e) => e !== value);
      }

      history.push(value);
      localStorage.setItem("ws.articles.searchHistory", JSON.stringify(history));
      OrchidServices.get("articles_metadata/profile_logs").then(function (
        data,
        id
      ) {
        if (data) {
          OrchidServices.set("articles_metadata/profile_logs", {
            search_keywords: [...data.search_keywords, value],
          });
        } else {
          OrchidServices.set("articles_metadata/profile_logs", {
            search_keywords: [value],
          });
        }
      });
    }
  }

  function refreshList() {
    searchResults.innerHTML = "";

    history.reverse().forEach((item, index) => {
      if (index >= 7) {
        return;
      }

      if (item.includes(searchboxInput.value) || searchboxInput.value == "") {
        var element = document.createElement("li");
        element.textContent = item;
        element.dataset.icon = "history";
        element.addEventListener("click", () => {
          location.href = "?searchquery=" + item + "&user=0";
        });
        searchResults.appendChild(element);
      }
    });

    OrchidServices.get("articles_metadata/profile_logs").then(function (
      data,
      id
    ) {
      history = JSON.parse(localStorage.getItem("ws.articles.searchHistory")) || [];
      if (!data.search_keywords) {
        return;
      }

      data.search_keywords.reverse().forEach((item, index) => {
        if (index >= 7) {
          return;
        }

        if (
          (item.includes(searchboxInput.value) || searchboxInput.value == "") &&
          history.indexOf(searchboxInput.value) == -1
        ) {
          var element = document.createElement("li");
          element.textContent = item;
          element.dataset.icon = "search";
          element.addEventListener("click", () => {
            location.href = "?searchquery=" + item + "&user=1";
          });
          searchResults.appendChild(element);
        }
      });
    });
  }
  refreshList();
})(window);
