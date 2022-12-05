(function (exports) {
  "use strict";

  exports.viewFunction = {};
  var sidebar = document.getElementById("sidebar");

  exports.openContentView = function openContentView(id, highlight = true) {
    sidebar.classList.remove('visible');

    var element = document.getElementById(id);
    if (!element.classList.contains('visible')) {
      exports.selectedView = id;
      var visible = document.querySelector('.content.visible');
      if (visible) {
        visible.classList.remove('visible');
      }

      if (highlight) {
        exports.viewFunction[id]();
      }
      element.classList.add('visible');
    }

    if (highlight) {
      var linkItem = document.getElementById('sidebar-' + id);
      if (linkItem) {
        var selected = document.querySelector('#sidebar [aria-selected="true"]');
        if (selected) {
          selected.setAttribute('aria-selected', null);
        }

        linkItem.setAttribute('aria-selected', true);
      }
    }
  }

  var paramString = location.search.substring(1);
  var queryString = new URLSearchParams(paramString);
  if (location.search !== "") {
    for (let pair of queryString.entries()) {
      switch (pair[0]) {
        case "page":
          openContentView(pair[1]);
          break;

        default:
          break;
      }
    }
  }
})(window);
