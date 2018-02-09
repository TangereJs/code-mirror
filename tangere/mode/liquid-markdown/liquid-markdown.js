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

  CodeMirror.defineMode("liquid-markdown", function (config, parserConfig) {
    var markdownModeSpec = CodeMirror.resolveMode("text/x-markdown");
    var markdownMode = CodeMirror.getMode(config, markdownModeSpec);

    var liquidModeSpec = CodeMirror.resolveMode("text/x-carbonliquid");
    var liquidMode = CodeMirror.getMode(config, liquidModeSpec);

    var liquidState;

    function parseInMarkdownMode(stream, state) {

      if(!state.localState) {
        state.localState = markdownMode.startState();
      }
      if (!state.localMode) {
        state.localMode = markdownMode;
      }

      var style = state.localMode.token(stream, state.localState);
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
            state.token = lmToken;
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

    function lmToken(stream, state) {

      // return parseInMarkdownMode(stream, state);

      if (stream.start === 0 && stream.pos === 0) {        
        stream.eatSpace();
      }

      var isStartOfLiquid = 
        stream.match('{%', false, true) || 
        stream.match('{{', false, true) || 
        stream.match('{#', false, true);

      var style = null;

      if (currentParsingModeFn !== null && !isStartOfLiquid) {
        // parse in markdown
        style = currentParsingModeFn(stream, state);
      
      } else {
        if (isStartOfLiquid) {
          currentParsingModeFn = parseInLiquidMode;
          style = currentParsingModeFn(stream, state);
        
        } else {
          currentParsingModeFn = parseInMarkdownMode;
          style = currentParsingModeFn(stream, state);

          // if (!stream.eatSpace()) {
          //   stream.next();
          // }
        }
      }

      if (stream.eol()) {
        currentParsingModeFn = null;
      }

      return style;
    }

    return {
      startState: function () {
        return {
          token: lmToken, 
          localMode: null,
          localState: null
        };
      },

      copyState: function (state) {
        var local;
        if (state.localState) {
          local = CodeMirror.copyState(state.localMode, state.localState);
        }
        return {
          token: state.token,
          localMode: state.localMode, 
          localState: local
        };
      },

      token: function (stream, state) {
        return state.token(stream, state);
      },

      indent: function (state, textAfter) {
        if (state.localMode && state.localMode.indent)
          return state.localMode.indent(state.localState, textAfter);
        else
          return CodeMirror.Pass;
      },

      innerMode: function (state) {
        if (!state.localMode) return false;
        return {
          state: state.localState, 
          mode: state.localMode 
        };
      }
    };

  }, "markdown", "carbonliquid");

  CodeMirror.defineMIME("text/liquid-markdown", "liquid-markdown");
});
