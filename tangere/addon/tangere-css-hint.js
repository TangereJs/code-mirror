// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var pseudoClasses = {
    link: 1,
    visited: 1,
    active: 1,
    hover: 1,
    focus: 1,
    "first-letter": 1,
    "first-line": 1,
    "first-child": 1,
    before: 1,
    after: 1,
    lang: 1
  };

  CodeMirror.registerHelper("hint", "css", function(cm) {
    var cur = cm.getCursor(),
      token = cm.getTokenAt(cur);
    var inner = CodeMirror.innerMode(cm.getMode(), token.state);
    if (inner.mode.name != "css") return;

    if (token.type == "keyword" && "!important".indexOf(token.string) == 0)
      return {
        list: ["!important"],
        from: CodeMirror.Pos(cur.line, token.start),
        to: CodeMirror.Pos(cur.line, token.end)
      };

    var start = token.start,
      end = cur.ch,
      word = token.string.slice(0, end - start);
    if (/[^\w$_-]/.test(word)) {
      word = "";
      start = end = cur.ch;
    }

    var spec = CodeMirror.resolveMode("text/css");

    var result = [];

    function add(keywords) {
      for (var name in keywords)
        if (!word || name.lastIndexOf(word, 0) == 0)
          result.push(name);
    }

    var st = inner.state.state;
    if (st == "pseudo" || token.type == "variable-3") {
      add(pseudoClasses);
    } else if (st == "block" || st == "maybeprop") {
      add(spec.propertyKeywords);
    } else if (st == "prop" || st == "parens" || st == "at" || st == "params") {
      // we have to compute property name ourselves since cm or css parser do not give this to us for free
      // we fetch the whole current line and trim it
      var line = cm.getLine(cur.line).trim();
      // split by colon character, because property name is to the left
      var lineParts = line.split(':');
      // get the left part
      var propertyName = lineParts[0];
      // we have enormous data structure bellow that holds pairs of propertyName -> suggested values
      if (propertyValuesHints.hasOwnProperty(propertyName)) {
        // we push the suggested values for current property to resutls
        result = result.concat(propertyValuesHints[propertyName].values);
      } else {
        // as fallback we keep the old way
        add(spec.valueKeywords);
        add(spec.colorKeywords);
      }
    } else if (st == "media" || st == "media_parens") {
      add(spec.mediaTypes);
      add(spec.mediaFeatures);
    }

    if (result.length) return {
      list: result,
      from: CodeMirror.Pos(cur.line, start),
      to: CodeMirror.Pos(cur.line, end)
    };
  });

  var propertyValuesHints = {
    "align-content": { "values": ["center", "flex-end", "flex-start", "space-around", "space-between", "stretch"] },
    "align-items": { "values": ["baseline", "center", "flex-end", "flex-start", "stretch"] },
    "align-self": { "values": ["auto", "baseline", "center", "flex-end", "flex-start", "stretch"] },
    "all": { "values": [] },
    "animation": { "values": [] },
    "animation-delay": { "values": [] },
    "animation-direction": { "values": ["alternate", "alternate-reverse", "normal", "reverse"] },
    "animation-duration": { "values": [] },
    "animation-fill-mode": { "values": ["backwards", "both", "forwards", "none"] },
    "animation-iteration-count": { "values": ["infinite"] },
    "animation-name": { "values": ["none"] },
    "animation-play-state": { "values": ["paused", "running"] },
    "animation-timing-function": { "values": ["cubic-bezier()", "ease", "ease-in", "ease-in-out", "ease-out", "linear", "step-end", "step-start", "steps()"] },
    "backface-visibility": { "values": ["hidden", "visible"] },
    "background": { "values": [] },
    "background-attachment": { "values": ["fixed", "local", "scroll", "inherit"] },
    "background-blend-mode": { "values": ["color", "color-burn", "color-dodge", "darken", "difference", "exclusion", "hard-light", "hue", "lighten", "luminosity", "multiply", "normal", "overlay", "saturation", "screen", "soft-light"] },
    "background-clip": { "values": ["border-box", "content-box", "padding-box", "inherit"] },
    "background-color": { "values": ["inherit"], "type": "color" },
    "background-image": { "values": ["image()", "linear-gradient()", "radial-gradient()", "repeating-linear-gradient()", "repeating-radial-gradient()", "url()"] },
    "background-origin": { "values": ["border-box", "content-box", "padding-box", "inherit"] },
    "background-position": { "values": ["left", "center", "right", "bottom", "top"] },
    "background-repeat": { "values": ["no-repeat", "repeat", "repeat-x", "repeat-y", "round", "space"] },
    "background-size": { "values": ["auto", "contain", "cover"] },
    "border": { "values": [] },
    "border-collapse": { "values": ["collapse", "separate", "inherit"] },
    "border-color": { "values": ["inherit"], "type": "color" },
    "border-spacing": { "values": ["inherit"] },
    "border-style": { "values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"] },
    "border-bottom": { "values": [] },
    "border-bottom-color": { "values": ["inherit"], "type": "color" },
    "border-bottom-left-radius": { "values": [] },
    "border-bottom-right-radius": { "values": [] },
    "border-bottom-style": { "values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"] },
    "border-bottom-width": { "values": ["medium", "thin", "thick", "inherit"] },
    "border-image": { "values": ["url()"] },
    "border-image-outset": { "values": [] },
    "border-image-slice": { "values": [] },
    "border-image-source": { "values": [] },
    "border-image-repeat": { "values": ["repeat", "round", "space", "stretch"] },
    "border-image-width": { "values": ["auto"] },
    "border-left": { "values": [] },
    "border-left-color": { "values": ["inherit"], "type": "color" },
    "border-left-style": { "values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"] },
    "border-left-width": { "values": ["medium", "thin", "thick", "inherit"] },
    "border-radius": { "values": [] },
    "border-right": { "values": [] },
    "border-right-color": { "values": ["inherit"], "type": "color" },
    "border-right-style": { "values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"] },
    "border-right-width": { "values": ["medium", "thin", "thick", "inherit"] },
    "border-top": { "values": [] },
    "border-top-color": { "values": ["inherit"], "type": "color" },
    "border-top-left-radius": { "values": [] },
    "border-top-right-radius": { "values": [] },
    "border-top-style": { "values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"] },
    "border-top-width": { "values": ["medium", "thin", "thick", "inherit"] },
    "border-width": { "values": ["medium", "thin", "thick", "inherit"] },
    "box-decoration-break": { "values": ["clone", "slice"] },
    "box-shadow": { "values": [] },
    "box-sizing": { "values": ["border-box", "content-box", "inherit"] },
    "bottom": { "values": ["auto", "inherit"] },
    "break-after": { "values": ["always", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "column", "left", "page", "region", "right"] },
    "break-before": { "values": ["always", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "column", "left", "page", "region", "right"] },
    "break-inside": { "values": ["auto", "avoid", "avoid-column", "avoid-page", "avoid-region"] },
    "caption-side": { "values": ["bottom", "top", "inherit"] },
    "caret-color": { "values": ["auto"], "type": "color" },
    "clear": { "values": ["both", "left", "none", "right", "inherit"] },
    "clip": { "values": ["auto", "inherit"] },
    "color": { "values": ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen", "inherit"], "type": "color" },
    "columns": { "values": [] },
    "column-count": { "values": [] },
    "column-fill": { "values": ["auto", "balance"] },
    "column-gap": { "values": ["normal"] },
    "column-rule": { "values": [] },
    "column-rule-color": { "values": [], "type": "color" },
    "column-rule-style": { "values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"] },
    "column-rule-width": { "values": ["medium", "thin", "thick", "inherit"] },
    "column-span": { "values": ["all", "none"] },
    "column-width": { "values": ["auto", "inherit"] },
    "content": { "values": ["attr()", "close-quote", "no-close-quote", "no-open-quote", "normal", "none", "open-quote", "inherit"] },
    "counter-increment": { "values": ["none", "inherit"] },
    "counter-reset": { "values": ["none", "inherit"] },
    "cursor": { "values": ["alias", "all-scroll", "auto", "cell", "col-resize", "context-menu", "copy", "crosshair", "default", "e-resize", "ew-resize", "grab", "grabbing", "help", "inherit", "move", "n-resize", "ne-resize", "nesw-resize", "no-drop", "none", "not-allowed", "ns-resize", "nw-resize", "nwse-resize", "pointer", "progress", "row-resize", "s-resize", "se-resize", "sw-resize", "text", "vertical-text", "w-resize", "wait", "zoom-in", "zoom-out"] },
    "direction": { "values": ["ltr", "rtl", "inherit"] },
    "display": { "values": ["block", "contents", "flex", "flow-root", "grid", "inline", "inline-block", "inline-flex", "inline-grid", "inline-table", "list-item", "none", "run-in", "subgrid", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "inherit"] },
    "empty-cells": { "values": ["hide", "show", "inherit"] },
    "filter": { "values": ["blur()", "brightness()", "contrast()", "custom()", "drop-shadow()", "grayscale()", "hue-rotate()", "invert()", "none", "opacity()", "sepia()", "saturate()", "url()"] },
    "flex": { "values": ["auto", "initial", "none"] },
    "flex-basis": { "values": ["auto"] },
    "flex-direction": { "values": ["column", "column-reverse", "row", "row-reverse"] },
    "flex-flow": { "values": ["column", "column-reverse", "nowrap", "row", "row-reverse", "wrap", "wrap-reverse"] },
    "flex-grow": { "values": [] },
    "flex-shrink": { "values": [] },
    "flex-wrap": { "values": ["nowrap", "wrap", "wrap-reverse"] },
    "float": { "values": ["left", "right", "none", "inherit"] },
    "flow-into": { "values": ["none"], "type": "named-flow" },
    "flow-from": { "values": ["none", "inherit"], "type": "named-flow" },
    "font": { "values": [] },
    "font-display": { "values": ["auto", "block", "swap", "fallback", "optional"] },
    "font-family": { "values": ["cursive", "fantasy", "inherit", "monospace", "sans-serif", "serif"] },
    "font-feature-settings": { "values": ["normal"] },
    "font-kerning": { "values": ["auto", "none", "normal"] },
    "font-language-override": { "values": ["normal"] },
    "font-size": { "values": [] },
    "font-size-adjust": { "values": ["auto", "none"] },
    "font-stretch": { "values": ["condensed", "expanded", "extra-condensed", "extra-expanded", "normal", "semi-condensed", "semi-expanded", "ultra-condensed", "ultra-expanded"] },
    "font-style": { "values": ["italic", "normal", "oblique"] },
    "font-synthesis": { "values": ["none", "style", "weight"] },
    "font-variant": { "values": ["normal", "small-caps", "inherit"] },
    "font-variant-alternates": { "values": ["normal"] },
    "font-variant-caps": { "values": ["normal", "small-caps", "all-small-caps", "petite-caps", "all-petite-caps", "unicase", "titling-caps"] },
    "font-variant-east-asian": { "values": ["normal"] },
    "font-variant-ligatures": { "values": ["normal", "none"] },
    "font-variant-numeric": { "values": ["normal"] },
    "font-variant-position": { "values": ["normal", "sub", "super"] },
    "font-weight": { "values": ["bold", "bolder", "lighter", "normal", "100", "200", "300", "400", "500", "600", "700", "800", "900", "inherit"] },
    "grid": { "values": [] },
    "grid-area": { "values": [] },
    "grid-auto-columns": { "values": [] },
    "grid-auto-flow": { "values": ["row", "column", "dense"] },
    "grid-auto-rows": { "values": [] },
    "grid-column": { "values": ["auto"] },
    "grid-column-end": { "values": [] },
    "grid-column-gap": { "values": [] },
    "grid-column-start": { "values": [] },
    "grid-gap": { "values": [] },
    "grid-row": { "values": ["auto"] },
    "grid-row-end": { "values": [] },
    "grid-row-start": { "values": [] },
    "grid-row-gap": { "values": [] },
    "grid-template": { "values": ["none"] },
    "grid-template-areas": { "values": [] },
    "grid-template-columns": { "values": ["auto"] },
    "grid-template-rows": { "values": ["auto"] },
    "hanging-punctuation": { "values": ["allow-end", "first", "force-end", "last", "none"] },
    "height": { "values": ["auto", "inherit"] },
    "hyphens": { "values": ["auto", "manual", "none"] },
    "image-orientation": { "values": [] },
    "image-resolution": { "values": ["from-image", "snap"] },
    "isolation": { "values": ["auto", "isolate"] },
    "justify-content": { "values": ["center", "flex-end", "flex-start", "space-around", "space-between"] },
    "left": { "values": ["auto", "inherit"] },
    "letter-spacing": { "values": ["normal", "inherit"] },
    "line-height": { "values": ["normal", "inherit"] },
    "list-style": { "values": ["none", "inherit", "initial", "unset", "url()", "armenian", "circle", "decimal", "decimal-leading-zero", "disc", "georgian", "inside", "lower-alpha", "lower-greek", "lower-latin", "lower-roman", "outside", "square", "upper-alpha", "upper-latin", "upper-roman"] },
    "list-style-image": { "values": ["none", "url()", "inherit"] },
    "list-style-position": { "values": ["inside", "outside", "inherit"] },
    "list-style-type": { "values": ["armenian", "circle", "decimal", "decimal-leading-zero", "disc", "georgian", "lower-alpha", "lower-greek", "lower-latin", "lower-roman", "none", "square", "upper-alpha", "upper-latin", "upper-roman", "inherit"] },
    "margin": { "values": ["auto", "inherit"] },
    "margin-bottom": { "values": ["auto", "inherit"] },
    "margin-left": { "values": ["auto", "inherit"] },
    "margin-right": { "values": ["auto", "inherit"] },
    "margin-top": { "values": ["auto", "inherit"] },
    "max-height": { "values": ["none", "inherit"] },
    "max-width": { "values": ["none", "inherit"] },
    "min-height": { "values": ["inherit"] },
    "min-width": { "values": ["inherit"] },
    "mix-blend-mode": { "values": ["color", "color-burn", "color-dodge", "darken", "difference", "exclusion", "hard-light", "hue", "lighten", "luminosity", "multiply", "normal", "overlay", "saturation", "screen", "soft-light"] },
    "object-fit": { "values": ["contain", "cover", "fill", "none", "scale-down"] },
    "object-position": { "values": ["left", "center", "right", "bottom", "top"] },
    "opacity": { "values": ["inherit"] },
    "order": { "values": [] },
    "orphans": { "values": ["inherit"] },
    "outline": { "values": ["inherit"] },
    "outline-color": { "values": ["invert", "inherit"], "type": "color" },
    "outline-offset": { "values": ["inherit"] },
    "outline-style": { "values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"] },
    "outline-width": { "values": ["medium", "thin", "thick", "inherit"] },
    "overflow": { "values": ["auto", "hidden", "scroll", "visible", "inherit"] },
    "overflow-x": { "values": ["auto", "hidden", "scroll", "visible", "inherit"] },
    "overflow-y": { "values": ["auto", "hidden", "scroll", "visible", "inherit"] },
    "padding": { "values": ["inherit"] },
    "padding-bottom": { "values": [] },
    "padding-left": { "values": [] },
    "padding-right": { "values": [] },
    "padding-top": { "values": [] },
    "page-break-after": { "values": ["always", "auto", "avoid", "left", "right", "inherit"] },
    "page-break-before": { "values": ["always", "auto", "avoid", "left", "right", "inherit"] },
    "page-break-inside": { "values": ["auto", "avoid", "inherit"] },
    "perspective": { "values": ["none"] },
    "perspective-origin": { "values": ["bottom", "center", "left", "right", "top"] },
    "pointer-events": { "values": ["all", "auto", "fill", "inherit", "none", "painted", "stroke", "visible", "visibleFill", "visiblePainted", "visibleStroke"] },
    "position": { "values": ["absolute", "fixed", "relative", "static", "sticky", "inherit"] },
    "quotes": { "values": ["none", "inherit"] },
    "region-break-after": { "values": ["always", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "column", "left", "page", "region", "right"] },
    "region-break-before": { "values": ["always", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "column", "left", "page", "region", "right"] },
    "region-break-inside": { "values": ["auto", "avoid", "avoid-column", "avoid-page", "avoid-region"] },
    "region-fragment": { "values": ["auto", "break"] },
    "resize": { "values": ["both", "horizontal", "none", "vertical", "inherit"] },
    "right": { "values": ["auto", "inherit"] },
    "scroll-behavior": { "values": ["auto", "smooth"] },
    "src": { "values": ["url()"] },
    "shape-image-threshold": { "values": [] },
    "shape-inside": { "values": ["auto", "circle()", "ellipse()", "inherit", "outside-shape", "polygon()", "rectangle()"] },
    "shape-margin": { "values": [] },
    "shape-outside": { "values": ["none", "inherit", "circle()", "ellipse()", "polygon()", "inset()", "margin-box", "border-box", "padding-box", "content-box", "url()", "image()", "linear-gradient()", "radial-gradient()", "repeating-linear-gradient()", "repeating-radial-gradient()"] },
    "tab-size": { "values": [] },
    "table-layout": { "values": ["auto", "fixed", "inherit"] },
    "text-align": { "values": ["center", "left", "justify", "right", "inherit"] },
    "text-align-last": { "values": ["center", "left", "justify", "right", "inherit"] },
    "text-decoration": { "values": ["line-through", "none", "overline", "underline", "inherit"] },
    "text-decoration-color": { "values": [], "type": "color" },
    "text-decoration-line": { "values": ["line-through", "none", "overline", "underline"] },
    "text-decoration-skip": { "values": ["edges", "ink", "none", "objects", "spaces"] },
    "text-decoration-style": { "values": ["dashed", "dotted", "double", "solid", "wavy"] },
    "text-emphasis": { "values": [] },
    "text-emphasis-color": { "values": [], "type": "color" },
    "text-emphasis-position": { "values": ["above", "below", "left", "right"] },
    "text-emphasis-style": { "values": ["circle", "dot", "double-circle", "filled", "none", "open", "sesame", "triangle"] },
    "text-indent": { "values": ["inherit"] },
    "text-overflow": { "values": ["clip", "ellipsis", "inherit"] },
    "text-shadow": { "values": [] },
    "text-rendering": { "values": ["auto", "geometricPrecision", "optimizeLegibility", "optimizeSpeed"] },
    "text-transform": { "values": ["capitalize", "full-width", "lowercase", "none", "uppercase", "inherit"] },
    "text-underline-position": { "values": ["alphabetic", "auto", "below", "left", "right"] },
    "top": { "values": ["auto", "inherit"] },
    "transform": { "values": ["matrix()", "matrix3d()", "none", "perspective()", "rotate()", "rotate3d()", "rotateX()", "rotateY()", "rotateZ()", "scale()", "scale3d()", "scaleX()", "scaleY()", "scaleZ()", "skewX()", "skewY()", "translate()", "translate3d()", "translateX()", "translateY()", "translateZ()"] },
    "transform-origin": { "values": ["bottom", "center", "left", "right", "top"] },
    "transform-style": { "values": ["flat", "preserve-3d"] },
    "transition": { "values": [] },
    "transition-delay": { "values": [] },
    "transition-duration": { "values": [] },
    "transition-property": { "values": ["all", "none"] },
    "transition-timing-function": { "values": ["cubic-bezier()", "ease", "ease-in", "ease-in-out", "ease-out", "linear", "step-end", "step-start", "steps()"] },
    "unicode-bidi": { "values": ["bidi-override", "embed", "normal", "inherit"] },
    "unicode-range": { "values": [] },
    "user-select": { "values": ["all", "auto", "contain", "none", "text"] },
    "vertical-align": { "values": ["baseline", "bottom", "middle", "sub", "super", "text-bottom", "text-top", "top", "inherit"] },
    "visibility": { "values": ["collapse", "hidden", "visible", "inherit"] },
    "white-space": { "values": ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "inherit"] },
    "widows": { "values": ["inherit"] },
    "width": { "values": ["auto", "inherit"] },
    "will-change": { "values": ["auto", "contents", "opacity", "scroll-position", "transform", "inherit", "initial", "unset"] },
    "word-break": { "values": ["normal", "break-all", "keep-all"] },
    "word-spacing": { "values": ["normal", "inherit"] },
    "word-wrap": { "values": ["break-word", "normal"] },
    "z-index": { "values": ["auto", "inherit"] }
  }
});