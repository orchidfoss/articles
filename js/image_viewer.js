(function (exports) {
  "use strict";

  exports.imageViewer = function imageViewer(images, index, element) {
    var container = document.getElementById('image-viewer');
    var list = document.getElementById('image-viewer-list');
    var closeButton = document.getElementById('image-viewer-close-button');
    var backButton = document.getElementById('image-viewer-back-button');
    var forwardButton = document.getElementById('image-viewer-forward-button');

    if (element) {
      container.style.transition = 'none';
      container.style.setProperty('--x', element.getBoundingClientRect().left + 'px');
      container.style.setProperty('--y', element.getBoundingClientRect().top + 'px');
      container.style.setProperty('--width', element.getBoundingClientRect().width + 'px');
      container.style.setProperty('--height', element.getBoundingClientRect().height + 'px');
      setTimeout(() => {
        container.style.transition = '';
      });
    }

    setTimeout(() => {
      container.classList.add('visible');
    }, 10);

    closeButton.onclick = () => {
      container.classList.remove('visible');
    };

    list.innerHTML = '';
    images.forEach(image => {
      var element = document.createElement("img");
      element.src = image;
      element.loading = "lazy";
      list.appendChild(element);
    });

    var rtl = (document.dir === 'rtl');
    list.scrollLeft = rtl ? -(window.innerWidth * index) : (window.innerWidth * index);

    backButton.onclick = () => {
      list.scrollLeft = rtl ? (list.scrollLeft + window.innerWidth) : (list.scrollLeft - window.innerWidth);
    };

    forwardButton.onclick = () => {
      list.scrollLeft = rtl ? (list.scrollLeft - window.innerWidth) : (list.scrollLeft + window.innerWidth);
    };

    list.onscroll = () => {
      if (list.scrollLeft == 0) {
        backButton.classList.add('hidden');
      } else {
        backButton.classList.remove('hidden');
      }

      if (!rtl && list.scrollLeft >= (list.scrollWidth - window.innerWidth) || rtl && list.scrollLeft <= -(list.scrollWidth - window.innerWidth)) {
        forwardButton.classList.add('hidden');
      } else {
        forwardButton.classList.remove('hidden');
      }
    };
  }
})(window);
