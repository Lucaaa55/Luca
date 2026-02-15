/**
 * Data integration: fetches CSV files from data/ and populates HTML.
 * CSV column names are preserved as object keys (trimmed).
 */
(function () {
  'use strict';

  var DATA_BASE = 'data/';
  var CSV_FILES = {
    blogPosts: 'Luca - Blog Posts - 698941237cab858de65419ff.csv',
    tags: 'Luca - Tags - 698941237cab858de6541a63.csv',
    works: 'Luca - Works - 698941237cab858de6541a9b.csv',
    projects: 'Luca - Projects - 698941237cab858de6541a4d.csv'
  };

  /**
   * Parse CSV text into array of objects (first row = headers).
   * Handles quoted fields and escaped quotes.
   */
  function parseCSV(text) {
    var rows = [];
    var i = 0;
    var len = text.length;

    function readRow() {
      var fields = [];
      var field = '';
      var inQuotes = false;
      while (i < len) {
        var c = text[i];
        if (inQuotes) {
          if (c === '"') {
            if (text[i + 1] === '"') {
              field += '"';
              i += 2;
              continue;
            }
            inQuotes = false;
            i++;
            continue;
          }
          if (c === '\r' && text[i + 1] === '\n') {
            field += '\n';
            i += 2;
            continue;
          }
          field += c;
          i++;
          continue;
        }
        if (c === '"') {
          inQuotes = true;
          i++;
          continue;
        }
        if (c === ',' || c === '\n' || (c === '\r' && text[i + 1] === '\n')) {
          fields.push(field.trim());
          field = '';
          if (c === '\n' || (c === '\r' && text[i + 1] === '\n')) {
            if (c === '\r') i++;
            i++;
            return fields;
          }
          i++;
          continue;
        }
        field += c;
        i++;
      }
      if (field !== '' || fields.length > 0) {
        fields.push(field.trim());
      }
      return fields.length ? fields : null;
    }

    var header = readRow();
    if (!header || header.length === 0) return [];

    while (i < len) {
      var rowFields = readRow();
      if (!rowFields) break;
      var obj = {};
      for (var j = 0; j < header.length; j++) {
        obj[header[j]] = rowFields[j] !== undefined ? rowFields[j] : '';
      }
      rows.push(obj);
    }
    return rows;
  }

  function getSlug(name) {
    if (!name) return '';
    return String(name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  function getUrlSlug() {
    var params = new URLSearchParams(window.location.search);
    return params.get('slug') || '';
  }

  /**
   * Fetch and parse a CSV file. Returns Promise<Array<Object>>.
   */
  function loadCSV(key) {
    var path = DATA_BASE + (CSV_FILES[key] || key);
    return fetch(path)
      .then(function (r) { return r.ok ? r.text() : Promise.reject(new Error('Failed to load ' + path)); })
      .then(parseCSV);
  }

  /**
   * Populate index.html: showcase (projects) and featured blog (blog posts).
   */
  function integrateIndex() {
    var showcaseList = document.querySelector('.section-home-showcase .showcase_list');
    var blogListHome = document.querySelector('.section-home-blog .blog_list');
    if (!showcaseList && !blogListHome) return;

    function renderShowcaseItem(project) {
      var name = project['Home page name'] || '';
      var slug = getSlug(name);
      var desc = project['Home page description'] || '';
      var img = project['Home page image'] || '';
      var imgHover = project['Home page image hover'] || img;
      var href = 'detail_projects.html?slug=' + encodeURIComponent(slug);
      return (
        '<div role="listitem" class="showcase_item w-dyn-item">' +
          '<div class="showcase_item-content">' +
            '<div class="margin-bottom margin-medium">' +
              '<a aria-label="project link" href="' + href + '" class="showcase_link w-inline-block">' +
                '<div class="showcase_image is-home-main"><img src="' + img + '" loading="lazy" alt="' + escapeHtml(name) + '" class="image-wrapper_image"></div>' +
                '<div class="showcase_image is-on-hover"><img src="' + imgHover + '" loading="lazy" alt="" class="image-wrapper_image"></div>' +
              '</a>' +
            '</div>' +
            '<div class="max-width-medium">' +
              '<div class="margin-bottom margin-xsmall"><h3 class="heading-small">' + escapeHtml(name) + '</h3></div>' +
              '<p>' + escapeHtml(desc) + '</p>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }

    function renderBlogItem(post) {
      var title = post['Blog post title'] || '';
      var slug = (post['Slug'] || getSlug(title)).trim();
      var img = post['Main Image'] || '';
      var href = 'detail_post.html?slug=' + encodeURIComponent(slug);
      return (
        '<div role="listitem" class="blog_item w-dyn-item">' +
          '<a aria-label="blog post link" href="' + href + '" class="blog_link w-inline-block">' +
            '<div class="padding-vertical padding-medium">' +
              '<div class="blog_title-wrapper">' +
                '<div class="max-width-custom1"><h3 class="heading-small">' + escapeHtml(title) + '</h3></div>' +
                '<div class="blog_arrow-wrapper">' +
                  '<div class="button-reveal"></div>' +
                  '<div class="blog_arrow one w-embed"><svg width="20" height="12" viewbox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 5.525V7.225H7.57239V5.525H0Z" fill="currentColor"></path><path d="M8.66451 12L19.5 6.825V5.175L8.66451 0V1.925L14.0449 4.2C15.4398 4.8 16.8098 5.35 18.13 5.875V6.1C16.7849 6.65 15.39 7.2 14.0449 7.8L8.66451 10.075V12Z" fill="currentColor"></path></svg></div>' +
                  '<div class="blog_arrow two w-embed"><svg width="20" height="12" viewbox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 5.525V7.225H7.57239V5.525H0Z" fill="#ffffff"></path><path d="M8.66451 12L19.5 6.825V5.175L8.66451 0V1.925L14.0449 4.2C15.4398 4.8 16.8098 5.35 18.13 5.875V6.1C16.7849 6.65 15.39 7.2 14.0449 7.8L8.66451 10.075V12Z" fill="#ffffff"></path></svg></div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="track_component"><div class="track-line"></div><div class="track_progress horizontal"></div></div>' +
            '<div class="blog_thumbnail hide-tablet">' +
              '<div class="blog_image-wrapper"><img alt="" loading="lazy" src="' + img + '" class="blog_image"></div>' +
            '</div>' +
          '</a>' +
        '</div>'
      );
    }

    Promise.all([
      document.querySelector('.section-home-showcase .showcase_list') ? loadCSV('projects') : [],
      document.querySelector('.section-home-blog .blog_list') ? loadCSV('blogPosts') : []
    ]).then(function (results) {
      var projects = results[0] || [];
      var posts = results[1] || [];
      if (showcaseList && projects.length > 0) {
        var template = showcaseList.querySelector('.showcase_item');
        if (template) template.remove();
        projects.forEach(function (p) {
          if (p['Draft'] === 'true' || p['Archived'] === 'true') return;
          showcaseList.insertAdjacentHTML('beforeend', renderShowcaseItem(p));
        });
        hideEmpty(showcaseList.closest('.showcase_list-wrapper'), !!projects.length);
      }
      if (blogListHome && posts.length > 0) {
        var featured = posts.filter(function (p) {
          return p['Featured on the home page?'] === 'true' && p['Draft'] !== 'true' && p['Archived'] !== 'true';
        });
        if (featured.length === 0) featured = posts.filter(function (p) { return p['Draft'] !== 'true' && p['Archived'] !== 'true'; });
        var templateBlog = blogListHome.querySelector('.blog_item');
        if (templateBlog) templateBlog.remove();
        featured.slice(0, 3).forEach(function (p) {
          blogListHome.insertAdjacentHTML('beforeend', renderBlogItem(p));
        });
        hideEmpty(blogListHome.closest('.blog_wrapper'), featured.length > 0);
      }
    }).catch(console.error);
  }

  /**
   * Populate blog.html: full blog list from Blog Posts CSV.
   */
  function integrateBlogPage() {
    var list = document.querySelector('.section-blog-blog .blog_list');
    if (!list) return;

    function renderItem(post) {
      var title = post['Blog post title'] || '';
      var slug = (post['Slug'] || getSlug(title)).trim();
      var img = post['Main Image'] || '';
      var href = 'detail_post.html?slug=' + encodeURIComponent(slug);
      return (
        '<div role="listitem" class="blog_item w-dyn-item">' +
          '<a href="' + href + '" class="blog_link w-inline-block">' +
            '<div class="padding-vertical padding-medium">' +
              '<div class="blog_title-wrapper">' +
                '<div class="max-width-custom1"><h3 class="heading-small">' + escapeHtml(title) + '</h3></div>' +
                '<div class="blog_arrow-wrapper">' +
                  '<div class="button-reveal"></div>' +
                  '<div class="blog_arrow one w-embed"><svg width="20" height="12" viewbox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 5.525V7.225H7.57239V5.525H0Z" fill="currentColor"></path><path d="M8.66451 12L19.5 6.825V5.175L8.66451 0V1.925L14.0449 4.2C15.4398 4.8 16.8098 5.35 18.13 5.875V6.1C16.7849 6.65 15.39 7.2 14.0449 7.8L8.66451 10.075V12Z" fill="currentColor"></path></svg></div>' +
                  '<div class="blog_arrow two w-embed"><svg width="20" height="12" viewbox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 5.525V7.225H7.57239V5.525H0Z" fill="#ffffff"></path><path d="M8.66451 12L19.5 6.825V5.175L8.66451 0V1.925L14.0449 4.2C15.4398 4.8 16.8098 5.35 18.13 5.875V6.1C16.7849 6.65 15.39 7.2 14.0449 7.8L8.66451 10.075V12Z" fill="#ffffff"></path></svg></div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="track_component"><div class="track-line"></div><div class="track_progress horizontal"></div></div>' +
            '<div class="blog_thumbnail hide-tablet">' +
              '<div class="blog_image-wrapper"><img alt="" loading="lazy" src="' + img + '" class="blog_image"></div>' +
            '</div>' +
          '</a>' +
        '</div>'
      );
    }

    loadCSV('blogPosts').then(function (rows) {
      var posts = (rows || []).filter(function (p) { return p['Draft'] !== 'true' && p['Archived'] !== 'true'; });
      var template = list.querySelector('.blog_item');
      if (template) template.remove();
      posts.forEach(function (p) {
        list.insertAdjacentHTML('beforeend', renderItem(p));
      });
      hideEmpty(list.closest('.blog_wrapper'), !!posts.length);
    }).catch(console.error);
  }

  /**
   * Populate work.html: work list from Works CSV.
   */
  function integrateWorkPage() {
    var list = document.querySelector('.section-work-work .work_list');
    if (!list) return;

    function renderItem(work) {
      var name = work['Project name'] || '';
      var slug = (work['Slug'] || getSlug(name)).trim();
      var img = work['Work screenshot'] || '';
      var alt = work['Work screenshot alt text'] || name;
      var href = 'detail_projects.html?slug=' + encodeURIComponent(slug);
      return (
        '<div role="listitem" class="work_item w-dyn-item">' +
          '<div class="work_image-wrapper">' +
            '<a href="' + href + '"><img height="" loading="lazy" alt="' + escapeHtml(alt) + '" src="' + img + '" class="work_image"></a>' +
          '</div>' +
          '<div class="work_scroll-blocker"></div>' +
          '<div class="work_button-scroll-unlock">' +
            '<div class="button-text is-small">Unlock scrolling</div>' +
            '<div class="button-reveal"></div>' +
          '</div>' +
          '<div class="work_button-scroll-lock">' +
            '<div class="button-text is-small">Lock scrolling</div>' +
            '<div class="button-reveal"></div>' +
          '</div>' +
        '</div>'
      );
    }

    loadCSV('works').then(function (rows) {
      var works = (rows || []).filter(function (w) { return w['Draft'] !== 'true' && w['Archived'] !== 'true'; });
      var template = list.querySelector('.work_item');
      if (template) template.remove();
      works.forEach(function (w) {
        list.insertAdjacentHTML('beforeend', renderItem(w));
      });
      hideEmpty(list.closest('.work_list-wrapper'), !!works.length);
    }).catch(console.error);
  }

  /**
   * Populate detail_post.html: single post by ?slug= and "You may also like".
   */
  function integrateDetailPost() {
    var slug = getUrlSlug();
    if (!slug) return;

    var titleEl = document.querySelector('.section-article-header h1');
    var mainImgEl = document.querySelector('.section-article-main-image .image-wrapper_image');
    var bannerLink = document.querySelector('.section-article-banner .banner_component');
    var bannerText = document.querySelector('.section-article-banner .is-banner-text');
    var contentEl = document.querySelector('.section-article-content .text-rich-text');
    var blogList = document.querySelector('.section-article-blog .blog_list');

    function setMeta(title, description, image) {
      document.title = (title || '') + ' | Luca Pignataro';
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', description || '');
      var ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title || '');
      var ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description || '');
      var ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', image || '');
      var twTitle = document.querySelector('meta[property="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', title || '');
      var twDesc = document.querySelector('meta[property="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', description || '');
      var twImg = document.querySelector('meta[property="twitter:image"]');
      if (twImg) twImg.setAttribute('content', image || '');
    }

    function renderOtherPost(post) {
      var title = post['Blog post title'] || '';
      var postSlug = (post['Slug'] || getSlug(title)).trim();
      var img = post['Main Image'] || '';
      var href = 'detail_post.html?slug=' + encodeURIComponent(postSlug);
      return (
        '<div role="listitem" class="blog_item w-dyn-item">' +
          '<a href="' + href + '" class="blog_link w-inline-block">' +
            '<div class="padding-vertical padding-medium">' +
              '<div class="blog_title-wrapper">' +
                '<div class="max-width-custom1"><h3 class="heading-small">' + escapeHtml(title) + '</h3></div>' +
                '<div class="blog_arrow-wrapper"><div class="button-reveal"></div><div class="blog_arrow one w-embed"><svg width="20" height="12" viewbox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 5.525V7.225H7.57239V5.525H0Z" fill="currentColor"></path><path d="M8.66451 12L19.5 6.825V5.175L8.66451 0V1.925L14.0449 4.2C15.4398 4.8 16.8098 5.35 18.13 5.875V6.1C16.7849 6.65 15.39 7.2 14.0449 7.8L8.66451 10.075V12Z" fill="currentColor"></path></svg></div><div class="blog_arrow two w-embed"><svg width="20" height="12" viewbox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 5.525V7.225H7.57239V5.525H0Z" fill="#ffffff"></path><path d="M8.66451 12L19.5 6.825V5.175L8.66451 0V1.925L14.0449 4.2C15.4398 4.8 16.8098 5.35 18.13 5.875V6.1C16.7849 6.65 15.39 7.2 14.0449 7.8L8.66451 10.075V12Z" fill="#ffffff"></path></svg></div></div>' +
              '</div>' +
            '</div>' +
            '<div class="track_component"><div class="track-line"></div><div class="track_progress horizontal"></div></div>' +
            '<div class="blog_thumbnail hide-tablet">' +
              '<div class="blog_image-wrapper"><img alt="" loading="lazy" src="' + img + '" class="blog_image"></div>' +
            '</div>' +
          '</a>' +
        '</div>'
      );
    }

    loadCSV('blogPosts').then(function (rows) {
      var posts = rows || [];
      var post = posts.find(function (p) {
        var s = (p['Slug'] || getSlug(p['Blog post title'] || '')).trim();
        return s === slug;
      });
      if (!post) {
        if (titleEl) titleEl.textContent = 'Post not found';
        return;
      }
      var title = post['Blog post title'] || '';
      var article = post['Blog post article'] || '';
      var mainImg = post['Main Image'] || '';
      var alt = post['Main image alt text'] || title;
      var bannerMsg = post['Banner Message'] || '';
      var bannerUrl = post['Banner URL (external link)'] || '';
      var seoTitle = post['SEO Title tag'] || title;
      var seoDesc = post['SEO Meta Description'] || '';
      var ogImage = post['Open Graph Image'] || mainImg;

      if (titleEl) titleEl.textContent = title;
      if (mainImgEl) {
        mainImgEl.src = mainImg;
        mainImgEl.alt = alt;
      }
      if (bannerLink) {
        if (bannerUrl) bannerLink.href = bannerUrl;
        else bannerLink.style.display = 'none';
      }
      if (bannerText) bannerText.textContent = bannerMsg;
      if (contentEl) contentEl.innerHTML = article;
      setMeta(seoTitle, seoDesc, ogImage);

      if (blogList) {
        var others = posts.filter(function (p) {
          var s = (p['Slug'] || getSlug(p['Blog post title'] || '')).trim();
          return s !== slug && p['Draft'] !== 'true' && p['Archived'] !== 'true';
        }).slice(0, 3);
        var tpl = blogList.querySelector('.blog_item');
        if (tpl) tpl.remove();
        others.forEach(function (p) {
          blogList.insertAdjacentHTML('beforeend', renderOtherPost(p));
        });
        hideEmpty(blogList.closest('.blog_wrapper'), others.length > 0);
      }
    }).catch(console.error);
  }

  /**
   * Populate detail_projects.html: single project by ?slug= (from Projects CSV, matched by slug of "Home page name").
   */
  function integrateDetailProject() {
    var slug = getUrlSlug();
    if (!slug) return;

    var container = document.querySelector('main .container-large, main .container-medium, main');
    if (!container) {
      var main = document.createElement('main');
      main.className = 'main-wrapper';
      main.style.padding = '2rem';
      document.body.insertBefore(main, document.body.firstChild);
      container = main;
    }

    loadCSV('projects').then(function (rows) {
      var projects = rows || [];
      var project = projects.find(function (p) {
        return getSlug(p['Home page name'] || '') === slug;
      });
      if (!project) {
        document.title = 'Project not found | Luca Pignataro';
        container.innerHTML = '<p>Project not found. <a href="work.html">Back to Work</a></p>';
        return;
      }
      var name = project['Home page name'] || '';
      document.title = name + ' | Luca Pignataro';
      var heroTitle = project['Hero title'] || name;
      var desc = project['Home page description'] || '';
      var mainImg = project['Main image'] || project['Home page image'] || '';
      var liveUrl = project['URL to live website'] || '';
      var html = '<div class="page-padding"><div class="padding-top padding-header"><div class="padding-vertical padding-xhuge">' +
        '<p><a href="work.html">← Back to Work</a></p>' +
        '<h1 class="heading-xxlarge">' + escapeHtml(heroTitle) + '</h1>' +
        '<p class="text-size-medium margin-top margin-medium">' + escapeHtml(desc) + '</p>' +
        (mainImg ? '<div class="margin-top margin-large"><img src="' + mainImg + '" alt="' + escapeHtml(name) + '" loading="lazy" style="max-width:100%;"></div>' : '') +
        (liveUrl ? '<p class="margin-top margin-medium"><a href="' + escapeHtml(liveUrl) + '" target="_blank" rel="noopener" class="button w-inline-block"><span class="button-text">View project</span></a></p>' : '') +
        '</div></div></div>';
      container.insertAdjacentHTML('afterbegin', html);
    }).catch(console.error);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function hideEmpty(wrapper, hasItems) {
    if (!wrapper) return;
    var empty = wrapper.querySelector('.w-dyn-empty');
    if (empty) empty.style.display = hasItems ? 'none' : '';
  }

  function run() {
    if (document.querySelector('.section-home-showcase') || document.querySelector('.section-home-blog .blog_list')) {
      integrateIndex();
    }
    if (document.querySelector('.section-blog-blog .blog_list')) {
      integrateBlogPage();
    }
    if (document.querySelector('.section-work-work .work_list')) {
      integrateWorkPage();
    }
    if (document.querySelector('.section-article-header') && document.querySelector('.section-article-content')) {
      integrateDetailPost();
    }
    var path = window.location.pathname || '';
    if (path.indexOf('detail_projects') !== -1 && getUrlSlug()) {
      integrateDetailProject();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
