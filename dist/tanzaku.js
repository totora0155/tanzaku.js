/*!
 * Copyright 2016, nju33
 * Released under the MIT License
 * https://github.com/totora0155/tanzaku.js
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Tanzaku = factory());
}(this, function () { 'use strict';

  var exists = null;
  var mouseover = false;

  Tanzaku.config = {
    maxWidth: '20em',
    maxHeight: '15em',
    duration: 100,
  };

  function Tanzaku(data, opts) {
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
    if (mouseover) {
      return;
    }
    mouseover = true;

    var el = e.currentTarget;
    var key = el.getAttribute('data-tanzaku');
    var value = this.data[key];
    var box;

    if (!value) {
      console.error(key + ' is undefined');
    } else {
      if (this._cache[key]) {
        box = this._cache[key];
        adjust(box);
        box.style.display = 'block';
        timeout(function() {
          box.style.opacity = 1;
        });
      } else {
        var imgs = pickImages(value);
        var handle = function () {
          box = create(value, this.opts.name);
          this._cache[key] = box;
          insert(el, box);
          timeout(function() {
            box.style.opacity = 1;
          });
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
      try {
        setTimeout(function() {
          box.style.display = 'none';
          mouseover = false;
        }, Tanzaku.config.duration);
      } catch (e) {
        throw Error(e);
      }
    }
  }

  function insert(el, box) {
    el.innerHTML = '<span class="tanzaku__origin">' + el.innerText + '</span>';
    el.appendChild(box);
    transform(box);
    adjust(box);
  }

  function transform(box) {
    var width = box.children[0].clientWidth;
    box.children[0].style.width = width + 'px';
    box.children[0].style.whiteSpace = 'normal';
    box.style.width = '100%';
  }

  function adjust(box) {
    box.children[0].style.left = 0;
    timeout(function() {
      var offsetLeft = box.getBoundingClientRect().left;
      var width = box.children[0].clientWidth;
      if (offsetLeft + width > innerWidth) {
        var size = offsetLeft + width - innerWidth;
        box.children[0].style.left = -size + 'px';
      }
    });
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

  function timeout(cb) {
    if (requestAnimationFrame) {
      requestAnimationFrame(cb)
    } else {
      setTimeout(cb, 0);
    }
  }

  function injectStyle() {
    var style = document.createElement('style');
    var duration = Tanzaku.config.duration / 1000;
    var css = '.tanzaku__box {' +
                'position: absolute;' +
                'right: 50%;' +
                'top: 0;' +
                '-webkit-transform: translateX(50%);' +
                '-ms-transform: translateX(50%);' +
                'transform: translateX(50%);' +
                '-webkit-transition: opacity ' + duration + 's linear;' +
                'transition: opacity ' + duration  + 's linear;' +
                'opacity: 0;' +
              '}' +
              '.tanzaku__inner {' +
                'position: relative;' +
                'max-width: ' + Tanzaku.config.maxWidth + ';' +
                'max-height: ' + Tanzaku.config.maxHeight + ';' +
                'box-sizing: border-box;' +
                'padding: .3em .5em;' +
                'margin-top: 1.3em;' +
                'white-space: pre;' +
                'word-wrap: break-word;' +
                'overflow-wrap: break-word;' +
                'overflow: auto;' +
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

  return Tanzaku;

}));
