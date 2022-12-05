(function (exports) {
  "use strict";

  var LIKE_SOUND = new Audio('resources/sounds/like.wav');
  var DISLIKE_SOUND = new Audio('resources/sounds/dislike.wav');

  var posts = document.getElementById("posts");

  exports.createPostCard = function createPostCard(data, id) {
    var element = document.createElement("a");
    element.href = "?post=" + id;
    element.classList.add("post");
    element.classList.add("post-object");
    element.onclick = (evt) => {
      evt.preventDefault();
      showPostInfo(data, id, element);
    };
    posts.appendChild(element);

    var iconHolder = document.createElement("div");
    iconHolder.classList.add("icon-holder");
    element.appendChild(iconHolder);

    var icon = document.createElement("img");
    icon.src = data.icon;
    icon.onerror = () => {
      icon.src = "/images/profile_pictures/avatar_default.svg";
    };
    iconHolder.appendChild(icon);

    var contentHolder = document.createElement("div");
    contentHolder.classList.add("content-holder");
    element.appendChild(contentHolder);

    var author = document.createElement("a");
    author.classList.add("author");
    author.target = '_blank';
    contentHolder.appendChild(author);

    var content = document.createElement("span");
    content.classList.add("context");
    content.textContent = data.content;
    contentHolder.appendChild(content);

    OrchidServices.getWithUpdate("profile/" + data.author_id, function (udata) {
      icon.src = udata.profile_picture;
      author.innerHTML = `<span>${udata.username}</span>`;
      author.href = "/profile/?user_id=" + udata.token;

      if (udata.metadata || udata.metadata.is_verified) {
        author.classList.add('verified');
      }
    });

    var nav = document.createElement("nav");
    element.appendChild(nav);

    var likeButton = document.createElement("button");
    likeButton.classList.add("like-button");
    likeButton.dataset.icon = 'like';
    nav.appendChild(likeButton);

    var likeButtonNumber = document.createElement("span");
    likeButtonNumber.textContent = EnglishToArabicNumerals(data.likes.length);
    likeButton.appendChild(likeButtonNumber);

    var likeButtonTooltip = document.createElement("div");
    likeButtonTooltip.setAttribute('role', 'title');
    likeButtonTooltip.classList.add('bottom');
    likeButtonTooltip.dataset.l10nId = 'post-like';
    likeButton.appendChild(likeButtonTooltip);

    var dislikeButton = document.createElement("button");
    dislikeButton.classList.add("dislike-button");
    dislikeButton.dataset.icon = 'dislike';
    nav.appendChild(dislikeButton);

    var dislikeButtonNumber = document.createElement("span");
    dislikeButtonNumber.textContent = EnglishToArabicNumerals(data.dislikes.length);
    dislikeButton.appendChild(dislikeButtonNumber);

    var dislikeButtonTooltip = document.createElement("div");
    dislikeButtonTooltip.setAttribute('role', 'title');
    dislikeButtonTooltip.classList.add('bottom');
    dislikeButtonTooltip.dataset.l10nId = 'post-dislike';
    dislikeButton.appendChild(dislikeButtonTooltip);

    if (data.likes.indexOf(OrchidServices.userId()) !== -1) {
      likeButton.classList.add('enabled');
    }
    if (data.dislikes.indexOf(OrchidServices.userId()) !== -1) {
      dislikeButton.classList.add('enabled');
    }

    if (!OrchidServices.isUserLoggedIn()) {
      likeButton.setAttribute('disabled', true);
      dislikeButton.setAttribute('disabled', true);
    }

    likeButton.addEventListener('click', function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (data.likes.indexOf(OrchidServices.userId()) === -1) {
        data.likes.push(OrchidServices.userId());
        LIKE_SOUND.currentTime = 0;
        LIKE_SOUND.play();
      } else {
        data.likes.splice(OrchidServices.userId());
      }

      data.dislikes.splice(OrchidServices.userId());
      dislikeButtonNumber.textContent = EnglishToArabicNumerals(data.dislikes.length);
      dislikeButton.classList.remove('enabled');

      OrchidServices.getWithUpdate('articles/' + data.token, (data) => {
        data.likes = data.likes;
        data.dislikes = data.dislikes;
        OrchidServices.set('articles/' + data.token, { comments: data.comments });
      });
      likeButtonNumber.textContent = EnglishToArabicNumerals(data.likes.length);
      likeButton.classList.toggle('enabled');
    });

    dislikeButton.addEventListener('click', function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (data.dislikes.indexOf(OrchidServices.userId()) === -1) {
        data.dislikes.push(OrchidServices.userId());
        DISLIKE_SOUND.currentTime = 0;
        DISLIKE_SOUND.play();
      } else {
        data.dislikes.splice(OrchidServices.userId());
      }

      data.likes.splice(OrchidServices.userId());
      likeButtonNumber.textContent = EnglishToArabicNumerals(data.likes.length);
      likeButton.classList.remove('enabled');

      OrchidServices.get('articles/' + data.token).then((data) => {
        data.likes = data.likes;
        data.dislikes = data.dislikes;
        OrchidServices.set('articles/' + data.token, { comments: data.comments });
      });
      dislikeButtonNumber.textContent = EnglishToArabicNumerals(data.dislikes.length);
      dislikeButton.classList.toggle('enabled');
    });

    var shareButton = document.createElement("button");
    shareButton.classList.add("share-button");
    shareButton.dataset.icon = 'share';
    nav.appendChild(shareButton);

    var shareButtonTooltip = document.createElement("div");
    shareButtonTooltip.setAttribute('role', 'title');
    shareButtonTooltip.classList.add('bottom');
    shareButtonTooltip.dataset.l10nId = 'post-share';
    shareButton.appendChild(shareButtonTooltip);

    var optionsButton = document.createElement("button");
    optionsButton.classList.add("options-button");
    optionsButton.dataset.icon = 'options';
    nav.appendChild(optionsButton);

    var optionsButtonTooltip = document.createElement("div");
    optionsButtonTooltip.setAttribute('role', 'title');
    optionsButtonTooltip.classList.add('bottom');
    optionsButtonTooltip.dataset.l10nId = 'post-options';
    optionsButton.appendChild(optionsButtonTooltip);
  };

  exports.showPostInfo = function showPostInfo(data, id, card) {
    openContentView('post');
    var postAvatar = document.getElementById("post-avatar");
    var postAuthor = document.getElementById("post-author");
    var postContent = document.getElementById("post-context");
    var postComments = document.getElementById("post-comments");

    var likeButton = document.getElementById("like-button");
    var dislikeButton = document.getElementById("dislike-button");
    var shareButton = document.getElementById("share-button");
    var optionsButton = document.getElementById("options-button");

    postAvatar.onerror = () => {
      postAvatar.src = '/images/profile_pictures/avatar_default.svg';
    };

    OrchidServices.get("profile/" + data.author_id).then(function (udata) {
      postAvatar.src = udata.profile_picture;
      postAuthor.innerHTML = `<span>${udata.username}</span>`;
      postAuthor.href = "/profile/?user_id=" + udata.token;

      if (udata.metadata || udata.metadata.is_verified) {
        postAuthor.classList.add('verified');
      } else {
        postAuthor.classList.remove('verified');
      }
    });

    likeButton.innerHTML = '';

    var likeButtonNumber = document.createElement("span");
    likeButtonNumber.textContent = EnglishToArabicNumerals(data.likes.length);
    likeButton.appendChild(likeButtonNumber);

    var likeButtonTooltip = document.createElement("div");
    likeButtonTooltip.setAttribute('role', 'title');
    likeButtonTooltip.classList.add('bottom');
    likeButtonTooltip.dataset.l10nId = 'post-like';
    likeButton.appendChild(likeButtonTooltip);

    dislikeButton.innerHTML = '';

    var dislikeButtonNumber = document.createElement("span");
    dislikeButtonNumber.textContent = EnglishToArabicNumerals(data.dislikes.length);
    dislikeButton.appendChild(dislikeButtonNumber);

    var dislikeButtonTooltip = document.createElement("div");
    dislikeButtonTooltip.setAttribute('role', 'title');
    dislikeButtonTooltip.classList.add('bottom');
    dislikeButtonTooltip.dataset.l10nId = 'post-dislike';
    dislikeButton.appendChild(dislikeButtonTooltip);

    if (data.likes.indexOf(OrchidServices.userId()) !== -1) {
      likeButton.classList.add('enabled');
    } else {
      likeButton.classList.remove('enabled');
    }
    if (data.dislikes.indexOf(OrchidServices.userId()) !== -1) {
      dislikeButton.classList.add('enabled');
    } else {
      likeButton.classList.remove('enabled');
    }

    if (!OrchidServices.isUserLoggedIn()) {
      likeButton.setAttribute('disabled', true);
      dislikeButton.setAttribute('disabled', true);
    }

    var lastLikeAmount = 0;
    likeButton.onclick = function() {
      if (data.likes.indexOf(OrchidServices.userId()) === -1) {
        LIKE_SOUND.currentTime = 0;
        LIKE_SOUND.play();

        data.likes.push(OrchidServices.userId());
        likeButtonNumber.classList.add('increment');
        likeButtonNumber.classList.remove('decrement');
      } else {
        data.likes.splice(OrchidServices.userId());
        likeButtonNumber.classList.remove('increment');
        likeButtonNumber.classList.add('decrement');
      }

      data.dislikes.splice(OrchidServices.userId());
      if (lastDislikeAmount !== data.dislikes.length) {
        dislikeButtonNumber.classList.add('decrement');
        setTimeout(() => {
          dislikeButtonNumber.classList.remove('decrement');
          lastDislikeAmount = data.dislikes.length;
        }, 500);
      }
      setTimeout(() => {
        dislikeButtonNumber.textContent = EnglishToArabicNumerals(data.dislikes.length);
      }, 250);
      dislikeButton.classList.remove('enabled');

      OrchidServices.getWithUpdate('articles/' + data.token, (data) => {
        data.likes = data.likes;
        data.dislikes = data.dislikes;
        OrchidServices.set('articles/' + data.token, { comments: data.comments });
      });
      setTimeout(() => {
        likeButtonNumber.textContent = EnglishToArabicNumerals(data.likes.length);
      }, 250);
      setTimeout(() => {
        likeButtonNumber.classList.remove('increment');
        likeButtonNumber.classList.remove('decrement');
        lastLikeAmount = data.likes.length;
      }, 500);
      likeButton.classList.toggle('enabled');
    };

    var lastDislikeAmount = 0;
    dislikeButton.onclick = function() {
      if (data.dislikes.indexOf(OrchidServices.userId()) === -1) {
        DISLIKE_SOUND.currentTime = 0;
        DISLIKE_SOUND.play();

        data.dislikes.push(OrchidServices.userId());
        dislikeButtonNumber.classList.add('increment');
        dislikeButtonNumber.classList.remove('decrement');
      } else {
        data.dislikes.splice(OrchidServices.userId());
        dislikeButtonNumber.classList.remove('increment');
        dislikeButtonNumber.classList.add('decrement');
      }

      data.likes.splice(OrchidServices.userId());
      if (lastLikeAmount !== data.likes.length) {
        likeButtonNumber.classList.add('decrement');
        setTimeout(() => {
          likeButtonNumber.classList.remove('decrement');
          lastLikeAmount = data.likes.length;
        }, 500);
      }
      setTimeout(() => {
        likeButtonNumber.textContent = EnglishToArabicNumerals(data.likes.length);
      }, 250);
      likeButton.classList.remove('enabled');

      OrchidServices.get('articles/' + data.token).then((data) => {
        data.likes = data.likes;
        data.dislikes = data.dislikes;
        OrchidServices.set('articles/' + data.token, { comments: data.comments });
      });
      setTimeout(() => {
        dislikeButtonNumber.textContent = EnglishToArabicNumerals(data.dislikes.length);
      }, 250);
      setTimeout(() => {
        dislikeButtonNumber.classList.remove('increment');
        dislikeButtonNumber.classList.remove('decrement');
        lastDislikeAmount = data.dislikes.length;
      }, 500);
      dislikeButton.classList.toggle('enabled');
    };

    var shareButtonTooltip = document.createElement("div");
    shareButtonTooltip.setAttribute('role', 'title');
    shareButtonTooltip.classList.add('bottom');
    shareButtonTooltip.dataset.l10nId = 'post-share';
    shareButton.appendChild(shareButtonTooltip);

    var optionsButtonTooltip = document.createElement("div");
    optionsButtonTooltip.setAttribute('role', 'title');
    optionsButtonTooltip.classList.add('bottom');
    optionsButtonTooltip.dataset.l10nId = 'post-options';
    optionsButton.appendChild(optionsButtonTooltip);

    postContent.innerText = data.content;

    Comments("posts/" + id, postComments, false);
  };
})(window);
