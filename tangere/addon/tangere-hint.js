// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("./xml-hint"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "./xml-hint"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  
  var s = { attrs: {} };
  
  // CodeMirror.tangereHint.htmlSchema is defined in tangere-hint-data.js and imported 
  // before tangere-hint.js so that this data is available
  var data = CodeMirror.tangereHint.htmlSchema;

  var globalAttrs = {
    accesskey: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    // CodeMirror.tangereHint.classes is defined in tangere-hint-class-data.js and imported 
    // before tangere-hint.js so that this data is available
    "class": CodeMirror.tangereHint.classes,
    contenteditable: ["true", "false"],
    contextmenu: null,
    dir: ["ltr", "rtl", "auto"],
    draggable: ["true", "false", "auto"],
    dropzone: ["copy", "move", "link", "string:", "file:"],
    hidden: ["hidden"],
    id: null,
    inert: ["inert"],
    itemid: null,
    itemprop: null,
    itemref: null,
    itemscope: ["itemscope"],
    itemtype: null,
    lang: ["en", "es"],
    spellcheck: ["true", "false"],
    style: null,
    tabindex: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    title: null,
    translate: ["yes", "no"],
    onclick: null,
    rel: ["stylesheet", "alternate", "author", "bookmark", "help", "license", "next", "nofollow", "noreferrer", "prefetch", "prev", "search", "tag"]
  };
  function populate(obj) {
    for (var attr in globalAttrs) if (globalAttrs.hasOwnProperty(attr))
      obj.attrs[attr] = globalAttrs[attr];

    if (obj.attrs.hasOwnProperty('icon')) {
      // CodeMirror.tangereHint.nowIcons is defined in tangere-hint-data.js and imported 
      // before tangere-hint.js so that this data is available
      obj.attrs.icon.value = CodeMirror.tangereHint.nowIcons;
    }
  }

  populate(s);
  for (var tag in data) if (data.hasOwnProperty(tag) && data[tag] != s)
    populate(data[tag]);

  // inject tangere css class names into default html tags 
  Object.keys(CodeMirror.htmlSchema).forEach(function(key, index){ 
    // clone default tag data so that css class names are not shared with htmlmixed mode
    var clone = JSON.parse(JSON.stringify(CodeMirror.htmlSchema[key]));
    data[key] = clone;
    data[key].attrs.class = CodeMirror.tangereHint.classes;
  });

  function tangereHint(cm, options) {
    var local = {schemaInfo: data};
    if (options) for (var opt in options) local[opt] = options[opt];
    return CodeMirror.hint.carbonxml(cm, local);
  }

  var existingHtmlHintFn = null;
  function combinedHtmlAndTangereHint(cm, options) {
    var final = undefined;
    var result = [];
    if (existingHtmlHintFn) {
      result = existingHtmlHintFn(cm, options);
    }

    var tangereResult = tangereHint(cm, options);

    if (result) {
      final = result;
    }

    if (tangereResult && !result) {
      final = tangereResult;
    } else if (tangereResult && result) {
      final = result;

      tangereResult.list.forEach(function(item, index) {
        // *ij*  avoid duplicate entries
        if (item.text) {
          if (findIndexOf(final.list, item) === -1) {
            final.list.push(item);
          }
        } else if (final.list.indexOf(item) === -1) {
          final.list.push(item);
        }
      });
    }

    return final;
  }

  function findIndexOf(array, item) {
    var result = -1;
    array.forEach(function(arrayItem, index){ 
      if (arrayItem.text === item.text) { result = index; }
    });
    return result;
  }

  if (CodeMirror.helpers.hint.hasOwnProperty('html')) {
    existingHtmlHintFn = CodeMirror.helpers.hint.html;

    CodeMirror.registerHelper("hint", "carbonhtml", combinedHtmlAndTangereHint);
  } else {
    CodeMirror.registerHelper("hint", "carbonhtml", tangereHint);
  }
  
});
