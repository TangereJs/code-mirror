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
  var Pos = CodeMirror.Pos;

  function forEach(arr, f) {
    for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
  }

  function arrayContains(arr, item) {
    if (!Array.prototype.indexOf) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === item) {
          return true;
        }
      }
      return false;
    }
    return arr.indexOf(item) != -1;
  }

  var liquidKeywords = ["block", "endblock", "for", "endfor", "true", "false", "filter", "endfilter",
                    "loop", "none", "self", "super", "if", "elif", "endif", "as", "else", "import",
                    "with", "endwith", "without", "context", "ifequal", "endifequal", "ifnotequal",
                    "endifnotequal", "extends", "include", "load", "comment", "endcomment",
                    "empty", "url", "static", "trans", "blocktrans", "endblocktrans", "now",
                    "regroup", "lorem", "ifchanged", "endifchanged", "firstof", "debug", "cycle",
                    "csrf_token", "autoescape", "endautoescape", "spaceless", "endspaceless",
                    "ssi", "templatetag", "verbatim", "endverbatim", "widthratio"];

  liquidKeywords = liquidKeywords.sort(function(key1, key2) {
    if (key1 === key2) {
      return 1;
    }
    return key1 > key2 ? 1 : -1;
  });

  var liquidFilters = ["add", "addslashes", "capfirst", "center", "cut", "date",
                   "default", "default_if_none", "dictsort",
                   "dictsortreversed", "divisibleby", "escape", "escapejs",
                   "filesizeformat", "first", "floatformat", "force_escape",
                   "get_digit", "iriencode", "join", "last", "length",
                   "length_is", "linebreaks", "linebreaksbr", "linenumbers",
                   "ljust", "lower", "make_list", "phone2numeric", "pluralize",
                   "pprint", "random", "removetags", "rjust", "safe",
                   "safeseq", "slice", "slugify", "stringformat", "striptags",
                   "time", "timesince", "timeuntil", "title", "truncatechars",
                   "truncatechars_html", "truncatewords", "truncatewords_html",
                   "unordered_list", "upper", "urlencode", "urlize",
                   "urlizetrunc", "wordcount", "wordwrap", "yesno", 
                   "component_url", "t"];

    liquidFilters = liquidFilters.sort(function(key1, key2) {
    if (key1 === key2) {
      return 1;
    }
    return key1 > key2 ? 1 : -1;
  });

  function CreateKeywordCompletion(name, description) {
    var _name = name;
    var _description = description;
    
    return {
      text: name,
      render: function(parentElement, data, current) {
        var div = document.createElement('div');
        div.classList.add('liquid-keyword');

        var span = document.createElement('span');
        span.classList.add('liquid-keyword-name');
        span.textContent = _name;
        div.appendChild(span);

        span = document.createElement('span');
        span.textContent = _description;
        span.classList.add('liquid-keyword-description');
        div.appendChild(span);

        parentElement.appendChild(div);
      }
    }
  }

  function CreateFilterCompletion(name, description) {
    var _name = name;
    var _description = description;

    return {
      text: " " + name + " ",
      render: function(parentElement, data, current) {
        var div = document.createElement('div');
        div.classList.add('liquid-filter');
        
        var span = document.createElement('span');
        span.classList.add('liquid-filter-name');
        span.textContent = _name;
        div.appendChild(span);

        span = document.createElement('span');
        span.textContent = _description;
        span.classList.add('liquid-filter-description');
        div.appendChild(span);

        parentElement.appendChild(div);
      }
    }
  }  

  function liquidHintFn(editor, keywords, getToken, options) {
    // Find the token at the cursor
    var cur = editor.getCursor(), token = getToken(editor, cur);    
    if (/\b(?:string|comment)\b/.test(token.type)) return;
    token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;

    var isWord = true;
    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
      isWord = /^\s+$/.test(token.string);
      token = {start: cur.ch, end: cur.ch, string: "", state: token.state,
               type: token.string == "." ? "property" : null};
    } else if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }    

    if (!token.state.parsingStack) {
      return {list: [],
        from: Pos(cur.line, token.start),
        to: Pos(cur.line, token.end)};
    }

    var topScope = token.state.parsingStack[token.state.parsingStack.length-1];
    var suggestFilter = token.state.waitFilter;

    var tprop = token;
    // If it is a property, find out what it is a property of.
    while (tprop.type == "property") {
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (tprop.string != ".") return;
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (!context1) var context1 = [];
      context1.push(tprop);
    }

    var result = [];

    var startsWidthRegex = new RegExp("^"+token.string);
    if (topScope === "tag" && !suggestFilter) {
      // suggest keywords here
      liquidKeywords.forEach(function(keyword, index) {
        if (startsWidthRegex.test(keyword)) {
          result.push(CreateKeywordCompletion(keyword, "keyword"));
        }
      });
    } else if (topScope === "tag" && suggestFilter) {
      // suggest filters here
      liquidFilters.forEach(function(filter, index) {
        if (startsWidthRegex.test(filter)) {
          result.push(CreateFilterCompletion(filter, "filter"));
        }
      });
    } else if (topScope === "variable" && !suggestFilter) {
      // suggest variables here
    } else if (topScope === "variable" && suggestFilter) {
      // suggest filters here
      liquidFilters.forEach(function(filter, index) {
        if (startsWidthRegex.test(filter)) {
          result.push(CreateFilterCompletion(filter, "filter"));
        }
      });
    }

    return {list: result,
            from: Pos(cur.line, token.start),
            to: Pos(cur.line, token.end)};
  }

  function getTokenFn(e, cur) {
    return e.getTokenAt(cur);
  }

  function liquidHint(editor, options) {
    return liquidHintFn(editor, liquidKeywords, getTokenFn, options);
  };
  CodeMirror.registerHelper("hint", "carbonliquid", liquidHint);
  CodeMirror.registerHelper("hint", "liquid", liquidHint);
});
