(function (exports) {
  "use strict";

  exports.viewFunction["history"] = () => {
    setTimeout(() => {
      openContentView("loading-screen", false);
    });

    var history = JSON.parse(localStorage.getItem("ws.articles.history")) || [];
    historyTimeline.innerHTML = "";
    history.forEach((item) => {
      var element = document.createElement("div");
      element.classList.add("container");
      historyTimeline.appendChild(element);

      var content = document.createElement("div");
      content.classList.add("timeline-content");
      element.appendChild(content);

      var iconHolder = document.createElement("div");
      iconHolder.classList.add("icon-holder");
      content.appendChild(iconHolder);

      var icon = document.createElement("img");
      icon.onerror = () => {
        icon.src = "images/default.svg";
      };
      iconHolder.appendChild(icon);

      var context = document.createElement("div");
      context.classList.add("context");
      content.appendChild(context);

      var title = document.createElement("h1");
      context.appendChild(title);

      var paragraph = document.createElement("p");
      context.appendChild(paragraph);

      var timedate = document.createElement("p");
      timedate.classList.add("timedate");
      timedate.textContent = EnglishToArabicNumerals(
        new Date(item.visited_at).toLocaleDateString(
          navigator.mozL10n.language.code,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }
        )
      );
      context.appendChild(timedate);

      OrchidServices.get("webstore/" + item.id).then((data) => {
        openContentView("history", false);
        icon.src = data.icon;
        title.textContent = data.name;
        paragraph.textContent = data.description;

        element.addEventListener("click", () => {
          showWebappInfo(data, item.id, element);
        });
      });
    });
  };

  function removeDuplicates(arr) {
    var unique = [];
    arr.forEach((element) => {
      if (!unique.includes(element)) {
        unique.push(element);
      }
    });
    return unique;
  }

  exports.isHistoryEnabled =
    localStorage.getItem("ws.articles.historyEnabled") == "true" || true;
  exports.addToHistory = function addToHistory(id) {
    if (isHistoryEnabled) {
      var history =
        JSON.parse(localStorage.getItem("ws.articles.history")) || [];
      history.push({
        id: id,
        visited_at: Date.now(),
      });
      history = removeDuplicates(history);
      localStorage.setItem("ws.articles.history", JSON.stringify(history));
    }
  };

  var historyTimeline = document.getElementById("history-timeline");
})(window);
