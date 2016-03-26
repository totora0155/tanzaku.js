var exists = null;

Tanzaku.config = {
  maxWidth: '20em',
};

export default function Tanzaku(data, opts) {
  this.data = data;
  this.opts = opts;
  this._show = show.bind(this);
  this._hide = hide.bind(this);
  this._cache = {};

  if (!exists) {
    injectStyle();
    exists = true;
  }
};

Tanzaku.prototype.init = function init(els) {
  els = Array.prototype.slice.call(els);

  for (var i = 0, len = els.length; i < len; i++) {
    els[i].addEventListener('mouseover', this._show);
    els[i].addEventListener('mouseleave', this._hide);
  }
}

function create(str, name) {
  var box = document.createElement('div');
  box.className = 'tanzaku__box';
  if (name) {
    box.className += ' tanzaku__' + name;
  }
  box.innerHTML = '<div class="tanzaku__inner">' + str + '</div>';
  return box;
}

function show(e) {
  var el = e.currentTarget;
  var key = el.getAttribute('data-tanzaku');
  var value = this.data[key];
  var box;

  if (!value) {
    console.error(key + ' is undefined');
  } else {
    if (this._cache[key]) {
      box = this._cache[key];
      box.style.display = 'block';
      setTimeout(function() {
        box.style.opacity = '1';
      }, 0)
    } else {
      var imgs = pickImages(value);
      var handle = function () {
        box = create(value, this.opts.name);
        this._cache[key] = box;
        insert(el, box);
      }.bind(this);

      if (imgs.length) {
        preload(imgs, handle);
      } else {
        handle();
      }
    }
  }
}

function hide(e) {
  var el = e.currentTarget;
  var key = el.getAttribute('data-tanzaku');
  var box = this._cache[key];

  if (box) {
    box.style.opacity = 0;
    setTimeout(function() {
      box.style.display = 'none';
    }, 200)
  }
}

function insert(el, box) {
  el.innerHTML = '<span class="tanzaku__origin">' + el.innerText + '</span>';
  el.appendChild(box);
  adjust(box);
}

function adjust(box) {
  var width = box.children[0].clientWidth;
  box.children[0].style.width = width + 'px';
  box.children[0].style.whiteSpace = 'normal';
  box.style.width = '100%';
}

function pickImages(str) {
  var matches = str.match(/<img\s[^>]+/g) || [];
  var imgs = [];

  for (var i = 0, len = matches.length; i < len; i++) {
    var src = matches[i].match(/src="(.+)"/);
    if (src) {
      imgs.push(src[1]);
    }
  }
  return imgs;
}

function preload(imgs, cb) {
  var len = imgs.length;
  var loaded = 0;
  for (var i = 0; i < len; i++) {
    var img = document.createElement('img');
    img.addEventListener('load', function() {
      loaded++;
      if (loaded === len) {
        cb();
      }
    });
    img.src = imgs[i];
  }
}

function injectStyle() {
  var style = document.createElement('style');
  var css = '.tanzaku__box {' +
              'position: absolute;' +
              'right: 50%;' +
              'top: 0;' +
              '-webkit-transform: translateX(50%);' +
              '-ms-transform: translateX(50%);' +
              'transform: translateX(50%);' +
              '-webkit-transition: opacity .1s linear;' +
              'transition: opacity .1s linear;' +
            '}' +
            '.tanzaku__inner {' +
              'max-width: ' + Tanzaku.config.maxWidth + ';' +
              'box-sizing: border-box;' +
              'padding: .3em .5em;' +
              'margin-top: 1.3em;' +
              'white-space: pre;' +
              'word-wrap: break-word;' +
              'overflow-wrap: break-word;' +
              'background: #414141;' +
              'color: #fff;' +
            '}' +
            '.tanzaku__origin {' +
              'position: relative;' +
              'z-index: 1;' +
            '}'
            ;
  style.innerText = css;
  document.head.insertBefore(style, document.head.children[0]);
}
