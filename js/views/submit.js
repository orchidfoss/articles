(function (exports) {
  "use strict";

  exports.viewFunction['submit'] = () => {};

  var base64 = {
    images: []
  };
  var textInput = document.getElementById('submit-content');
  var imagesInput = document.getElementById('submit-images');
  var submitButton = document.getElementById('submit-button');

  var tags = new TagsInput({
    selector: "submit-tags",
    duplicate: false,
    max: 10,
  });

  function getBase64(file, callback) {
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        callback(reader.result);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
        callback('about:blank');
      };
    } else {
      callback('about:blank');
    }
  }

  submitButton.addEventListener('click', () => {
    Array.from(imagesInput.files).forEach((file, index) => {
      getBase64(file, function(result) {
        base64.images[index] = result;
      });
    });

    setTimeout(() => {
      OrchidServices.custom.publishArticle({
        content: textInput.value,
        tags: tags.arr,
        images: base64.images
      });
      openContentView("content", true);
    }, 300);
  });
})(window);
