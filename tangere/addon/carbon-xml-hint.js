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

  var Pos = CodeMirror.Pos;

  function getHints(cm, options) {
    var tags = options && options.schemaInfo;
    var quote = (options && options.quoteChar) || '"';
    if (!tags) return;
    var cur = cm.getCursor(), token = cm.getTokenAt(cur);
    if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }
    var inner = CodeMirror.innerMode(cm.getMode(), token.state);
    if (inner.mode.name != "carbonxml") return;
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
      if (childList && tagType != "close") {
        for (var i = 0; i < childList.length; ++i) if (!prefix || childList[i].lastIndexOf(prefix, 0) == 0)
          result.push("<" + childList[i]);
      } else if (tagType && tagType != "close") {
        for (var name in tags)
          if (tags.hasOwnProperty(name) && name != "!top" && name != "!attrs" && (!prefix || name.lastIndexOf(prefix, 0) == 0))
            result.push("<" + name);
      }
      if (cx && (tagType == "close" || (prefix && cx.tagName.lastIndexOf(prefix, 0) == 0))) {
        result.push("</" + cx.tagName + ">");
      }
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
        
        if (atName[1] === "class") {

          var tokenString = token.string.trim();

          var after = cm.getRange(Pos(cur.line, token.end), Pos(cur.line, 100));
          
          // when class="cls1, cls2 ... clsn" user can
          // 1. add a leading " char like class=""cls1, cls2 ... clsn"
          // 2. remove leading " like class=cls1, cls2 ... clsn" and add it back immidiately
          // we want to detect how many of cls1, cls2 ... clsn are present
          // if any are present do not show autocomplete
          var indexOfGreater = after.indexOf(">");
          var afterSlice = after.slice(0, indexOfGreater);
          var afterTokensWithEmptyStrings = afterSlice.split(" ");
          var afterTokens = [];

          for (var i = 0; i < afterTokensWithEmptyStrings.length; i++) {
            var item = afterTokensWithEmptyStrings[i].trim();

            if (item.indexOf("=") > -1) { break; }

            if (item !== "" && item[item.length-1] !== "\"") {
              afterTokens.push(item);
            }

            if (item[item.length-1] === "\"") {
              var item = item.slice(0, item.length-1);
              afterTokens.push(item);
              break;
            }              
          }

          if (tokenString === "=") {
            if (afterTokens.length) {
              result = [];
            } else {
              // suggest all classes with quotes
              for (var i = 0; i < atValues.length; ++i) {
                result.push("\"" + atValues[i] + "\"");
              }              
            }

            replaceToken = false;
          } else if (tokenString === "\"") {

            if (afterTokens.length) {
              result = [];
            } else {
              // suggest all classes with ending quote
              for (var i = 0; i < atValues.length; ++i) {
                result.push(atValues[i] + "\"");
              }
            }

            replaceToken = false;
          } else if (tokenString[0] === "\"" && tokenString[tokenString.length-1] !== "\"") {
            console.log('token string ' + tokenString);
            console.debug("before " + before);
            console.debug("after " + after);
            console.debug('after tokens' + JSON.stringify(afterTokens));

            var tokenString = tokenString.slice(1, tokenString.length);
            var classNamesBefore = tokenString.split(" ");
            var tmpResult = [];
            for (var i = 0; i < atValues.length; ++i) {
              tmpResult.push(atValues[i]);
            }

            // TODO use classNamesBefore and afterTokens to filter available class names
            var isUserInputSpaceChar = token.string[token.string.length-1] === " ";
            var filterText = "";
            var classNamesBeforeLength = classNamesBefore.length;
            if (!isUserInputSpaceChar) {
              filterText = classNamesBefore[classNamesBefore.length-1];
              classNamesBeforeLength -= 1;
            }            
            
            for (var i = 0; i < classNamesBeforeLength; i+=1) {
              var classNameBefore = classNamesBefore[i];
              var classNameIndex = tmpResult.indexOf(classNameBefore);
              if (classNameIndex > -1) {
                tmpResult.splice(classNameIndex, 1);
              }
            }

            for (var i = 0; i < afterTokens.length; i += 1) {
              var afterToken = afterTokens[i];
              var afterTokenIndex = tmpResult.indexOf(afterToken);
              if (afterTokenIndex > -1) {
                tmpResult.splice(afterTokenIndex, 1);
              }
            }

            var startsWidthRegex = new RegExp("^"+filterText);
            tmpResult.forEach(function(tmp, index){
              if (startsWidthRegex.test(tmp)) {
                result.push(tmp);
              }
            });

            if (filterText.length) {
              replaceToken = true;
              tagStart = token.start + token.string.length - filterText.length;
            } else {
              replaceToken = false;
            }

            // debugger;
          }
        }
      
      } else { // An attribute name
        if (token.type == "attribute") {
          prefix = token.string;
          replaceToken = true;
        }
        for (var attr in attrs) if (attrs.hasOwnProperty(attr) && (!prefix || attr.lastIndexOf(prefix, 0) == 0))
          result.push(attr);
      }
    }
    return {
      list: result,
      from: replaceToken ? Pos(cur.line, tagStart == null ? token.start : tagStart) : cur,
      to: replaceToken ? Pos(cur.line, token.end) : cur
    };
  }

  CodeMirror.registerHelper("hint", "carbonxml", getHints);
});
