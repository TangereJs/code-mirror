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

  var langs = "ab aa af ak sq am ar an hy as av ae ay az bm ba eu be bn bh bi bs br bg my ca ch ce ny zh cv kw co cr hr cs da dv nl dz en eo et ee fo fj fi fr ff gl ka de el gn gu ht ha he hz hi ho hu ia id ie ga ig ik io is it iu ja jv kl kn kr ks kk km ki rw ky kv kg ko ku kj la lb lg li ln lo lt lu lv gv mk mg ms ml mt mi mr mh mn na nv nb nd ne ng nn no ii nr oc oj cu om or os pa pi fa pl ps pt qu rm rn ro ru sa sc sd se sm sg sr gd sn si sk sl so st es su sw ss sv ta te tg th ti bo tk tl tn to tr ts tt tw ty ug uk ur uz ve vi vo wa cy wo fy xh yi yo za zu".split(" ");
  var targets = ["_blank", "_self", "_top", "_parent"];
  var charsets = ["ascii", "utf-8", "utf-16", "latin1", "latin1"];
  var methods = ["get", "post", "put", "delete"];
  var encs = ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"];
  var media = ["all", "screen", "print", "embossed", "braille", "handheld", "print", "projection", "screen", "tty", "tv", "speech",
               "3d-glasses", "resolution [>][<][=] [X]", "device-aspect-ratio: X/Y", "orientation:portrait",
               "orientation:landscape", "device-height: [X]", "device-width: [X]"];
  var s = { attrs: {} }; // Simple tag, reused for a whole lot of tags

  var data = {
    a: {
      attrs: {
        href: null, ping: null, type: null,
        media: media,
        target: targets,
        hreflang: langs
      }
    },
    abbr: s,
    acronym: s,
    address: s,
    applet: s,
    area: {
      attrs: {
        alt: null, coords: null, href: null, target: null, ping: null,
        media: media, hreflang: langs, type: null,
        shape: ["default", "rect", "circle", "poly"]
      }
    },
    article: s,
    aside: s,
    audio: {
      attrs: {
        src: null, mediagroup: null,
        crossorigin: ["anonymous", "use-credentials"],
        preload: ["none", "metadata", "auto"],
        autoplay: ["", "autoplay"],
        loop: ["", "loop"],
        controls: ["", "controls"]
      }
    },
    b: s,
    base: { attrs: { href: null, target: targets } },
    basefont: s,
    bdi: s,
    bdo: s,
    big: s,
    blockquote: { attrs: { cite: null } },
    body: s,
    br: s,
    button: {
      attrs: {
        form: null, formaction: null, name: null, value: null,
        autofocus: ["", "autofocus"],
        disabled: ["", "autofocus"],
        formenctype: encs,
        formmethod: methods,
        formnovalidate: ["", "novalidate"],
        formtarget: targets,
        type: ["submit", "reset", "button"]
      }
    },
    canvas: { attrs: { width: null, height: null } },
    caption: s,
    center: s,
    cite: s,
    code: s,
    col: { attrs: { span: null } },
    colgroup: { attrs: { span: null } },
    command: {
      attrs: {
        type: ["command", "checkbox", "radio"],
        label: null, icon: null, radiogroup: null, command: null, title: null,
        disabled: ["", "disabled"],
        checked: ["", "checked"]
      }
    },
    data: { attrs: { value: null } },
    datagrid: { attrs: { disabled: ["", "disabled"], multiple: ["", "multiple"] } },
    datalist: { attrs: { data: null } },
    dd: s,
    del: { attrs: { cite: null, datetime: null } },
    details: { attrs: { open: ["", "open"] } },
    dfn: s,
    dir: s,
    div: s,
    dl: s,
    dt: s,
    em: s,
    embed: { attrs: { src: null, type: null, width: null, height: null } },
    eventsource: { attrs: { src: null } },
    fieldset: { attrs: { disabled: ["", "disabled"], form: null, name: null } },
    figcaption: s,
    figure: s,
    font: s,
    footer: s,
    form: {
      attrs: {
        action: null, name: null,
        "accept-charset": charsets,
        autocomplete: ["on", "off"],
        enctype: encs,
        method: methods,
        novalidate: ["", "novalidate"],
        target: targets
      }
    },
    frame: s,
    frameset: s,
    h1: s, h2: s, h3: s, h4: s, h5: s, h6: s,
    head: {
      attrs: {},
      children: ["title", "base", "link", "style", "meta", "script", "noscript", "command"]
    },
    header: s,
    hgroup: s,
    hr: s,
    html: {
      attrs: { manifest: null },
      children: ["head", "body"]
    },
    i: s,
    iframe: {
      attrs: {
        src: null, srcdoc: null, name: null, width: null, height: null,
        sandbox: ["allow-top-navigation", "allow-same-origin", "allow-forms", "allow-scripts"],
        seamless: ["", "seamless"]
      }
    },
    img: {
      attrs: {
        alt: null, src: null, ismap: null, usemap: null, width: null, height: null,
        crossorigin: ["anonymous", "use-credentials"]
      }
    },
    input: {
      attrs: {
        alt: null, dirname: null, form: null, formaction: null,
        height: null, list: null, max: null, maxlength: null, min: null,
        name: null, pattern: null, placeholder: null, size: null, src: null,
        step: null, value: null, width: null,
        accept: ["audio/*", "video/*", "image/*"],
        autocomplete: ["on", "off"],
        autofocus: ["", "autofocus"],
        checked: ["", "checked"],
        disabled: ["", "disabled"],
        formenctype: encs,
        formmethod: methods,
        formnovalidate: ["", "novalidate"],
        formtarget: targets,
        multiple: ["", "multiple"],
        readonly: ["", "readonly"],
        required: ["", "required"],
        type: ["hidden", "text", "search", "tel", "url", "email", "password", "datetime", "date", "month",
               "week", "time", "datetime-local", "number", "range", "color", "checkbox", "radio",
               "file", "submit", "image", "reset", "button"]
      }
    },
    ins: { attrs: { cite: null, datetime: null } },
    kbd: s,
    keygen: {
      attrs: {
        challenge: null, form: null, name: null,
        autofocus: ["", "autofocus"],
        disabled: ["", "disabled"],
        keytype: ["RSA"]
      }
    },
    label: { attrs: { "for": null, form: null } },
    legend: s,
    li: { attrs: { value: null } },
    link: {
      attrs: {
        href: null, type: null,
        hreflang: langs,
        media: media,
        sizes: ["all", "16x16", "16x16 32x32", "16x16 32x32 64x64"]
      }
    },
    map: { attrs: { name: null } },
    mark: s,
    menu: { attrs: { label: null, type: ["list", "context", "toolbar"] } },
    meta: {
      attrs: {
        content: null,
        charset: charsets,
        name: ["viewport", "application-name", "author", "description", "generator", "keywords"],
        "http-equiv": ["content-language", "content-type", "default-style", "refresh"]
      }
    },
    meter: { attrs: { value: null, min: null, low: null, high: null, max: null, optimum: null } },
    nav: s,
    noframes: s,
    noscript: s,
    object: {
      attrs: {
        data: null, type: null, name: null, usemap: null, form: null, width: null, height: null,
        typemustmatch: ["", "typemustmatch"]
      }
    },
    ol: { attrs: { reversed: ["", "reversed"], start: null, type: ["1", "a", "A", "i", "I"] } },
    optgroup: { attrs: { disabled: ["", "disabled"], label: null } },
    option: { attrs: { disabled: ["", "disabled"], label: null, selected: ["", "selected"], value: null } },
    output: { attrs: { "for": null, form: null, name: null } },
    p: s,
    param: { attrs: { name: null, value: null } },
    pre: s,
    progress: { attrs: { value: null, max: null } },
    q: { attrs: { cite: null } },
    rp: s,
    rt: s,
    ruby: s,
    s: s,
    samp: s,
    script: {
      attrs: {
        type: ["text/javascript"],
        src: null,
        async: ["", "async"],
        defer: ["", "defer"],
        charset: charsets
      }
    },
    section: s,
    select: {
      attrs: {
        form: null, name: null, size: null,
        autofocus: ["", "autofocus"],
        disabled: ["", "disabled"],
        multiple: ["", "multiple"]
      }
    },
    small: s,
    source: { attrs: { src: null, type: null, media: null } },
    span: s,
    strike: s,
    strong: s,
    style: {
      attrs: {
        type: ["text/css"],
        media: media,
        scoped: null
      }
    },
    sub: s,
    summary: s,
    sup: s,
    table: s,
    tbody: s,
    td: { attrs: { colspan: null, rowspan: null, headers: null } },
    textarea: {
      attrs: {
        dirname: null, form: null, maxlength: null, name: null, placeholder: null,
        rows: null, cols: null,
        autofocus: ["", "autofocus"],
        disabled: ["", "disabled"],
        readonly: ["", "readonly"],
        required: ["", "required"],
        wrap: ["soft", "hard"]
      }
    },
    tfoot: s,
    th: { attrs: { colspan: null, rowspan: null, headers: null, scope: ["row", "col", "rowgroup", "colgroup"] } },
    thead: s,
    time: { attrs: { datetime: null } },
    title: s,
    tr: s,
    track: {
      attrs: {
        src: null, label: null, "default": null,
        kind: ["subtitles", "captions", "descriptions", "chapters", "metadata"],
        srclang: langs
      }
    },
    tt: s,
    u: s,
    ul: s,
    "var": s,
    video: {
      attrs: {
        src: null, poster: null, width: null, height: null,
        crossorigin: ["anonymous", "use-credentials"],
        preload: ["auto", "metadata", "none"],
        autoplay: ["", "autoplay"],
        mediagroup: ["movie"],
        muted: ["", "muted"],
        controls: ["", "controls"]
      }
    },
    wbr: s,
    "at-carbon-action-button": { attrs: {disabled: {"description":"Disables the button when true","type":"Boolean","value":null}, xtype: {"description":"Sets button type. Can be Submit button and Cancel button","type":"String","value":["submit","cancel"]}} },
    "at-carbon-alert": { attrs: {"cancel-button": {"description":"","type":"string","value":null}, "confirm-button": {"description":"","type":"string","value":null}, message: {"description":"","type":"string","value":null}, opened: {"description":"","type":"boolean","value":null}, title: {"description":"","type":"string","value":null}} },
    "at-carbon-button": { attrs: {active: {"description":"","type":"boolean","value":null}, "aria-active-attribute": {"description":"","type":"string","value":null}, disabled: {"description":"","type":"boolean","value":null}, elevation: {"description":"","type":"number","value":null}, focused: {"description":"","type":"boolean","value":null}, "key-event-target": {"description":"","type":"object","value":null}, "pointer-down": {"description":"","type":"boolean","value":null}, pressed: {"description":"","type":"boolean","value":null}, raised: {"description":"","type":"boolean","value":null}, "received-focus-from-keyboard": {"description":"","type":"boolean","value":null}, "stop-keyboard-event-propagation": {"description":"","type":"boolean","value":null}, toggles: {"description":"","type":"boolean","value":null}} },
    "at-carbon-clamp": { attrs: {lines: {"description":"","type":"number","value":null}, text: {"description":"","type":"string","value":null}} },
    "at-carbon-collapse": { attrs: {content: {"description":"","type":"string","value":null}, "icon-position": {"description":"","type":"string","value":["left","right","right-justified"]}, opened: {"description":"","type":"boolean","value":null}, title: {"description":"","type":"string","value":null}} },
    "at-carbon-date-picker": { attrs: {"end-date": {"description":"holds the string value of the endDate of the date picker","type":"String","value":null}, mode: {"description":"Holds the mode of operation for date-picker.\nThree possible values \"single\", \"range-start\" and \"range-end\"\nsingle is used for at-form-date which operates on only one value\nrange-start and range-end are used for at-form-daterange which operates on start/end values","type":"String","value":["single","start-range","end-range"]}, "start-date": {"description":"holds the string value of the startDate of the date picker","type":"String","value":null}} },
    "at-carbon-dialog": { attrs: {"always-on-top": {"description":"","type":"boolean","value":null}, "animation-config": {"description":"","type":"object","value":null}, "auto-fit-on-attach": {"description":"","type":"boolean","value":null}, canceled: {"description":"","type":"boolean","value":null}, "closing-reason": {"description":"","type":"object","value":null}, "dynamic-align": {"description":"","type":"boolean","value":null}, "entry-animation": {"description":"","type":"string","value":null}, "exit-animation": {"description":"","type":"string","value":null}, "fit-into": {"description":"","type":"object","value":null}, "horizontal-align": {"description":"","type":"string","value":null}, "horizontal-offset": {"description":"","type":"number","value":null}, modal: {"description":"","type":"boolean","value":null}, "no-auto-focus": {"description":"","type":"boolean","value":null}, "no-cancel-on-esc-key": {"description":"","type":"boolean","value":null}, "no-cancel-on-outside-click": {"description":"","type":"boolean","value":null}, "no-overlap": {"description":"","type":"boolean","value":null}, opened: {"description":"","type":"boolean","value":null}, "position-target": {"description":"","type":"element","value":null}, "restore-focus-on-close": {"description":"","type":"boolean","value":null}, "sizing-target": {"description":"","type":"object","value":null}, "vertical-align": {"description":"","type":"string","value":null}, "vertical-offset": {"description":"","type":"number","value":null}, "with-backdrop": {"description":"","type":"boolean","value":null}} },
    "at-carbon-empty-state": { attrs: {html: {"description":"","type":"string","value":null}, icon: {"description":"","type":"string","value":null}} },
    "at-carbon-icon": { attrs: {icon: {"description":"","type":"string","value":null}, src: {"description":"","type":"string","value":null}, theme: {"description":"","type":"string","value":null}} },
    "at-carbon-icon-button": { attrs: {active: {"description":"","type":"boolean","value":null}, alt: {"description":"","type":"string","value":null}, "aria-active-attribute": {"description":"","type":"string","value":null}, color: {"description":"","type":"string","value":null}, disabled: {"description":"","type":"boolean","value":null}, disabled: {"description":"","type":"boolean","value":null}, focused: {"description":"","type":"boolean","value":null}, icon: {"description":"","type":"string","value":null}, "key-event-target": {"description":"","type":"object","value":null}, noink: {"description":"","type":"boolean","value":null}, "pointer-down": {"description":"","type":"boolean","value":null}, pressed: {"description":"","type":"boolean","value":null}, "received-focus-from-keyboard": {"description":"","type":"boolean","value":null}, "stop-keyboard-event-propagation": {"description":"","type":"boolean","value":null}, toggles: {"description":"","type":"boolean","value":null}} },
    "at-carbon-icon-color": { attrs: {color: {"description":"","type":"string","value":null}, icon: {"description":"","type":"string","value":null}} },
    "at-carbon-menu": { attrs: {items: {"description":"","type":"array","value":null}, "item-view": {"description":"","type":"string","value":null}, value: {"description":"","type":"string","value":null}} },
    "at-carbon-menu-button": { attrs: {color: {"description":"","type":"string","value":null}, icon: {"description":"","type":"string","value":null}, items: {"description":"","type":"array","value":null}, "item-view": {"description":"","type":"string","value":null}, position: {"description":"","type":"string","value":["topLeft","topRight","bottomLeft","bottomRight"]}, value: {"description":"","type":"string","value":null}, "x-offset": {"description":"","type":"number","value":null}, "y-offset": {"description":"","type":"number","value":null}} },
    "at-carbon-message": { attrs: {html: {"description":"","type":"string","value":null}, type: {"description":"","type":"string","value":["warning","info","error","success"]}} },
    "at-carbon-moment": { attrs: {ago: {"description":"","type":"boolean","value":null}, "auto-refresh": {"description":"","type":"boolean","value":null}, "auto-refresh-rate": {"description":"","type":"number","value":null}, datetime: {"description":"","type":"string","value":null}, "default-auto-refresh-rate": {"description":"","type":"number","value":null}, format: {"description":"","type":"string","value":null}, formats: {"description":"","type":"array","value":null}, "from-now": {"description":"","type":"boolean","value":null}, "interval-id": {"description":"","type":"number","value":null}, language: {"description":"","type":"string","value":null}, moment: {"description":"","type":"object","value":null}, "no-suffix": {"description":"","type":"boolean","value":null}, strict: {"description":"","type":"boolean","value":null}, "unix-offset": {"description":"","type":"number","value":null}, "unix-timestamp": {"description":"","type":"number","value":null}, utc: {"description":"","type":"boolean","value":null}} },
    "at-carbon-pager": { attrs: {hide: {"description":"","type":"boolean","value":null}, "item-count": {"description":"","type":"number","value":null}, page: {"description":"","type":"number","value":null}, "page-size": {"description":"","type":"number","value":null}} },
    "at-carbon-popup": { attrs: {"force-align": {"description":"","type":"boolean","value":null}, halign: {"description":"","type":"string","value":null}, spacing: {"description":"","type":"object","value":null}, valign: {"description":"","type":"string","value":null}} },
    "at-carbon-popup-content": { attrs: {dragging: {"description":"","type":"boolean","value":null}, "is-narrow": {"description":"","type":"boolean","value":null}, "is-open": {"description":"","type":"boolean","value":null}} },
    "at-carbon-progress": { attrs: {max: {"description":"","type":"number","value":null}, value: {"description":"","type":"number","value":null}} },
    "at-carbon-resolver": { attrs: {"item-root": {"description":"","type":"string","value":null}, "model-root": {"description":"","type":"string","value":null}, value: {"description":"","type":"object","value":null}} },
    "at-carbon-signal-button": { attrs: {disabled: {"description":"","type":"boolean","value":null}, signal: {"description":"","type":"string","value":null}, "signal-data": {"description":"","type":"string","value":null}} },
    "at-carbon-tab": { attrs: {} },
    "at-carbon-tabs": { attrs: {"align-bottom": {"description":"","type":"boolean","value":null}, "disable-drag": {"description":"","type":"boolean","value":null}, "hide-scroll-button": {"description":"","type":"boolean","value":null}, nobar: {"description":"","type":"boolean","value":null}, noslide: {"description":"","type":"boolean","value":null}, scrollable: {"description":"","type":"boolean","value":null}, selected: {"description":"","type":"string","value":null}} },
    "at-carbon-time-picker": { attrs: {value: {"description":"","type":"string","value":null}} },
    "at-carbon-tree": { attrs: {actions: {"description":"","type":"array","value":null}, data: {"description":"","type":"array","value":null}, value: {"description":"","type":"string","value":null}} },
    "at-carbon-tree-node": { attrs: {actions: {"description":"","type":"array","value":null}, data: {"description":"","type":"object","value":null}} },
    "at-carbon-video": { attrs: {"aspect-ratio": {"description":"aspect ratio - video aspect ratio\nsupported values are 4:3 and 16:9","type":"String","value":["4:3","16:9"]}, "autohide-controls": {"description":"autohideControls - timeout after video controls are automatically hidden\nthis attribute doesn't work with youtube player","type":"Number","value":null}, autoplay: {"description":"autoplay - if true video will start playing after it loads","type":"Boolean","value":null}, controls: {"description":"controls - if true controls will be displayed; false hides the controls\nthis attribute doesn't work with youtube player","type":"Boolean","value":null}, "current-time": {"description":"currentTime - start time at which video should start in seconds","type":"Number","value":null}, height: {"description":"height - height of the video area in px","type":"String","value":null}, loop: {"description":"loop - if true video will be played again from the begining when it finishes\nthis attribute doesn't work with youtube player","type":"Boolean","value":null}, muted: {"description":"muted - true mutes the audio","type":"Boolean","value":null}, preload: {"description":"preload - if true video will be preloaded; if false it will be loaded on play\nthis attribute doesn't work with youtube player","type":"Boolean","value":null}, src: {"description":"src - path or url to the video file\nSupply a relative path if video is hosted inside your domain\nSupply a remote url if video is hosted outside your domain","type":"String","value":null}, thumbnail: {"description":"thumbnail - path or url to the image file that will be displayed as thumbnail\nthis attribute doesn't work with youtube player","type":"String","value":null}, "video-volume": {"description":"videoVolume - audio volume in %\nmin is 0, max is 100","type":"Number","value":null}, width: {"description":"width - width of the video area in px","type":"String","value":null}} },
    "at-chart-core": { attrs: {c3chart: {"description":"","type":"object","value":null}, charttype: {"description":"","type":"string","value":["bar","line","pie","donut","spline","step","area","area-spline","default"]}, data: {"description":"","type":"object","value":null}, gridlines: {"description":"","type":"string","value":["none","y","x","xy"]}, legendposition: {"description":"","type":"string","value":["none","bottom","right","inset"]}, tooltip: {"description":"","type":"string","value":["none","default","grouped"]}} },
    "at-chart-inline": { attrs: {"chart-type": {"description":"","type":"string","value":["line","pie"]}, "color-scheme": {"description":"selects a color scheme to be used","type":"string","value":["category10","category20","category20b","category20c","google10c","google20c"]}, data: {"description":"","type":"object","value":null}, "data-column": {"description":"","type":"string","value":null}, hide: {"description":"","type":"boolean","value":null}, "pixels-per-data-point": {"description":"","type":"number","value":null}} },
    "at-chart-strudel": { attrs: {"color-scheme": {"description":"selects a color scheme to be used","type":"string","value":["category10","category20","category20b","category20c","google10c","google20c"]}, data: {"description":"","type":"object","value":null}, "model-root": {"description":"","type":"string","value":null}} },
    "at-core-activity": { attrs: {"active-requests": {"description":"","type":"array","value":null}, auto: {"description":"","type":"boolean","value":null}, body: {"description":"","type":"string","value":null}, "content-type": {"description":"","type":"string","value":null}, "disable-authorization": {"description":"","type":"boolean","value":null}, "handle-as": {"description":"","type":"string","value":null}, headers: {"description":"","type":"object","value":null}, indicator: {"description":"","type":"boolean","value":null}, "last-error": {"description":"","type":"object","value":null}, "last-request": {"description":"","type":"object","value":null}, "last-response": {"description":"","type":"object","value":null}, loading: {"description":"","type":"boolean","value":null}, method: {"description":"","type":"string","value":null}, "no-credentials": {"description":"","type":"boolean","value":null}, params: {"description":"","type":"object","value":null}, sync: {"description":"","type":"boolean","value":null}, url: {"description":"","type":"string","value":null}, verbose: {"description":"","type":"boolean","value":null}, "with-credentials": {"description":"","type":"boolean","value":null}} },
    "at-core-busy": { attrs: {type: {"description":"","type":"string","value":null}} },
    "at-core-card": { attrs: {"left-icon": {"description":"","type":"string","value":null}, "left-icon-color": {"description":"","type":"string","value":null}, "no-curve": {"description":"","type":"boolean","value":null}, "offset-ratio": {"description":"","type":"number","value":null}, removing: {"description":"","type":"boolean","value":null}, "right-icon": {"description":"","type":"string","value":null}, "right-icon-color": {"description":"","type":"string","value":null}, sort: {"description":"","type":"string","value":null}, swipeable: {"description":"","type":"boolean","value":null}, "width-ratio": {"description":"","type":"number","value":null}} },
    "at-core-cardlayout": { attrs: {"card-layout-data": {"description":"","type":"string","value":null}} },
    "at-core-cardlayout-desktop": { attrs: {"card-layout-data": {"description":"","type":"string","value":null}, "card-layout-pos": {"description":"","type":"string","value":null}, "card-layout-timeout": {"description":"","type":"string","value":null}} },
    "at-core-cardlayout-mobile": { attrs: {"card-layout-data": {"description":"","type":"string","value":null}, "card-layout-pos": {"description":"","type":"string","value":null}, "card-layout-timeout": {"description":"","type":"string","value":null}} },
    "at-core-cardlist": { attrs: {"card-width": {"description":"","type":"number","value":null}, "empty-list": {"description":"","type":"string","value":null}, indicator: {"description":"","type":"boolean","value":null}, "item-component": {"description":"","type":"string","value":null}, items: {"description":"","type":"array","value":null}, layout: {"description":"","type":"string","value":null}, view: {"description":"","type":"string","value":null}} },
    "at-core-dashboard-echo": { attrs: {"model-root": {"description":"","type":"string","value":null}, template: {"description":"","type":"string","value":null}} },
    "at-core-dframe": { attrs: {"device-type": {"description":"","type":"string","value":["iphone5s_silver","iphone6_black","iphone6_silver","ipad_silver","nexus5","macbook"]}, "max-height": {"description":"","type":"number","value":null}, "max-width": {"description":"","type":"number","value":null}, orientation: {"description":"","type":"string","value":["portrait","landscape"]}, src: {"description":"","type":"string","value":null}} },
    "at-core-dropdown": { attrs: {position: {"description":"","type":"string","value":["topLeft","topRight","bottomLeft","bottomRight"]}, "x-offset": {"description":"","type":"number","value":null}, "y-offset": {"description":"","type":"number","value":null}} },
    "at-core-form": { attrs: {"active-tab": {"description":"holds the value of the currently active tab when sectionMode === tab <br/>\nhas value of \"\" when sectionMode === default","type":"string","value":null}, data: {"description":"Holds values of the elements on the form","type":"Object | String","value":null}, disabled: {"description":"When true disables all elements on the form","type":"Boolean","value":null}, files: {"description":"","type":"object","value":null}, hide: {"description":"When true hides all elements.","type":"Boolean","value":null}, layout: {"description":"at-core-form can now have a one column or two column layout <br/>\nby default a one column layout is used but a two column layout can be specified <br/>\nlayout = 'horizontal' renders the two column layout <br/>\nlayout = 'vertical' renders the single column layout <br/>","type":"string","value":null}, schema: {"description":"Specification of elements that should appear on the form.<br/>\nProvide either an object or string.<br/>\nList property definitions inside properties object.<br/>","type":"Object | Stirng","value":null}, "section-mode": {"description":"at-core-form sectionMode governs the rendering of at-form-section <br/>\nsectionMode === default, renders at-form-section as a heading\nsectionMode === tab, renders at-form-section as a tab\nall form-section elements form a tab group\niron-pages hold the elements belonging to a tab group\nclicking a tab changes elements currently visible on screen","type":"string","value":["sections","tabs","auto","mobile"]}, valid: {"description":"Valid state of the form. When all elements on the form are valid form is valid. If at least one element on the form is invalid, form is invalid","type":"Boolean","value":null}} },
    "at-core-iframe": { attrs: {accesskey: {"description":"A key label or list of key labels with which to associate the element; each key label represents a keyboard shortcut which UAs can use to activate the element or give focus to the element.\nAn ordered set of unique space-separated tokens, each of which must be exactly one Unicode code point in length.","type":"String","value":null}, "allow-fullscreen": {"description":"This attribute can be set to true if the frame is allowed to be placed into full screen mode by calling its Element.requestFullscreen() method.\nIf this isn't set, the element can't be placed into full screen mode.","type":"Boolean","value":null}, contenteditable: {"description":"contenteditable - Specifies whether the contents of the element are editable.","type":"Boolean","value":null}, contextmenu: {"description":"contextmenu - The value of the id attribute on the menu with which to associate the element as a context menu.","type":"String","value":null}, dir: {"description":"dir - Specifies the element’s text directionality.","type":"String","value":null}, draggable: {"description":"draggable - Specifies whether the element is draggable.","type":"Boolean","value":null}, frameborder: {"description":"The value 1 (the default) tells the browser to draw a border between this frame and every other frame.\nThe value 0 tells the browser not to draw a border between this frame and other frames.","type":"String","value":["0","1"]}, height: {"description":"height - Give the height of the visual content of the element, in CSS pixels.","type":"String","value":null}, hidden: {"description":"hidden - Specifies that the element represents an element that is not yet, or is no longer, relevant.","type":"Boolean","value":null}, lang: {"description":"lang - A unique identifier for the element. <br/>\nThere must not be multiple elements in a document that have the same id value. <br/>\nAny string, with the following restrictions: <br/>\n1. must be at least one character long <br/>\n2. must not contain any space characters","type":"String","value":null}, sandbox: {"description":"sandbox - Enables a set of extra restrictions on any content hosted by the iframe.\nPossible values allow-same-origin/ allow-top-navigation/ allow-forms/ allow-scripts","type":"String","value":["","allow-same-origin","allow-top-navigation","allow-forms","allow-scripts"]}, scrolling: {"description":"Enumerated attribute indicating when the browser should provide a scroll bar (or other scrolling device) for the frame","type":"String","value":["auto","yes","no"]}, spellcheck: {"description":"spellcheck - Specifies the primary language for the contents of the element and for any of the element’s attributes that contain text. <br/>\nA valid language tag, as defined in [BCP47].","type":"Boolean","value":null}, src: {"description":"src - Gives the address of a page that the nested browsing context is to contain.","type":"String","value":null}, tabindex: {"description":"tabindex - Specifies whether the element represents an element that is is focusable (that is, an element which is part of the sequence of focusable elements in the document), and the relative order of the element in the sequence of focusable elements in the document.","type":"Number","value":null}, title: {"description":"title - Advisory information associated with the element.","type":"String","value":null}, width: {"description":"width - Give the width of the visual content of the element, in CSS pixels","type":"String","value":null}} },
    "at-core-item": { attrs: {"item-component": {"description":"","type":"string","value":null}, value: {"description":"","type":"object","value":null}, view: {"description":"","type":"string","value":null}} },
    "at-core-list": { attrs: {"card-height": {"description":"","type":"string","value":null}, "card-width": {"description":"","type":"string","value":null}, "empty-list": {"description":"","type":"string","value":null}, height: {"description":"","type":"string","value":null}, indicator: {"description":"","type":"boolean","value":null}, "item-component": {"description":"","type":"string","value":null}, items: {"description":"","type":"array","value":null}, layout: {"description":"","type":"string","value":null}, view: {"description":"","type":"string","value":null}} },
    "at-core-markdown": { attrs: {text: {"description":"","type":"string","value":null}} },
    "at-core-media-query": { attrs: {full: {"description":"","type":"boolean","value":null}, query: {"description":"","type":"string","value":null}, "query-matches": {"description":"","type":"boolean","value":null}} },
    "at-core-mic": { attrs: {"complete-transcript": {"description":"Returns the complete transcript string for the continuous recognition.","type":"string","value":null}, language: {"description":"Specifies the language of the speech synthesis for the utterance.","type":"string","value":null}, recognition: {"description":"","type":"object","value":null}, transcript: {"description":"Returns the current transcript string.","type":"string","value":null}} },
    "at-core-modal": { attrs: {"min-width": {"description":"","type":"string","value":null}} },
    "at-core-pdf": { attrs: {"aspect-ratio": {"description":"aspectRatio - used to dynamically calculate height of the pdf render container based on its width","type":"String","value":["a4","letter","4:3","16:9"]}, src: {"description":"src - uri of the pdf document to be displayed","type":"String","value":null}} },
    "at-core-propform": { attrs: {"element-instance": {"description":"","type":"object","value":null}, hide: {"description":"","type":"boolean","value":null}, mode: {"description":"","type":"string","value":["default","designer"]}, "title-mode": {"description":"","type":"string","value":["title","propertyName"]}, value: {"description":"","type":"object","value":null}} },
    "at-core-resize-sensor": { attrs: {} },
    "at-core-router": { attrs: {caption: {"description":"","type":"string","value":null}, context: {"description":"","type":"object","value":null}, "default-color": {"description":"","type":"string","value":null}, "default-view": {"description":"","type":"string","value":null}, "enable-back": {"description":"","type":"boolean","value":null}, "primary-color": {"description":"","type":"string","value":null}} },
    "at-core-searchbox": { attrs: {icon: {"description":"","type":"string","value":null}, language: {"description":"","type":"string","value":null}, placeholder: {"description":"","type":"string","value":null}, "search-term": {"description":"","type":"string","value":null}, "type-write": {"description":"","type":"string","value":null}} },
    "at-core-signals": { attrs: {} },
    "at-core-sortable": { attrs: {animation: {"description":"","type":"number","value":null}, "chosen-class": {"description":"","type":"string","value":null}, "data-id-attr": {"description":"","type":"string","value":null}, delay: {"description":"","type":"number","value":null}, disabled: {"description":"","type":"boolean","value":null}, draggable: {"description":"","type":"object","value":null}, "dragover-bubble": {"description":"","type":"boolean","value":null}, "drop-bubble": {"description":"","type":"boolean","value":null}, "fallback-class": {"description":"","type":"string","value":null}, "fallback-on-body": {"description":"","type":"boolean","value":null}, filter: {"description":"","type":"object","value":null}, "force-fallback": {"description":"","type":"boolean","value":null}, "ghost-class": {"description":"","type":"string","value":null}, group: {"description":"","type":"object","value":null}, handle: {"description":"","type":"string","value":null}, ignore: {"description":"","type":"string","value":null}, scroll: {"description":"","type":"object","value":null}, "scroll-sensitivity": {"description":"","type":"number","value":null}, "scroll-speed": {"description":"","type":"number","value":null}, sort: {"description":"","type":"boolean","value":null}, store: {"description":"","type":"object","value":null}} },
    "at-core-spinner": { attrs: {display: {"description":"","type":"string","value":null}, type: {"description":"","type":"string","value":null}} },
    "at-core-splitter": { attrs: {"allow-overflow": {"description":"By default the parent and siblings of the splitter are set to overflow hidden. This helps\navoid elements bleeding outside the splitter regions. Set this property to true to allow\nthese elements to overflow.","type":"boolean","value":null}, direction: {"description":"Possible values are `left`, `right`, `up` and `down`.","type":"string","value":null}, locked: {"description":"Locks the split bar so it can't be dragged.","type":"boolean","value":null}, "min-size": {"description":"Minimum width to which the splitter target can be sized, e.g.\n`minSize=\"100px\"`","type":"string","value":null}} },
    "at-core-theme": { attrs: {theme: {"description":"","type":"string","value":null}} },
    "at-core-video": { attrs: {"autohide-controls": {"description":"autohideControls - timeout after video controls are automatically hidden","type":"Number","value":null}, autoplay: {"description":"autoplay - if true video will start playing after it loads","type":"Boolean","value":null}, controls: {"description":"controls - if true controls will be displayed; false hides the controls","type":"Boolean","value":null}, "current-time": {"description":"currentTime - start time at which video should start in seconds","type":"Number","value":null}, height: {"description":"height - height of the video area in px","type":"Number","value":null}, loop: {"description":"loop - if true video will be played again from the begining when it finishes","type":"Boolean","value":null}, muted: {"description":"muted - true mutes the audio","type":"Boolean","value":null}, preload: {"description":"preload - if true video will be preloaded; if false it will be loaded on play","type":"Boolean","value":null}, src: {"description":"src - path or url to the video file\nSupply a relative path if video is hosted inside your domain\nSupply a remote url if video is hosted outside your domain","type":"String","value":null}, tabindex: {"description":"","type":"number","value":null}, thumbnail: {"description":"thumbnail - path or url to the image file that will be displayed as thumbnail","type":"String","value":null}, "video-volume": {"description":"videoVolume - audio volume in %\nmin is 0, max is 100","type":"Number","value":null}, width: {"description":"width - width of the video area in px","type":"Number","value":null}} },
    "at-core-view": { attrs: {model: {"description":"","type":"object","value":null}, "model-root": {"description":"","type":"string","value":null}, placeholder: {"description":"","type":"string","value":null}, value: {"description":"","type":"object","value":null}, view: {"description":"","type":"string","value":null}} },
    "at-doc-demo": { attrs: {auto: {"description":"","type":"boolean","value":null}, hide: {"description":"","type":"boolean","value":null}, url: {"description":"","type":"string","value":null}} },
    "at-doc-parser": { attrs: {url: {"description":"","type":"string","value":null}, value: {"description":"","type":"object","value":null}} },
    "at-doc-snippet": { attrs: {snippet: {"description":"","type":"string","value":null}} },
    "at-doc-viewer": { attrs: {auto: {"description":"","type":"boolean","value":null}, readme: {"description":"readme - if true, readme.md file will be read and displayed in a separate tab","type":"Boolean","value":null}, url: {"description":"","type":"string","value":null}} },
    "at-elements-catalog": { attrs: {catalog: {"description":"","type":"array","value":null}} },
    "at-form": { attrs: {data: {"description":"","type":"object","value":null}, layout: {"description":"","type":"string","value":null}, schema: {"description":"","type":"object","value":null}, url: {"description":"","type":"string","value":null}} },
    "at-form-ajax": { attrs: {mode: {"description":"","type":"string","value":["c","u","r"]}, "post-mode": {"description":"","type":"string","value":["json","formdata"]}, "record-id": {"description":"","type":"string","value":null}, schema: {"description":"","type":"object","value":null}, "schema-url": {"description":"","type":"string","value":null}, url: {"description":"","type":"string","value":null}} },
    "at-form-array": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"When true disables all elements on the form","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"When true hides the label for the element","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"Textual label for the element","type":"String","value":null}, layout: {"description":"Layout for the element\nThis is used to change layout of the at-form-complex that is used as row renderer\nand to govern row header rendering","type":"String","value":["vertical","horizontal"]}, required: {"description":"When true array must have at least one item","type":"Boolean","value":null}, schema: {"description":"Specification of elements that should appear on the element.<br/>\nProvide either an object or string.<br/>\nList property definitions inside properties object.<br/>","type":"Object | Stirng","value":null}, value: {"description":"Holds values of the elements on the element","type":"Array | String","value":null}} },
    "at-form-checkbox": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"","type":"String","value":null}, required: {"description":"","type":"Boolean","value":null}, value: {"description":"","type":"Object","value":null}, xtype: {"description":"","type":"String","value":["","toggle"]}} },
    "at-form-codemirror": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"Element's disabled state","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"Hides element's label","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"Element's label for element display purposes","type":"String","value":null}, "max-chars": {"description":"","type":"number","value":null}, "max-lines": {"description":"Maximum number of lines allowed on the element before vertical scroll bar is used","type":"Number","value":null}, mode: {"description":"Syntax highlighting mode","type":"String","value":["htmlmixed","carbon","javascript","css","markdown","sql","xml","liquid","application/json","yaml"]}, "no-line-numbers": {"description":"No line numbers. Set to true to hide line numbers","type":"Boolean","value":null}, required: {"description":"Element's required state for element validation purposes","type":"Boolean","value":null}, "tab-size": {"description":"Tab size","type":"Number","value":null}, theme: {"description":"Color theme","type":"String","value":["default","carbon"]}, value: {"description":"Elements value","type":"String","value":null}} },
    "at-form-complex": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"When true disables all elements on the form","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"When true hides the label for the element","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"Textual label for the element","type":"String","value":null}, schema: {"description":"Specification of elements that should appear on the element.<br/>\nProvide either an object or string.<br/>\nList property definitions inside properties object.<br/>","type":"Object | Stirng","value":null}, value: {"description":"Holds values of the elements on the element","type":"Object | String","value":null}, _layout: {"description":"_layout <br>\nadded as support for rendering rows in at-form-array <br>\n_layout = horizontal lays out elements in a horizontal line <br>\n_layout = vertical lays out elements in a single vertical column <br>","type":"String","value":null}} },
    "at-form-cron": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"Element's disabled state","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"When true label is hidden","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"Element's label for element display purposes","type":"String","value":null}, required: {"description":"Element's required state for element validation purposes","type":"Boolean","value":null}, value: {"description":"Elements value","type":"String","value":null}} },
    "at-form-date": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"","type":"boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, format: {"description":"Formating is based [moment.js](http://momentjs.com/). A list of supported tokens in format can be found in the [moment.js documentation](http://momentjs.com/docs/#/displaying/).","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"","type":"boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"","type":"string","value":null}, required: {"description":"","type":"boolean","value":null}, value: {"description":"","type":"string","value":null}, xtype: {"description":"","type":"string","value":null}} },
    "at-form-daterange": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"","type":"boolean","value":null}, "end-date": {"description":"","type":"string","value":null}, "error-message": {"description":"","type":"string","value":null}, format: {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"","type":"boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"","type":"string","value":null}, required: {"description":"","type":"boolean","value":null}, "start-date": {"description":"","type":"string","value":null}, value: {"description":"","type":"string","value":null}} },
    "at-form-file": { attrs: {accept: {"description":"If you want to restrict the types of files that the file chooser\nwill allow your user's to select, you can make use of an `accept`\nproperty, passing one or more MIME types as comma-separated values.\nPlease note that [browser support for this property is poor and implementations vary](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#Browser_compatibility).","type":"string","value":null}, "auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"Disabled state of the element; true = disabled, false = enabled","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, extensions: {"description":"This is a validation property that allows you to filter out any\nfiles that do not contain a specific extension. The value of this\nproperty is a JSON array string, containing all extensions to keep.\nYou can also negate your extension array by including a `!` sign\njust before the array's opening bracket.","type":"String","value":null}, files: {"description":"Array of javascript File objects so that contents of selected files can be read","type":"Array of javascript File objects","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"Hides the label","type":"String","value":null}, hint: {"description":"","type":"string","value":null}, icon: {"description":"Name of the icon","type":"String","value":null}, label: {"description":"Label for the element","type":"String","value":null}, "max-files": {"description":"If you'd like to limit the number of files to accept from your\nusers, specify this as an integer value for the `maxFiles` property.\nFor example, to only accept 3 files:\n <file-input maxFiles=\"3\">\n Select Files\n </file-input>\nIf you'd like to completely prevent users from selecting more\nthan one file from the file chooser, you can simply set\n`maxFiles` to 1:\n <file-input maxFiles=\"1\">\n Select Files\n </file-input>","type":"integer","value":null}, "max-size": {"description":"Maximum acceptable file size for the purposes of validation.\nThe value is expected to be in bytes.","type":"Number","value":null}, "min-size": {"description":"Minimum acceptable file size for the purposes of validation.\nThe value is expected to be in bytes.","type":"Number","value":null}, required: {"description":"Required state of the element; true = required, false = optional","type":"Boolean","value":null}, value: {"description":"Value of the element contains array of valid files and a count of invalid files","type":"Object","value":null}} },
    "at-form-html": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"Element's disabled state","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, formats: {"description":"Whitelist for all formats to allow. Defaults to enable all formats","type":"Array","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"Hides element's label","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"Element's label for element display purposes","type":"String","value":null}, "max-chars": {"description":"","type":"number","value":null}, "max-lines": {"description":"Maximum number of characters across all lines allowed on the element. Use 0 (zero) for no limit","type":"Number","value":null}, "ops-mode": {"description":"Ops Mode if true value will be emitted as quill delta. If false value will be emitted as html","type":"Boolean","value":null}, placeholder: {"description":"Placeholder when there is no content","type":"String","value":null}, required: {"description":"Element's required state for element validation purposes","type":"Boolean","value":null}, theme: {"description":"The Quill theme. Choose either \"snow\" or \"bubble\".","type":"String","value":["snow","bubble"]}, "toolbar-mode": {"description":"Type of toolbar. Standard toolbar has basic functions.\nWhen false, full toolbar is displayed.","type":"Boolean","value":["default","full"]}, value: {"description":"Elements value","type":"String","value":null}} },
    "at-form-image": { attrs: {accept: {"description":"If you want to restrict the types of files that the file chooser\nwill allow your user's to select, you can make use of an `accept`\nproperty, passing one or more MIME types as comma-separated values.\nPlease note that [browser support for this property is poor and implementations vary](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#Browser_compatibility).","type":"string","value":null}, "auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"Disabled state of the element; true = disabled, false = enabled","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, extensions: {"description":"This is a validation property that allows you to filter out any\nfiles that do not contain a specific extension. The value of this\nattribute is a JSON array string, containing all extensions to keep.\nYou can also negate your extension array by including a `!` sign\njust before the array's opening bracket.","type":"String","value":null}, files: {"description":"Array of javascript File objects so that contents of selected files can be read","type":"Array of javascript File objects","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"Hides the label","type":"String","value":null}, hint: {"description":"","type":"string","value":null}, icon: {"description":"Name of the icon","type":"String","value":null}, label: {"description":"Label for the element","type":"String","value":null}, "max-files": {"description":"If you'd like to limit the number of files to accept from your\nusers, specify this as an integer value for the `maxFiles` property.\nFor example, to only accept 3 files:\n <file-input maxFiles=\"3\">\n Select Files\n </file-input>\nIf you'd like to completely prevent users from selecting more\nthan one file from the file chooser, you can simply set\n`maxFiles` to 1:\n <file-input maxFiles=\"1\">\n Select Files\n </file-input>","type":"integer","value":null}, "max-size": {"description":"Maximum acceptable file size for the purposes of validation.\nThe value is expected to be in bytes.","type":"Number","value":null}, "min-size": {"description":"Minimum acceptable file size for the purposes of validation.\nThe value is expected to be in bytes.","type":"Number","value":null}, required: {"description":"Required state of the element; true = required, false = optional","type":"Boolean","value":null}, value: {"description":"Value of the element contains array of valid files and a count of invalid files","type":"Object","value":null}} },
    "at-form-input": { attrs: {disabled: {"description":"Element's disabled state","type":"Boolean","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"","type":"Boolean","value":null}, label: {"description":"Element's label for element display purposes","type":"String","value":null}, name: {"description":"Element's name for form submission purposes","type":"String","value":null}, placeholder: {"description":"Element's placeholder text for element display purposes","type":"String","value":null}, required: {"description":"Element's required state for element validation purposes","type":"Boolean","value":null}, type: {"description":"Element's type for element display and validation purposes","type":"String","value":null}, valid: {"description":"Element's valid state for element validation purposes\nnotify: true - outside world should be notified when element's valid state changes\nreadOnly: true - outside world is not able to change element's status since its element's internal state","type":"Boolean","value":null}, value: {"description":"Element's required status for element validation purposes\nnotify: true outside world should be notified that element's value has changed\nthis is achieved via autoamtic value-changed event\nobserver: 'valueChanged' outside world should be able to set/update the element's value\ncomponent is notified about this via valueChanged callback function","type":"String","value":null}} },
    "at-form-lookup": { attrs: {"allow-new-items": {"description":"When true new entries are created when no matching record is found","type":"Boolean","value":null}, "auto-validate": {"description":"","type":"boolean","value":null}, available: {"description":"The list of items that should initially be present for selection\nvalue should be provided as a comma separated values (CSV) string","type":"String","value":null}, disabled: {"description":"Element's disabled state","type":"Boolean","value":null}, enum: {"description":"The list of items that should initially be present for selection\nvalue should be provided as an array of strings","type":"Array","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"Hides label when true","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, "initial-search-term": {"description":"initialSearchTerm - when set/changed the current values are cleared and it behaves like having typed that value","type":"String","value":null}, "item-view": {"description":"","type":"string","value":null}, label: {"description":"Element's label for element display purposes","type":"String","value":null}, "max-items": {"description":"Maximum count of items that can be selected","type":"Number","value":null}, "no-credentials": {"description":"When true no authentication is sent to the server","type":"Boolean","value":null}, "no-preload": {"description":"When true initial request to popluate the available items is not set","type":"Boolean","value":null}, params: {"description":"Additional params to send with each request","type":"String","value":null}, required: {"description":"Element's required state for element validation purposes","type":"Boolean","value":null}, "selected-items": {"description":"Elements value as an array of selected objects","type":"Array","value":null}, url: {"description":"Remote url from where to get items from","type":"String","value":null}, value: {"description":"Elements value. Value is a CSV string","type":"String","value":null}, xurl: {"description":"Remote url from where to get items from","type":"String","value":null}, xvaluelist: {"description":"The list of items that should initially be present for selection\nvalue should be provided as an array of title, value objects","type":"Array","value":null}} },
    "at-form-markdown": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"","type":"boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"","type":"boolean","value":null}, hint: {"description":"","type":"string","value":null}, "inline-attachment-extra-params": {"description":"","type":"object","value":null}, "inline-attachment-json-field-name": {"description":"","type":"string","value":null}, "inline-attachment-upload-url": {"description":"","type":"string","value":null}, label: {"description":"","type":"string","value":null}, required: {"description":"","type":"boolean","value":null}, value: {"description":"","type":"string","value":null}} },
    "at-form-number": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"Element's disabled state","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"Hides title when true","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"Element's label for element display purposes","type":"String","value":null}, placeholder: {"description":"Element's placeholder text for element display purposes","type":"String","value":null}, required: {"description":"Element's required state for element validation purposes","type":"Boolean","value":null}, value: {"description":"Elements value","type":"String","value":null}} },
    "at-form-password": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"Element's disabled state","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"When true label is hidden","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"Element's label for element display purposes","type":"String","value":null}, "max-chars": {"description":"Maximum number of characters allowed in value\nIf 0, any number of characters is allowed","type":"Number","value":null}, placeholder: {"description":"Element's placeholder text for element display purposes","type":"String","value":null}, required: {"description":"Element's required state for element validation purposes","type":"Boolean","value":null}, value: {"description":"Elements value","type":"String","value":null}} },
    "at-form-radio": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"Element's disabled state","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"When true label is hidden","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"Element's label for element display purposes","type":"String","value":null}, required: {"description":"Element's required state for element validation purposes","type":"Boolean","value":null}, value: {"description":"Element's value","type":"String","value":null}, xvaluelist: {"description":"List of availble options provided as array of { title, value } pairs","type":"Array","value":null}} },
    "at-form-ruleset": { attrs: {disabled: {"description":"When true element is disabled; user input is not possible","type":"Boolean","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"When true label is hidden","type":"Boolean","value":null}, label: {"description":"Elements label","type":"String","value":null}, "rule-config": {"description":"Element configuration; for conditions and actions","type":"Object","value":null}, value: {"description":"Element's value","type":"Array","value":null}} },
    "at-form-section": { attrs: {hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"When true label is not displayed","type":"Boolean","value":null}, label: {"description":"Element's label","type":"String","value":null}} },
    "at-form-state": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"Element's disabled state","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"When true label is hidden","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"Element's label for element display purposes","type":"String","value":null}, required: {"description":"Element's required state for element validation purposes","type":"Boolean","value":null}, value: {"description":"Element's value","type":"String","value":null}, xvaluelist: {"description":"List of availble options provided as array of { title, value } pairs","type":"Array","value":null}} },
    "at-form-static": { attrs: {hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"When true label is hidden","type":"Boolean","value":null}, label: {"description":"Element's label for element display purposes","type":"String","value":null}, value: {"description":"Elements value","type":"String","value":null}} },
    "at-form-text": { attrs: {"auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"Element's disabled state","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"When true label is hidden","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, label: {"description":"Element's label for element display purposes","type":"String","value":null}, "max-chars": {"description":"Maximum number of characters allowed in value\nIf 0, any number of characters is allowed","type":"Number","value":null}, placeholder: {"description":"Element's placeholder text for element display purposes","type":"String","value":null}, required: {"description":"Element's required state for element validation purposes","type":"Boolean","value":null}, value: {"description":"Elements value","type":"String","value":null}} },
    "at-form-textarea": { attrs: {"autogrow-line-limit": {"description":"textarea will autogrow up to autogrow line limit\nabove the limit vertical scrollbar will be displyed","type":"Number","value":null}, "auto-validate": {"description":"","type":"boolean","value":null}, disabled: {"description":"When true element is disabled","type":"Boolean","value":null}, "error-message": {"description":"","type":"string","value":null}, hide: {"description":"Hides the element. When hidden nothing is displayed for the element","type":"Boolean","value":null}, "hide-label": {"description":"When true label is hidden","type":"Boolean","value":null}, hint: {"description":"","type":"string","value":null}, "initial-lines": {"description":"Count of initially displayed lines even if they do not have text in them","type":"Number","value":null}, label: {"description":"Element's label","type":"String","value":null}, "max-chars": {"description":"Maxmimum count of characters allowed in value.\nUse 0 for no limit","type":"Number","value":null}, "max-lines": {"description":"Maxmimum count of lines allowed in value.\nUse 0 for no limit","type":"Number","value":null}, required: {"description":"When true element must have value","type":"Boolean","value":null}, value: {"description":"","type":"string","value":null}, "-value": {"description":"Value of the element","type":"String","value":null}} },
    "at-journey": { attrs: {"cards-refresh": {"description":"","type":"string","value":null}, "device-type": {"description":"","type":"string","value":["","iphone5s_silver","iphone6_black","iphone6_silver","ipad_silver","nexus5","macbook"]}, "item-component": {"description":"","type":"string","value":null}, orientation: {"description":"","type":"string","value":["","portrait","landscape"]}, "type-write": {"description":"","type":"string","value":null}, url: {"description":"","type":"string","value":null}, view: {"description":"","type":"string","value":null}} },
    "at-link": { attrs: {href: {"description":"","type":"string","value":null}, signal: {"description":"","type":"string","value":null}, "signal-data": {"description":"","type":"string","value":null}, xref: {"description":"","type":"string","value":null}} },
    "at-map-google": { attrs: {"api-key": {"description":"A Maps API key. To obtain an API key, see https://developers.google.com/maps/documentation/javascript/tutorial#api_key.","type":"String","value":null}, "client-id": {"description":"Overrides the origin the Maps API is loaded from. Defaults to `https://maps.googleapis.com`.","type":"String","value":null}, "disable-default-ui": {"description":"If set, removes the map's default UI controls.","type":"Boolean","value":null}, "disable-map-type-control": {"description":"If set, removes the map's 'map type' UI controls.","type":"Boolean","value":null}, "disable-street-view-control": {"description":"If set, removes the map's 'street view' UI controls.","type":"Boolean","value":null}, "disable-zoom": {"description":"If true, prevent the user from zooming the map interactively.","type":"Boolean","value":null}, "fit-to-markers": {"description":"If set, the zoom level is set such that all markers (google-map-marker children) are brought into view.","type":"Boolean","value":null}, hide: {"description":"","type":"boolean","value":null}, latitude: {"description":"","type":"number","value":null}, longitude: {"description":"","type":"number","value":null}, "map-type": {"description":"Map type to display. One of 'roadmap', 'satellite', 'hybrid', 'terrain'.","type":"String","value":["roadmap","satellite","hybrid","terrain"]}, markers: {"description":"","type":"array","value":null}} },
    "at-rule-actions": { attrs: {config: {"description":"","type":"object","value":null}, disabled: {"description":"","type":"boolean","value":null}, "hide-label": {"description":"","type":"boolean","value":null}, label: {"description":"","type":"string","value":null}, schema: {"description":"","type":"object","value":null}, value: {"description":"","type":"array","value":null}} },
    "at-rule-conditions": { attrs: {config: {"description":"","type":"array","value":null}, disabled: {"description":"","type":"boolean","value":null}, "hide-label": {"description":"","type":"boolean","value":null}, label: {"description":"","type":"string","value":null}, schema: {"description":"","type":"object","value":null}, value: {"description":"","type":"object","value":null}} },
    "at-rule-edit": { attrs: {disabled: {"description":"","type":"boolean","value":null}, "rule-config": {"description":"","type":"object","value":null}, schema: {"description":"","type":"object","value":null}, value: {"description":"","type":"object","value":null}} },
    "at-silver-cards": { attrs: {"card-layout": {"description":"","type":"string","value":null}, "hide-search-box": {"description":"","type":"boolean","value":null}, "item-component": {"description":"","type":"string","value":null}, page: {"description":"","type":"number","value":null}, "page-size": {"description":"","type":"number","value":null}, "search-term": {"description":"","type":"string","value":null}, service: {"description":"","type":"string","value":null}, value: {"description":"","type":"object","value":null}, view: {"description":"","type":"string","value":null}} },
    "at-silver-datasource": { attrs: {method: {"description":"","type":"string","value":null}, parameter: {"description":"","type":"string","value":null}, value: {"description":"","type":"object","value":null}} },
    "at-silver-folder": { attrs: {"card-height": {"description":"","type":"string","value":null}, "card-layout": {"description":"","type":"string","value":null}, "file-component": {"description":"","type":"string","value":null}, "folder-component": {"description":"","type":"string","value":null}, gid: {"description":"","type":"string","value":null}, "hide-search-box": {"description":"","type":"boolean","value":null}, page: {"description":"","type":"number","value":null}, "page-size": {"description":"","type":"number","value":null}, "search-placeholder": {"description":"","type":"string","value":null}, "search-term": {"description":"","type":"string","value":null}, service: {"description":"","type":"string","value":null}, value: {"description":"","type":"object","value":null}, view: {"description":"","type":"string","value":null}} },
    "at-silver-form": { attrs: {"auto-app-title": {"description":"","type":"boolean","value":null}, mode: {"description":"","type":"string","value":["c","u","r"]}, "post-mode": {"description":"","type":"string","value":["json","formdata"]}, "record-id": {"description":"","type":"string","value":null}, "redirect-url": {"description":"","type":"string","value":null}, schema: {"description":"","type":"object","value":null}, "schema-url": {"description":"","type":"string","value":null}, "success-message": {"description":"","type":"string","value":null}, url: {"description":"","type":"string","value":null}} },
    "at-silver-item": { attrs: {"auto-app-title": {"description":"","type":"boolean","value":null}, gid: {"description":"","type":"string","value":null}, "item-component": {"description":"","type":"string","value":null}, service: {"description":"","type":"string","value":null}, url: {"description":"","type":"string","value":null}, value: {"description":"","type":"object","value":null}, view: {"description":"","type":"string","value":null}} },
    "at-silver-list": { attrs: {"card-height": {"description":"","type":"string","value":null}, "card-layout": {"description":"","type":"string","value":null}, "hide-search-box": {"description":"","type":"boolean","value":null}, "item-component": {"description":"","type":"string","value":null}, page: {"description":"","type":"number","value":null}, "page-size": {"description":"","type":"number","value":null}, "search-placeholder": {"description":"","type":"string","value":null}, "search-term": {"description":"","type":"string","value":null}, service: {"description":"","type":"string","value":null}, value: {"description":"","type":"object","value":null}, view: {"description":"","type":"string","value":null}} },
    "at-silver-navlist": { attrs: {"card-height": {"description":"","type":"string","value":null}, "card-layout": {"description":"","type":"string","value":null}, "item-component": {"description":"","type":"string","value":null}, navlist: {"description":"","type":"array","value":null}, value: {"description":"","type":"object","value":null}, view: {"description":"","type":"string","value":null}} },
    "at-silver-script": { attrs: {script: {"description":"","type":"string","value":null}, value: {"description":"","type":"string","value":null}} },
    "at-silver-transform": { attrs: {template: {"description":"","type":"string","value":null}, value: {"description":"","type":"string","value":null}} },
    "at-youtube-player": { attrs: {"aspect-ratio": {"description":"","type":"string","value":["4:3","16:9"]}, autoplay: {"description":"","type":"boolean","value":null}, "current-time": {"description":"","type":"number","value":null}, height: {"description":"","type":"string","value":null}, muted: {"description":"","type":"boolean","value":null}, src: {"description":"","type":"string","value":null}, "video-volume": {"description":"","type":"number","value":null}, width: {"description":"","type":"string","value":null}} }
  };

  var globalAttrs = {
    accesskey: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    class: [ "put", "allowed", "classes", "here" ],
    contenteditable: ["true", "false"],
    contextmenu: null,
    dir: ["ltr", "rtl", "auto"],
    draggable: ["true", "false", "auto"],
    dropzone: ["copy", "move", "link", "string:", "file:"],
    hidden: ["hidden"],
    id: null,
    inert: ["inert"],
    itemid: null,
    itemprop: null,
    itemref: null,
    itemscope: ["itemscope"],
    itemtype: null,
    lang: ["en", "es"],
    spellcheck: ["true", "false"],
    style: null,
    tabindex: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    title: null,
    translate: ["yes", "no"],
    onclick: null,
    rel: ["stylesheet", "alternate", "author", "bookmark", "help", "license", "next", "nofollow", "noreferrer", "prefetch", "prev", "search", "tag"]
  };
  function populate(obj) {
    for (var attr in globalAttrs) if (globalAttrs.hasOwnProperty(attr))
      obj.attrs[attr] = globalAttrs[attr];  
  }

  populate(s);
  for (var tag in data) if (data.hasOwnProperty(tag) && data[tag] != s)
    populate(data[tag]);

  CodeMirror.htmlSchema = data;
  function htmlHint(cm, options) {
    var local = {schemaInfo: data};
    if (options) for (var opt in options) local[opt] = options[opt];
    return CodeMirror.hint.carbonxml(cm, local);
  }
  CodeMirror.registerHelper("hint", "html", htmlHint);
});
