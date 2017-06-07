
(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("./xml-hint"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "./json-hint"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  
  function jsonHint(cm, options) {
    return {
      list: []
    };
  }

  CodeMirror.registerHelper("hint", "json", jsonHint);
});
