(function (exports) {
  'use strict';

  function Dropdown(element, dropdown, callback) {
    var header = document.getElementById('header');
    var sidebar = document.getElementById('sidebar');
    var post = document.getElementById('post');
    var content = document.querySelectorAll('.content');
    [header, sidebar, post, ...content].forEach((uiElement) => {
      uiElement.addEventListener('click', () => {
        if (dropdown.classList.contains('visible')) {
          element.classList.remove('dropdown-button');
          dropdown.classList.remove('visible');
        }
      });
    });

    element.classList.add('dropdown-button');
    element.onclick = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      var activeButtons = document.querySelectorAll('.dropdown-button');
      activeButtons.forEach((buttonElement) => {
        if (buttonElement == element) {
          buttonElement.classList.toggle('active');
          return;
        }
        buttonElement.classList.remove('active');
      });

      dropdown.style.left = element.getBoundingClientRect().left + 'px';
      dropdown.style.top = element.getBoundingClientRect().top + element.offsetHeight + 'px';
      var activeDropdowns = document.querySelectorAll('.dropdown');
      activeDropdowns.forEach((dropdownElement) => {
        if (dropdownElement == dropdown) {
          dropdownElement.classList.toggle('visible');
          return;
        }
        dropdownElement.classList.remove('visible');
      });

      callback();

      if (element.getBoundingClientRect().left >= window.innerWidth - dropdown.offsetWidth - 10) {
        dropdown.style.left =
          element.getBoundingClientRect().left -
          (dropdown.offsetWidth - element.offsetWidth) +
          'px';
      }

      var views = dropdown.querySelectorAll('.dropdown-view');
      views.forEach((view, index) => {
        view.classList.remove('previous');

        if (index == 0) {
          view.classList.remove('next');
          view.classList.add('current');
          dropdown.style.height = view.offsetHeight + 'px';
        } else {
          view.classList.remove('current');
          view.classList.add('next');
        }
      });

      var links = dropdown.querySelectorAll('li[data-for]');
      links.forEach((link) => {
        link.onclick = () => {
          var currentView = document.querySelector('.dropdown-view.current');
          currentView.classList.remove('current');
          currentView.classList.remove('next');
          currentView.classList.add('previous');

          var id = link.dataset.for;
          var view = document.getElementById(id);
          view.classList.remove('next');
          view.classList.remove('previous');
          view.classList.add('current');
          dropdown.style.height = view.offsetHeight + 'px';
        };
      });

      var headerButtons = dropdown.querySelectorAll('a[data-for]');
      headerButtons.forEach((button) => {
        button.onclick = () => {
          var currentView = document.querySelector('.dropdown-view.current');
          currentView.classList.remove('current');
          currentView.classList.remove('previous');
          currentView.classList.add('next');

          var id = button.dataset.for;
          var view = document.getElementById(id);
          view.classList.remove('next');
          view.classList.remove('previous');
          view.classList.add('current');
          dropdown.style.height = view.offsetHeight + 'px';
        };
      });
    };
  }

  exports.Dropdown = Dropdown;
})(window);
