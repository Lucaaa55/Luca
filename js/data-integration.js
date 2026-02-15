/**
 * Data integration: fetches CSV files from data/ and populates HTML.
 * CSV column names are preserved as object keys (trimmed).
 */
(function () {
  'use strict';

  var DATA_BASE = 'data/';
  var CSV_FILES = {
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
   * Populate index.html: showcase (projects) only.
   */
  function integrateIndex() {
    var showcaseList = document.querySelector('.section-home-showcase .showcase_list');
    if (!showcaseList) return;

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

    loadCSV('projects').then(function (projects) {
      var list = (projects || []).filter(function (p) { return p['Draft'] !== 'true' && p['Archived'] !== 'true'; });
      var template = showcaseList.querySelector('.showcase_item');
      if (template) template.remove();
      list.forEach(function (p) {
        showcaseList.insertAdjacentHTML('beforeend', renderShowcaseItem(p));
      });
      hideEmpty(showcaseList.closest('.showcase_list-wrapper'), list.length > 0);
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
    if (document.querySelector('.section-home-showcase .showcase_list')) {
      integrateIndex();
    }
    if (document.querySelector('.section-work-work .work_list')) {
      integrateWorkPage();
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
