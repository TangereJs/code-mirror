// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var ssmlTags = {
    speak: {
      attrs: {},
      children: [ "audio", "break", "p", "s", "say-as", "sub" ],
    },
    audio: {
      attrs: {
        src: null
      },
      children: []
    },
    break: {
      attrs: {
        strength: [ "none", "x-weak", "weak", "medium", "strong", "x-strong" ],
        time: null
      },
      children: []
    },
    p: {
      attrs: {},
      children: [],
    },
    s: {
      attrs: {},
      children: [],
    },
    "say-as": {
      attrs: {
        "interpret-as": [ "characters", "spell-out", "orginal", "digits", "fraction", "unit", "date", "time", "telephone", "address", "interjection", "expletive" ],
        format: [ "mdy", "dmy", "ymd", "md", "dm", "ym", "my", "d", "m", "y" ]
      },
      children: []
    },
    sub: {
      attrs: {
        alias: {}
      },
      children: []
    }
  };

  var Pos = CodeMirror.Pos;

  function getHints(cm, options) {
    var tags = ssmlTags;
    var quote = (options && options.quoteChar) || '"';
    if (!tags) return;
    var cur = cm.getCursor(), token = cm.getTokenAt(cur);
    if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }
        
    var inner = CodeMirror.innerMode(cm.getMode(), token.state);
    if (inner.mode.name != "ssml") return;
    var result = [], replaceToken = false, prefix;
    var tag = /\btag\b/.test(token.type) && !/>$/.test(token.string);
    var tagName = tag && /^\w/.test(token.string), tagStart;

    if (tagName) {
      var before = cm.getLine(cur.line).slice(Math.max(0, token.start - 2), token.start);
      var tagType = /<\/$/.test(before) ? "close" : /<$/.test(before) ? "open" : null;
      if (tagType) tagStart = token.start - (tagType == "close" ? 2 : 1);
    } else if (tag && token.string == "<") {
      tagType = "open";
    } else if (tag && token.string == "</") {
      tagType = "close";
    }

    if (!tag && !inner.state.tagName || tagType) {
      if (tagName)
        prefix = token.string;      
      replaceToken = tagType;
      var cx = inner.state.context, curTag = cx && tags[cx.tagName];
      var childList = cx ? curTag && curTag.children : tags["!top"];
      if (childList && tagType != "close" && token.string[token.string.length-1] === "<") {
        for (var i = 0; i < childList.length; ++i) if (!prefix || childList[i].lastIndexOf(prefix, 0) == 0)
          result.push(childList[i]);
          // result.push("<" + childList[i]);
      } else if (tagType && tagType != "close") {
        for (var name in tags)
          if (tags.hasOwnProperty(name) && name != "!top" && name != "!attrs" && (!prefix || name.lastIndexOf(prefix, 0) == 0)) {
            result.push("<" + name);
          }
      }
      if (cx && (tagType == "close" || (prefix && cx.tagName.lastIndexOf(prefix, 0) == 0))) {
        result.push("</" + cx.tagName + ">");
      }

    } else if ((tag && !inner.state.tagName || tagType) && inner.state.context) {
      // this else branch here handles the case when we are inside a parent tag and user just pressed < character
      var tagName1 = inner.state.context.tagName;
      var tag1 = ssmlTags[tagName1];
      var childList1 = tag1.children;
      for (var i = 0; i < childList1.length; ++i)
        result.push(childList1[i]);

    } else {
      // Attribute completion
      var curTag = tags[inner.state.tagName], attrs = curTag && curTag.attrs;
      var globalAttrs = tags["!attrs"];
      if (!attrs && !globalAttrs) return;
      if (!attrs) {
        attrs = globalAttrs;
      } else if (globalAttrs) { // Combine tag-local and global attributes
        var set = {};
        for (var nm in globalAttrs) if (globalAttrs.hasOwnProperty(nm)) set[nm] = globalAttrs[nm];
        for (var nm in attrs) if (attrs.hasOwnProperty(nm)) set[nm] = attrs[nm];
        attrs = set;
      }
      if (token.type == "string" || token.string == "=") { // A value
        var existingClasses = [];
        var before = cm.getRange(Pos(cur.line, Math.max(0, cur.ch - 60)),
                                 Pos(cur.line, token.type == "string" ? token.start : token.end));
        var atName = before.match(/([^\s\u00a0=<>\"\']+)=$/), atValues;
        if (!atName || !attrs.hasOwnProperty(atName[1]) || !(atValues = attrs[atName[1]])) return;
        if (typeof atValues == 'function') atValues = atValues.call(this, cm); // Functions can be used to supply values for autocomplete widget

        if (typeof atValues == 'string') atValues = [ atValues ];

        if (token.type == "string") {
          prefix = token.string;
          var n = 0;
          if (/['"]/.test(token.string.charAt(0))) {
            quote = token.string.charAt(0);
            prefix = token.string.slice(1);
            n++;
          }
          var len = token.string.length;
          if (/['"]/.test(token.string.charAt(len - 1))) {
            quote = token.string.charAt(len - 1);
            prefix = token.string.substr(n, len - 2);
          }
          replaceToken = true;
        }
        
        // when attribute name is not class and has enum values
        // just add those values to result
        var tokenString = token.string.trim();
        var quoteIndex = tokenString.indexOf("\"");
        var filterText = "";
        if (quoteIndex > -1) {
          filterText = tokenString.slice(quoteIndex+1, tokenString.length);
        }

        var startsWidthRegex = new RegExp("^"+filterText);

        var attributeValues = atValues;
        if (atValues.value !== undefined && isArray(atValues.value)) {
          attributeValues = atValues.value;
        }

        for (var i = 0; i < attributeValues.length; ++i) {
          if (startsWidthRegex.test(attributeValues[i])) {
            result.push("\"" + attributeValues[i] + "\"");
          }
        }
      
      } else { // An attribute name
        if (token.type == "attribute") {
          prefix = token.string;
          replaceToken = true;
        }
        for (var attr in attrs) if (attrs.hasOwnProperty(attr) && (!prefix || attr.lastIndexOf(prefix, 0) == 0)) {
          var attrDef = attrs[attr];
          result.push(attr);
        }
      }
    }
    return {
      list: result,
      from: replaceToken ? Pos(cur.line, tagStart == null ? token.start : tagStart) : cur,
      to: replaceToken ? Pos(cur.line, token.end) : cur
    };
  }

  CodeMirror.registerHelper("hint", "ssml", getHints);
});
