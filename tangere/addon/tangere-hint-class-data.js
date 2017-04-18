(function(mod){
  mod(CodeMirror);
})(function(CodeMirror){
  "use strict";

  if (CodeMirror.tangereHint == undefined) {
    CodeMirror.tangereHint = {
      classes: []
    };
  } else {
    CodeMirror.tangereHint.classes = [];
  }

  CodeMirror.tangereHint.classes.push({
    class: "tangere-class1",
    description: "class1 description"
  });

  CodeMirror.tangereHint.classes.push({
    class: "empty-desc-class",
    description: ""
  });

  CodeMirror.tangereHint.classes.push({
    class: "tangere-class3",
    description: "class3 description"
  });

  CodeMirror.tangereHint.classes.push({
    class: "null-desc-class",
    description: null
  });

  CodeMirror.tangereHint.classes.push({
    class: "undefined-desc-class",
  });

  CodeMirror.tangereHint.classes.push({
    class: "undefined2-desc-class",
    description: undefined
  });  

});
