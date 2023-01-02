(function (exports) {
  "use strict";

  var profileButton = document.getElementById("profile-button");
  var optionsButton = document.getElementById("options-button");
  var optionsDropdown = document.getElementById("options-dropdown");

  [profileButton, optionsButton].forEach(button => {
    Dropdown(button, optionsDropdown, () => {
      // Account
      var profileButton = document.getElementById("options-dropdown-profile");
      var profileAvatar = document.getElementById("options-dropdown-profile-avatar");
      var profileUsername = document.getElementById("options-dropdown-profile-username");

      var loginButton = document.getElementById("options-dropdown-login");
      var signUpButton = document.getElementById("options-dropdown-signup");
      var switchUserButton = document.getElementById("options-dropdown-switch-user");
      var logOutButton = document.getElementById("options-dropdown-logout");

      if (navigator.onLine) {
        if (OrchidServices.isUserLoggedIn()) {
          OrchidServices.getWithUpdate(
            "profile/" + OrchidServices.userId(),
            function (data) {
              profileButton.onclick = () => {
                window.open('https://orchidfoss.github.io/profile/?user_id=' + data.token);
              };
              profileUsername.textContent = data.username;
              profileAvatar.alt = data.username;
              if (data.profile_picture !== "") {
                profileAvatar.src = data.profile_picture;
              } else {
                profileAvatar.src = "/images/profile_pictures/avatar_default.svg";
              }
            }
          );

          loginButton.style.display = "none";
          signUpButton.style.display = "none";
        } else {
          profileButton.style.display = "none";
          switchUserButton.style.display = "none";
          logOutButton.style.display = "none";
        }
      } else {
        profileButton.style.display = "none";
        loginButton.style.display = "none";
        signUpButton.style.display = "none";
        switchUserButton.style.display = "none";
        logOutButton.style.display = "none";
        logOutButton.nextElementSibling.style.display = "none";
      }

      loginButton.onclick = () => {
        window.open('https://orchidfoss.github.io/auth/?redirect=' + encodeURI(location.href), 'popUpWindow', 'width=854,height=480,left=64,top=48,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
      };

      signUpButton.onclick = () => {
        window.open('https://orchidfoss.github.io/auth/signup.html?redirect=' + encodeURI(location.href), 'popUpWindow', 'width=854,height=480,left=64,top=48,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
      };

      switchUserButton.onclick = () => {
        window.open('https://orchidfoss.github.io/auth/?redirect=' + encodeURI(location.href), 'popUpWindow', 'width=854,height=480,left=64,top=48,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
      };

      logOutButton.onclick = () => {
        delete localStorage['ws.login.userId'];
        location.reload();
      };

      // Options
      var settingsButton = document.getElementById("options-dropdown-settings");
      var termsButton = document.getElementById("options-dropdown-terms");
      var privacyButton = document.getElementById("options-dropdown-privacy");
      var guidelinesButton = document.getElementById("options-dropdown-guidelines");

      settingsButton.onclick = () => {
        openContentView('settings', true);
        button.classList.remove('active');
        optionsDropdown.classList.remove('visible');
      };

      termsButton.onclick = () => {
        window.open('https://orchidfoss.github.io/?p=terms-of-service');
      };

      privacyButton.onclick = () => {
        window.open('https://orchidfoss.github.io/?p=privacy-policy');
      };

      guidelinesButton.onclick = () => {
        window.open('https://orchidfoss.github.io/?p=community-guidelines');
      };
    });
  });
})(window);
