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

  if (!CodeMirror.htmlSchema) {
    CodeMirror.htmlSchema = {};
  }
  
  Object.keys(CodeMirror.htmlSchema).forEach(function(elem, index){
    CodeMirror.htmlSchema[elem].attrs.class = CodeMirror.tangereHint.classes;
  });
  
  function htmlHint(cm, options) {
    var local = {schemaInfo: CodeMirror.htmlSchema};
    if (options) for (var opt in options) local[opt] = options[opt];

    return CodeMirror.hint.carbonxml(cm, local);
  }
  CodeMirror.registerHelper("hint", "html", htmlHint);
});
