(function (exports) {
  "use strict";

  var helpButton = document.getElementById("help-button");
  var helpDropdownButton = document.getElementById("options-dropdown-help");
  var helpDropdown = document.getElementById("help-dropdown");

  [helpButton, helpDropdownButton].forEach(button => {
    Dropdown(button, helpDropdown, () => {
      // Account
      var reportLink = document.getElementById("help-dropdown-report");
      var mediaLink = document.getElementById("help-dropdown-media");
      var moreLink = document.getElementById("help-dropdown-more");

      reportLink.onclick = () => {
        window.open('https://orchidfoss.github.io/?p=help/articles/reporting-posts');
      };

      mediaLink.onclick = () => {
        window.open('https://orchidfoss.github.io/?p=help/articles/posting-media');
      };

      moreLink.onclick = () => {
        window.open('https://orchidfoss.github.io/?p=help/articles');
      };
    });
  });
})(window);
