function Comments(path, element, hasStars = false) {
  function EnglishToArabicNumerals(numberString) {
    var arabicNumerals = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    if (document.dir == 'rtl') {
      return numberString.toString().replace(/[0-9]/g, function(w) {
        return arabicNumerals[+w];
      });
    } else {
      return numberString;
    }
  }

  var currentUrl = location.href;

  var form = element.querySelector('form');
  var inputbox = element.querySelector('form textarea');
  var comments = element.querySelector('ul');
  var starRatingForm = element.querySelector('.star-rating > form');
  var expandButton = element.querySelector('.expand-button');

  if (!OrchidServices.isUserLoggedIn()) {
    form.style.display = 'none';
    if (starRatingForm) {
      starRatingForm.parentElement.style.display = 'none';
    }
  }

  expandButton.onclick = (evt) => {
    evt.preventDefault();
    comments.classList.toggle('expanded');
    expandButton.classList.toggle('active');
    if (comments.classList.contains("expanded")) {
      expandButton.children[0].dataset.l10nId = "show-less";
    } else {
      expandButton.children[0].dataset.l10nId = "show-more";
    }
  };

  function refreshComments() {
    OrchidServices.getWithUpdate(path, (data) => {
      comments.innerHTML = '';

      if (data.comments == null) {
        OrchidServices.set(path, { comments: [] });
        return;
      }
      data.comments.forEach((comment, index) => {
        var element = document.createElement('li');
        comments.appendChild(element);

        var figure = document.createElement('figure');
        element.appendChild(figure);

        var figureAvatar = document.createElement('img');
        figureAvatar.onerror = function() {
          figureAvatar.src = '/images/profile_pictures/avatar_default.svg';
        };
        figure.appendChild(figureAvatar);

        var figCaption = document.createElement('figcaption');
        figure.appendChild(figCaption);

        OrchidServices.get('profile/' + comment.author_id).then(function(udata) {
          figureAvatar.src = udata.profile_picture;
          figureAvatar.alt = udata.username;
          figCaption.textContent = udata.username;

          if (udata.metadata.is_verified) {
            figCaption.classList.add('verified');
          }
          if (udata.token == comment.author_id) {
            figCaption.classList.add('author');
          }
        });

        if (hasStars && comment.rating) {
          var starRating = document.createElement('div');
          starRating.classList.add('stars');
          element.appendChild(starRating);

          for (let index = 0; index < parseInt(comment.rating * 5); index++) {
            var star = document.createElement('span');
            star.classList.add('star');
            star.classList.add('active');
            starRating.appendChild(star);
          }
          for (let index = 0; index < (5 - parseInt(comment.rating * 5)); index++) {
            var star = document.createElement('span');
            star.classList.add('star');
            starRating.appendChild(star);
          }
        }

        var content = document.createElement('p');
        content.innerText = comment.content;
        element.appendChild(content);

        var menu = document.createElement('menu');
        element.appendChild(menu);

        var likeButton = document.createElement('button');
        likeButton.classList.add('like-button');
        likeButton.dataset.icon = 'like';
        likeButton.textContent = EnglishToArabicNumerals(comment.likes.length);
        menu.appendChild(likeButton);

        var dislikeButton = document.createElement('button');
        dislikeButton.classList.add('dislike-button');
        dislikeButton.dataset.icon = 'dislike';
        dislikeButton.textContent = EnglishToArabicNumerals(comment.dislikes.length);
        menu.appendChild(dislikeButton);

        if (comment.likes.indexOf(OrchidServices.userId()) !== -1) {
          likeButton.classList.add('enabled');
        }
        if (comment.dislikes.indexOf(OrchidServices.userId()) !== -1) {
          dislikeButton.classList.add('enabled');
        }

        if (!OrchidServices.isUserLoggedIn()) {
          likeButton.setAttribute('disabled', true);
          dislikeButton.setAttribute('disabled', true);
        }

        likeButton.addEventListener('click', function() {
          if (comment.likes.indexOf(OrchidServices.userId()) === -1) {
            comment.likes.push(OrchidServices.userId());
          } else {
            comment.likes.splice(OrchidServices.userId());
          }

          comment.dislikes.splice(OrchidServices.userId());
          dislikeButton.textContent = EnglishToArabicNumerals(comment.dislikes.length);
          dislikeButton.classList.remove('enabled');

          OrchidServices.getWithUpdate(path, (data) => {
            data.comments[index].likes = comment.likes;
            data.comments[index].dislikes = comment.dislikes;
            OrchidServices.set(path, { comments: data.comments });
          });
          likeButton.textContent = EnglishToArabicNumerals(comment.likes.length);
          likeButton.classList.toggle('enabled');
        });

        dislikeButton.addEventListener('click', function() {
          if (comment.dislikes.indexOf(OrchidServices.userId()) === -1) {
            comment.dislikes.push(OrchidServices.userId());
          } else {
            comment.dislikes.splice(OrchidServices.userId());
          }

          comment.likes.splice(OrchidServices.userId());
          likeButton.textContent = EnglishToArabicNumerals(comment.likes.length);
          likeButton.classList.remove('enabled');

          OrchidServices.get(path).then((data) => {
            data.comments[index].likes = comment.likes;
            data.comments[index].dislikes = comment.dislikes;
            OrchidServices.set(path, { comments: data.comments });
          });
          dislikeButton.textContent = EnglishToArabicNumerals(comment.dislikes.length);
          dislikeButton.classList.toggle('enabled');
        });

        var replyButton = document.createElement('button');
        replyButton.classList.add('reply-button');
        replyButton.dataset.icon = 'sms';
        replyButton.textContent = EnglishToArabicNumerals(comment.replies.length);
        replyButton.addEventListener('click', () => {
          element.classList.toggle('reply-form-shown');
        });
        menu.appendChild(replyButton);

        var replyForm = document.createElement('form');
        replyForm.classList.add('comment-form');
        element.appendChild(replyForm);

        var replyInput = document.createElement('textarea');
        replyForm.appendChild(replyInput);

        var replyClear = document.createElement('button');
        replyClear.type = 'clear';
        replyClear.dataset.icon = 'close';
        replyForm.appendChild(replyClear);

        var replySubmit = document.createElement('button');
        replySubmit.type = 'submit';
        replySubmit.dataset.icon = 'send';
        replyForm.addEventListener('submit', (evt) => {
          evt.preventDefault();
          OrchidServices.get(path).then((data) => {
            data.comments[index].replies.push({
              author_id: OrchidServices.userId(),
              content: replyInput.value,
              likes: [],
              dislikes: []
            });
            OrchidServices.set(path, { comments: data.comments });
          });
        });
        replyForm.appendChild(replySubmit);

        var showRepliesButton = document.createElement('button');
        showRepliesButton.classList.add('show-replies-button');
        showRepliesButton.classList.add('recommend');
        showRepliesButton.dataset.icon = 'expand-chevron';
        showRepliesButton.addEventListener('click', () => {
          showRepliesButton.classList.toggle('active');
          replyList.classList.toggle('visible');
        });
        menu.appendChild(showRepliesButton);

        var replyList = document.createElement('ul');
        element.appendChild(replyList);
        comment.replies.forEach((reply, index1) => {
          var element = document.createElement('li');
          replyList.appendChild(element);

          var figure = document.createElement('figure');
          element.appendChild(figure);

          var figureAvatar = document.createElement('img');
          figureAvatar.onerror = function() {
            figureAvatar.src = '/images/profile_pictures/avatar_default.svg';
          };
          figure.appendChild(figureAvatar);

          var figCaption = document.createElement('figcaption');
          figure.appendChild(figCaption);

          OrchidServices.get('profile/' + reply.author_id).then(function(udata) {
            figureAvatar.src = udata.profile_picture;
            figureAvatar.alt = udata.username;
            figCaption.textContent = udata.username;
          });

          OrchidServices.get(path).then(function(udata) {
            if (udata.author_id == reply.author_id) {
              figCaption.classList.add('author');
            }
          });

          var content = document.createElement('p');
          content.innerText = reply.content;
          element.appendChild(content);

          var menu = document.createElement('menu');
          element.appendChild(menu);

          var likeButton = document.createElement('button');
          likeButton.classList.add('like-button');
          likeButton.dataset.icon = 'like';
          likeButton.textContent = EnglishToArabicNumerals(reply.likes.length);
          menu.appendChild(likeButton);

          var dislikeButton = document.createElement('button');
          dislikeButton.classList.add('dislike-button');
          dislikeButton.dataset.icon = 'dislike';
          dislikeButton.textContent = EnglishToArabicNumerals(reply.dislikes.length);
          menu.appendChild(dislikeButton);

          if (reply.likes.indexOf(OrchidServices.userId()) !== -1) {
            likeButton.classList.add('enabled');
          }
          if (reply.dislikes.indexOf(OrchidServices.userId()) !== -1) {
            dislikeButton.classList.add('enabled');
          }

          if (!OrchidServices.isUserLoggedIn()) {
            likeButton.setAttribute('disabled', true);
            dislikeButton.setAttribute('disabled', true);
          }

          likeButton.addEventListener('click', function() {
            if (reply.likes.indexOf(OrchidServices.userId()) === -1) {
              reply.likes.push(OrchidServices.userId());
            } else {
              reply.likes.splice(OrchidServices.userId());
            }

            reply.dislikes.splice(OrchidServices.userId());
            dislikeButton.textContent = EnglishToArabicNumerals(reply.dislikes.length);
            dislikeButton.classList.remove('enabled');

            OrchidServices.getWithUpdate(path, (data) => {
              data.comments[index].replies[index1].likes = reply.likes;
              data.comments[index].replies[index1].dislikes = reply.dislikes;
              OrchidServices.set(path, { comments: data.comments });
            });
            likeButton.textContent = EnglishToArabicNumerals(reply.likes.length);
            likeButton.classList.toggle('enabled');
          });

          dislikeButton.addEventListener('click', function() {
            if (reply.dislikes.indexOf(OrchidServices.userId()) === -1) {
              reply.dislikes.push(OrchidServices.userId());
            } else {
              reply.dislikes.splice(OrchidServices.userId());
            }

            reply.likes.splice(OrchidServices.userId());
            likeButton.textContent = EnglishToArabicNumerals(reply.likes.length);
            likeButton.classList.remove('enabled');

            OrchidServices.get(path).then((data) => {
              data.comments[index].replies[index1].likes = reply.likes;
              data.comments[index].replies[index1].dislikes = reply.dislikes;
              OrchidServices.set(path, { comments: data.comments });
            });
            dislikeButton.textContent = EnglishToArabicNumerals(reply.dislikes.length);
            dislikeButton.classList.toggle('enabled');
          });
        });
      });
    });
  }
  if (location.href == currentUrl) {
    refreshComments();
  }

  form.onsubmit = (evt) => {
    evt.preventDefault();
    OrchidServices.get(path).then(data => {
      if (!data) {
        var data = {
          comments: []
        };
      }

      if (hasStars) {
        data.comments.push({
          author_id: OrchidServices.userId(),
          content: inputbox.value,
          likes: [],
          dislikes: [],
          replies: [],
          rating: (starRatingForm.querySelector('input[type="radio"]:checked').value / 5)
        });
      } else {
        data.comments.push({
          author_id: OrchidServices.userId(),
          content: inputbox.value,
          likes: [],
          dislikes: [],
          replies: []
        });
      }
      inputbox.value = '';
      OrchidServices.set(path, { comments: data.comments });
    });
  };
}