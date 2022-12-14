(function (exports) {
  'use strict';

  var LIKE_SOUND = new Audio('resources/sounds/like.wav');
  var DISLIKE_SOUND = new Audio('resources/sounds/dislike.wav');

  var posts = document.getElementById('posts');

  exports.createPostCard = function createPostCard(data, id) {
    var element = document.createElement('a');
    element.href = '?post=' + id;
    element.classList.add('post');
    element.classList.add('post-object');
    element.onclick = (evt) => {
      evt.preventDefault();
      OrchidServices.get('articles/' + id).then((data) => {
        showPostInfo(data, id, element);
      });
    };
    posts.appendChild(element);

    var iconHolder = document.createElement('div');
    iconHolder.classList.add('icon-holder');
    element.appendChild(iconHolder);

    var icon = document.createElement('img');
    icon.src = data.icon;
    icon.loading = 'lazy';
    icon.onerror = () => {
      icon.src =
        'https://orchidfoss.github.io/images/profile_pictures/avatar_default.svg';
    };
    iconHolder.appendChild(icon);

    var contentHolder = document.createElement('div');
    contentHolder.classList.add('content-holder');
    element.appendChild(contentHolder);

    var info = document.createElement('div');
    info.classList.add('info');
    contentHolder.appendChild(info);

    var author = document.createElement('a');
    author.classList.add('author');
    author.target = '_blank';
    info.appendChild(author);

    var date = document.createElement('a');
    date.classList.add('date');
    date.textContent = EnglishToArabicNumerals(
      new Date(data.published_at).toLocaleDateString(
        navigator.mozL10n.language.code,
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }
      )
    );
    info.appendChild(date);

    var secureContent = data.content;
    if (!secureContent) {
      secureContent = '';
    }

    secureContent = secureContent.replaceAll('<', '&lt;');
    secureContent = secureContent.replaceAll('>', '&gt;');

    var content = document.createElement('span');
    content.classList.add('context');
    content.textContent = secureContent;
    contentHolder.appendChild(content);

    var pattern1 =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    var str1 = secureContent.replaceAll(pattern1, "<a href='$1'>$1</a>");
    var pattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var str2 = str1.replaceAll(
      pattern2,
      '$1<a target="_blank" href="http://$2">$2</a>'
    );
    content.innerHTML = str2;

    var embeds = document.createElement('div');
    embeds.classList.add('embeds');
    contentHolder.appendChild(embeds);

    const extractLinks = (string) => {
      // Regular expression to match URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g;

      // Use the regular expression to find all matches in the string
      const matches = string.match(urlRegex);

      // Return the matches as an array
      return matches ? matches : [];
    };

    extractLinks(secureContent).forEach((url) => {
      window.getOpenGraphData(url).then(data => {
        console.log(data);

        var embed = document.createElement('div');
        embed.classList.add('embed');
        embeds.appendChild(embed);

        if (data.type == 'article') {
          embed.classList.add('article');
        }

        if (data.image !== undefined) {
          var embedImageHolder = document.createElement('div');
          embedImageHolder.classList.add('image-holder');
          embed.appendChild(embedImageHolder);

          var embedImage = document.createElement('img');
          embedImage.classList.add('image');
          embedImage.src = data.image;
          embedImageHolder.appendChild(embedImage);
        }

        var embedContext = document.createElement('div');
        embedContext.classList.add('text-content');
        embed.appendChild(embedContext);

        if (data.site_name !== undefined) {
          var embedSiteName = document.createElement('div');
          embedSiteName.classList.add('site-name');
          embedSiteName.textContent = data.site_name;
          embedContext.appendChild(embedSiteName);
        }

        if (data.title !== undefined) {
          var embedTitle = document.createElement('div');
          embedTitle.classList.add('title');
          embedTitle.textContent = data.title;
          embedContext.appendChild(embedTitle);
        }

        if (data.description !== undefined) {
          var embedDescription = document.createElement('div');
          embedDescription.classList.add('description');
          embedDescription.textContent = data.description;
          embedContext.appendChild(embedDescription);
        }
      });
    });

    var images = document.createElement('div');
    images.classList.add('images');
    contentHolder.appendChild(images);

    if (data.images) {
      data.images.forEach((image, index) => {
        var element = document.createElement('img');
        element.src = image;
        element.loading = 'lazy';
        element.onclick = (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          imageViewer(data.images, index, element);
        };
        images.appendChild(element);
      });
    }

    var tags = document.createElement('div');
    tags.classList.add('tags');
    contentHolder.appendChild(tags);

    if (data.tags) {
      data.tags.forEach((tag) => {
        var element = document.createElement('span');
        element.textContent = tag;
        tags.appendChild(element);
      });
    }

    OrchidServices.getWithUpdate('profile/' + data.author_id, (udata) => {
      if (udata) {
        icon.src = udata.profile_picture;
        author.innerHTML = `<span>${udata.username}</span>`;
        author.href = '/profile/?user_id=' + udata.token;

        if (udata.metadata || udata.is_verified) {
          author.classList.add('verified');
        }
      }
    });

    var nav = document.createElement('nav');
    element.appendChild(nav);

    var likeButton = document.createElement('button');
    likeButton.classList.add('like-button');
    likeButton.dataset.icon = 'like';
    nav.appendChild(likeButton);

    var likeButtonNumber = document.createElement('span');
    likeButtonNumber.textContent = EnglishToArabicNumerals(data.likes.length);
    likeButton.appendChild(likeButtonNumber);

    var likeButtonTooltip = document.createElement('div');
    likeButtonTooltip.setAttribute('role', 'title');
    likeButtonTooltip.classList.add('bottom');
    likeButtonTooltip.dataset.l10nId = 'post-like';
    likeButton.appendChild(likeButtonTooltip);

    var dislikeButton = document.createElement('button');
    dislikeButton.classList.add('dislike-button');
    dislikeButton.dataset.icon = 'dislike';
    nav.appendChild(dislikeButton);

    var dislikeButtonNumber = document.createElement('span');
    dislikeButtonNumber.textContent = EnglishToArabicNumerals(
      data.dislikes.length
    );
    dislikeButton.appendChild(dislikeButtonNumber);

    var dislikeButtonTooltip = document.createElement('div');
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

    likeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      OrchidServices.get('articles/' + data.token).then((data) => {
        if (data.likes.indexOf(OrchidServices.userId()) === -1) {
          data.likes.push(OrchidServices.userId());
          LIKE_SOUND.currentTime = 0;
          LIKE_SOUND.play();
        } else {
          data.likes.splice(OrchidServices.userId());
        }

        data.dislikes.splice(OrchidServices.userId());
        dislikeButtonNumber.textContent = EnglishToArabicNumerals(
          data.dislikes.length
        );
        dislikeButton.classList.remove('enabled');
        OrchidServices.set('articles/' + data.token, { likes: data.likes });
        OrchidServices.set('articles/' + data.token, {
          dislikes: data.dislikes,
        });
        likeButtonNumber.textContent = EnglishToArabicNumerals(
          data.likes.length
        );
        likeButton.classList.toggle('enabled');
      });
    });

    dislikeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      OrchidServices.get('articles/' + data.token).then((data) => {
        if (data.dislikes.indexOf(OrchidServices.userId()) === -1) {
          data.dislikes.push(OrchidServices.userId());
          DISLIKE_SOUND.currentTime = 0;
          DISLIKE_SOUND.play();
        } else {
          data.dislikes.splice(OrchidServices.userId());
        }

        data.likes.splice(OrchidServices.userId());
        likeButtonNumber.textContent = EnglishToArabicNumerals(
          data.likes.length
        );
        likeButton.classList.remove('enabled');
        OrchidServices.set('articles/' + data.token, { likes: data.likes });
        OrchidServices.set('articles/' + data.token, {
          dislikes: data.dislikes,
        });
        dislikeButtonNumber.textContent = EnglishToArabicNumerals(
          data.dislikes.length
        );
        dislikeButton.classList.toggle('enabled');
      });
    });

    var shareButton = document.createElement('button');
    shareButton.classList.add('share-button');
    shareButton.dataset.icon = 'share';
    nav.appendChild(shareButton);

    var shareButtonTooltip = document.createElement('div');
    shareButtonTooltip.setAttribute('role', 'title');
    shareButtonTooltip.classList.add('bottom');
    shareButtonTooltip.dataset.l10nId = 'post-share';
    shareButton.appendChild(shareButtonTooltip);

    var optionsButton = document.createElement('button');
    optionsButton.classList.add('options-button');
    optionsButton.dataset.icon = 'options';
    nav.appendChild(optionsButton);

    var postDropdown = document.getElementById('post-dropdown');
    var deleteButton = document.getElementById('post-dropdown-delete');
    Dropdown(optionsButton, postDropdown, () => {
      OrchidServices.get('profile/' + OrchidServices.userId()).then((data) => {
        if (data.author_id == OrchidServices.userId() || data.is_moderator) {
          deleteButton.onclick = () => {
            OrchidServices.remove('articles/' + data.token);
            postDropdown.classList.remove('visible');
            window.viewFunction['content']();
          };
          deleteButton.disabled = false;
        } else {
          deleteButton.disabled = true;
        }
      });
    });

    var optionsButtonTooltip = document.createElement('div');
    optionsButtonTooltip.setAttribute('role', 'title');
    optionsButtonTooltip.classList.add('bottom');
    optionsButtonTooltip.dataset.l10nId = 'post-options';
    optionsButton.appendChild(optionsButtonTooltip);
  };

  exports.showPostInfo = function showPostInfo(data, id, card) {
    openContentView('post');
    var postAvatar = document.getElementById('post-avatar');
    var postAuthor = document.getElementById('post-author');
    var postContent = document.getElementById('post-context');
    var postImages = document.getElementById('post-images');
    var postComments = document.getElementById('post-comments');

    var likeButton = document.getElementById('like-button');
    var dislikeButton = document.getElementById('dislike-button');
    var shareButton = document.getElementById('share-button');
    var optionsButton = document.getElementById('options-button');

    addToHistory(id);
    window.history.pushState({ html: '', pageTitle: '' }, '', '?post=' + id);
    postAvatar.onerror = () => {
      postAvatar.src =
        'https://orchidfoss.github.io/images/profile_pictures/avatar_default.svg';
    };

    OrchidServices.get('profile/' + data.author_id).then((udata) => {
      if (udata) {
        postAvatar.src = udata.profile_picture;
        postAuthor.innerHTML = `<span>${udata.username}</span>`;
        postAuthor.href = '/profile/?user_id=' + udata.token;

        if (udata.metadata || udata.is_verified) {
          postAuthor.classList.add('verified');
        } else {
          postAuthor.classList.remove('verified');
        }
      }
    });

    postContent.innerText = data.content;
    postImages.innerHTML = '';
    if (data.images) {
      data.images.forEach((image) => {
        var element = document.createElement('img');
        element.src = image;
        postImages.appendChild(element);
      });
    }

    likeButton.innerHTML = '';
    var likeButtonNumber = document.createElement('span');
    likeButtonNumber.textContent = EnglishToArabicNumerals(data.likes.length);
    likeButton.appendChild(likeButtonNumber);

    var likeButtonTooltip = document.createElement('div');
    likeButtonTooltip.setAttribute('role', 'title');
    likeButtonTooltip.classList.add('bottom');
    likeButtonTooltip.dataset.l10nId = 'post-like';
    likeButton.appendChild(likeButtonTooltip);

    dislikeButton.innerHTML = '';
    var dislikeButtonNumber = document.createElement('span');
    dislikeButtonNumber.textContent = EnglishToArabicNumerals(
      data.dislikes.length
    );
    dislikeButton.appendChild(dislikeButtonNumber);

    var dislikeButtonTooltip = document.createElement('div');
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
      dislikeButton.classList.remove('enabled');
    }

    if (!OrchidServices.isUserLoggedIn()) {
      likeButton.setAttribute('disabled', true);
      dislikeButton.setAttribute('disabled', true);
    }

    likeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      OrchidServices.get('articles/' + data.token).then((data) => {
        if (data.likes.indexOf(OrchidServices.userId()) === -1) {
          data.likes.push(OrchidServices.userId());
          LIKE_SOUND.currentTime = 0;
          LIKE_SOUND.play();
        } else {
          data.likes.splice(OrchidServices.userId());
        }

        data.dislikes.splice(OrchidServices.userId());
        dislikeButtonNumber.textContent = EnglishToArabicNumerals(
          data.dislikes.length
        );
        dislikeButton.classList.remove('enabled');
        OrchidServices.set('articles/' + data.token, { likes: data.likes });
        OrchidServices.set('articles/' + data.token, {
          dislikes: data.dislikes,
        });
        likeButtonNumber.textContent = EnglishToArabicNumerals(
          data.likes.length
        );
        likeButton.classList.toggle('enabled');
      });
    });

    dislikeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      OrchidServices.get('articles/' + data.token).then((data) => {
        if (data.dislikes.indexOf(OrchidServices.userId()) === -1) {
          data.dislikes.push(OrchidServices.userId());
          DISLIKE_SOUND.currentTime = 0;
          DISLIKE_SOUND.play();
        } else {
          data.dislikes.splice(OrchidServices.userId());
        }

        data.likes.splice(OrchidServices.userId());
        likeButtonNumber.textContent = EnglishToArabicNumerals(
          data.likes.length
        );
        likeButton.classList.remove('enabled');
        OrchidServices.set('articles/' + data.token, { likes: data.likes });
        OrchidServices.set('articles/' + data.token, {
          dislikes: data.dislikes,
        });
        dislikeButtonNumber.textContent = EnglishToArabicNumerals(
          data.dislikes.length
        );
        dislikeButton.classList.toggle('enabled');
      });
    });

    Comments('posts/' + id, postComments, false);
  };

  var paramString = location.search.substring(1);
  var queryString = new URLSearchParams(paramString);
  if (location.search !== '') {
    for (let pair of queryString.entries()) {
      switch (pair[0]) {
        case 'post':
          window.addEventListener('load', () => {
            OrchidServices.get('articles/' + pair[1]).then((data) => {
              showPostInfo(data, pair[1], null);
            });
          });
          break;

        default:
          break;
      }
    }
  }
})(window);
