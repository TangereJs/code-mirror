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
    "at-carbon-action-button": { attrs: {disabled: false, xtype: ["submit","cancel"]} },
    "at-carbon-alert": { attrs: {title: null, message: null, "confirm-button": "Ok", "cancel-button": "", opened: null} },
    "at-carbon-button": { attrs: {raised: false, "key-event-target": null, "stop-keyboard-event-propagation": false, pressed: false, toggles: false, active: false, "pointer-down": false, "received-focus-from-keyboard": null, "aria-active-attribute": "aria-pressed", focused: false, disabled: false, elevation: null} },
    "at-carbon-clamp": { attrs: {text: "", lines: 1} },
    "at-carbon-collapse": { attrs: {"icon-position": ["left","right","right-justified"], title: "", content: "", opened: false} },
    "at-carbon-date-picker": { attrs: {mode: ["single","start-range","end-range"], "start-date": "", "end-date": ""} },
    "at-carbon-dialog": { attrs: {"sizing-target": null, "fit-into": null, "no-overlap": null, "position-target": null, "horizontal-align": null, "vertical-align": null, "dynamic-align": null, "horizontal-offset": 0, "vertical-offset": 0, "auto-fit-on-attach": false, opened: false, canceled: false, "with-backdrop": null, "no-auto-focus": false, "no-cancel-on-esc-key": false, "no-cancel-on-outside-click": false, "closing-reason": null, "restore-focus-on-close": false, "always-on-top": null, modal: false, "animation-config": null, "entry-animation": null, "exit-animation": null} },
    "at-carbon-empty-state": { attrs: {icon: "now:error", html: ""} },
    "at-carbon-icon": { attrs: {src: "", icon: "", theme: ""} },
    "at-carbon-icon-button": { attrs: {icon: null, alt: null, disabled: false, color: "", "key-event-target": null, "stop-keyboard-event-propagation": false, pressed: false, toggles: false, active: false, "pointer-down": false, "received-focus-from-keyboard": null, "aria-active-attribute": "aria-pressed", focused: false, noink: null} },
    "at-carbon-icon-color": { attrs: {icon: "", color: "blue"} },
    "at-carbon-menu": { attrs: {items: null, value: "", "item-view": "<div>{{title}}</div>"} },
    "at-carbon-menu-button": { attrs: {position: ["topLeft","topRight","bottomLeft","bottomRight"], items: null, value: ""} },
    "at-carbon-message": { attrs: {type: "warning", html: ""} },
    "at-carbon-moment": { attrs: {"auto-refresh": 0, "auto-refresh-rate": 0, "default-auto-refresh-rate": 60, datetime: "", format: "", formats: [], "from-now": false, language: "", "no-suffix": false, strict: false, "unix-offset": 0, "unix-timestamp": 0, utc: false, ago: false, "interval-id": 0, moment: {}} },
    "at-carbon-pager": { attrs: {page: 1, "page-size": 0, "item-count": 0, hide: false} },
    "at-carbon-popup": { attrs: {halign: "left", valign: "bottom", "force-align": false, spacing: {"top":12,"bottom":12,"left":0,"right":0}} },
    "at-carbon-popup-content": { attrs: {dragging: false, "is-open": false, "is-narrow": false} },
    "at-carbon-progress": { attrs: {max: 100, value: 0} },
    "at-carbon-resolver": { attrs: {"model-root": "", value: null, "item-root": ""} },
    "at-carbon-signal-button": { attrs: {disabled: false, signal: "", "signal-data": ""} },
    "at-carbon-tab": { attrs: {} },
    "at-carbon-tabs": { attrs: {nobar: false, noslide: false, scrollable: false, "disable-drag": false, "hide-scroll-button": false, "align-bottom": false, selected: null} },
    "at-carbon-time-picker": { attrs: {value: ""} },
    "at-carbon-tree": { attrs: {data: null, value: null, actions: null} },
    "at-carbon-tree-node": { attrs: {data: null, actions: null} },
    "at-carbon-video": { attrs: {controls: false, autoplay: false, loop: false, src: "", thumbnail: "", preload: false, muted: false, "video-volume": 100, "autohide-controls": 1000, width: null, height: null, "current-time": 0, "aspect-ratio": ["4:3","16:9"]} },
    "at-chart-core": { attrs: {charttype: "line", gridlines: "none", legendposition: "none", tooltip: "default", c3chart: {}, data: {}} },
    "at-chart-inline": { attrs: {"chart-type": ["line","pie"], "data-column": "", data: {"columns":[["demo",1,2,3,4,5,5,5,5,5,5,5,5,5,5]]}, "pixels-per-data-point": 5, "color-scheme": "category10", hide: false} },
    "at-chart-strudel": { attrs: {"color-scheme": "category10", data: {"columns":[["Taken",6],["Planned",2],["Open",2]]}, "model-root": ""} },
    "at-core-activity": { attrs: {url: "", params: {}, method: "GET", headers: {}, "content-type": "application/x-www-form-urlencoded", body: "", sync: false, "handle-as": "json", "with-credentials": false, "no-credentials": false, indicator: false, auto: false, "disable-authorization": false, verbose: false, loading: null, "last-request": null, "last-response": null, "last-error": null, "active-requests": null} },
    "at-core-busy": { attrs: {type: "spinner"} },
    "at-core-card": { attrs: {removing: true, swipeable: false, "no-curve": true, sort: "", "offset-ratio": 0.2, "width-ratio": 1.2} },
    "at-core-cardlayout": { attrs: {"card-layout-data": ""} },
    "at-core-cardlayout-desktop": { attrs: {"card-layout-data": "", "card-layout-pos": "", "card-layout-timeout": null} },
    "at-core-cardlayout-mobile": { attrs: {"card-layout-data": "", "card-layout-pos": "", "card-layout-timeout": null} },
    "at-core-cardlist": { attrs: {items: null, "item-component": "", "card-width": 320, layout: "card", view: "", indicator: false, "empty-list": "No data found"} },
    "at-core-dashboard-echo": { attrs: {template: "", "model-root": ""} },
    "at-core-dframe": { attrs: {src: "", "device-type": ["iphone5s_silver","iphone6_black","iphone6_silver","ipad_silver","nexus5","macbook"], orientation: ["portrait","landscape"], "max-width": 0, "max-height": 0} },
    "at-core-dropdown": { attrs: {position: ["topLeft","topRight","bottomLeft","bottomRight"]} },
    "at-core-form": { attrs: {schema: {"properties":{}}, data: {}, files: {}, disabled: false, hide: false, layout: ["horizontal","vertical"], "section-mode": ["sections","tabs","auto","mobile"], "active-tab": ""} },
    "at-core-iframe": { attrs: {accesskey: "", contenteditable: false, contextmenu: "", dir: "ltr", draggable: false, hidden: false, lang: "en", spellcheck: false, tabindex: -1, title: "", src: "", sandbox: ["","allow-same-origin","allow-top-navigation","allow-forms","allow-scripts"], width: "100%", height: "100%", frameborder: ["0","1"], "allow-fullscreen": false, scrolling: ["auto","yes","no"]} },
    "at-core-item": { attrs: {value: null, "item-component": "", view: ""} },
    "at-core-list": { attrs: {items: null, "item-component": "", "card-width": "320", "card-height": "", layout: ["card","list"], view: "", indicator: false, height: "120px", "empty-list": "No data found"} },
    "at-core-markdown": { attrs: {text: ""} },
    "at-core-media-query": { attrs: {"query-matches": false, query: null, full: false} },
    "at-core-mic": { attrs: {recognition: {}, language: "en-US", transcript: "", "complete-transcript": ""} },
    "at-core-modal": { attrs: {"min-width": "600"} },
    "at-core-pdf": { attrs: {src: "", "aspect-ratio": ["a4","letter","4:3","16:9"]} },
    "at-core-propform": { attrs: {"element-instance": {}, value: {}, mode: ["default","designer"], hide: false, "title-mode": ["title","propertyName"]} },
    "at-core-resize-sensor": { attrs: {} },
    "at-core-router": { attrs: {"default-view": "at-app/at-home", "primary-color": "", "default-color": "lightGreen", caption: "", "enable-back": false, context: null} },
    "at-core-searchbox": { attrs: {"search-term": "", placeholder: "", language: "en-US", icon: "search", "type-write": ""} },
    "at-core-signals": { attrs: {} },
    "at-core-sortable": { attrs: {group: null, sort: true, disabled: false, store: null, handle: null, "scroll-sensitivity": 30, "scroll-speed": 10, "ghost-class": "sortable-ghost", "chosen-class": "sortable-chosen", ignore: "a, img", filter: null, animation: 0, "drop-bubble": false, "dragover-bubble": false, "data-id-attr": "data-id", delay: 0, "force-fallback": false, "fallback-class": "sortable-fallback", "fallback-on-body": false, draggable: null, scroll: null} },
    "at-core-spinner": { attrs: {display: "block", type: "spinner"} },
    "at-core-splitter": { attrs: {direction: "left", "min-size": "", locked: false, "allow-overflow": false} },
    "at-core-theme": { attrs: {theme: "carbon"} },
    "at-core-video": { attrs: {tabindex: 0, controls: false, autoplay: false, loop: false, src: "", thumbnail: "", preload: false, muted: false, "video-volume": 100, "autohide-controls": 1000, width: null, height: null, "current-time": 0} },
    "at-core-view": { attrs: {model: null, value: null, view: null, placeholder: "<div class='m'> <div class='placeholder-text'></div><div class='placeholder-text mtsm'></div></div>", "model-root": ""} },
    "at-doc-demo": { attrs: {url: "", auto: false, hide: false} },
    "at-doc-parser": { attrs: {url: "", value: ""} },
    "at-doc-snippet": { attrs: {snippet: ""} },
    "at-doc-viewer": { attrs: {url: "", auto: false, readme: false} },
    "at-elements-catalog": { attrs: {catalog: null} },
    "at-form": { attrs: {schema: {}, data: {}, url: "", layout: "vertical"} },
    "at-form-ajax": { attrs: {url: "", "schema-url": "", schema: null, "record-id": "", mode: ["c","u","r"], "post-mode": ["json","formdata"]} },
    "at-form-array": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, schema: {"items":{"properties":{"value":{"type":"string","title":"Value"}}}}, value: null, layout: "horizontal", "error-message": "", hint: "", "auto-validate": false} },
    "at-form-checkbox": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, value: false, xtype: ["","toggle"], "error-message": "", hint: "", "auto-validate": false} },
    "at-form-codemirror": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, "max-chars": 0, value: "", "max-lines": 14, mode: ["htmlmixed","javascript","css","markdown","sql","xml","liquid","application/json","yaml"], theme: ["ambiance","blackboard","carbon","cobalt","eclipse","elegant","erlang-dark","lesser-dark","midnight","monokai","neat","night","rubyblue","solarized","twilight","vibrant-ink","xq-dark","xq-light"], "tab-size": 2, "no-line-numbers": false, "error-message": "", hint: "", "auto-validate": false} },
    "at-form-complex": { attrs: {label: "", "hide-label": false, schema: {"properties":{}}, value: {}, disabled: false, hide: false, "error-message": "", hint: "", "auto-validate": false} },
    "at-form-cron": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, value: "", "error-message": "", hint: "", "auto-validate": false} },
    "at-form-date": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, format: "", value: "", xtype: ["date","time","datetime"], "error-message": "", hint: "", "auto-validate": false} },
    "at-form-daterange": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, format: "", "start-date": "", "end-date": "", value: "", "error-message": "", hint: "", "auto-validate": false} },
    "at-form-file": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, value: {"invalid":{"count":0},"valid":[],"current":[],"deleted":[]}, files: null, "min-size": 0, "max-size": 0, icon: "picture", accept: "", extensions: "", "max-files": 1, "error-message": "", hint: "", "auto-validate": false} },
    "at-form-html": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, "max-chars": 0, value: "", placeholder: null, formats: null, theme: ["snow","bubble"], "ops-mode": false, "toolbar-mode": ["default","full"], "error-message": "", hint: "", "auto-validate": false} },
    "at-form-image": { attrs: {label: "Select an image", "hide-label": false, disabled: false, hide: false, required: false, value: {"invalid":{"count":0},"valid":[]}, files: null, "min-size": 0, "max-size": 0, icon: "picture", accept: "", extensions: "[\"png\",\"jpeg\",\"jpg\",\"gif\"]", "max-files": 0, "error-message": "", hint: "", "auto-validate": false} },
    "at-form-input": { attrs: {value: "", "hide-label": false, valid: true, required: false, disabled: false, name: "", type: "text", label: "", placeholder: "", hide: false} },
    "at-form-lookup": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, available: "", xvaluelist: null, enum: null, value: "", "initial-search-term": "", "selected-items": null, "no-credentials": false, "no-preload": false, url: "", xurl: "", params: "", "allow-new-items": false, "max-items": 1, "item-view": null, "error-message": "", hint: "", "auto-validate": false} },
    "at-form-markdown": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, value: "", "inline-attachment-extra-params": {}, "inline-attachment-upload-url": "", "inline-attachment-json-field-name": "", "error-message": "", hint: "", "auto-validate": false} },
    "at-form-number": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, value: "", placeholder: "", "error-message": "", hint: "", "auto-validate": false} },
    "at-form-password": { attrs: {label: "", "hide-label": false, placeholder: "", disabled: false, hide: false, required: false, value: "", "max-chars": 0, "error-message": "", hint: "", "auto-validate": false} },
    "at-form-radio": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, value: "", xvaluelist: null, "error-message": "", hint: "", "auto-validate": false} },
    "at-form-ruleset": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, "rule-config": {}, value: null} },
    "at-form-section": { attrs: {label: "", "hide-label": false, hide: false} },
    "at-form-state": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, value: "", xvaluelist: null, "error-message": "", hint: "", "auto-validate": false} },
    "at-form-static": { attrs: {label: "", "hide-label": false, hide: false, value: ""} },
    "at-form-text": { attrs: {label: "", "hide-label": false, placeholder: "", disabled: false, hide: false, required: false, value: "", "max-chars": 0, "error-message": "", hint: "", "auto-validate": false} },
    "at-form-textarea": { attrs: {label: "", "hide-label": false, disabled: false, hide: false, required: false, value: "", "max-chars": 0, "max-lines": 0, "initial-lines": 4, "autogrow-line-limit": 6, "error-message": "", hint: "", "auto-validate": false} },
    "at-journey": { attrs: {"item-component": "", view: "", "cards-refresh": "", url: "#!at-now/start-now", "type-write": "", "device-type": ["","iphone5s_silver","iphone6_black","iphone6_silver","ipad_silver","nexus5","macbook"], orientation: ["","portrait","landscape"]} },
    "at-link": { attrs: {href: "", xref: "", signal: "", "signal-data": ""} },
    "at-map-google": { attrs: {"api-key": "", "client-id": "", "disable-default-ui": false, "disable-map-type-control": false, "disable-street-view-control": false, "disable-zoom": false, "fit-to-markers": false, latitude: 37.77493, longitude: -122.41942, "map-type": ["roadmap","satellite","hybrid","terrain"], markers: null, hide: false} },
    "at-rule-actions": { attrs: {schema: {}, config: {}, value: null, disabled: false, label: "Do these actions...", "hide-label": false} },
    "at-rule-conditions": { attrs: {schema: {}, config: null, value: {"kind":"all","conditions":[]}, disabled: false, label: "When these conditions are met ...", "hide-label": false} },
    "at-rule-edit": { attrs: {schema: {}, "rule-config": {"conditions":[],"actions":{}}, value: {"conditions":{"kind":"all","conditions":[]},"actions":[]}, disabled: false} },
    "at-silver-cards": { attrs: {"search-term": "", service: "", page: 1, "page-size": 18, "item-component": "", "hide-search-box": false, "card-layout": "card", view: "", value: null} },
    "at-silver-datasource": { attrs: {parameter: "", method: "GET", value: null} },
    "at-silver-folder": { attrs: {"search-term": "", "search-placeholder": "", service: "", page: 1, "page-size": 18, "file-component": "", "folder-component": "", "hide-search-box": false, "card-layout": ["card","list"], "card-height": "100px", view: "", gid: "", value: null} },
    "at-silver-form": { attrs: {url: "", "schema-url": "", schema: null, "record-id": "", "success-message": "", "redirect-url": "#!at-now/start-now", "auto-app-title": false, mode: ["c","u","r"], "post-mode": ["json","formdata"]} },
    "at-silver-item": { attrs: {url: "/api/adenin.GateKeeper.Connector/", service: "", gid: "", "item-component": "", view: "", value: null, "auto-app-title": false} },
    "at-silver-list": { attrs: {"search-term": "", "search-placeholder": "", service: "", page: 1, "page-size": 18, "item-component": "", "hide-search-box": false, "card-layout": ["card","list"], "card-height": "100px", view: "", value: null} },
    "at-silver-navlist": { attrs: {"item-component": "", "card-layout": ["card","list"], "card-height": "100px", view: "", value: null, navlist: null} },
    "at-silver-script": { attrs: {script: "", value: ""} },
    "at-silver-transform": { attrs: {template: "", value: ""} },
    "at-youtube-player": { attrs: {src: "", autoplay: false, muted: false, "video-volume": 100, width: null, height: null, "current-time": 0, "aspect-ratio": ["4:3","16:9"]} }
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
    return CodeMirror.hint.liquidxml(cm, local);
  }
  CodeMirror.registerHelper("hint", "html", htmlHint);
});
