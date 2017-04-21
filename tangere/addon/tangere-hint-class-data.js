(function(mod){
  mod(CodeMirror);
})(function(CodeMirror){
  "use strict";

  var classes = [{
    class: "tangere-class1",
    description: "class1 description"
  }, {
    class: "empty-desc-class",
    description: ""
  }, {
    class: "tangere-class3",
    description: "class3 description"
  }, {
    class: "null-desc-class",
    description: null
  }, {
    class: "undefined-desc-class",
  }, {
    class: "undefined2-desc-class",
    description: undefined
  }];

  if (CodeMirror.tangereHint == undefined) {
    CodeMirror.tangereHint = {
      classes: classes
    };
  } else {
    CodeMirror.tangereHint.classes = classes;
  }
  
});
