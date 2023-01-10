(function (exports) {
  'use strict';

  var ARTICLES_URL = /htt\w+\:\/\/orchidfoss\.github\.io\/articles\/(.*)\?post=/ig;
  var WEBSTORE_URL = /htt\w+\:\/\/orchidfoss\.github\.io\/webstore\/(.*)\?webapp=/ig;

  const getOpenGraphData = (url) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Fetch the HTML of the website
        const response = await fetch(url);
        const html = await response.text();

        if (WEBSTORE_URL.test(url)) {
          var id = url.replace(WEBSTORE_URL, '');
          OrchidServices.get('webstore/' + id).then((data) => {
            // Return the OpenGraph data as an object
            resolve({
              site_name: 'Web Store',
              title: data.name,
              image: data.icon,
              description: data.description,
              type: 'website',
            });
          });
        } else if (ARTICLES_URL.test(url)) {
          var id = url.replace(ARTICLES_URL, '');
          OrchidServices.get('articles/' + id).then((data) => {
            OrchidServices.get('profile/' + data.author_id).then(
              (data_user) => {
                // Return the OpenGraph data as an object
                resolve({
                  site_name: 'Articles',
                  title: data_user.username,
                  image: data.images[0],
                  description: data.content,
                  type: 'article',
                });
              }
            );
          });
        } else {
          // Create a temporary DOM to extract the OpenGraph data
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          // Extract the OpenGraph data from the DOM
          const type = doc
            .querySelector('meta[property="og:type"]')
            .getAttribute('content');
          const site_name = doc
            .querySelector('meta[property="og:site_name"]')
            .getAttribute('content');
          const title = doc
            .querySelector('meta[property="og:title"]')
            .getAttribute('content');
          const image = doc
            .querySelector('meta[property="og:image"]')
            .getAttribute('content');
          const description = doc
            .querySelector('meta[property="og:description"]')
            .getAttribute('content');

          // Return the OpenGraph data as an object
          resolve({ site_name, title, image, description });
        }
      } catch (error) {
        console.error(`Error getting OpenGraph data for ${url}: ${error}`);
      }
    });
  };

  window.getOpenGraphData = getOpenGraphData;
})(window);
