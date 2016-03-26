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

  function create(text, name) {
    var box = document.createElement('div');
    box.className = 'tanzaku__box';
    if (name) {
      box.className += ' tanzaku__' + name;
    }
    box.innerHTML = '<div class="tanzaku__inner">' + text + '</div>';
    return box;
  }

  function show(e) {
    var el = e.currentTarget;
    var key = el.getAttribute('data-tanzaku');
    var box;

    if (!this.data[key]) {
      console.error(key + ' is undefined');
    } else {
      if (this._cache[key]) {
        box = this._cache[key];
        box.style.display = 'block';
        setTimeout(function() {
          box.style.opacity = '1';
        }, 0)
      } else {
        box = create(this.data[key], this.opts.name);
        this._cache[key] = box;
        insert(el, box);
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
    box.style.width = '100%';
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
                'box-sizing: border-box;' +
                'padding: .3em .5em;' +
                'margin-top: 1.3em;' +
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