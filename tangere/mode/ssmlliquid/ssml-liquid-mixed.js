// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../xml/xml"), require("../javascript/javascript"), require("../css/css"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../xml/xml", "../javascript/javascript", "../css/css"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  function maybeBackup(stream, pat, style) {
    var cur = stream.current(), close = cur.search(pat);
    if (close > -1) {
      stream.backUp(cur.length - close);
    } else if (cur.match(/<\/?$/)) {
      stream.backUp(cur.length);
      if (!stream.match(pat, false)) stream.match(cur);
    }
    return style;
  }

  var attrRegexpCache = {};
  function getAttrRegexp(attr) {
    var regexp = attrRegexpCache[attr];
    if (regexp) return regexp;
    return attrRegexpCache[attr] = new RegExp("\\s+" + attr + "\\s*=\\s*('|\")?([^'\"]+)('|\")?\\s*");
  }

  function getAttrValue(text, attr) {
    var match = text.match(getAttrRegexp(attr))
    return match ? /^\s*(.*?)\s*$/.exec(match[2])[1] : ""
  }

  function getTagRegexp(tagName, anchored) {
    return new RegExp((anchored ? "^" : "") + "<\/\s*" + tagName + "\s*>", "i");
  }

  function addTags(from, to) {
    for (var tag in from) {
      var dest = to[tag] || (to[tag] = []);
      var source = from[tag];
      for (var i = source.length - 1; i >= 0; i--)
        dest.unshift(source[i])
    }
  }

  function findMatchingMode(tagInfo, tagText) {
    for (var i = 0; i < tagInfo.length; i++) {
      var spec = tagInfo[i];
      if (!spec[0] || spec[1].test(getAttrValue(tagText, spec[0]))) return spec[2];
    }
  }

  CodeMirror.defineMode("ssmlliquid", function (config, parserConfig) {
    var htmlMode = CodeMirror.getMode(config, {
      name: "ssml",
      htmlMode: true,
      multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,
      multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag
    });

    var liquidModeSpec = CodeMirror.resolveMode("text/x-carbonliquid");
    var liquidMode = CodeMirror.getMode(config, liquidModeSpec);
    var liquidState;

    var tags = {};
    var configTags = parserConfig && parserConfig.tags, configScript = parserConfig && parserConfig.scriptTypes;
    
    if (configTags) addTags(configTags, tags);
    if (configScript) for (var i = configScript.length - 1; i >= 0; i--)
      tags.script.unshift(["type", configScript[i].matches, configScript[i].mode])

    
    function parseInHtmlMode(stream, state) {
      var style = htmlMode.token(stream, state.htmlState);
      var tag = /\btag\b/.test(style); 
      var tagName;

      if (tag && !/[<>\s\/]/.test(stream.current()) &&
          (tagName = state.htmlState.tagName && state.htmlState.tagName.toLowerCase()) &&
          tags.hasOwnProperty(tagName)) {        
        state.inTag = tagName + " "
      } else if (state.inTag && tag && />$/.test(stream.current())) {
        var inTag = /^([\S]+) (.*)/.exec(state.inTag)
        state.inTag = null
        var modeSpec = stream.current() == ">" && findMatchingMode(tags[inTag[1]], inTag[2])
        var mode = CodeMirror.getMode(config, modeSpec)
        var endTagA = getTagRegexp(inTag[1], true), endTag = getTagRegexp(inTag[1], false);
        state.token = function (stream, state) {
          if (stream.match(endTagA, false)) {
            state.token = html;
            state.localState = state.localMode = null;
            // state.parsingStack = [];
            return null;
          }
          return maybeBackup(stream, endTag, state.localMode.token(stream, state.localState));
        };
        state.localMode = mode;
        state.localState = CodeMirror.startState(mode, htmlMode.indent(state.htmlState, ""));
      } else if (state.inTag) {
        state.inTag += stream.current()
        if (stream.eol()) state.inTag += " "
      }

      return style;
    }

    function parseInLiquidMode(stream, state) {
      var liquidState = liquidMode.startState();
      // we peeks the stream and checks if current token is a liquid token
      var style = liquidState.tokenize(stream, liquidState);
      
      if (style !== null && ["tag", "variable", "comment"].indexOf(style) > -1) {
        state.localMode = liquidMode;
        state.localState = liquidState;
        state.token = function(stream, state) {
          var style = state.localState.tokenize(stream, state.localState);
          if (!state.localState.parsingStack.length) {
            currentParsingModeFn = null;
            state.localMode = state.localState = null;
            state.token = html;
          }
          return style;
        }       
      } else {
        if(!stream.eatSpace()){
          stream.next();
        }
      }

      return style;
    }

    var currentParsingModeFn = null;

    function html(stream, state) {

      if (stream.start === 0 && stream.pos === 0) {        
        stream.eatSpace();
      }

      // we test the peek of the stream to test if we can match start of html or liquid
      var isStartOfHtml = stream.match('<', false, true);

      var isStartOfLiquid = 
        stream.match('{%', false, true) || 
        stream.match('{{', false, true) || 
        stream.match('{#', false, true);

      var style = null;

      if (currentParsingModeFn !== null && !isStartOfHtml && !isStartOfLiquid) {
        style = currentParsingModeFn(stream, state);
      } else {
        if (isStartOfHtml) {
          currentParsingModeFn = parseInHtmlMode;
          style = currentParsingModeFn(stream, state);
        } else if (isStartOfLiquid) {
          currentParsingModeFn = parseInLiquidMode;
          style = currentParsingModeFn(stream, state);
        } else {
          if (!stream.eatSpace()) {
            stream.next();
          }
        }
      }

      if (stream.eol()) {
        currentParsingModeFn = null;
      }

      return style;
    };

    return {
      startState: function () {
        var state = CodeMirror.startState(htmlMode);
        return {token: html, inTag: null, localMode: null, localState: null, htmlState: state};
      },

      copyState: function (state) {
        var local;
        if (state.localState) {
          local = CodeMirror.copyState(state.localMode, state.localState);
        }
        return {token: state.token, inTag: state.inTag,
                localMode: state.localMode, localState: local,
                htmlState: CodeMirror.copyState(htmlMode, state.htmlState)};
      },

      token: function (stream, state) {
        return state.token(stream, state);
      },

      indent: function (state, textAfter) {
        if (!state.localMode || /^\s*<\//.test(textAfter))
          return htmlMode.indent(state.htmlState, textAfter);
        else if (state.localMode.indent)
          return state.localMode.indent(state.localState, textAfter);
        else
          return CodeMirror.Pass;
      },

      innerMode: function (state) {
        return {state: state.localState || state.htmlState, mode: state.localMode || htmlMode};
      }
    };
  }, "ssml", "carbonliquid");

  CodeMirror.defineMIME("text/ssmlliquid", "ssmlliquid");
});
