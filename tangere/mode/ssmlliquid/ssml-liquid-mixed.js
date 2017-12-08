// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineMode("ssmlliquid", function (config, parserConfig) {
    
    var ssmlModeSpec = CodeMirror.resolveMode("text/ssml");
    var ssmlMode = CodeMirror.getMode(config, ssmlModeSpec);
    
    var liquidModeSpec = CodeMirror.resolveMode("text/x-carbonliquid");
    var liquidMode = CodeMirror.getMode(config, liquidModeSpec);

    function tokenFn(stream, state) {

      if (stream.start === 0 && stream.pos === 0) {
        stream.eatSpace();
      }

      var isStartOfSsml = stream.match('<', false, true);

      var isStartOfLiquid = 
        stream.match('{%', false, true) || 
        stream.match('{{', false, true) || 
        stream.match('{#', false, true);

      var style = null;

      if (state.localMode !== null && !isStartOfLiquid && !isStartOfSsml) {
        style = state.localMode.token(stream, state.localState);
        
      } else {
        if (isStartOfLiquid) {
          state.localMode = liquidMode;
          state.localState = liquidMode.startState();
          style = state.localMode.token(stream, state.localState);

        } else if (isStartOfSsml) {
          state.localMode = ssmlMode;
          state.localState = state.localState ? state.localState : ssmlMode.startState(0);
          style = state.localMode.token(stream, state.localState);
        }
      }

      if (stream.eol()) {
        state.localMode = state.localState = null;
      
      } else if (state.localMode == null) {
        stream.next();
      }

      return style;
    }

    return {
      startState: function () {
        return {
          token: tokenFn,
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
        if (state.localMode.indent)
          return state.localMode.indent(state.localState, textAfter);
        else
          return CodeMirror.Pass;
      },

      innerMode: function (state) {
        return {
          state: state.localState, 
          mode: state.localMode || ssmlMode
        };
      }
    };
  }, "ssml", "carbonliquid");

  CodeMirror.defineMIME("text/ssml-liquid", "ssmlliquid");
});
