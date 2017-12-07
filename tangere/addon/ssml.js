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

  CodeMirror.defineMode("ssml", function (config, parserConfig) {
    var htmlMode = CodeMirror.getMode(config, {
      name: "xml",
      htmlMode: false,
      multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,
      multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag
    });

    return {
      startState: function (baseIndent) {
        var state = htmlMode.startState(baseIndent);
        return state;
      },

      token: function (stream, state) {
        return htmlMode.token(stream, state);
      },

      indent: function (state, textAfter, line) {
        return htmlMode.indent(state, textAfter, line);
      }
    };
  }, "xml");

  CodeMirror.defineMIME("text/ssml", "ssml");
});
