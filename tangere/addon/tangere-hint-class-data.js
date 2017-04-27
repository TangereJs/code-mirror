(function(mod){
  mod(CodeMirror);
})(function(CodeMirror){
  "use strict";

  var classes = [
    "tangere-class1 class1 description",
    "empty-desc-class",
    "tangere-class3 class3 description",
    "null-desc-class",
    "undefined-desc-class",
    "undefined2-desc-class"
  ];

  if (CodeMirror.tangereHint == undefined) {
    CodeMirror.tangereHint = {
      classes: classes
    };
  } else {
    CodeMirror.tangereHint.classes = classes;
  }
  
});
