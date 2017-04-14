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
  
  // *ij* to update now icons go to at-carbon-icon/now-icons-array.html and copy paste the JSON string over the existing string
  var nowIcons = ["now:about","now:about-filled","now:administration","now:alert","now:ambulance","now:announcement","now:app","now:arrow-down","now:arrow-left","now:arrow-right","now:arrow-up","now:assistant","now:audio","now:birthday","now:blank","now:bold","now:calendar","now:cancel","now:cards","now:caret-down","now:caret-left","now:caret-right","now:caret-up","now:chart","now:chart-bar","now:chart-doughnut","now:chart-line","now:chart-pie","now:checkbox","now:checklist","now:checkmark","now:clock","now:code","now:collapse","now:component","now:contact","now:create-new","now:database","now:delete","now:device-laptop","now:device-phone","now:devices","now:device-tablet","now:directions","now:document","now:download","now:edit","now:end","now:error","now:error-filled","now:excel","now:exchange","now:exit","now:expand","now:faq","now:file","now:filter","now:flash","now:folder","now:form","now:gear","now:generic-text","now:group","now:hash","now:heading","now:help","now:home","now:html","now:html-file","now:image-file","now:inbox","now:info","now:info-filled","now:invoice","now:italic","now:key","now:line-horizontal","now:link","now:list-bullets","now:list-numbered","now:manual","now:map","now:markdown","now:marker","now:menu","now:menu2","now:message","now:micro","now:minus","now:minus-filled","now:more","now:msaccess","now:msproject","now:number","now:onenote","now:password","now:pdf","now:phone","now:picture","now:plane","now:play","now:plus","now:plus-filled","now:powerpoint","now:question","now:questions","now:quote","now:redo","now:restart","now:rewind","now:rss","now:search","now:server-cloud","now:share","now:sharepoint","now:shopping-basket","now:sort-down","now:source-code","now:star","now:star-filled","now:start","now:tag","now:toggle","now:trash","now:undo","now:upload","now:user","now:users","now:video","now:video-call","now:visible","now:warning","now:warning-filled","now:weather","now:word","now:wrench"];
  var s = { attrs: {} };
  
  var data = {
    // *ij* to update at elemenst go to at-elements/index-cm-tag-attr.html and copy paste the items here
    "at-carbon-action-button": { attrs: {disabled: null, xtype: ["submit","cancel"]} },
    "at-carbon-alert": { attrs: {title: null, message: null, "confirm-button": null, "cancel-button": "", opened: null} },
    "at-carbon-button": { attrs: {raised: null, "key-event-target": null, "stop-keyboard-event-propagation": null, pressed: null, toggles: null, active: null, "pointer-down": null, "received-focus-from-keyboard": null, "aria-active-attribute": null, focused: null, disabled: null, elevation: null} },
    "at-carbon-clamp": { attrs: {text: null, lines: null} },
    "at-carbon-collapse": { attrs: {"icon-position": ["left","right","right-justified"], title: null, content: null, opened: false} },
    "at-carbon-date-picker": { attrs: {mode: ["single","start-range","end-range"], "start-date": null, "end-date": null} },
    "at-carbon-dialog": { attrs: {"sizing-target": null, "fit-into": null, "no-overlap": null, "position-target": null, "horizontal-align": null, "vertical-align": null, "dynamic-align": null, "horizontal-offset": null, "vertical-offset": null, "auto-fit-on-attach": null, opened: null, canceled: null, "with-backdrop": null, "no-auto-focus": null, "no-cancel-on-esc-key": null, "no-cancel-on-outside-click": null, "closing-reason": null, "restore-focus-on-close": null, "always-on-top": null, modal: null, "animation-config": null, "entry-animation": null, "exit-animation": null} },
    "at-carbon-empty-state": { attrs: {icon: null, html: null} },
    "at-carbon-icon": { attrs: {src: null, icon: null, theme: null} },
    "at-carbon-icon-button": { attrs: {icon: null, alt: null, disabled: null, color: null, "key-event-target": null, "stop-keyboard-event-propagation": null, pressed: null, toggles: null, active: null, "pointer-down": null, "received-focus-from-keyboard": null, "aria-active-attribute": null, focused: null, noink: null} },
    "at-carbon-icon-color": { attrs: {icon: null, color: null} },
    "at-carbon-menu": { attrs: {items: null, value: null, "item-view": null} },
    "at-carbon-menu-button": { attrs: {position: ["topLeft","topRight","bottomLeft","bottomRight"], icon: null, items: null, value: null, "item-view": null, "x-offset": null, "y-offset": null, color: null} },
    "at-carbon-message": { attrs: {type: ["warning","info","error","success"], html: null} },
    "at-carbon-moment": { attrs: {"auto-refresh": null, "auto-refresh-rate": null, "default-auto-refresh-rate": null, datetime: null, format: null, formats: null, "from-now": null, language: null, "no-suffix": null, strict: null, "unix-offset": null, "unix-timestamp": null, utc: null, ago: null, "interval-id": null, moment: null} },
    "at-carbon-pager": { attrs: {page: null, "page-size": null, "item-count": null, hide: null} },
    "at-carbon-popup": { attrs: {halign: null, valign: null, "force-align": null, spacing: null} },
    "at-carbon-popup-content": { attrs: {dragging: null, "is-open": null, "is-narrow": null} },
    "at-carbon-progress": { attrs: {max: null, value: null} },
    "at-carbon-resolver": { attrs: {"model-root": null, value: null, "item-root": null} },
    "at-carbon-signal-button": { attrs: {disabled: null, signal: null, "signal-data": null} },
    "at-carbon-tab": { attrs: {} },
    "at-carbon-tabs": { attrs: {nobar: null, noslide: null, scrollable: null, "disable-drag": null, "hide-scroll-button": null, "align-bottom": null, selected: null} },
    "at-carbon-time-picker": { attrs: {value: null} },
    "at-carbon-tree": { attrs: {data: null, value: null, actions: null} },
    "at-carbon-tree-node": { attrs: {data: null, actions: null} },
    "at-carbon-video": { attrs: {controls: null, autoplay: null, loop: null, src: null, thumbnail: null, preload: null, muted: null, "video-volume": null, "autohide-controls": null, width: null, height: null, "current-time": null, "aspect-ratio": ["4:3","16:9"]} },
    "at-chart-core": { attrs: {charttype: ["bar","line","pie","donut","spline","step","area","area-spline","default"], gridlines: ["none","y","x","xy"], legendposition: ["none","bottom","right","inset"], tooltip: ["none","default","grouped"], c3chart: null, data: null} },
    "at-chart-inline": { attrs: {"chart-type": ["line","pie"], "data-column": null, data: null, "pixels-per-data-point": null, "color-scheme": ["category10","category20","category20b","category20c","google10c","google20c"], hide: null} },
    "at-chart-strudel": { attrs: {"color-scheme": ["category10","category20","category20b","category20c","google10c","google20c"], data: null, "model-root": null} },
    "at-core-activity": { attrs: {url: null, params: null, method: null, headers: null, "content-type": null, body: null, sync: null, "handle-as": null, "with-credentials": null, "no-credentials": null, indicator: null, auto: null, "disable-authorization": null, verbose: null, loading: null, "last-request": null, "last-response": null, "last-error": null, "active-requests": null} },
    "at-core-busy": { attrs: {type: null} },
    "at-core-card": { attrs: {removing: null, swipeable: null, "no-curve": null, sort: null, "offset-ratio": null, "width-ratio": null} },
    "at-core-cardlayout": { attrs: {"card-layout-data": null} },
    "at-core-cardlayout-desktop": { attrs: {"card-layout-data": null, "card-layout-pos": null, "card-layout-timeout": null} },
    "at-core-cardlayout-mobile": { attrs: {"card-layout-data": null, "card-layout-pos": null, "card-layout-timeout": null} },
    "at-core-cardlist": { attrs: {items: null, "item-component": null, "card-width": null, layout: null, view: null, indicator: null, "empty-list": null} },
    "at-core-dashboard-echo": { attrs: {template: null, "model-root": null} },
    "at-core-dframe": { attrs: {src: null, "device-type": ["iphone5s_silver","iphone6_black","iphone6_silver","ipad_silver","nexus5","macbook"], orientation: ["portrait","landscape"], "max-width": null, "max-height": null} },
    "at-core-dropdown": { attrs: {position: ["topLeft","topRight","bottomLeft","bottomRight"], "x-offset": null, "y-offset": null} },
    "at-core-form": { attrs: {schema: null, data: null, files: null, disabled: null, hide: null, layout: ["horizontal","vertical"], "section-mode": ["sections","tabs","auto","mobile"], "active-tab": null} },
    "at-core-iframe": { attrs: {accesskey: null, contenteditable: null, contextmenu: null, dir: null, draggable: null, hidden: null, lang: null, spellcheck: null, tabindex: null, title: null, src: null, sandbox: ["","allow-same-origin","allow-top-navigation","allow-forms","allow-scripts"], width: null, height: null, frameborder: ["0","1"], "allow-fullscreen": null, scrolling: ["auto","yes","no"]} },
    "at-core-item": { attrs: {value: null, "item-component": null, view: null} },
    "at-core-list": { attrs: {items: null, "item-component": null, "card-width": null, "card-height": null, layout: ["card","list"], view: null, indicator: null, height: null, "empty-list": null} },
    "at-core-markdown": { attrs: {text: null} },
    "at-core-media-query": { attrs: {"query-matches": null, query: null, full: null} },
    "at-core-mic": { attrs: {recognition: null, language: null, transcript: null, "complete-transcript": null} },
    "at-core-modal": { attrs: {"min-width": null} },
    "at-core-pdf": { attrs: {src: null, "aspect-ratio": ["a4","letter","4:3","16:9"]} },
    "at-core-propform": { attrs: {"element-instance": null, value: null, mode: ["default","designer"], hide: null, "title-mode": ["title","propertyName"]} },
    "at-core-resize-sensor": { attrs: {} },
    "at-core-router": { attrs: {"default-view": null, "primary-color": null, "default-color": null, caption: null, "enable-back": null, context: null} },
    "at-core-searchbox": { attrs: {"search-term": null, placeholder: null, language: null, icon: null, "type-write": null} },
    "at-core-signals": { attrs: {} },
    "at-core-sortable": { attrs: {group: null, sort: null, disabled: null, store: null, handle: null, "scroll-sensitivity": null, "scroll-speed": null, "ghost-class": null, "chosen-class": null, ignore: null, filter: null, animation: null, "drop-bubble": null, "dragover-bubble": null, "data-id-attr": null, delay: null, "force-fallback": null, "fallback-class": null, "fallback-on-body": null, draggable: null, scroll: null} },
    "at-core-spinner": { attrs: {display: null, type: null} },
    "at-core-splitter": { attrs: {direction: null, "min-size": null, locked: null, "allow-overflow": null} },
    "at-core-theme": { attrs: {theme: null} },
    "at-core-video": { attrs: {tabindex: null, controls: null, autoplay: null, loop: null, src: null, thumbnail: null, preload: null, muted: null, "video-volume": null, "autohide-controls": null, width: null, height: null, "current-time": null} },
    "at-core-view": { attrs: {model: null, value: null, view: null, placeholder: null, "model-root": null} },
    "at-doc-demo": { attrs: {url: null, auto: null, hide: null} },
    "at-doc-parser": { attrs: {url: null, value: null} },
    "at-doc-snippet": { attrs: {snippet: null} },
    "at-doc-viewer": { attrs: {url: null, auto: null, readme: null} },
    "at-elements-catalog": { attrs: {catalog: null} },
    "at-form": { attrs: {schema: null, data: null, url: null, layout: null} },
    "at-form-ajax": { attrs: {url: null, "schema-url": null, schema: null, "record-id": null, mode: ["c","u","r"], "post-mode": ["json","formdata"]} },
    "at-form-array": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, schema: null, value: null, layout: ["vertical","horizontal"], "error-message": null, hint: null, "auto-validate": null} },
    "at-form-checkbox": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, value: null, xtype: ["","toggle"], "error-message": null, hint: null, "auto-validate": null} },
    "at-form-codemirror": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, "max-chars": null, value: null, "max-lines": null, mode: ["htmlmixed","carbon","javascript","css","markdown","sql","xml","liquid","application/json","yaml"], theme: ["default","carbon"], "tab-size": null, "no-line-numbers": null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-complex": { attrs: {label: null, "hide-label": null, schema: null, value: null, disabled: null, hide: null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-cron": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, value: null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-date": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, format: null, value: null, xtype: ["date","time","datetime"], "error-message": null, hint: null, "auto-validate": null} },
    "at-form-daterange": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, format: null, "start-date": null, "end-date": null, value: null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-file": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, value: null, files: null, "min-size": null, "max-size": null, icon: null, accept: null, extensions: null, "max-files": null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-html": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, "max-chars": null, value: null, placeholder: null, formats: null, theme: ["snow","bubble"], "ops-mode": null, "toolbar-mode": ["default","full"], "error-message": null, hint: null, "auto-validate": null} },
    "at-form-image": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, value: null, files: null, "min-size": null, "max-size": null, icon: null, accept: null, extensions: null, "max-files": null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-input": { attrs: {value: null, "hide-label": null, valid: null, required: null, disabled: null, name: null, type: null, label: null, placeholder: null, hide: null} },
    "at-form-lookup": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, available: null, xvaluelist: null, enum: null, value: null, "initial-search-term": null, "selected-items": null, "no-credentials": null, "no-preload": null, url: null, xurl: null, params: null, "allow-new-items": null, "max-items": null, "item-view": null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-markdown": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, value: null, "inline-attachment-extra-params": null, "inline-attachment-upload-url": null, "inline-attachment-json-field-name": null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-number": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, value: null, placeholder: null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-password": { attrs: {label: null, "hide-label": null, placeholder: null, disabled: null, hide: null, required: null, value: null, "max-chars": null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-radio": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, value: null, xvaluelist: null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-ruleset": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, "rule-config": null, value: null} },
    "at-form-section": { attrs: {label: null, "hide-label": null, hide: null} },
    "at-form-state": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, value: null, xvaluelist: null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-static": { attrs: {label: null, "hide-label": null, hide: null, value: null} },
    "at-form-text": { attrs: {label: null, "hide-label": null, placeholder: null, disabled: null, hide: null, required: null, value: null, "max-chars": null, "error-message": null, hint: null, "auto-validate": null} },
    "at-form-textarea": { attrs: {label: null, "hide-label": null, disabled: null, hide: null, required: null, value: null, "max-chars": null, "max-lines": null, "initial-lines": null, "autogrow-line-limit": null, "error-message": null, hint: null, "auto-validate": null} },
    "at-journey": { attrs: {"item-component": null, view: null, "cards-refresh": null, url: null, "type-write": null, "device-type": ["","iphone5s_silver","iphone6_black","iphone6_silver","ipad_silver","nexus5","macbook"], orientation: ["","portrait","landscape"]} },
    "at-link": { attrs: {href: null, xref: null, signal: null, "signal-data": null} },
    "at-map-google": { attrs: {"api-key": null, "client-id": null, "disable-default-ui": null, "disable-map-type-control": null, "disable-street-view-control": null, "disable-zoom": null, "fit-to-markers": null, latitude: null, longitude: null, "map-type": ["roadmap","satellite","hybrid","terrain"], markers: null, hide: null} },
    "at-rule-actions": { attrs: {schema: null, config: null, value: null, disabled: null, label: null, "hide-label": null} },
    "at-rule-conditions": { attrs: {schema: null, config: null, value: null, disabled: null, label: null, "hide-label": null} },
    "at-rule-edit": { attrs: {schema: null, "rule-config": null, value: null, disabled: null} },
    "at-silver-cards": { attrs: {"search-term": null, service: null, page: null, "page-size": null, "item-component": null, "hide-search-box": null, "card-layout": null, view: null, value: null} },
    "at-silver-datasource": { attrs: {parameter: null, method: null, value: null} },
    "at-silver-folder": { attrs: {"search-term": null, "search-placeholder": null, service: null, page: null, "page-size": null, "file-component": null, "folder-component": null, "hide-search-box": null, "card-layout": ["card","list"], "card-height": null, view: null, gid: null, value: null} },
    "at-silver-form": { attrs: {url: null, "schema-url": null, schema: null, "record-id": null, "success-message": null, "redirect-url": null, "auto-app-title": null, mode: ["c","u","r"], "post-mode": ["json","formdata"]} },
    "at-silver-item": { attrs: {url: null, service: null, gid: null, "item-component": null, view: null, value: null, "auto-app-title": null} },
    "at-silver-list": { attrs: {"search-term": null, "search-placeholder": null, service: null, page: null, "page-size": null, "item-component": null, "hide-search-box": null, "card-layout": ["card","list"], "card-height": null, view: null, value: null} },
    "at-silver-navlist": { attrs: {"item-component": null, "card-layout": ["card","list"], "card-height": null, view: null, value: null, navlist: null} },
    "at-silver-script": { attrs: {script: null, value: null} },
    "at-silver-transform": { attrs: {template: null, value: null} },
    "at-youtube-player": { attrs: {src: null, autoplay: null, muted: null, "video-volume": null, width: null, height: null, "current-time": null, "aspect-ratio": ["4:3","16:9"]} }
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

    if (obj.attrs.hasOwnProperty('icon')) {
      obj.attrs['icon'] = nowIcons;
    }
  }

  populate(s);
  for (var tag in data) if (data.hasOwnProperty(tag) && data[tag] != s)
    populate(data[tag]);

  CodeMirror.htmlSchema = data;
  function tangereHint(cm, options) {
    var local = {schemaInfo: data};
    if (options) for (var opt in options) local[opt] = options[opt];
    return CodeMirror.hint.carbonxml(cm, local);
  }

  var existingHtmlHintFn = null;
  function combinedHtmlAndTangereHint(cm, options) {
    var final = undefined;
    var result = [];
    if (existingHtmlHintFn) {
      result = existingHtmlHintFn(cm, options);
    }

    var tangereResult = tangereHint(cm, options);

    if (result) {
      final = result;
    }

    if (tangereResult && !result) {
      final = tangereResult;
    } else if (tangereResult && result) {
      final = result;
      final.list = tangereResult.list.concat(result.list);
    }
    
    return final;
  }

  if (CodeMirror.helpers.hint.hasOwnProperty('html')) {
    existingHtmlHintFn = CodeMirror.helpers.hint.html;

    CodeMirror.registerHelper("hint", "html", combinedHtmlAndTangereHint);
  } else {
    CodeMirror.registerHelper("hint", "html", tangereHint);  
  }


});
