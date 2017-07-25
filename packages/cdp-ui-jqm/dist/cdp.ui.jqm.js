﻿/*!
 * cdp.ui.jqm.js 2.0.0
 *
 * Date: 2017-07-25T09:12:06.236Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["cdp.framework.jqm", "cdp.tools", "cdp.ui.listview"], function () { return factory(root.CDP || (root.CDP = {})); }); } else { factory(root.CDP || (root.CDP = {})); } }(this, function (CDP) { CDP.UI = CDP.UI || {};
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Config = CDP.Config;
        var Framework = CDP.Framework;
        var TAG = "[CDP.UI.Theme] ";
        //__________________________________________________________________________________________________________//
        /**
         * @class Theme
         * @brief UI Theme 設定を行うユーティリティクラス
         */
        var Theme = (function () {
            function Theme() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static methods:
            /**
             * Theme の初期化
             *
             * @param options オプション指定
             * @returns true: 成功 / false: 失敗
             */
            Theme.initialize = function (options) {
                var opt = $.extend({}, {
                    platform: "auto",
                    reserveScrollbarRegion: true,
                }, options);
                if ("auto" === opt.platform) {
                    return Theme.detectUIPlatform(opt.reserveScrollbarRegion);
                }
                else {
                    if (Theme.setCurrentUIPlatform(opt.platform)) {
                        return opt.platform;
                    }
                    else {
                        console.warn(TAG + "setCurrentUIPlatform(), failed. platform: " + opt.platform);
                    }
                }
            };
            /**
             * 現在指定されている UI Platform を取得
             *
             * @return {String} ex) "ios"
             */
            Theme.getCurrentUIPlatform = function () {
                var $htms = $("html");
                for (var i = 0, n = Theme.s_platforms.length; i < n; i++) {
                    if ($htms.hasClass("ui-platform-" + Theme.s_platforms[i])) {
                        return Theme.s_platforms[i];
                    }
                }
                return null;
            };
            /**
             * UI Platform を設定
             *
             * @return {String} true: 成功 / false: 失敗
             */
            Theme.setCurrentUIPlatform = function (platform) {
                if (null == platform || Theme.s_platforms.indexOf(platform) >= 0) {
                    var $htms_1 = $("html");
                    Theme.s_platforms.forEach(function (target) {
                        $htms_1.removeClass("ui-platform-" + target);
                    });
                    if (platform) {
                        $htms_1.addClass("ui-platform-" + platform);
                    }
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
             * 現在の Platform を判定し最適な platform を自動決定
             *
             * @param reserveScrollbarRegion PC デバッグ環境ではスクロールバーを表示. default: true
             * @returns ex) "ios"
             */
            Theme.detectUIPlatform = function (reserveScrollbarRegion) {
                if (reserveScrollbarRegion === void 0) { reserveScrollbarRegion = true; }
                var platform = "";
                // platform の設定
                if (Framework.Platform.iOS) {
                    $("html").addClass("ui-platform-ios");
                    platform = "ios";
                }
                else {
                    $("html").addClass("ui-platform-android");
                    platform = "android";
                }
                // PC デバッグ環境ではスクロールバーを表示
                if (Config.DEBUG && reserveScrollbarRegion && !Framework.Platform.Mobile) {
                    $("body").css("overflow-y", "scroll");
                }
                return platform;
            };
            /**
             * platform を配列で登録
             * 上書きされる
             *
             * @param {String[]} platforms [in] OS ex): ["ios", "android"]
             */
            Theme.registerUIPlatforms = function (platforms) {
                if (platforms) {
                    Theme.s_platforms = platforms;
                }
            };
            /**
             * page transition を登録
             * 上書きされる
             *
             * @param {TransitionMap} map [in] TransitionMap を指定
             */
            Theme.registerPageTransitionMap = function (map) {
                if (map) {
                    Theme.s_pageTransitionMap = map;
                }
            };
            /**
             * dialog transition を登録
             * 上書きされる
             *
             * @param {TransitionMap} map [in] TransitionMap を指定
             */
            Theme.registerDialogTransitionMap = function (map) {
                if (map) {
                    Theme.s_dialogTransitionMap = map;
                }
            };
            /**
             * page transition を取得
             * TransitionMap にアサインされているものであれば変換
             *
             * @return {String[]} "slide"
             */
            Theme.queryPageTransition = function (original) {
                var convert = Theme.s_pageTransitionMap[original];
                if (convert) {
                    return convert[Theme.getCurrentUIPlatform()] || convert.fallback;
                }
                else {
                    return original;
                }
            };
            /**
             * dialog transition を取得
             * TransitionMap にアサインされているものであれば変換
             *
             * @return {String[]} "slide"
             */
            Theme.queryDialogTransition = function (original) {
                var convert = Theme.s_dialogTransitionMap[original];
                if (convert) {
                    return convert[Theme.getCurrentUIPlatform()] || convert.fallback;
                }
                else {
                    return original;
                }
            };
            Theme.s_platforms = ["ios", "android"];
            Theme.s_pageTransitionMap = {
                "platform-default": {
                    ios: "slide",
                    android: "floatup",
                    fallback: "slide",
                },
                "platform-alternative": {
                    ios: "slideup",
                    android: "floatup",
                    fallback: "slideup",
                },
            };
            Theme.s_dialogTransitionMap = {
                "platform-default": {
                    ios: "popzoom",
                    android: "crosszoom",
                    fallback: "none",
                },
            };
            return Theme;
        }());
        UI.Theme = Theme;
        //__________________________________________________________________________________________________________//
        // jquey.mobile.changePage() の Hook.
        function applyCustomChangePage() {
            var jqmChangePage = _.bind($.mobile.changePage, $.mobile);
            function customChangePage(to, options) {
                if (_.isString(to)) {
                    if (options && options.transition) {
                        options.transition = Theme.queryPageTransition(options.transition);
                    }
                }
                jqmChangePage(to, options);
            }
            $.mobile.changePage = customChangePage;
        }
        // framework 初期化後に適用
        Framework.waitForInitialize()
            .done(function () {
            applyCustomChangePage();
        });
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        //__________________________________________________________________________________________________________//
        /**
         * @class ExtensionManager
         * @brief 拡張機能を管理するユーティリティクラス
         */
        var ExtensionManager = (function () {
            function ExtensionManager() {
            }
            /**
             * DOM 拡張関数の登録
             *
             * @param {DomExtension} func [in] DOM 拡張関数
             */
            ExtensionManager.registerDomExtension = function (func) {
                this.s_domExtensions.push(func);
            };
            /**
             * DOM 拡張を適用
             *
             * @param {jQuery} $ui       [in] 拡張対象の DOM
             * @param {Object} [options] [in] オプション
             */
            ExtensionManager.applyDomExtension = function ($ui, options) {
                this.s_domExtensions.forEach(function (func) {
                    func($ui, options);
                });
            };
            ExtensionManager.s_domExtensions = [];
            return ExtensionManager;
        }());
        UI.ExtensionManager = ExtensionManager;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
/* tslint:disable:no-bitwise */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.Toast] ";
        /**
         * @class Toast
         * @brief Android SDK の Toast クラスのように自動消滅するメッセージ出力ユーティリティ
         *        入れ子の関係を実現するために module で実装
         */
        var Toast;
        (function (Toast) {
            // 表示時間の定義
            Toast.LENGTH_SHORT = 1500; //!< 短い:1500 msec
            Toast.LENGTH_LONG = 4000; //!< 長い:4000 msec
            //! @enum オフセットの基準
            var OffsetX;
            (function (OffsetX) {
                OffsetX[OffsetX["LEFT"] = 1] = "LEFT";
                OffsetX[OffsetX["RIGHT"] = 2] = "RIGHT";
                OffsetX[OffsetX["CENTER"] = 4] = "CENTER";
            })(OffsetX = Toast.OffsetX || (Toast.OffsetX = {}));
            //! @enum オフセットの基準
            var OffsetY;
            (function (OffsetY) {
                OffsetY[OffsetY["TOP"] = 16] = "TOP";
                OffsetY[OffsetY["BOTTOM"] = 32] = "BOTTOM";
                OffsetY[OffsetY["CENTER"] = 64] = "CENTER";
            })(OffsetY = Toast.OffsetY || (Toast.OffsetY = {}));
            /**
             * @class StyleBuilderDefault
             * @brief スタイル変更時に使用する既定の構造体オブジェクト
             */
            var StyleBuilderDefault = (function () {
                function StyleBuilderDefault() {
                }
                //! class attribute に設定する文字列を取得
                StyleBuilderDefault.prototype.getClass = function () {
                    return "ui-loader ui-overlay-shadow ui-corner-all";
                };
                //! style attribute に設定する JSON オブジェクトを取得
                StyleBuilderDefault.prototype.getStyle = function () {
                    var style = {
                        "padding": "7px 25px 7px 25px",
                        "display": "block",
                        "background-color": "#1d1d1d",
                        "border-color": "#1b1b1b",
                        "color": "#fff",
                        "text-shadow": "0 1px 0 #111",
                        "font-weight": "bold",
                        "opacity": 0.8,
                    };
                    return style;
                };
                //! オフセットの基準位置を取得
                StyleBuilderDefault.prototype.getOffsetPoint = function () {
                    return OffsetX.CENTER | OffsetY.BOTTOM;
                };
                //! X 座標のオフセット値を取得
                StyleBuilderDefault.prototype.getOffsetX = function () {
                    return 0;
                };
                //! Y 座標のオフセット値を取得
                StyleBuilderDefault.prototype.getOffsetY = function () {
                    return -75;
                };
                return StyleBuilderDefault;
            }());
            Toast.StyleBuilderDefault = StyleBuilderDefault;
            /**
             * Toast 表示
             *
             * @param message  [in] メッセージ
             * @param duration [in] 表示時間を設定 (msec) default: LENGTH_SHORT
             * @param style    [in] スタイル変更する場合には派生クラスオブジェクトを指定
             */
            function show(message, duration, style) {
                if (duration === void 0) { duration = Toast.LENGTH_SHORT; }
                var $mobile = $.mobile;
                var info = style || new StyleBuilderDefault();
                var setCSS = info.getStyle() ? true : false;
                // 改行コードは <br/> に置換する
                var msg = message.replace(/\n/g, "<br/>");
                // メッセージ element の動的生成
                var html = "<div>" + msg + "</div>";
                var box = $(html).addClass(info.getClass());
                if (setCSS) {
                    box.css(info.getStyle());
                }
                // 自動改行されてもよいように、基点を設定してから追加
                box.css({
                    "top": 0,
                    "left": 0,
                }).appendTo($mobile.pageContainer);
                // 配置位置の決定
                var offsetPoint = info.getOffsetPoint();
                var $window = $(window);
                var posX, posY;
                var box_width = box.width() + parseInt(box.css("padding-left"), 10) + parseInt(box.css("padding-right"), 10);
                var box_height = box.height() + parseInt(box.css("padding-top"), 10) + parseInt(box.css("padding-bottom"), 10);
                switch (offsetPoint & 0x000F) {
                    case OffsetX.LEFT:
                        posX = 0 + info.getOffsetX();
                        break;
                    case OffsetX.RIGHT:
                        posX = $window.width() - box_width + info.getOffsetX();
                        break;
                    case OffsetX.CENTER:
                        posX = ($window.width() / 2) - (box_width / 2) + info.getOffsetX();
                        break;
                    default:
                        console.warn(TAG + "warn. unknown offsetPoint:" + (offsetPoint & 0x000F));
                        posX = ($window.width() / 2) - (box_width / 2) + info.getOffsetX();
                        break;
                }
                switch (offsetPoint & 0x00F0) {
                    case OffsetY.TOP:
                        posY = 0 + info.getOffsetY();
                        break;
                    case OffsetY.BOTTOM:
                        posY = $window.height() - box_height + info.getOffsetY();
                        break;
                    case OffsetY.CENTER:
                        posY = ($window.height() / 2) - (box_height / 2) + info.getOffsetY();
                        break;
                    default:
                        console.warn(TAG + "warn. unknown offsetPoint:" + (offsetPoint & 0x00F0));
                        posY = ($window.height() / 2) - (box_height / 2) + info.getOffsetY();
                        break;
                }
                // 表示
                box.css({
                    "top": posY,
                    "left": posX,
                })
                    .delay(duration)
                    .fadeOut(400, function () {
                    $(this).remove();
                });
            }
            Toast.show = show;
        })(Toast = UI.Toast || (UI.Toast = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Promise = CDP.Promise;
        var Framework = CDP.Framework;
        var TAG = "[CDP.UI.Dialog] ";
        //___________________________________________________________________________________________________________________//
        /**
         * @class Dialog
         * @brief 汎用ダイアログクラス
         *        jQM の popup widget によって実装
         */
        var Dialog = (function () {
            /**
             * constructor
             *
             * @param id      {String}        [in] ダイアログ DOM ID を指定 ex) #dialog-hoge
             * @param options {DialogOptions} [in] オプション
             */
            function Dialog(id, options) {
                this._template = null;
                this._settings = null;
                this._$dialog = null;
                // Dialog 共通設定の初期化
                Dialog.initCommonCondition();
                // 設定を更新
                this._settings = $.extend({}, Dialog.s_defaultOptions, options);
                // ダイアログテンプレートを作成
                this._template = CDP.Tools.Template.getJST(id, this._settings.src);
            }
            ///////////////////////////////////////////////////////////////////////
            // public methods
            /**
             * 表示
             * 表示をして始めて DOM が有効になる。
             *
             * @param options {DialogOptions} [in] オプション (src は無視される)
             * @return ダイアログの jQuery オブジェクト
             */
            Dialog.prototype.show = function (options) {
                var _this = this;
                var $document = $(document);
                var $body = $("body");
                var $page = $body.pagecontainer("getActivePage");
                var ofcHidden = {
                    "overflow": "hidden",
                    "overflow-x": "hidden",
                    "overflow-y": "hidden",
                };
                var ofcBody = {
                    "overflow": $body.css("overflow"),
                    "overflow-x": $body.css("overflow-x"),
                    "overflow-y": $body.css("overflow-y"),
                };
                var parentScrollPos = $body.scrollTop();
                var ofcPage = {
                    "overflow": $page.css("overflow"),
                    "overflow-x": $page.css("overflow-x"),
                    "overflow-y": $page.css("overflow-y"),
                };
                var scrollEvent = "scroll touchmove mousemove MSPointerMove";
                var scrollHander = function (event) {
                    if ("deny" === _this._settings.scrollEvent) {
                        event.preventDefault();
                    }
                    else if ("adjust" === _this._settings.scrollEvent) {
                        $body.scrollTop(parentScrollPos);
                    }
                };
                // option が指定されていた場合更新
                if (null != options) {
                    this._settings = $.extend({}, this._settings, options);
                }
                // afterclose 処理は Dialog の破棄処理を実装するため基本的に設定禁止 (強制上書きモードを設定使用可)
                if (this._settings.afterclose && !this._settings.forceOverwriteAfterClose) {
                    console.warn(TAG + "cannot accept 'afterclose' option. please instead using 'popupafterclose' event.");
                    delete this._settings.afterclose;
                }
                // title の有無
                this._settings._titleState = this._settings.title ? "ui-has-title" : "ui-no-title";
                /*
                 * template から jQuery オブジェクトを作成し、
                 * <body> 直下に追加.
                 * $page では Backbone event を受けられないことに注意
                 */
                this._$dialog = $(this._template(this._settings));
                this._$dialog.localize();
                $body.append(this._$dialog);
                // theme を解決
                this.resolveTheme();
                this._$dialog
                    .on("popupcreate", function (event) {
                    // スクロールを抑止
                    if ("allow" !== _this._settings.scrollEvent) {
                        $document.on(scrollEvent, scrollHander);
                    }
                    $body.css(ofcHidden);
                    $page.css(ofcHidden);
                    Dialog.register(_this);
                })
                    .enhanceWithin();
                // DOM 拡張
                if (null != this._settings.domExtensionOptions) {
                    UI.ExtensionManager.applyDomExtension(this._$dialog, this._settings.domExtensionOptions);
                }
                this.onBeforeShow()
                    .done(function () {
                    // 表示
                    _this._$dialog
                        .popup($.extend({}, {
                        positionTo: "window",
                        afterclose: function (event, ui) {
                            // スクロール状態を戻す
                            $page.css(ofcPage);
                            $body.css(ofcBody);
                            if ("allow" !== _this._settings.scrollEvent) {
                                $document.off(scrollEvent, scrollHander);
                            }
                            Dialog.register(null);
                            _this._$dialog.remove();
                            _this._$dialog = null;
                        },
                    }, _this._settings))
                        .popup("open").on(_this._settings.event, function (event) {
                        // "data-auto-close='false'" が指定されている要素は dialog を閉じない
                        var autoClose = $(event.target).attr("data-auto-close");
                        if (null == autoClose) {
                            autoClose = _this._settings.defaultAutoClose ? "true" : "false";
                        }
                        if ("false" === autoClose) {
                            return;
                        }
                        _this.close();
                        event.preventDefault();
                    });
                })
                    .fail(function (error) {
                    console.error(TAG + "Dialog.show() failed.");
                    if (_this._$dialog) {
                        _this._$dialog.trigger("error", error);
                    }
                });
                return this._$dialog;
            };
            /**
             * 終了
             * 基本的には自動で閉じるが、
             * 表示中のダイアログをクライアント側から閉じるメソッド
             */
            Dialog.prototype.close = function () {
                if (this._$dialog) {
                    this._$dialog.popup("close");
                }
            };
            Object.defineProperty(Dialog.prototype, "$el", {
                //! ダイアログ element を取得
                get: function () {
                    return this._$dialog;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // protected methods: Override
            /**
             * ダイアログ表示の直前
             * DOM を操作できるタイミングで呼び出される.
             *
             * @return {IPromiseBase} promise オブジェクト
             */
            Dialog.prototype.onBeforeShow = function () {
                return Promise.resolve();
            };
            /**
             * ダイアログの使用する Theme を解決
             * 不要な場合はオーバーライドすることも可能
             */
            Dialog.prototype.resolveTheme = function () {
                var queryTheme = function () {
                    return $(".ui-page-active").jqmData("theme");
                };
                var candidateTheme;
                if (!this._settings.theme) {
                    var domTheme = this._$dialog.jqmData("theme");
                    if (!domTheme) {
                        this._settings.theme = candidateTheme = queryTheme();
                    }
                }
                if (!this._settings.overlayTheme) {
                    var domOverlayTheme = this._$dialog.jqmData("overlay-theme");
                    if (!domOverlayTheme) {
                        this._settings.overlayTheme = candidateTheme || queryTheme();
                    }
                }
                // transition の更新
                this._settings.transition = UI.Theme.queryDialogTransition(this._settings.transition);
            };
            ///////////////////////////////////////////////////////////////////////
            // public static methods
            /**
             * Dialog の既定オプションを更新
             * すべての Dialog が使用する共通設定
             *
             * @param options {DialogOptions} [in] ダイアログオプション
             */
            Dialog.setDefaultOptions = function (options) {
                // Dialog 共通設定の初期化
                Dialog.initCommonCondition();
                $.extend(true, Dialog.s_defaultOptions, options);
            };
            ///////////////////////////////////////////////////////////////////////
            // private methods
            // 現在 active なダイアログとして登録する
            Dialog.register = function (dialog) {
                if (null != dialog && null != Dialog.s_activeDialog) {
                    console.warn(TAG + "new dialog proc is called in the past dialog's one. use setTimeout() for post process.");
                }
                Dialog.s_activeDialog = dialog;
            };
            /**
             * Dialog 共通設定の初期化
             */
            Dialog.initCommonCondition = function () {
                // Framework の初期化後に処理する必要がある
                if (!Framework.isInitialized()) {
                    console.warn(TAG + "initCommonCondition() should be called after Framework.initialized.");
                    return;
                }
                if (null == Dialog.s_oldBackKeyHandler) {
                    // Back Button Handler
                    Dialog.s_oldBackKeyHandler = CDP.setBackButtonHandler(null);
                    CDP.setBackButtonHandler(Dialog.customBackKeyHandler);
                    // 既定オプション
                    Dialog.s_defaultOptions = {
                        idPositive: "dlg-btn-positive",
                        idNegative: "dlg-btn-negative",
                        event: Framework.getDefaultClickEvent(),
                        dismissible: false,
                        defaultAutoClose: false,
                        transition: "platform-default",
                        labelPositive: "OK",
                        labelNegative: "Cancel",
                        backKey: "close",
                        scrollEvent: "deny",
                        domExtensionOptions: {},
                    };
                }
            };
            /**
             * H/W Back Button Handler
             */
            Dialog.customBackKeyHandler = function (event) {
                if (null != Dialog.s_activeDialog) {
                    if ("close" === Dialog.s_activeDialog._settings.backKey) {
                        Dialog.s_activeDialog.close();
                    }
                    else if ("function" === typeof Dialog.s_activeDialog._settings.backKey) {
                        Dialog.s_activeDialog._settings.backKey(event);
                    }
                    return; // Dialog が active な場合、常に既定のハンドラには渡さない
                }
                Dialog.s_oldBackKeyHandler(event);
            };
            Dialog.s_activeDialog = null;
            Dialog.s_oldBackKeyHandler = null;
            Dialog.s_defaultOptions = null;
            return Dialog;
        }());
        UI.Dialog = Dialog;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
/* tslint:disable:max-line-length */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.DialogCommons] ";
        /**
         * Alert
         * alert メッセージ表示
         *
         * @param {String} message   [in] 表示文字列
         * @param {String} [options] [in] ダイアログオプション
         * @return {jQuery} ダイアログの DOM オブジェクト
         */
        function alert(message, options) {
            var template = "\n            <script type=\"text/template\">\n                <section class=\"ui-modal\" data-role=\"popup\" data-corners=\"false\">\n                    <div class=\"ui-content\">\n                        <h1 class=\"ui-title {{_titleState}}\">{{title}}</h1>\n                        <p class=\"ui-message\">{{message}}</p>\n                    </div>\n                    <div class=\"ui-modal-footer ui-grid-solo\">\n                        <button id=\"{{idPositive}}\" class=\"ui-btn ui-block-a ui-text-emphasis\" data-auto-close=\"true\">{{labelPositive}}</button>\n                    </div>\n                </section>\n            </script>\n        ";
            var dlgAlert = new UI.Dialog(template, $.extend({}, {
                src: null,
                message: message,
            }, options));
            return dlgAlert.show();
        }
        UI.alert = alert;
        /**
         * Confirm
         * 確認メッセージ表示
         *
         * @param {String} message   [in] 表示文字列
         * @param {String} [options] [in] ダイアログオプション
         * @return {jQuery} ダイアログの DOM オブジェクト
         */
        function confirm(message, options) {
            var template = "\n            <script type=\"text/template\">\n                <section class=\"ui-modal\" data-role=\"popup\" data-corners=\"false\">\n                    <div class=\"ui-content\">\n                        <h1 class=\"ui-title {{_titleState}}\">{{title}}</h1>\n                        <p class=\"ui-message\">{{message}}</p>\n                    </div>\n                    <div class=\"ui-modal-footer ui-grid-a\">\n                        <button id=\"{{idNegative}}\" class=\"ui-btn ui-block-a\" data-auto-close=\"true\">{{labelNegative}}</button>\n                        <button id=\"{{idPositive}}\" class=\"ui-btn ui-block-b ui-text-emphasis\" data-auto-close=\"true\">{{labelPositive}}</button>\n                    </div>\n                </section>\n            </script>\n        ";
            var dlgConfirm = new UI.Dialog(template, $.extend({}, {
                src: null,
                message: message,
            }, options));
            return dlgConfirm.show();
        }
        UI.confirm = confirm;
        /**
         * @class DialogPrompt
         * @brief prompt ダイアログ (非公開)
         */
        var DialogPrompt = (function (_super) {
            __extends(DialogPrompt, _super);
            /**
             * constructor
             *
             */
            function DialogPrompt(id, options) {
                var _this = _super.call(this, id, options) || this;
                _this._eventOK = options.eventOK || "promptok";
                return _this;
            }
            //! ダイアログ表示の直前
            DialogPrompt.prototype.onBeforeShow = function () {
                var _this = this;
                var onCommit = function (event) {
                    var text = _this.$el.find("#_ui-prompt").val();
                    _this.$el.trigger(_this._eventOK, text);
                    _this.close();
                    event.preventDefault();
                };
                this.$el
                    .on("vclick", ".command-prompt-ok ", function (event) {
                    onCommit(event);
                })
                    .on("keydown", "#_ui-prompt", function (event) {
                    var ENTER_KEY_CODE = 13;
                    if (ENTER_KEY_CODE === event.keyCode) {
                        onCommit(event);
                    }
                });
                return _super.prototype.onBeforeShow.call(this);
            };
            return DialogPrompt;
        }(UI.Dialog));
        /**
         * Prompt
         *
         * @param {String} message   [in] 表示文字列
         * @param {String} [options] [in] ダイアログオプション
         * @return {jQuery} ダイアログの DOM オブジェクト
         */
        function prompt(message, options) {
            var template = "\n            <script type=\"text/template\">\n                <section class=\"ui-modal\" data-role=\"popup\" data-corners=\"false\">\n                    <div class=\"ui-content\">\n                        <h1 class=\"ui-title {{_titleState}}\">{{title}}</h1>\n                        <p class=\"ui-message\">{{message}}</p>\n                        <label for=\"_ui-prompt\" class=\"ui-hidden-accessible\"></label>\n                        <input type=\"text\" name=\"_ui-prompt\" id=\"_ui-prompt\">\n                    </div>\n                    <div class=\"ui-modal-footer ui-grid-a\">\n                        <button id=\"{{idNegative}}\" class=\"ui-btn ui-block-a\" data-auto-close=\"true\">{{labelNegative}}</button>\n                        <button id=\"{{idPositive}}\" class=\"command-prompt-ok ui-btn ui-block-b ui-text-emphasis\" data-auto-close=\"false\">{{labelPositive}}</button>\n                    </div>\n                </section>\n            </script>\n        ";
            var dlgPrompt = new DialogPrompt(template, $.extend({}, {
                src: null,
                message: message,
            }, options));
            return dlgPrompt.show();
        }
        UI.prompt = prompt;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Router = CDP.Framework.Router;
        var View = CDP.Framework.View;
        var Template = CDP.Tools.Template;
        var TAG = "[CDP.UI.BaseHeaderView] ";
        //__________________________________________________________________________________________________________//
        /**
         * @class BaseHeaderView
         * @brief 共通ヘッダを操作するクラス
         */
        var BaseHeaderView = (function (_super) {
            __extends(BaseHeaderView, _super);
            /**
             * constructor
             *
             * @param {IPage} _owner [in] オーナーページインスタンス
             */
            function BaseHeaderView(_owner, _options) {
                var _this = _super.call(this, _options = $.extend({
                    el: _owner.$page.find("[data-role='header']"),
                    backCommandSelector: ".command-back",
                    backCommandKind: "pageback",
                }, _options)) || this;
                _this._owner = _owner;
                _this._options = _options;
                // template 設定
                if (_options.baseTemplate) {
                    _this._template = _options.baseTemplate;
                }
                else {
                    _this._template = Template.getJST("\n                    <script type='text/template'>\n                        <header class='ui-header-base ui-body-{{theme}}'>\n                            <div class='ui-fixed-back-indicator'></div>\n                        </header>\n                    </script>\n                ");
                }
                // Backbone.View 用の初期化
                _this.setElement(_this.$el, true);
                return _this;
            }
            ///////////////////////////////////////////////////////////////////////
            // public methods
            /**
             * 初期化
             */
            BaseHeaderView.prototype.create = function () {
                return this.createHeaderBase();
            };
            /**
             * 有効化
             */
            BaseHeaderView.prototype.activate = function () {
                return this.showIndicator();
            };
            /**
             * 無効化
             */
            BaseHeaderView.prototype.inactivate = function () {
                return this.hideIndicator();
            };
            /**
             * 破棄
             */
            BaseHeaderView.prototype.release = function () {
                return this.releaseHeaderBase();
            };
            ///////////////////////////////////////////////////////////////////////
            // private methods
            //! 共通ヘッダのベースを準備
            BaseHeaderView.prototype.createHeaderBase = function () {
                // 固定ヘッダのときに有効化
                if ("fixed" === this._owner.$header.jqmData("position")) {
                    if (null == BaseHeaderView.s_$headerBase) {
                        BaseHeaderView.s_$headerBase = $(this._template({
                            theme: this._owner.$page.jqmData("theme"),
                        }));
                    }
                    BaseHeaderView.s_refCount++;
                    BaseHeaderView.s_$headerBase.appendTo($(document.body));
                }
                // Back Indicator を持っているか判定
                if (0 < this.$el.find(".ui-back-indicator").length) {
                    this._hasBackIndicator = true;
                }
                return BaseHeaderView.s_$headerBase;
            };
            //! indicator の表示
            BaseHeaderView.prototype.showIndicator = function () {
                // Back Indicator を持っていない場合表示しない
                if (null != BaseHeaderView.s_$headerBase && this._hasBackIndicator) {
                    BaseHeaderView.s_$headerBase.find(".ui-fixed-back-indicator").addClass("show");
                }
                return BaseHeaderView.s_$headerBase;
            };
            //! indicator の非表示
            BaseHeaderView.prototype.hideIndicator = function () {
                if (null != BaseHeaderView.s_$headerBase) {
                    BaseHeaderView.s_$headerBase.find(".ui-fixed-back-indicator").removeClass("show");
                }
                return BaseHeaderView.s_$headerBase;
            };
            //! 共通ヘッダのベースを破棄
            BaseHeaderView.prototype.releaseHeaderBase = function () {
                // 固定ヘッダ時に参照カウントを管理
                if ("fixed" === this._owner.$header.jqmData("position")) {
                    if (null != BaseHeaderView.s_$headerBase) {
                        BaseHeaderView.s_refCount--;
                        if (0 === BaseHeaderView.s_refCount) {
                            BaseHeaderView.s_$headerBase.remove();
                            BaseHeaderView.s_$headerBase = null;
                        }
                    }
                }
                return BaseHeaderView.s_$headerBase;
            };
            ///////////////////////////////////////////////////////////////////////
            // Override: Backbone.View
            //! events binding
            BaseHeaderView.prototype.events = function () {
                var eventMap = {};
                if (this._options) {
                    eventMap["vclick " + this._options.backCommandSelector] = this.onCommandBack;
                }
                return eventMap;
            };
            //! back のハンドラ
            BaseHeaderView.prototype.onCommandBack = function (event) {
                event.preventDefault();
                var handled = false;
                if (this._owner) {
                    handled = this._owner.onCommand(event, this._options.backCommandKind);
                }
                if (!handled) {
                    Router.back();
                }
            };
            BaseHeaderView.s_refCount = 0; //!< 参照カウント
            return BaseHeaderView;
        }(View));
        UI.BaseHeaderView = BaseHeaderView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Framework = CDP.Framework;
        var TAG = "[CDP.UI.BasePage] ";
        //__________________________________________________________________________________________________________//
        /**
         * @class BasePage
         * @brief Header を備える Page クラス
         */
        var BasePage = (function (_super) {
            __extends(BasePage, _super);
            /**
             * constructor
             *
             * @param {String}          url       [in] ページ URL
             * @param {String}          id        [in] ページ ID
             * @param {BasePageOptions} [options] [in] オプション
             */
            function BasePage(url, id, _options) {
                var _this = _super.call(this, url, id, _options = $.extend({
                    baseHeader: UI.BaseHeaderView,
                    backCommandHandler: "onPageBack",
                    backCommandKind: "pageback",
                    domExtensionOptions: {},
                }, _options)) || this;
                _this._options = _options;
                return _this;
            }
            ///////////////////////////////////////////////////////////////////////
            // Override: Framework Page
            /**
             * jQM event: "pagebeforecreate" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            BasePage.prototype.onPageBeforeCreate = function (event) {
                if (this._options.baseHeader) {
                    this._baseHeader = new this._options.baseHeader(this, this._options);
                    this._baseHeader.create();
                }
                _super.prototype.onPageBeforeCreate.call(this, event);
            };
            /**
             * jQM event: "pagecreate" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            BasePage.prototype.onPageInit = function (event) {
                if (null != this._options.domExtensionOptions) {
                    UI.ExtensionManager.applyDomExtension(this.$page, this._options.domExtensionOptions);
                }
                _super.prototype.onPageInit.call(this, event);
            };
            /**
             * jQM event: "pagebeforeshow" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            BasePage.prototype.onPageBeforeShow = function (event, data) {
                if (this._baseHeader) {
                    this._baseHeader.activate();
                }
                _super.prototype.onPageBeforeShow.call(this, event, data);
            };
            /**
             * jQM event: "pagebeforehide" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            BasePage.prototype.onPageBeforeHide = function (event, data) {
                if (this._baseHeader) {
                    this._baseHeader.inactivate();
                }
                _super.prototype.onPageBeforeHide.call(this, event, data);
            };
            /**
             * jQM event: "pageremove" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            BasePage.prototype.onPageRemove = function (event) {
                if (this._baseHeader) {
                    this._baseHeader.release();
                    this._baseHeader = null;
                }
                _super.prototype.onPageRemove.call(this, event);
            };
            /**
             * H/W Back Button ハンドラ
             *
             * @param  event {JQuery.Event} [in] event object
             * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
             */
            BasePage.prototype.onHardwareBackButton = function (event) {
                var retval = _super.prototype.onHardwareBackButton.call(this, event);
                if (!retval) {
                    retval = this.onCommand(event, this._options.backCommandKind);
                }
                return retval;
            };
            ///////////////////////////////////////////////////////////////////////
            // Override: Custom Event
            /**
             * "戻る" event 発行時にコールされる
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
             */
            BasePage.prototype.onCommand = function (event, kind) {
                if (this._options.backCommandKind === kind) {
                    if (this._owner && this._owner[this._options.backCommandHandler]) {
                        return this._owner[this._options.backCommandHandler](event);
                    }
                }
                return false;
            };
            return BasePage;
        }(Framework.Page));
        UI.BasePage = BasePage;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Promise = CDP.Promise;
        var Framework = CDP.Framework;
        var TAG = "[CDP.UI.PageView] ";
        /**
         * @class PageContainerView
         * @brief PageView と連携可能な コンテナビュークラス
         */
        var PageContainerView = (function (_super) {
            __extends(PageContainerView, _super);
            /**
             * constructor
             */
            function PageContainerView(options) {
                var _this = _super.call(this, options) || this;
                _this._owner = null;
                _this._owner = options.owner;
                if (options.$el) {
                    var delegates = _this.events ? true : false;
                    _this.setElement(options.$el, delegates);
                }
                return _this;
            }
            Object.defineProperty(PageContainerView.prototype, "owner", {
                ///////////////////////////////////////////////////////////////////////
                // short cut methods
                //! Owner 取得
                get: function () {
                    return this._owner;
                },
                enumerable: true,
                configurable: true
            });
            return PageContainerView;
        }(Framework.View));
        UI.PageContainerView = PageContainerView;
        /* tslint:enable:no-use-before-declare */
        //___________________________________________________________________________________________________________________//
        /**
         * @class PageView
         * @brief CDP.Framework.Page と Backbone.View の両方の機能を提供するページの基底クラス
         */
        var PageView = (function (_super) {
            __extends(PageView, _super);
            /**
             * constructor
             *
             * @param url     {String}                   [in] ページ URL
             * @param id      {String}                   [in] ページ ID
             * @param options {PageViewConstructOptions} [in] オプション
             */
            function PageView(url, id, options) {
                var _this = _super.call(this, options) || this;
                _this._pageOptions = null;
                _this._basePage = null;
                _this._statusMgr = null;
                // PageView 設定
                _this._pageOptions = $.extend({}, { owner: _this }, options);
                _this._basePage = _this._pageOptions.basePage ? new _this._pageOptions.basePage(url, id, _this._pageOptions) : new UI.BasePage(url, id, _this._pageOptions);
                // StatusManager
                _this._statusMgr = new UI.StatusManager();
                // Backbone.View 用の初期化
                var delegates = _this.events ? true : false;
                _this.setElement(_this.$page, delegates);
                return _this;
            }
            ///////////////////////////////////////////////////////////////////////
            // Implements: IStatusManager 状態管理
            /**
             * 状態変数の参照カウントのインクリメント
             *
             * @param status {String} [in] 状態識別子
             */
            PageView.prototype.statusAddRef = function (status) {
                return this._statusMgr.statusAddRef(status);
            };
            /**
             * 状態変数の参照カウントのデクリメント
             *
             * @param status {String} [in] 状態識別子
             */
            PageView.prototype.statusRelease = function (status) {
                return this._statusMgr.statusRelease(status);
            };
            /**
             * 処理スコープ毎に状態変数を設定
             *
             * @param status   {String}   [in] 状態識別子
             * @param callback {Function} [in] 処理コールバック
             */
            PageView.prototype.statusScope = function (status, callback) {
                this._statusMgr.statusScope(status, callback);
            };
            /**
             * 指定した状態中であるか確認
             *
             * @param status {String}   [in] 状態識別子
             * @return {Boolean} true: 状態内 / false: 状態外
             */
            PageView.prototype.isStatusIn = function (status) {
                return this._statusMgr.isStatusIn(status);
            };
            Object.defineProperty(PageView.prototype, "active", {
                ///////////////////////////////////////////////////////////////////////
                // IPage stub stuff.
                get: function () { return this._basePage.active; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "url", {
                get: function () { return this._basePage.url; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "id", {
                get: function () { return this._basePage ? this._basePage.id : null; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "$page", {
                get: function () { return this._basePage.$page; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "$header", {
                get: function () { return this._basePage.$header; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "$footer", {
                get: function () { return this._basePage.$footer; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "intent", {
                get: function () { return this._basePage.intent; },
                set: function (newIntent) { this._basePage.intent = newIntent; },
                enumerable: true,
                configurable: true
            });
            /**
             * Orientation の変更を受信
             *
             * @param newOrientation {Orientation} [in] new orientation code.
             */
            PageView.prototype.onOrientationChanged = function (newOrientation) {
                // Override
            };
            /**
             * H/W Back Button ハンドラ
             *
             * @param  event {JQuery.Event} [in] event object
             * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
             */
            PageView.prototype.onHardwareBackButton = function (event) {
                return false;
            };
            /**
             * Router "before route change" ハンドラ
             * ページ遷移直前に非同期処理を行うことが可能
             *
             * @return {IPromiseBase} Promise オブジェクト
             */
            PageView.prototype.onBeforeRouteChange = function () {
                return Promise.resolve();
            };
            /**
             * 汎用コマンドを受信
             *
             * @param  event {JQuery.Event} [in] event object
             * @param  event {kind}              [in] command kind string
             * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
             */
            PageView.prototype.onCommand = function (event, kind) {
                return false;
            };
            /**
             * 最初の OnPageInit() のときにのみコールされる
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageView.prototype.onInitialize = function (event) {
                // Override
            };
            /**
             * jQM event: "pagebeforecreate" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageView.prototype.onPageBeforeCreate = function (event) {
                this.setElement(this.$page, true);
            };
            /**
             * jQM event: "pagecreate" (旧:"pageinit") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageView.prototype.onPageInit = function (event) {
                // Override
            };
            /**
             * jQM event: "pagebeforeshow" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            PageView.prototype.onPageBeforeShow = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagecontainershow" (旧:"pageshow") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            PageView.prototype.onPageShow = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagebeforehide" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            PageView.prototype.onPageBeforeHide = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            PageView.prototype.onPageHide = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pageremove" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageView.prototype.onPageRemove = function (event) {
                this.remove();
                this.el = null;
                this.$el = null;
            };
            return PageView;
        }(Framework.View));
        UI.PageView = PageView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.PageListView] ";
        /**
         * @class PageListView
         * @brief 仮想リストビュー機能を持つ PageView クラス
         */
        var PageListView = (function (_super) {
            __extends(PageListView, _super);
            /**
             * constructor
             *
             * @param url     {String}                       [in] page template に使用する URL
             * @param id      {String}                       [in] page に振られた ID
             * @param options {PageListViewConstructOptions} [in] オプション
             */
            function PageListView(url, id, options) {
                var _this = _super.call(this, url, id, $.extend({}, {
                    autoDestoryElement: false,
                }, options)) || this;
                _this._scrollMgr = null; //!< scroll コアロジック
                _this._needRebuild = false; //!< ページ表示時に rebuild() をコールするための内部変数
                _this._scrollMgr = new UI.ScrollManager(options);
                return _this;
            }
            //! rebuild() のスケジューリング
            PageListView.prototype.reserveRebuild = function () {
                this._needRebuild = true;
            };
            ///////////////////////////////////////////////////////////////////////
            // Override: PageView
            //! Orientation の変更検知
            PageListView.prototype.onOrientationChanged = function (newOrientation) {
                this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
            };
            //! ページ遷移直前イベント処理
            PageListView.prototype.onBeforeRouteChange = function () {
                if (this._pageOptions.autoDestoryElement) {
                    this._scrollMgr.destroy();
                }
                return _super.prototype.onBeforeRouteChange.call(this);
            };
            //! jQM event: "pagebeforeshow" に対応
            PageListView.prototype.onPageBeforeShow = function (event, data) {
                _super.prototype.onPageBeforeShow.call(this, event, data);
                this._scrollMgr.initialize(this.$page, this.getPageBaseHeight());
            };
            //! jQM event: "pagecontainershow" (旧:"pageshow") に対応
            PageListView.prototype.onPageShow = function (event, data) {
                _super.prototype.onPageShow.call(this, event, data);
                this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
                if (this._needRebuild) {
                    this.rebuild();
                    this._needRebuild = false;
                }
            };
            //! jQM event: "pageremove" に対応
            PageListView.prototype.onPageRemove = function (event) {
                _super.prototype.onPageRemove.call(this, event);
                this.release();
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Profile 管理
            //! 初期化済みか判定
            PageListView.prototype.isInitialized = function () {
                return this._scrollMgr.isInitialized();
            };
            //! プロパティを指定して、ListItem を管理
            PageListView.prototype.addItem = function (height, initializer, info, insertTo) {
                this._addLine(new UI.LineProfile(this._scrollMgr, Math.floor(height), initializer, info), insertTo);
            };
            PageListView.prototype.removeItem = function (index, arg2, arg3) {
                this._scrollMgr.removeItem(index, arg2, arg3);
            };
            PageListView.prototype.getItemInfo = function (target) {
                return this._scrollMgr.getItemInfo(target);
            };
            //! アクティブページを更新
            PageListView.prototype.refresh = function () {
                this._scrollMgr.refresh();
            };
            //! 未アサインページを構築
            PageListView.prototype.update = function () {
                this._scrollMgr.update();
            };
            //! ページアサインを再構成
            PageListView.prototype.rebuild = function () {
                this._scrollMgr.rebuild();
            };
            //! 管轄データを破棄
            PageListView.prototype.release = function () {
                this._scrollMgr.release();
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Profile Backup / Restore
            //! 内部データをバックアップ
            PageListView.prototype.backup = function (key) {
                return this._scrollMgr.backup(key);
            };
            //! 内部データをリストア
            PageListView.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
                var retval = this._scrollMgr.restore(key, rebuild);
                if (retval && !rebuild) {
                    this.reserveRebuild();
                }
                return retval;
            };
            //! バックアップデータの有無
            PageListView.prototype.hasBackup = function (key) {
                return this._scrollMgr.hasBackup(key);
            };
            //! バックアップデータの破棄
            PageListView.prototype.clearBackup = function (key) {
                return this._scrollMgr.clearBackup(key);
            };
            Object.defineProperty(PageListView.prototype, "backupData", {
                //! バックアップデータにアクセス
                get: function () {
                    return this._scrollMgr.backupData;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Scroll
            //! スクロールイベントハンドラ設定/解除
            PageListView.prototype.setScrollHandler = function (handler, on) {
                this._scrollMgr.setScrollHandler(handler, on);
            };
            //! スクロール終了イベントハンドラ設定/解除
            PageListView.prototype.setScrollStopHandler = function (handler, on) {
                this._scrollMgr.setScrollStopHandler(handler, on);
            };
            //! スクロール位置を取得
            PageListView.prototype.getScrollPos = function () {
                return this._scrollMgr.getScrollPos();
            };
            //! スクロール位置の最大値を取得
            PageListView.prototype.getScrollPosMax = function () {
                return this._scrollMgr.getScrollPosMax();
            };
            //! スクロール位置を指定
            PageListView.prototype.scrollTo = function (pos, animate, time) {
                this._scrollMgr.scrollTo(pos, animate, time);
            };
            //! 指定された ListItemView の表示を保証
            PageListView.prototype.ensureVisible = function (index, options) {
                this._scrollMgr.ensureVisible(index, options);
            };
            Object.defineProperty(PageListView.prototype, "core", {
                ///////////////////////////////////////////////////////////////////////
                // Implements: IListView Properties
                //! core framework access
                get: function () {
                    return this._scrollMgr;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Internal I/F
            //! 登録 framework が使用する
            PageListView.prototype._addLine = function (_line, insertTo) {
                this._scrollMgr._addLine(_line, insertTo);
            };
            ///////////////////////////////////////////////////////////////////////
            // private method:
            //! ページの基準値を取得
            PageListView.prototype.getPageBaseHeight = function () {
                return $(window).height() - parseInt(this.$page.css("padding-top"), 10);
            };
            return PageListView;
        }(UI.PageView));
        UI.PageListView = PageListView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.PageExpandableListView] ";
        /**
         * @class PageExpandableListView
         * @brief 開閉リストビュー機能を持つ PageView クラス
         */
        var PageExpandableListView = (function (_super) {
            __extends(PageExpandableListView, _super);
            /**
             * constructor
             *
             * @param url     {String}                       [in] page template に使用する URL
             * @param id      {String}                       [in] page に振られた ID
             * @param options {PageListViewConstructOptions} [in] オプション
             */
            function PageExpandableListView(url, id, options) {
                var _this = _super.call(this, url, id, options) || this;
                _this._expandManager = null;
                _this._expandManager = new UI.ExpandManager(_this);
                return _this;
            }
            ///////////////////////////////////////////////////////////////////////
            // Implements: IExpandableListView
            //! 新規 GroupProfile を作成
            PageExpandableListView.prototype.newGroup = function (id) {
                return this._expandManager.newGroup(id);
            };
            //! 登録済み Group を取得
            PageExpandableListView.prototype.getGroup = function (id) {
                return this._expandManager.getGroup(id);
            };
            //! 第1階層の Group 登録
            PageExpandableListView.prototype.registerTopGroup = function (topGroup) {
                this._expandManager.registerTopGroup(topGroup);
            };
            //! 第1階層の Group を取得
            PageExpandableListView.prototype.getTopGroups = function () {
                return this._expandManager.getTopGroups();
            };
            //! すべてのグループを展開 (1階層)
            PageExpandableListView.prototype.expandAll = function () {
                this._expandManager.expandAll();
            };
            //! すべてのグループを収束 (1階層)
            PageExpandableListView.prototype.collapseAll = function (delay) {
                this._expandManager.collapseAll(delay);
            };
            //! 展開中か判定
            PageExpandableListView.prototype.isExpanding = function () {
                return this._expandManager.isExpanding();
            };
            //! 収束中か判定
            PageExpandableListView.prototype.isCollapsing = function () {
                return this._expandManager.isCollapsing();
            };
            //! 開閉中か判定
            PageExpandableListView.prototype.isSwitching = function () {
                return this._expandManager.isSwitching();
            };
            Object.defineProperty(PageExpandableListView.prototype, "layoutKey", {
                //! layout key を取得
                get: function () {
                    return this._expandManager.layoutKey;
                },
                //! layout key を設定
                set: function (key) {
                    this._expandManager.layoutKey = key;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Override: PageListView
            //! データを破棄
            PageExpandableListView.prototype.release = function () {
                _super.prototype.release.call(this);
                this._expandManager.release();
            };
            //! 内部データをバックアップ
            PageExpandableListView.prototype.backup = function (key) {
                return this._expandManager.backup(key);
            };
            //! 内部データをリストア
            PageExpandableListView.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
                return this._expandManager.restore(key, rebuild);
            };
            return PageExpandableListView;
        }(UI.PageListView));
        UI.PageExpandableListView = PageExpandableListView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            var Framework = CDP.Framework;
            // jQuery plugin
            $.fn.ripple = function (options) {
                var $el = $(this);
                if ($el.length <= 0) {
                    return $el;
                }
                return $el.on(Framework.Patch.s_vclickEvent, function (event) {
                    var surface = $(this);
                    // create surface if it doesn't exist
                    if (surface.find(".ui-ripple-ink").length === 0) {
                        surface.prepend("<div class='ui-ripple-ink'></div>");
                    }
                    var ink = surface.find(".ui-ripple-ink");
                    // stop the previous animation
                    ink.removeClass("ui-ripple-animate");
                    // ink size:
                    if (!ink.height() && !ink.width()) {
                        var d = Math.max(surface.outerWidth(), surface.outerHeight());
                        ink.css({ height: d, width: d });
                    }
                    var x = event.pageX - surface.offset().left - (ink.width() / 2);
                    var y = event.pageY - surface.offset().top - (ink.height() / 2);
                    var rippleColor = surface.data("ripple-color");
                    // animation end handler
                    var ANIMATION_END_EVENT = "animationend webkitAnimationEnd";
                    ink.on(ANIMATION_END_EVENT, function (ev) {
                        ink.off();
                        ink.removeClass("ui-ripple-animate");
                        ink = null;
                    });
                    // set the position and add class .animate
                    ink.css({
                        top: y + "px",
                        left: x + "px",
                        background: rippleColor
                    }).addClass("ui-ripple-animate");
                });
            };
            /**
             * Material Design Ripple 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyDomExtension($ui, options) {
                var NO_RIPPLE_CLASS = [
                    ".ui-ripple-none",
                    ".ui-flipswitch-on",
                    ".ui-slider-handle",
                    ".ui-input-clear",
                ];
                var selector = ".ui-btn";
                if ($ui.hasClass("ui-page")) {
                    selector = ".ui-content .ui-btn"; // header は自動 ripple 化対象外
                }
                $ui.find(selector)
                    .filter(function (index, elem) {
                    var $elem = $(elem);
                    if ($elem.is(NO_RIPPLE_CLASS.join(","))) {
                        return false;
                    }
                    else {
                        return true;
                    }
                })
                    .addClass("ui-ripple");
                // ripplify
                //        $ui.find(".ui-ripple").ripple(options);
                $ui.find(".ui-ripple")
                    .each(function (index, elem) {
                    $(elem).ripple(options);
                });
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyDomExtension);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            var Template = CDP.Tools.Template;
            var _template;
            // jQuery plugin
            $.fn.spinner = function (options) {
                if ("string" === typeof options) {
                    return refresh($(this));
                }
                else {
                    return spinnerify($(this), options);
                }
            };
            function spinnerify($target, options) {
                if ($target.length <= 0) {
                    return $target;
                }
                if (!_template) {
                    _template = Template.getJST("\n                <script type=\"text/template\">\n                    <span class=\"ui-spinner-base\">\n                        <span class=\"ui-spinner-inner\">\n                            <span class=\"ui-spinner-inner-gap\" {{borderTop}}></span>\n                            <span class=\"ui-spinner-inner-left\">\n                                <span class=\"ui-spinner-inner-half-circle\" {{border}}></span>\n                            </span>\n                            <span class=\"ui-spinner-inner-right\">\n                                <span class=\"ui-spinner-inner-half-circle\" {{border}}></span>\n                            </span>\n                        </span>\n                    </span>\n                </script>\n            ");
                }
                var makeTemplateParam = function (clr) {
                    return {
                        borderTop: "style=border-top-color:" + clr + ";",
                        border: "style=border-color:" + clr + ";",
                    };
                };
                var color = $target.data("spinner-color");
                var param = null;
                if (color) {
                    $target.css({ "background-color": color });
                    param = makeTemplateParam(color);
                }
                $target.append(_template(param));
                return refresh($target);
            }
            // iOS 10.2+ SVG SMIL アニメーションが 2回目以降動かない問題の対策
            // data:image/svg+xml;<cache bust string>;base64,... とすることで data-url にも cache busting が有効になる
            function refresh($target) {
                var PREFIX = ["-webkit-", ""];
                var valid = function (prop) {
                    return (prop && "none" !== prop);
                };
                var dataUrl;
                for (var i = 0, n = PREFIX.length; i < n; i++) {
                    if (!valid(dataUrl)) {
                        dataUrl = $target.css(PREFIX[i] + "mask-image");
                        if (valid(dataUrl)) {
                            // iOS では url(data***); 内に '"' は入らない
                            var match = dataUrl.match(/(url\(data:image\/svg\+xml;)([\s\S]*)?(base64,[\s\S]*\))/);
                            if (match) {
                                dataUrl = match[1] + "bust=" + Date.now().toString(36) + ";" + match[3];
                            }
                            else {
                                dataUrl = null;
                            }
                        }
                    }
                    if (valid(dataUrl)) {
                        $target.css(PREFIX[i] + "mask-image", dataUrl);
                    }
                }
                return $target;
            }
            /**
             * Material Design Spinner 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyDomExtension($ui, options) {
                $ui.find(".ui-spinner, .ui-icon-loading")
                    .each(function (index, elem) {
                    $(elem).spinner(options);
                });
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyDomExtension);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            /**
             * Text Input 用 Floating Label 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyDomExtension($ui, options) {
                var update = function (elem, floating) {
                    var $elem = $(elem);
                    if (floating) {
                        $elem.addClass("ui-float-label-floating");
                    }
                    else {
                        $elem.removeClass("ui-float-label-floating");
                    }
                };
                var floatingify = function (elem) {
                    var id = $(elem).attr("for");
                    var $input = $ui.find("#" + id);
                    if ("search" === $input.jqmData("type")) {
                        $(elem).addClass("ui-float-label-has-icon");
                    }
                    update(elem, !!$input.val());
                    $input.on("keyup change input focus blur cut paste", function (event) {
                        update(elem, !!$(event.target).val());
                    });
                };
                $ui.find("label.ui-float-label, .ui-float-label label")
                    .each(function (index, elem) {
                    floatingify(elem);
                });
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyDomExtension);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            var Framework = CDP.Framework;
            /**
             * jQuery Mobile Flip Switch 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyDomExtension($ui, options) {
                /*
                 * flipswitch に紐づく label は OS によって event 発行形式が異なるためフックして独自イベントで対応する.
                 * また flipswitch は内部で click を発行しているが、vclick に変更する.
                 */
                var _getAllSwitches = function () {
                    return $ui.find(".ui-flipswitch");
                };
                var _getInputFromSwitch = function ($switch) {
                    var $input = $switch.find("input");
                    if ($input.length) {
                        return $input;
                    }
                    var $select = $switch.find("select");
                    if ($select.length) {
                        return $select;
                    }
                    return null;
                };
                var _change = function ($input, to) {
                    if ($input) {
                        if ("INPUT" === $input[0].nodeName) {
                            $input.prop("checked", to).flipswitch("refresh");
                        }
                        else if ("SELECT" === $input[0].nodeName) {
                            $input.val(to ? "on" : "off").flipswitch("refresh");
                        }
                    }
                };
                var _getLabelsFromSwitch = function ($switch) {
                    var $input = _getInputFromSwitch($switch);
                    if ($input) {
                        var labels = $input[0].labels;
                        if (labels) {
                            return $(labels);
                        }
                    }
                    return $();
                };
                var _getSwitchFromLabel = function ($label) {
                    var name = $label.attr("for");
                    return _getAllSwitches().find("[name='" + name + "']");
                };
                _getAllSwitches()
                    .on("vclick _change_flipswich", function (event) {
                    var $switch = $(event.currentTarget);
                    var $target = $(event.target);
                    var $input = _getInputFromSwitch($switch);
                    var changeTo = !$switch.hasClass("ui-flipswitch-active");
                    if ($target.hasClass("ui-flipswitch-input")) {
                        _change($input, changeTo);
                    }
                    else if ($target.hasClass("ui-flipswitch-on")) {
                        if (Framework.Platform.Mobile && Framework.Patch.isSupportedVclick()) {
                            _change($input, changeTo);
                            event.preventDefault();
                        }
                    }
                })
                    .each(function (index, flipswitch) {
                    _getLabelsFromSwitch($(flipswitch))
                        .on("vclick", function (event) {
                        var $switch = _getSwitchFromLabel($(event.target));
                        if (!$switch.parent().hasClass("ui-state-disabled")) {
                            $switch.trigger("_change_flipswich");
                        }
                        event.preventDefault();
                    });
                });
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyDomExtension);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            /**
             * jQuery Mobile Slider 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyDomExtension($ui, options) {
                $ui.find(".ui-slider-input")
                    .on("slidestop", function (event) {
                    var $handles = $(event.currentTarget)
                        .parent()
                        .find(".ui-slider-handle");
                    $handles.blur();
                });
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyDomExtension);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            //! iScroll.click patch
            var patch_IScroll_utils_click = function (event) {
                var target = event.target;
                var e = event;
                var ev;
                // [CDP modified]: set target.clientX.
                if (null == target.clientX || null == target.clientY) {
                    if (null != e.pageX && null != e.pageY) {
                        target.clientX = e.pageX;
                        target.clientY = e.pageY;
                    }
                    else if (e.changedTouches && e.changedTouches[0]) {
                        target.clientX = e.changedTouches[0].pageX;
                        target.clientY = e.changedTouches[0].pageY;
                    }
                }
                if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
                    ev = document.createEvent("MouseEvents");
                    ev.initMouseEvent("click", true, true, e.view, 1, target.screenX, target.screenY, target.clientX, target.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
                    ev._constructed = true;
                    target.dispatchEvent(ev);
                }
            };
            var s_applied = false;
            /**
             * iScroll Patch 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyPatch($ui, options) {
                if (!s_applied && UI.global.IScroll && UI.global.IScroll.utils) {
                    UI.global.IScroll.utils.click = patch_IScroll_utils_click;
                    s_applied = true;
                }
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyPatch);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

return CDP.UI; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVUkvanFtL1RoZW1lLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uTWFuYWdlci50cyIsImNkcDovLy9DRFAvVUkvanFtL1RvYXN0LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nQ29tbW9ucy50cyIsImNkcDovLy9DRFAvVUkvanFtL0Jhc2VIZWFkZXJWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vQmFzZVBhZ2UudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9QYWdlVmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VMaXN0Vmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VFeHBhbmRhYmxlTGlzdFZpZXcudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vUmlwcGxlLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL1NwaW5uZXIudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vRmxvYXRMYWJlbC50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9GbGlwU3dpdGNoLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL1NsaWRlci50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9JU2Nyb2xsLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vSW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0E0T1o7QUE1T0QsV0FBVSxHQUFHO0lBQUMsTUFBRSxDQTRPZjtJQTVPYSxhQUFFO1FBRVosSUFBTyxNQUFNLEdBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNqQyxJQUFPLFNBQVMsR0FBTSxHQUFHLENBQUMsU0FBUyxDQUFDO1FBRXBDLElBQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDO1FBNEI5Qiw4R0FBOEc7UUFFOUc7OztXQUdHO1FBQ0g7WUFB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SyxDQUFDLEtBQUssR0FBRyx5QkFBeUIsQ0FBQztvQkFDdkQsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDckIsQ0FBQztnQkFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2YsQ0FBQztZQUVELEtBQUs7WUFDTCxtQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RCxDQUFDLEVBakRnQixTQUFTLEdBQVQsWUFBUyxLQUFULFlBQVMsUUFpRHpCO0lBQUQsQ0FBQyxFQWpEYSxFQUFFLEdBQUYsTUFBRSxLQUFGLE1BQUUsUUFpRGY7QUFBRCxDQUFDLEVBakRTLEdBQUcsS0FBSCxHQUFHLFFBaURaIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IENvbmZpZyAgICAgICA9IENEUC5Db25maWc7XHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrICAgID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuVGhlbWVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQbGF0Zm9ybVRyYW5zaXRpb25cclxuICAgICAqIEBicmllZiDjg5fjg6njg4Pjg4jjg5Xjgqnjg7zjg6DjgZTjgajjga4gVHJhbnNpdGlvbiDjgpLmoLzntI1cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQbGF0Zm9ybVRyYW5zaXRpb24ge1xyXG4gICAgICAgIFtwbGF0Zm9ybTogc3RyaW5nXTogc3RyaW5nOyAgICAgLy8gZXgpIGlvczogXCJzbGlkZVwiXHJcbiAgICAgICAgZmFsbGJhY2s6IHN0cmluZzsgICAgICAgICAgICAgICAvLyBmYWxsYmFjayB0cmFuc2l0aW9uIHByb3BcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgVHJhbnNpdGlvbk1hcFxyXG4gICAgICogQGJyaWVmIOODiOODqeODs+OCuOOCt+ODp+ODs+ODnuODg+ODl1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRyYW5zaXRpb25NYXAge1xyXG4gICAgICAgIFt0cmFuc2l0aW9uTmFtZTogc3RyaW5nXTogUGxhdGZvcm1UcmFuc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBUaGVtZUluaXRPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYg44OI44Op44Oz44K444K344On44Oz44Oe44OD44OXXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGhlbWVJbml0T3B0aW9ucyB7XHJcbiAgICAgICAgcGxhdGZvcm0/OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAgLy8gcGxhdGZvcm0g44KS5oyH5a6aLiBkZWZhdWx0OlwiYXV0b1wiXHJcbiAgICAgICAgcmVzZXJ2ZVNjcm9sbGJhclJlZ2lvbj86IGJvb2xlYW47ICAgLy8gUEMg44OH44OQ44OD44Kw55Kw5aKD44Gn44Gv44K544Kv44Ot44O844Or44OQ44O844KS6KGo56S6LiBkZWZhdWx0OiBcInRydWVcIlxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgVGhlbWVcclxuICAgICAqIEBicmllZiBVSSBUaGVtZSDoqK3lrprjgpLooYzjgYbjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFRoZW1lIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19wbGF0Zm9ybXM6IHN0cmluZ1tdID0gW1wiaW9zXCIsIFwiYW5kcm9pZFwiXTtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX3BhZ2VUcmFuc2l0aW9uTWFwOiBUcmFuc2l0aW9uTWFwID0ge1xyXG4gICAgICAgICAgICBcInBsYXRmb3JtLWRlZmF1bHRcIjoge1xyXG4gICAgICAgICAgICAgICAgaW9zOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBhbmRyb2lkOiBcImZsb2F0dXBcIixcclxuICAgICAgICAgICAgICAgIGZhbGxiYWNrOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwicGxhdGZvcm0tYWx0ZXJuYXRpdmVcIjoge1xyXG4gICAgICAgICAgICAgICAgaW9zOiBcInNsaWRldXBcIixcclxuICAgICAgICAgICAgICAgIGFuZHJvaWQ6IFwiZmxvYXR1cFwiLFxyXG4gICAgICAgICAgICAgICAgZmFsbGJhY2s6IFwic2xpZGV1cFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19kaWFsb2dUcmFuc2l0aW9uTWFwOiBUcmFuc2l0aW9uTWFwID0ge1xyXG4gICAgICAgICAgICBcInBsYXRmb3JtLWRlZmF1bHRcIjoge1xyXG4gICAgICAgICAgICAgICAgaW9zOiBcInBvcHpvb21cIixcclxuICAgICAgICAgICAgICAgIGFuZHJvaWQ6IFwiY3Jvc3N6b29tXCIsXHJcbiAgICAgICAgICAgICAgICBmYWxsYmFjazogXCJub25lXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZW1lIOOBruWIneacn+WMllxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMg44Kq44OX44K344On44Oz5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnMgdHJ1ZTog5oiQ5YqfIC8gZmFsc2U6IOWkseaVl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW5pdGlhbGl6ZShvcHRpb25zPzogVGhlbWVJbml0T3B0aW9ucyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybTogXCJhdXRvXCIsXHJcbiAgICAgICAgICAgICAgICByZXNlcnZlU2Nyb2xsYmFyUmVnaW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChcImF1dG9cIiA9PT0gb3B0LnBsYXRmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVGhlbWUuZGV0ZWN0VUlQbGF0Zm9ybShvcHQucmVzZXJ2ZVNjcm9sbGJhclJlZ2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVGhlbWUuc2V0Q3VycmVudFVJUGxhdGZvcm0ob3B0LnBsYXRmb3JtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHQucGxhdGZvcm07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInNldEN1cnJlbnRVSVBsYXRmb3JtKCksIGZhaWxlZC4gcGxhdGZvcm06IFwiICsgb3B0LnBsYXRmb3JtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54++5Zyo5oyH5a6a44GV44KM44Gm44GE44KLIFVJIFBsYXRmb3JtIOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBleCkgXCJpb3NcIlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q3VycmVudFVJUGxhdGZvcm0oKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgJGh0bXMgPSAkKFwiaHRtbFwiKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBUaGVtZS5zX3BsYXRmb3Jtcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICgkaHRtcy5oYXNDbGFzcyhcInVpLXBsYXRmb3JtLVwiICsgVGhlbWUuc19wbGF0Zm9ybXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRoZW1lLnNfcGxhdGZvcm1zW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVUkgUGxhdGZvcm0g44KS6Kit5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IHRydWU6IOaIkOWKnyAvIGZhbHNlOiDlpLHmlZdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNldEN1cnJlbnRVSVBsYXRmb3JtKHBsYXRmb3JtOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gcGxhdGZvcm0gfHwgVGhlbWUuc19wbGF0Zm9ybXMuaW5kZXhPZihwbGF0Zm9ybSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGh0bXMgPSAkKFwiaHRtbFwiKTtcclxuICAgICAgICAgICAgICAgIFRoZW1lLnNfcGxhdGZvcm1zLmZvckVhY2goKHRhcmdldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRodG1zLnJlbW92ZUNsYXNzKFwidWktcGxhdGZvcm0tXCIgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGxhdGZvcm0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkaHRtcy5hZGRDbGFzcyhcInVpLXBsYXRmb3JtLVwiICsgcGxhdGZvcm0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOePvuWcqOOBriBQbGF0Zm9ybSDjgpLliKTlrprjgZfmnIDpganjgaogcGxhdGZvcm0g44KS6Ieq5YuV5rG65a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcmVzZXJ2ZVNjcm9sbGJhclJlZ2lvbiBQQyDjg4fjg5Djg4PjgrDnkrDlooPjgafjga/jgrnjgq/jg63jg7zjg6vjg5Djg7zjgpLooajnpLouIGRlZmF1bHQ6IHRydWVcclxuICAgICAgICAgKiBAcmV0dXJucyBleCkgXCJpb3NcIlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGV0ZWN0VUlQbGF0Zm9ybShyZXNlcnZlU2Nyb2xsYmFyUmVnaW9uOiBib29sZWFuID0gdHJ1ZSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBwbGF0Zm9ybSA9IFwiXCI7XHJcbiAgICAgICAgICAgIC8vIHBsYXRmb3JtIOOBruioreWumlxyXG4gICAgICAgICAgICBpZiAoRnJhbWV3b3JrLlBsYXRmb3JtLmlPUykge1xyXG4gICAgICAgICAgICAgICAgJChcImh0bWxcIikuYWRkQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1pb3NcIik7XHJcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybSA9IFwiaW9zXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiaHRtbFwiKS5hZGRDbGFzcyhcInVpLXBsYXRmb3JtLWFuZHJvaWRcIik7XHJcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybSA9IFwiYW5kcm9pZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFBDIOODh+ODkOODg+OCsOeSsOWig+OBp+OBr+OCueOCr+ODreODvOODq+ODkOODvOOCkuihqOekulxyXG4gICAgICAgICAgICBpZiAoQ29uZmlnLkRFQlVHICYmIHJlc2VydmVTY3JvbGxiYXJSZWdpb24gJiYgIUZyYW1ld29yay5QbGF0Zm9ybS5Nb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICQoXCJib2R5XCIpLmNzcyhcIm92ZXJmbG93LXlcIiwgXCJzY3JvbGxcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHBsYXRmb3JtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGxhdGZvcm0g44KS6YWN5YiX44Gn55m76YyyXHJcbiAgICAgICAgICog5LiK5pu444GN44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBwbGF0Zm9ybXMgW2luXSBPUyBleCk6IFtcImlvc1wiLCBcImFuZHJvaWRcIl1cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyVUlQbGF0Zm9ybXMocGxhdGZvcm1zOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAocGxhdGZvcm1zKSB7XHJcbiAgICAgICAgICAgICAgICBUaGVtZS5zX3BsYXRmb3JtcyA9IHBsYXRmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGFnZSB0cmFuc2l0aW9uIOOCkueZu+mMslxyXG4gICAgICAgICAqIOS4iuabuOOBjeOBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtUcmFuc2l0aW9uTWFwfSBtYXAgW2luXSBUcmFuc2l0aW9uTWFwIOOCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJQYWdlVHJhbnNpdGlvbk1hcChtYXA6IFRyYW5zaXRpb25NYXApOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgVGhlbWUuc19wYWdlVHJhbnNpdGlvbk1hcCA9IG1hcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZGlhbG9nIHRyYW5zaXRpb24g44KS55m76YyyXHJcbiAgICAgICAgICog5LiK5pu444GN44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1RyYW5zaXRpb25NYXB9IG1hcCBbaW5dIFRyYW5zaXRpb25NYXAg44KS5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWdpc3RlckRpYWxvZ1RyYW5zaXRpb25NYXAobWFwOiBUcmFuc2l0aW9uTWFwKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChtYXApIHtcclxuICAgICAgICAgICAgICAgIFRoZW1lLnNfZGlhbG9nVHJhbnNpdGlvbk1hcCA9IG1hcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGFnZSB0cmFuc2l0aW9uIOOCkuWPluW+l1xyXG4gICAgICAgICAqIFRyYW5zaXRpb25NYXAg44Gr44Ki44K144Kk44Oz44GV44KM44Gm44GE44KL44KC44Gu44Gn44GC44KM44Gw5aSJ5o+bXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmdbXX0gXCJzbGlkZVwiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBxdWVyeVBhZ2VUcmFuc2l0aW9uKG9yaWdpbmFsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBjb252ZXJ0ID0gVGhlbWUuc19wYWdlVHJhbnNpdGlvbk1hcFtvcmlnaW5hbF07XHJcbiAgICAgICAgICAgIGlmIChjb252ZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udmVydFtUaGVtZS5nZXRDdXJyZW50VUlQbGF0Zm9ybSgpXSB8fCBjb252ZXJ0LmZhbGxiYWNrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBkaWFsb2cgdHJhbnNpdGlvbiDjgpLlj5blvpdcclxuICAgICAgICAgKiBUcmFuc2l0aW9uTWFwIOOBq+OCouOCteOCpOODs+OBleOCjOOBpuOBhOOCi+OCguOBruOBp+OBguOCjOOBsOWkieaPm1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nW119IFwic2xpZGVcIlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcXVlcnlEaWFsb2dUcmFuc2l0aW9uKG9yaWdpbmFsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBjb252ZXJ0ID0gVGhlbWUuc19kaWFsb2dUcmFuc2l0aW9uTWFwW29yaWdpbmFsXTtcclxuICAgICAgICAgICAgaWYgKGNvbnZlcnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb252ZXJ0W1RoZW1lLmdldEN1cnJlbnRVSVBsYXRmb3JtKCldIHx8IGNvbnZlcnQuZmFsbGJhY2s7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvLyBqcXVleS5tb2JpbGUuY2hhbmdlUGFnZSgpIOOBriBIb29rLlxyXG4gICAgZnVuY3Rpb24gYXBwbHlDdXN0b21DaGFuZ2VQYWdlKCkge1xyXG4gICAgICAgIGNvbnN0IGpxbUNoYW5nZVBhZ2U6ICh0bzogYW55LCBvcHRpb25zPzogQ2hhbmdlUGFnZU9wdGlvbnMpID0+IHZvaWQgPSBfLmJpbmQoJC5tb2JpbGUuY2hhbmdlUGFnZSwgJC5tb2JpbGUpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjdXN0b21DaGFuZ2VQYWdlKHRvOiBhbnksIG9wdGlvbnM/OiBDaGFuZ2VQYWdlT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoXy5pc1N0cmluZyh0bykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudHJhbnNpdGlvbiA9IFRoZW1lLnF1ZXJ5UGFnZVRyYW5zaXRpb24ob3B0aW9ucy50cmFuc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBqcW1DaGFuZ2VQYWdlKHRvLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQubW9iaWxlLmNoYW5nZVBhZ2UgPSBjdXN0b21DaGFuZ2VQYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGZyYW1ld29yayDliJ3mnJ/ljJblvozjgavpgannlKhcclxuICAgIEZyYW1ld29yay53YWl0Rm9ySW5pdGlhbGl6ZSgpXHJcbiAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBhcHBseUN1c3RvbUNoYW5nZVBhZ2UoKTtcclxuICAgICAgICB9KTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgRG9tRXh0ZW5zaW9uT3B0aW9uc1xyXG4gICAgICogQGJyZWlmIERvbUV4dGVuc2lvbiDjgavmuKHjgZnjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEb21FeHRlbnNpb25PcHRpb25zIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSBEb21FeHRlbnNpb25cclxuICAgICAqIEBicmllZiBET00g5ouh5by16Zai5pWwXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIERvbUV4dGVuc2lvbiA9ICgkdGFyZ2V0OiBKUXVlcnksIERvbUV4dGVuc2lvbk9wdGlvbnM/OiBPYmplY3QpID0+IEpRdWVyeTtcclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEV4dGVuc2lvbk1hbmFnZXJcclxuICAgICAqIEBicmllZiDmi6HlvLXmqZ/og73jgpLnrqHnkIbjgZnjgovjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEV4dGVuc2lvbk1hbmFnZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX2RvbUV4dGVuc2lvbnM6IERvbUV4dGVuc2lvbltdID0gW107XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERPTSDmi6HlvLXplqLmlbDjga7nmbvpjLJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9ufSBmdW5jIFtpbl0gRE9NIOaLoeW8temWouaVsFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJEb21FeHRlbnNpb24oZnVuYzogRG9tRXh0ZW5zaW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc19kb21FeHRlbnNpb25zLnB1c2goZnVuYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBET00g5ouh5by144KS6YGp55SoXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHVpICAgICAgIFtpbl0g5ouh5by15a++6LGh44GuIERPTVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNfZG9tRXh0ZW5zaW9ucy5mb3JFYWNoKChmdW5jOiBEb21FeHRlbnNpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGZ1bmMoJHVpLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2UgKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5Ub2FzdF0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgVG9hc3RcclxuICAgICAqIEBicmllZiBBbmRyb2lkIFNESyDjga4gVG9hc3Qg44Kv44Op44K544Gu44KI44GG44Gr6Ieq5YuV5raI5ruF44GZ44KL44Oh44OD44K744O844K45Ye65Yqb44Om44O844OG44Kj44Oq44OG44KjXHJcbiAgICAgKiAgICAgICAg5YWl44KM5a2Q44Gu6Zai5L+C44KS5a6f54++44GZ44KL44Gf44KB44GrIG1vZHVsZSDjgaflrp/oo4VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IG1vZHVsZSBUb2FzdCB7XHJcblxyXG4gICAgICAgIC8vIOihqOekuuaZgumWk+OBruWumue+qVxyXG4gICAgICAgIGV4cG9ydCBsZXQgTEVOR1RIX1NIT1JUID0gMTUwMDsgICAvLyE8IOefreOBhDoxNTAwIG1zZWNcclxuICAgICAgICBleHBvcnQgbGV0IExFTkdUSF9MT05HICA9IDQwMDA7ICAgLy8hPCDplbfjgYQ6NDAwMCBtc2VjXHJcblxyXG4gICAgICAgIC8vISBAZW51bSDjgqrjg5Xjgrvjg4Pjg4jjga7ln7rmupZcclxuICAgICAgICBleHBvcnQgZW51bSBPZmZzZXRYIHtcclxuICAgICAgICAgICAgTEVGVCAgICA9IDB4MDAwMSxcclxuICAgICAgICAgICAgUklHSFQgICA9IDB4MDAwMixcclxuICAgICAgICAgICAgQ0VOVEVSICA9IDB4MDAwNCxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBAZW51bSDjgqrjg5Xjgrvjg4Pjg4jjga7ln7rmupZcclxuICAgICAgICBleHBvcnQgZW51bSBPZmZzZXRZIHtcclxuICAgICAgICAgICAgVE9QICAgICA9IDB4MDAxMCxcclxuICAgICAgICAgICAgQk9UVE9NICA9IDB4MDAyMCxcclxuICAgICAgICAgICAgQ0VOVEVSICA9IDB4MDA0MCxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBpbnRlcmZhY2UgU3R5bGVCdWlsZGVyXHJcbiAgICAgICAgICogQGJyaWVmICAgICDjgrnjgr/jgqTjg6vlpInmm7TmmYLjgavkvb/nlKjjgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAgICAgKiAgICAgICAgICAgIGNzcyDjgavjgrnjgr/jgqTjg6vjgpLpgIPjgYzjgZnloLTlkIjjgIHni6zoh6rjga4gY2xhc3Mg44KS6Kit5a6a44GX44CBZ2V0U3R5bGUg44GvIG51bGwg44KS6L+U44GZ44GT44Go44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTdHlsZUJ1aWxkZXIge1xyXG4gICAgICAgICAgICAvLyEgY2xhc3MgYXR0cmlidXRlIOOBq+ioreWumuOBmeOCi+aWh+Wtl+WIl+OCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRDbGFzcygpOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIC8vISBzdHlsZSBhdHRyaWJ1dGUg44Gr6Kit5a6a44GZ44KLIEpTT04g44Kq44OW44K444Kn44Kv44OI44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldFN0eWxlKCk6IGFueTtcclxuICAgICAgICAgICAgLy8hIOOCquODleOCu+ODg+ODiOOBruWfuua6luS9jee9ruOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRQb2ludCgpOiBudW1iZXI7XHJcbiAgICAgICAgICAgIC8vISBYIOW6p+aomeOBruOCquODleOCu+ODg+ODiOWApOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRYKCk6IG51bWJlcjtcclxuICAgICAgICAgICAgLy8hIFkg5bqn5qiZ44Gu44Kq44OV44K744OD44OI5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFkoKTogbnVtYmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGNsYXNzIFN0eWxlQnVpbGRlckRlZmF1bHRcclxuICAgICAgICAgKiBAYnJpZWYg44K544K/44Kk44Or5aSJ5pu05pmC44Gr5L2/55So44GZ44KL5pei5a6a44Gu5qeL6YCg5L2T44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFN0eWxlQnVpbGRlckRlZmF1bHQgaW1wbGVtZW50cyBTdHlsZUJ1aWxkZXIge1xyXG5cclxuICAgICAgICAgICAgLy8hIGNsYXNzIGF0dHJpYnV0ZSDjgavoqK3lrprjgZnjgovmloflrZfliJfjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0Q2xhc3MoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInVpLWxvYWRlciB1aS1vdmVybGF5LXNoYWRvdyB1aS1jb3JuZXItYWxsXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vISBzdHlsZSBhdHRyaWJ1dGUg44Gr6Kit5a6a44GZ44KLIEpTT04g44Kq44OW44K444Kn44Kv44OI44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldFN0eWxlKCk6IGFueSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhZGRpbmdcIjogICAgICAgICAgXCI3cHggMjVweCA3cHggMjVweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzcGxheVwiOiAgICAgICAgICBcImJsb2NrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiIzFkMWQxZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6ICAgICBcIiMxYjFiMWJcIixcclxuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6ICAgICAgICAgICAgXCIjZmZmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0LXNoYWRvd1wiOiAgICAgIFwiMCAxcHggMCAjMTExXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJmb250LXdlaWdodFwiOiAgICAgIFwiYm9sZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib3BhY2l0eVwiOiAgICAgICAgICAwLjgsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyEg44Kq44OV44K744OD44OI44Gu5Z+65rqW5L2N572u44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFBvaW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2Zmc2V0WC5DRU5URVIgfCBPZmZzZXRZLkJPVFRPTTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8hIFgg5bqn5qiZ44Gu44Kq44OV44K744OD44OI5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyEgWSDluqfmqJnjga7jgqrjg5Xjgrvjg4Pjg4jlgKTjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0WSgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC03NTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVG9hc3Qg6KGo56S6XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZSAgW2luXSDjg6Hjg4Pjgrvjg7zjgrhcclxuICAgICAgICAgKiBAcGFyYW0gZHVyYXRpb24gW2luXSDooajnpLrmmYLplpPjgpLoqK3lrpogKG1zZWMpIGRlZmF1bHQ6IExFTkdUSF9TSE9SVFxyXG4gICAgICAgICAqIEBwYXJhbSBzdHlsZSAgICBbaW5dIOOCueOCv+OCpOODq+WkieabtOOBmeOCi+WgtOWQiOOBq+OBr+a0vueUn+OCr+ODqeOCueOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBzaG93KG1lc3NhZ2U6IHN0cmluZywgZHVyYXRpb246IG51bWJlciA9IFRvYXN0LkxFTkdUSF9TSE9SVCwgc3R5bGU/OiBTdHlsZUJ1aWxkZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgJG1vYmlsZSA9ICQubW9iaWxlO1xyXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gc3R5bGUgfHwgbmV3IFN0eWxlQnVpbGRlckRlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc3Qgc2V0Q1NTID0gaW5mby5nZXRTdHlsZSgpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy8g5pS56KGM44Kz44O844OJ44GvIDxici8+IOOBq+e9ruaPm+OBmeOCi1xyXG4gICAgICAgICAgICBjb25zdCBtc2cgPSBtZXNzYWdlLnJlcGxhY2UoL1xcbi9nLCBcIjxici8+XCIpO1xyXG5cclxuICAgICAgICAgICAgLy8g44Oh44OD44K744O844K4IGVsZW1lbnQg44Gu5YuV55qE55Sf5oiQXHJcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBcIjxkaXY+XCIgKyBtc2cgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICBjb25zdCBib3ggPSAkKGh0bWwpLmFkZENsYXNzKGluZm8uZ2V0Q2xhc3MoKSk7XHJcbiAgICAgICAgICAgIGlmIChzZXRDU1MpIHtcclxuICAgICAgICAgICAgICAgIGJveC5jc3MoaW5mby5nZXRTdHlsZSgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g6Ieq5YuV5pS56KGM44GV44KM44Gm44KC44KI44GE44KI44GG44Gr44CB5Z+654K544KS6Kit5a6a44GX44Gm44GL44KJ6L+95YqgXHJcbiAgICAgICAgICAgIGJveC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgXCJ0b3BcIjogMCxcclxuICAgICAgICAgICAgICAgIFwibGVmdFwiOiAwLFxyXG4gICAgICAgICAgICB9KS5hcHBlbmRUbygkbW9iaWxlLnBhZ2VDb250YWluZXIpO1xyXG5cclxuICAgICAgICAgICAgLy8g6YWN572u5L2N572u44Gu5rG65a6aXHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldFBvaW50ID0gaW5mby5nZXRPZmZzZXRQb2ludCgpO1xyXG4gICAgICAgICAgICBjb25zdCAkd2luZG93ID0gJCh3aW5kb3cpO1xyXG4gICAgICAgICAgICBsZXQgcG9zWCwgcG9zWTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJveF93aWR0aCA9IGJveC53aWR0aCgpICsgcGFyc2VJbnQoYm94LmNzcyhcInBhZGRpbmctbGVmdFwiKSwgMTApICsgcGFyc2VJbnQoYm94LmNzcyhcInBhZGRpbmctcmlnaHRcIiksIDEwKTtcclxuICAgICAgICAgICAgY29uc3QgYm94X2hlaWdodCA9IGJveC5oZWlnaHQoKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLXRvcFwiKSwgMTApICsgcGFyc2VJbnQoYm94LmNzcyhcInBhZGRpbmctYm90dG9tXCIpLCAxMCk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKG9mZnNldFBvaW50ICYgMHgwMDBGKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFguTEVGVDpcclxuICAgICAgICAgICAgICAgICAgICBwb3NYID0gMCArIGluZm8uZ2V0T2Zmc2V0WCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRYLlJJR0hUOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSAkd2luZG93LndpZHRoKCkgLSBib3hfd2lkdGggKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WC5DRU5URVI6XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWCA9ICgkd2luZG93LndpZHRoKCkgLyAyKSAtIChib3hfd2lkdGggLyAyKSArIGluZm8uZ2V0T2Zmc2V0WCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ3YXJuLiB1bmtub3duIG9mZnNldFBvaW50OlwiICsgKG9mZnNldFBvaW50ICYgMHgwMDBGKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWCA9ICgkd2luZG93LndpZHRoKCkgLyAyKSAtIChib3hfd2lkdGggLyAyKSArIGluZm8uZ2V0T2Zmc2V0WCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKG9mZnNldFBvaW50ICYgMHgwMEYwKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFkuVE9QOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSAwICsgaW5mby5nZXRPZmZzZXRZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFkuQk9UVE9NOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSAkd2luZG93LmhlaWdodCgpIC0gYm94X2hlaWdodCArIGluZm8uZ2V0T2Zmc2V0WSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRZLkNFTlRFUjpcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gKCR3aW5kb3cuaGVpZ2h0KCkgLyAyKSAtIChib3hfaGVpZ2h0IC8gMikgKyBpbmZvLmdldE9mZnNldFkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwid2Fybi4gdW5rbm93biBvZmZzZXRQb2ludDpcIiArIChvZmZzZXRQb2ludCAmIDB4MDBGMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSAoJHdpbmRvdy5oZWlnaHQoKSAvIDIpIC0gKGJveF9oZWlnaHQgLyAyKSArIGluZm8uZ2V0T2Zmc2V0WSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDooajnpLpcclxuICAgICAgICAgICAgYm94LmNzcyh7XHJcbiAgICAgICAgICAgICAgICBcInRvcFwiOiBwb3NZLFxyXG4gICAgICAgICAgICAgICAgXCJsZWZ0XCI6IHBvc1gsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5kZWxheShkdXJhdGlvbilcclxuICAgICAgICAgICAgLmZhZGVPdXQoNDAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgICAgICA9IENEUC5Qcm9taXNlO1xyXG4gICAgaW1wb3J0IEZyYW1ld29yayAgICA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkRpYWxvZ10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIL1cgQmFjayBLZXkgSG9vayDplqLmlbBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IHR5cGUgRGlhbG9nQmFja0tleUhhbmRsZXIgPSAoZXZlbnQ/OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIERpYWxvZ09wdGlvbnNcclxuICAgICAqICAgICAgICAgICAg44OA44Kk44Ki44Ot44Kw44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGlhbG9nT3B0aW9ucyBleHRlbmRzIFBvcHVwT3B0aW9ucyB7XHJcbiAgICAgICAgc3JjPzogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IHRlbXBsYXRlIOODleOCoeOCpOODq+OBruODkeOCuSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxyXG4gICAgICAgIHRpdGxlPzogc3RyaW5nOyAgICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSDjg4DjgqTjgqLjg63jgrDjgr/jgqTjg4jjg6sgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxyXG4gICAgICAgIG1lc3NhZ2U/OiBzdHJpbmc7ICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSDjg6HjgqTjg7Pjg6Hjg4Pjgrvjg7zjgrggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXHJcbiAgICAgICAgaWRQb3NpdGl2ZT86IHN0cmluZzsgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IFBvc2l0aXZlIOODnOOCv+ODs+OBrklEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiZGxnLWJ0bi1wb3NpdGl2ZVwiXHJcbiAgICAgICAgaWROZWdhdGl2ZT86IHN0cmluZzsgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IE5hZ2F0aXZlIOODnOOCv+ODs+OBrklEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiZGxnLWJ0bi1uZWdhdGl2ZVwiXHJcbiAgICAgICAgZXZlbnQ/OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IERpYWxvZyDjgq/jg6njgrnjgYznrqHnkIbjgZnjgovjgqTjg5njg7Pjg4ggICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJ2Y2xpY2tcIlxyXG4gICAgICAgIGRlZmF1bHRBdXRvQ2xvc2U/OiBib29sZWFuOyAgICAgLy8hPCB7Qm9vbGVhbn0gZGF0YS1hdXRvLWNsb3NlIOOBjOaMh+WumuOBleOCjOOBpuOBhOOBquOBhOWgtOWQiOOBruaXouWumuWApCAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgZm9yY2VPdmVyd3JpdGVBZnRlckNsb3NlPzogYm9vbGVhbjsgLy8hPCB7Qm9vbGVhbn0gYWZ0ZXJjbG9zZSDjgqrjg5fjgrfjg6fjg7PjgpLlvLfliLbkuIrmm7jjgY3jgZnjgovjgZ/jgoHjga7oqK3lrpogICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICBsYWJlbFBvc2l0aXZlPzogc3RyaW5nOyAgICAgICAgIC8vITwge1N0cmluZ30gUG9zaXRpdmUg44Oc44K/44Oz44Op44OZ44OrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcIk9LXCJcclxuICAgICAgICBsYWJlbE5lZ2F0aXZlPzogc3RyaW5nOyAgICAgICAgIC8vITwge1N0cmluZ30gTmVnYXRpdmUg44Oc44K/44Oz44Op44OZ44OrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcIkNhbmNlbFwiXHJcbiAgICAgICAgYmFja0tleT86IFwiY2xvc2VcIiB8IFwiZGVueVwiIHwgRGlhbG9nQmFja0tleUhhbmRsZXI7ICAvLyE8IEgvVyBiYWNrS2V5IOOBruaMr+OCi+iInuOBhCAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJjbG9zZVwiXHJcbiAgICAgICAgc2Nyb2xsRXZlbnQ/OiBcImRlbnlcIiB8IFwiYWxsb3dcIiB8IFwiYWRqdXN0XCI7ICAgLy8hPCB7U3RyaW5nfSBzY3JvbGzjga7mipHmraLmlrnlvI8gICjigLsgYWRqdXN0IOOBr+ippumok+eahCkgICAgIGRlZmF1bHQ6IFwiZGVueVwiXHJcbiAgICAgICAgZG9tRXh0ZW5zaW9uT3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnM7ICAgLy8hPCBET03mi6HlvLXjgqrjg5fjgrfjg6fjg7MuIG51bGx8dW5kZWZpbmVkIOOBp+aLoeW8teOBl+OBquOBhCAgICAgIGRlZmF1bHQ6IHt9XHJcbiAgICAgICAgW3g6IHN0cmluZ106IGFueTsgICAgICAgICAgICAgICAvLyE8IGFueSBkaWFsb2cgdGVtcGxhdGUgcGFyYW1ldGVycy5cclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIERpYWxvZ1xyXG4gICAgICogQGJyaWVmIOaxjueUqOODgOOCpOOCouODreOCsOOCr+ODqeOCuVxyXG4gICAgICogICAgICAgIGpRTSDjga4gcG9wdXAgd2lkZ2V0IOOBq+OCiOOBo+OBpuWun+ijhVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgRGlhbG9nIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGU6IFRvb2xzLkpTVCA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfc2V0dGluZ3M6IERpYWxvZ09wdGlvbnMgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgXyRkaWFsb2c6IEpRdWVyeSA9IG51bGw7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfYWN0aXZlRGlhbG9nOiBEaWFsb2cgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfb2xkQmFja0tleUhhbmRsZXI6IChldmVudD86IEpRdWVyeS5FdmVudCkgPT4gdm9pZCA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19kZWZhdWx0T3B0aW9uczogRGlhbG9nT3B0aW9ucyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaWQgICAgICB7U3RyaW5nfSAgICAgICAgW2luXSDjg4DjgqTjgqLjg63jgrAgRE9NIElEIOOCkuaMh+WumiBleCkgI2RpYWxvZy1ob2dlXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0RpYWxvZ09wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ09wdGlvbnMpIHtcclxuICAgICAgICAgICAgLy8gRGlhbG9nIOWFsemAmuioreWumuOBruWIneacn+WMllxyXG4gICAgICAgICAgICBEaWFsb2cuaW5pdENvbW1vbkNvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICAvLyDoqK3lrprjgpLmm7TmlrBcclxuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgRGlhbG9nLnNfZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAvLyDjg4DjgqTjgqLjg63jgrDjg4bjg7Pjg5fjg6zjg7zjg4jjgpLkvZzmiJBcclxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBUb29scy5UZW1wbGF0ZS5nZXRKU1QoaWQsIHRoaXMuX3NldHRpbmdzLnNyYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOihqOekulxyXG4gICAgICAgICAqIOihqOekuuOCkuOBl+OBpuWni+OCgeOBpiBET00g44GM5pyJ5Yq544Gr44Gq44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7RGlhbG9nT3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7MgKHNyYyDjga/nhKHoppbjgZXjgozjgospXHJcbiAgICAgICAgICogQHJldHVybiDjg4DjgqTjgqLjg63jgrDjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzaG93KG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgY29uc3QgJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XHJcbiAgICAgICAgICAgIGNvbnN0ICRib2R5ID0gJChcImJvZHlcIik7XHJcbiAgICAgICAgICAgIGNvbnN0ICRwYWdlID0gKDxhbnk+JGJvZHkpLnBhZ2Vjb250YWluZXIoXCJnZXRBY3RpdmVQYWdlXCIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb2ZjSGlkZGVuID0ge1xyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvd1wiOiAgICAgXCJoaWRkZW5cIixcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteFwiOiAgIFwiaGlkZGVuXCIsXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXlcIjogICBcImhpZGRlblwiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBvZmNCb2R5ID0geyAvLyBib2R5IG92ZXJmbG93IGNvbnRleHRcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3dcIjogICAgICRib2R5LmNzcyhcIm92ZXJmbG93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy14XCI6ICAgJGJvZHkuY3NzKFwib3ZlcmZsb3cteFwiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteVwiOiAgICRib2R5LmNzcyhcIm92ZXJmbG93LXlcIiksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudFNjcm9sbFBvcyA9ICRib2R5LnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICBjb25zdCBvZmNQYWdlID0geyAvLyBwYWdlIG92ZXJmbG93IGNvbnRleHRcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3dcIjogICAgICRwYWdlLmNzcyhcIm92ZXJmbG93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy14XCI6ICAgJHBhZ2UuY3NzKFwib3ZlcmZsb3cteFwiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteVwiOiAgICRwYWdlLmNzcyhcIm92ZXJmbG93LXlcIiksXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzY3JvbGxFdmVudCA9IFwic2Nyb2xsIHRvdWNobW92ZSBtb3VzZW1vdmUgTVNQb2ludGVyTW92ZVwiO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsSGFuZGVyID0gKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChcImRlbnlcIiA9PT0gdGhpcy5fc2V0dGluZ3Muc2Nyb2xsRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImFkanVzdFwiID09PSB0aGlzLl9zZXR0aW5ncy5zY3JvbGxFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRib2R5LnNjcm9sbFRvcChwYXJlbnRTY3JvbGxQb3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gb3B0aW9uIOOBjOaMh+WumuOBleOCjOOBpuOBhOOBn+WgtOWQiOabtOaWsFxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB0aGlzLl9zZXR0aW5ncywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGFmdGVyY2xvc2Ug5Yem55CG44GvIERpYWxvZyDjga7noLTmo4Tlh6bnkIbjgpLlrp/oo4XjgZnjgovjgZ/jgoHln7rmnKznmoTjgavoqK3lrprnpoHmraIgKOW8t+WItuS4iuabuOOBjeODouODvOODieOCkuioreWumuS9v+eUqOWPrylcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmFmdGVyY2xvc2UgJiYgIXRoaXMuX3NldHRpbmdzLmZvcmNlT3ZlcndyaXRlQWZ0ZXJDbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiY2Fubm90IGFjY2VwdCAnYWZ0ZXJjbG9zZScgb3B0aW9uLiBwbGVhc2UgaW5zdGVhZCB1c2luZyAncG9wdXBhZnRlcmNsb3NlJyBldmVudC5cIik7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fc2V0dGluZ3MuYWZ0ZXJjbG9zZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gdGl0bGUg44Gu5pyJ54ShXHJcbiAgICAgICAgICAgICg8YW55PnRoaXMuX3NldHRpbmdzKS5fdGl0bGVTdGF0ZSA9IHRoaXMuX3NldHRpbmdzLnRpdGxlID8gXCJ1aS1oYXMtdGl0bGVcIiA6IFwidWktbm8tdGl0bGVcIjtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRlbXBsYXRlIOOBi+OCiSBqUXVlcnkg44Kq44OW44K444Kn44Kv44OI44KS5L2c5oiQ44GX44CBXHJcbiAgICAgICAgICAgICAqIDxib2R5PiDnm7TkuIvjgavov73liqAuXHJcbiAgICAgICAgICAgICAqICRwYWdlIOOBp+OBryBCYWNrYm9uZSBldmVudCDjgpLlj5fjgZHjgonjgozjgarjgYTjgZPjgajjgavms6jmhI9cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cgPSAkKHRoaXMuX3RlbXBsYXRlKHRoaXMuX3NldHRpbmdzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cubG9jYWxpemUoKTtcclxuICAgICAgICAgICAgJGJvZHkuYXBwZW5kKHRoaXMuXyRkaWFsb2cpO1xyXG5cclxuICAgICAgICAgICAgLy8gdGhlbWUg44KS6Kej5rG6XHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZVRoZW1lKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl8kZGlhbG9nXHJcbiAgICAgICAgICAgICAgICAub24oXCJwb3B1cGNyZWF0ZVwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOOCueOCr+ODreODvOODq+OCkuaKkeatolxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcImFsbG93XCIgIT09IHRoaXMuX3NldHRpbmdzLnNjcm9sbEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vbihzY3JvbGxFdmVudCwgc2Nyb2xsSGFuZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJGJvZHkuY3NzKG9mY0hpZGRlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2UuY3NzKG9mY0hpZGRlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgRGlhbG9nLnJlZ2lzdGVyKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5lbmhhbmNlV2l0aGluKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBET00g5ouh5by1XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX3NldHRpbmdzLmRvbUV4dGVuc2lvbk9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIEV4dGVuc2lvbk1hbmFnZXIuYXBwbHlEb21FeHRlbnNpb24odGhpcy5fJGRpYWxvZywgdGhpcy5fc2V0dGluZ3MuZG9tRXh0ZW5zaW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMub25CZWZvcmVTaG93KClcclxuICAgICAgICAgICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDooajnpLpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kZGlhbG9nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wb3B1cCgkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25UbzogXCJ3aW5kb3dcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyY2xvc2U6IChldmVudDogSlF1ZXJ5LkV2ZW50LCB1aTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g44K544Kv44Ot44O844Or54q25oWL44KS5oi744GZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHBhZ2UuY3NzKG9mY1BhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRib2R5LmNzcyhvZmNCb2R5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXCJhbGxvd1wiICE9PSB0aGlzLl9zZXR0aW5ncy5zY3JvbGxFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub2ZmKHNjcm9sbEV2ZW50LCBzY3JvbGxIYW5kZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEaWFsb2cucmVnaXN0ZXIobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl8kZGlhbG9nID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMuX3NldHRpbmdzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnBvcHVwKFwib3BlblwiKS5vbih0aGlzLl9zZXR0aW5ncy5ldmVudCwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiZGF0YS1hdXRvLWNsb3NlPSdmYWxzZSdcIiDjgYzmjIflrprjgZXjgozjgabjgYTjgovopoHntKDjga8gZGlhbG9nIOOCkumWieOBmOOBquOBhFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF1dG9DbG9zZSA9ICQoZXZlbnQudGFyZ2V0KS5hdHRyKFwiZGF0YS1hdXRvLWNsb3NlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gYXV0b0Nsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b0Nsb3NlID0gdGhpcy5fc2V0dGluZ3MuZGVmYXVsdEF1dG9DbG9zZSA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFwiZmFsc2VcIiA9PT0gYXV0b0Nsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5mYWlsKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJEaWFsb2cuc2hvdygpIGZhaWxlZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuXyRkaWFsb2cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZy50cmlnZ2VyKFwiZXJyb3JcIiwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRkaWFsb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDntYLkuoZcclxuICAgICAgICAgKiDln7rmnKznmoTjgavjga/oh6rli5XjgafplonjgZjjgovjgYzjgIFcclxuICAgICAgICAgKiDooajnpLrkuK3jga7jg4DjgqTjgqLjg63jgrDjgpLjgq/jg6njgqTjgqLjg7Pjg4jlgbTjgYvjgonplonjgZjjgovjg6Hjgr3jg4Pjg4lcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY2xvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl8kZGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kZGlhbG9nLnBvcHVwKFwiY2xvc2VcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg4DjgqTjgqLjg63jgrAgZWxlbWVudCDjgpLlj5blvpdcclxuICAgICAgICBwdWJsaWMgZ2V0ICRlbCgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJGRpYWxvZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJvdGVjdGVkIG1ldGhvZHM6IE92ZXJyaWRlXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODgOOCpOOCouODreOCsOihqOekuuOBruebtOWJjVxyXG4gICAgICAgICAqIERPTSDjgpLmk43kvZzjgafjgY3jgovjgr/jgqTjg5/jg7PjgrDjgaflkbzjgbPlh7rjgZXjgozjgosuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtJUHJvbWlzZUJhc2V9IHByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQmVmb3JlU2hvdygpOiBJUHJvbWlzZUJhc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHZvaWQ+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg4DjgqTjgqLjg63jgrDjga7kvb/nlKjjgZnjgosgVGhlbWUg44KS6Kej5rG6XHJcbiAgICAgICAgICog5LiN6KaB44Gq5aC05ZCI44Gv44Kq44O844OQ44O844Op44Kk44OJ44GZ44KL44GT44Go44KC5Y+v6IO9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlc29sdmVUaGVtZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgcXVlcnlUaGVtZSA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQoXCIudWktcGFnZS1hY3RpdmVcIikuanFtRGF0YShcInRoZW1lXCIpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZVRoZW1lOiBzdHJpbmc7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3NldHRpbmdzLnRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21UaGVtZSA9IHRoaXMuXyRkaWFsb2cuanFtRGF0YShcInRoZW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkb21UaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzLnRoZW1lID0gY2FuZGlkYXRlVGhlbWUgPSBxdWVyeVRoZW1lKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fc2V0dGluZ3Mub3ZlcmxheVRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21PdmVybGF5VGhlbWUgPSB0aGlzLl8kZGlhbG9nLmpxbURhdGEoXCJvdmVybGF5LXRoZW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkb21PdmVybGF5VGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy5vdmVybGF5VGhlbWUgPSBjYW5kaWRhdGVUaGVtZSB8fCBxdWVyeVRoZW1lKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRyYW5zaXRpb24g44Gu5pu05pawXHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzLnRyYW5zaXRpb24gPSBUaGVtZS5xdWVyeURpYWxvZ1RyYW5zaXRpb24odGhpcy5fc2V0dGluZ3MudHJhbnNpdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEaWFsb2cg44Gu5pei5a6a44Kq44OX44K344On44Oz44KS5pu05pawXHJcbiAgICAgICAgICog44GZ44G544Gm44GuIERpYWxvZyDjgYzkvb/nlKjjgZnjgovlhbHpgJroqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtEaWFsb2dPcHRpb25zfSBbaW5dIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2V0RGVmYXVsdE9wdGlvbnMob3B0aW9uczogRGlhbG9nT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBEaWFsb2cg5YWx6YCa6Kit5a6a44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICAgIERpYWxvZy5pbml0Q29tbW9uQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIERpYWxvZy5zX2RlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vIOePvuWcqCBhY3RpdmUg44Gq44OA44Kk44Ki44Ot44Kw44Go44GX44Gm55m76Yyy44GZ44KLXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVnaXN0ZXIoZGlhbG9nOiBEaWFsb2cpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gZGlhbG9nICYmIG51bGwgIT0gRGlhbG9nLnNfYWN0aXZlRGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJuZXcgZGlhbG9nIHByb2MgaXMgY2FsbGVkIGluIHRoZSBwYXN0IGRpYWxvZydzIG9uZS4gdXNlIHNldFRpbWVvdXQoKSBmb3IgcG9zdCBwcm9jZXNzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEaWFsb2cuc19hY3RpdmVEaWFsb2cgPSBkaWFsb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEaWFsb2cg5YWx6YCa6Kit5a6a44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgaW5pdENvbW1vbkNvbmRpdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gRnJhbWV3b3JrIOOBruWIneacn+WMluW+jOOBq+WHpueQhuOBmeOCi+W/heimgeOBjOOBguOCi1xyXG4gICAgICAgICAgICBpZiAoIUZyYW1ld29yay5pc0luaXRpYWxpemVkKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImluaXRDb21tb25Db25kaXRpb24oKSBzaG91bGQgYmUgY2FsbGVkIGFmdGVyIEZyYW1ld29yay5pbml0aWFsaXplZC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChudWxsID09IERpYWxvZy5zX29sZEJhY2tLZXlIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCYWNrIEJ1dHRvbiBIYW5kbGVyXHJcbiAgICAgICAgICAgICAgICBEaWFsb2cuc19vbGRCYWNrS2V5SGFuZGxlciA9IENEUC5zZXRCYWNrQnV0dG9uSGFuZGxlcihudWxsKTtcclxuICAgICAgICAgICAgICAgIENEUC5zZXRCYWNrQnV0dG9uSGFuZGxlcihEaWFsb2cuY3VzdG9tQmFja0tleUhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOaXouWumuOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAgICAgICAgRGlhbG9nLnNfZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWRQb3NpdGl2ZTogICAgICAgICAgICAgXCJkbGctYnRuLXBvc2l0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaWROZWdhdGl2ZTogICAgICAgICAgICAgXCJkbGctYnRuLW5lZ2F0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6ICAgICAgICAgICAgICAgICAgRnJhbWV3b3JrLmdldERlZmF1bHRDbGlja0V2ZW50KCksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzbWlzc2libGU6ICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdEF1dG9DbG9zZTogICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogICAgICAgICAgICAgXCJwbGF0Zm9ybS1kZWZhdWx0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxQb3NpdGl2ZTogICAgICAgICAgXCJPS1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsTmVnYXRpdmU6ICAgICAgICAgIFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja0tleTogICAgICAgICAgICAgICAgXCJjbG9zZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbEV2ZW50OiAgICAgICAgICAgIFwiZGVueVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM6ICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSC9XIEJhY2sgQnV0dG9uIEhhbmRsZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21CYWNrS2V5SGFuZGxlcihldmVudD86IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBEaWFsb2cuc19hY3RpdmVEaWFsb2cpIHtcclxuICAgICAgICAgICAgICAgIGlmIChcImNsb3NlXCIgPT09IERpYWxvZy5zX2FjdGl2ZURpYWxvZy5fc2V0dGluZ3MuYmFja0tleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIERpYWxvZy5zX2FjdGl2ZURpYWxvZy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBEaWFsb2cuc19hY3RpdmVEaWFsb2cuX3NldHRpbmdzLmJhY2tLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAoPERpYWxvZ0JhY2tLZXlIYW5kbGVyPkRpYWxvZy5zX2FjdGl2ZURpYWxvZy5fc2V0dGluZ3MuYmFja0tleSkoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBEaWFsb2cg44GMIGFjdGl2ZSDjgarloLTlkIjjgIHluLjjgavml6Llrprjga7jg4/jg7Pjg4njg6njgavjga/muKHjgZXjgarjgYRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEaWFsb2cuc19vbGRCYWNrS2V5SGFuZGxlcihldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkRpYWxvZ0NvbW1vbnNdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWxlcnRcclxuICAgICAqIGFsZXJ0IOODoeODg+OCu+ODvOOCuOihqOekulxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICAgW2luXSDooajnpLrmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uc10gW2luXSDjg4DjgqTjgqLjg63jgrDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEByZXR1cm4ge2pRdWVyeX0g44OA44Kk44Ki44Ot44Kw44GuIERPTSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGFsZXJ0KG1lc3NhZ2U6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ09wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYFxyXG4gICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInVpLW1vZGFsXCIgZGF0YS1yb2xlPVwicG9wdXBcIiBkYXRhLWNvcm5lcnM9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cInVpLXRpdGxlIHt7X3RpdGxlU3RhdGV9fVwiPnt7dGl0bGV9fTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidWktbWVzc2FnZVwiPnt7bWVzc2FnZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1tb2RhbC1mb290ZXIgdWktZ3JpZC1zb2xvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkUG9zaXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWEgdWktdGV4dC1lbXBoYXNpc1wiIGRhdGEtYXV0by1jbG9zZT1cInRydWVcIj57e2xhYmVsUG9zaXRpdmV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBkbGdBbGVydCA9IG5ldyBEaWFsb2codGVtcGxhdGUsICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIHNyYzogbnVsbCxcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICB9LCBvcHRpb25zKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkbGdBbGVydC5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25maXJtXHJcbiAgICAgKiDnorroqo3jg6Hjg4Pjgrvjg7zjgrjooajnpLpcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgIFtpbl0g6KGo56S65paH5a2X5YiXXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnNdIFtpbl0g44OA44Kk44Ki44Ot44Kw44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcmV0dXJuIHtqUXVlcnl9IOODgOOCpOOCouODreOCsOOBriBET00g44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjb25maXJtKG1lc3NhZ2U6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ09wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYFxyXG4gICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInVpLW1vZGFsXCIgZGF0YS1yb2xlPVwicG9wdXBcIiBkYXRhLWNvcm5lcnM9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cInVpLXRpdGxlIHt7X3RpdGxlU3RhdGV9fVwiPnt7dGl0bGV9fTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidWktbWVzc2FnZVwiPnt7bWVzc2FnZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1tb2RhbC1mb290ZXIgdWktZ3JpZC1hXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkTmVnYXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWFcIiBkYXRhLWF1dG8tY2xvc2U9XCJ0cnVlXCI+e3tsYWJlbE5lZ2F0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInt7aWRQb3NpdGl2ZX19XCIgY2xhc3M9XCJ1aS1idG4gdWktYmxvY2stYiB1aS10ZXh0LWVtcGhhc2lzXCIgZGF0YS1hdXRvLWNsb3NlPVwidHJ1ZVwiPnt7bGFiZWxQb3NpdGl2ZX19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgIDwvc2NyaXB0PlxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgICAgIGNvbnN0IGRsZ0NvbmZpcm0gPSBuZXcgRGlhbG9nKHRlbXBsYXRlLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBzcmM6IG51bGwsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgfSwgb3B0aW9ucykpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGxnQ29uZmlybS5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIERpYWxvZ0NvbW1vbnNPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgcHJvbXB0IOOBruOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERpYWxvZ1Byb21wdE9wdGlvbnMgZXh0ZW5kcyBEaWFsb2dPcHRpb25zIHtcclxuICAgICAgICBldmVudE9LPzogc3RyaW5nOyAvLyE8IE9LIOODnOOCv+ODs+aKvOS4i+aZguOBriBldmVudDogZGVmYXVsdDogcHJvbXB0b2tcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBEaWFsb2dQcm9tcHRcclxuICAgICAqIEBicmllZiBwcm9tcHQg44OA44Kk44Ki44Ot44KwICjpnZ7lhazplospXHJcbiAgICAgKi9cclxuICAgIGNsYXNzIERpYWxvZ1Byb21wdCBleHRlbmRzIERpYWxvZyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2V2ZW50T0s6IHN0cmluZztcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dQcm9tcHRPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGlkLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRPSyA9IG9wdGlvbnMuZXZlbnRPSyB8fCBcInByb21wdG9rXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OA44Kk44Ki44Ot44Kw6KGo56S644Gu55u05YmNXHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQmVmb3JlU2hvdygpOiBJUHJvbWlzZUJhc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICBjb25zdCBvbkNvbW1pdCA9IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy4kZWwuZmluZChcIiNfdWktcHJvbXB0XCIpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWwudHJpZ2dlcih0aGlzLl9ldmVudE9LLCB0ZXh0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRlbFxyXG4gICAgICAgICAgICAgICAgLm9uKFwidmNsaWNrXCIsIFwiLmNvbW1hbmQtcHJvbXB0LW9rIFwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uQ29tbWl0KGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oXCJrZXlkb3duXCIsIFwiI191aS1wcm9tcHRcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBFTlRFUl9LRVlfQ09ERSA9IDEzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChFTlRFUl9LRVlfQ09ERSA9PT0gZXZlbnQua2V5Q29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNvbW1pdChldmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIub25CZWZvcmVTaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvbXB0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgICBbaW5dIOihqOekuuaWh+Wtl+WIl1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zXSBbaW5dIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHJldHVybiB7alF1ZXJ5fSDjg4DjgqTjgqLjg63jgrDjga4gRE9NIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcHJvbXB0KG1lc3NhZ2U6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ1Byb21wdE9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYFxyXG4gICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInVpLW1vZGFsXCIgZGF0YS1yb2xlPVwicG9wdXBcIiBkYXRhLWNvcm5lcnM9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cInVpLXRpdGxlIHt7X3RpdGxlU3RhdGV9fVwiPnt7dGl0bGV9fTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidWktbWVzc2FnZVwiPnt7bWVzc2FnZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiX3VpLXByb21wdFwiIGNsYXNzPVwidWktaGlkZGVuLWFjY2Vzc2libGVcIj48L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiX3VpLXByb21wdFwiIGlkPVwiX3VpLXByb21wdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1tb2RhbC1mb290ZXIgdWktZ3JpZC1hXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkTmVnYXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWFcIiBkYXRhLWF1dG8tY2xvc2U9XCJ0cnVlXCI+e3tsYWJlbE5lZ2F0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInt7aWRQb3NpdGl2ZX19XCIgY2xhc3M9XCJjb21tYW5kLXByb21wdC1vayB1aS1idG4gdWktYmxvY2stYiB1aS10ZXh0LWVtcGhhc2lzXCIgZGF0YS1hdXRvLWNsb3NlPVwiZmFsc2VcIj57e2xhYmVsUG9zaXRpdmV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBkbGdQcm9tcHQgPSBuZXcgRGlhbG9nUHJvbXB0KHRlbXBsYXRlLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBzcmM6IG51bGwsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgfSwgb3B0aW9ucykpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGxnUHJvbXB0LnNob3coKTtcclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgUm91dGVyICAgICAgID0gQ0RQLkZyYW1ld29yay5Sb3V0ZXI7XHJcbiAgICBpbXBvcnQgSVBhZ2UgICAgICAgID0gQ0RQLkZyYW1ld29yay5JUGFnZTtcclxuICAgIGltcG9ydCBNb2RlbCAgICAgICAgPSBDRFAuRnJhbWV3b3JrLk1vZGVsO1xyXG4gICAgaW1wb3J0IFZpZXcgICAgICAgICA9IENEUC5GcmFtZXdvcmsuVmlldztcclxuICAgIGltcG9ydCBWaWV3T3B0aW9ucyAgPSBDRFAuRnJhbWV3b3JrLlZpZXdPcHRpb25zO1xyXG4gICAgaW1wb3J0IFRlbXBsYXRlICAgICA9IENEUC5Ub29scy5UZW1wbGF0ZTtcclxuICAgIGltcG9ydCBKU1QgICAgICAgICAgPSBDRFAuVG9vbHMuSlNUO1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLlVJLkJhc2VIZWFkZXJWaWV3XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgQmFzZUhlYWRlclZpZXdPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgQmFzZUhlYWRlclZpZXcg44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgVmlld09wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgYmFzZVRlbXBsYXRlPzogSlNUOyAgICAgICAgICAgICAvLyE8IOWbuuWumuODmOODg+ODgOeUqCBKYXZhU2NyaXB0IOODhuODs+ODl+ODrOODvOODiC5cclxuICAgICAgICBiYWNrQ29tbWFuZFNlbGVjdG9yPzogc3RyaW5nOyAgIC8vITwgXCLmiLvjgotcIuOCs+ODnuODs+ODieOCu+ODrOOCr+OCvy4gZGVmYXVsdDogXCJjb21tYW5kLWJhY2tcIlxyXG4gICAgICAgIGJhY2tDb21tYW5kS2luZD86IHN0cmluZzsgICAgICAgLy8hPCBcIuaIu+OCi1wi44Kz44Oe44Oz44OJ56iu5YilIChvbkNvbW1hbmQg56ysMuW8leaVsCkuIGRlZmF1bHQ6IFwicGFnZWJhY2tcIlxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgQmFzZUhlYWRlclZpZXdcclxuICAgICAqIEBicmllZiDlhbHpgJrjg5jjg4Pjg4DjgpLmk43kvZzjgZnjgovjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEJhc2VIZWFkZXJWaWV3PFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgVmlldzxUTW9kZWw+IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc18kaGVhZGVyQmFzZTogSlF1ZXJ5OyAgIC8vITwg44Oa44O844K45aSW44Gr6YWN572u44GV44KM44KL5YWx6YCa44OY44OD44OA44Gu44OZ44O844K56YOo5ZOB55SoIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX3JlZkNvdW50ID0gMDsgICAgICAgICAgLy8hPCDlj4Lnhafjgqvjgqbjg7Pjg4hcclxuICAgICAgICBwcml2YXRlIF90ZW1wbGF0ZTogSlNUO1xyXG4gICAgICAgIHByaXZhdGUgX2hhc0JhY2tJbmRpY2F0b3I6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0lQYWdlfSBfb3duZXIgW2luXSDjgqrjg7zjg4rjg7zjg5rjg7zjgrjjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9vd25lcjogSVBhZ2UsIHByaXZhdGUgX29wdGlvbnM/OiBCYXNlSGVhZGVyVmlld09wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihfb3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgIGVsOiBfb3duZXIuJHBhZ2UuZmluZChcIltkYXRhLXJvbGU9J2hlYWRlciddXCIpLFxyXG4gICAgICAgICAgICAgICAgYmFja0NvbW1hbmRTZWxlY3RvcjogXCIuY29tbWFuZC1iYWNrXCIsXHJcbiAgICAgICAgICAgICAgICBiYWNrQ29tbWFuZEtpbmQ6IFwicGFnZWJhY2tcIixcclxuICAgICAgICAgICAgfSwgX29wdGlvbnMpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRlbXBsYXRlIOioreWumlxyXG4gICAgICAgICAgICBpZiAoX29wdGlvbnMuYmFzZVRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IF9vcHRpb25zLmJhc2VUZW1wbGF0ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gVGVtcGxhdGUuZ2V0SlNUKGBcclxuICAgICAgICAgICAgICAgICAgICA8c2NyaXB0IHR5cGU9J3RleHQvdGVtcGxhdGUnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGVhZGVyIGNsYXNzPSd1aS1oZWFkZXItYmFzZSB1aS1ib2R5LXt7dGhlbWV9fSc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSd1aS1maXhlZC1iYWNrLWluZGljYXRvcic+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2NyaXB0PlxyXG4gICAgICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEJhY2tib25lLlZpZXcg55So44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudCh0aGlzLiRlbCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBjcmVhdGUoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlSGVhZGVyQmFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pyJ5Yq55YyWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGFjdGl2YXRlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3dJbmRpY2F0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeEoeWKueWMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBpbmFjdGl2YXRlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhpZGVJbmRpY2F0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOegtOajhFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyByZWxlYXNlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbGVhc2VIZWFkZXJCYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEg5YWx6YCa44OY44OD44OA44Gu44OZ44O844K544KS5rqW5YKZXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVIZWFkZXJCYXNlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIC8vIOWbuuWumuODmOODg+ODgOOBruOBqOOBjeOBq+acieWKueWMllxyXG4gICAgICAgICAgICBpZiAoXCJmaXhlZFwiID09PSB0aGlzLl9vd25lci4kaGVhZGVyLmpxbURhdGEoXCJwb3NpdGlvblwiKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UgPSAkKHRoaXMuX3RlbXBsYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU6IHRoaXMuX293bmVyLiRwYWdlLmpxbURhdGEoXCJ0aGVtZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zX3JlZkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLmFwcGVuZFRvKCQoZG9jdW1lbnQuYm9keSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEJhY2sgSW5kaWNhdG9yIOOCkuaMgeOBo+OBpuOBhOOCi+OBi+WIpOWumlxyXG4gICAgICAgICAgICBpZiAoMCA8IHRoaXMuJGVsLmZpbmQoXCIudWktYmFjay1pbmRpY2F0b3JcIikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNCYWNrSW5kaWNhdG9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBpbmRpY2F0b3Ig44Gu6KGo56S6XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93SW5kaWNhdG9yKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIC8vIEJhY2sgSW5kaWNhdG9yIOOCkuaMgeOBo+OBpuOBhOOBquOBhOWgtOWQiOihqOekuuOBl+OBquOBhFxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlICYmIHRoaXMuX2hhc0JhY2tJbmRpY2F0b3IpIHtcclxuICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UuZmluZChcIi51aS1maXhlZC1iYWNrLWluZGljYXRvclwiKS5hZGRDbGFzcyhcInNob3dcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgaW5kaWNhdG9yIOOBrumdnuihqOekulxyXG4gICAgICAgIHByaXZhdGUgaGlkZUluZGljYXRvcigpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLmZpbmQoXCIudWktZml4ZWQtYmFjay1pbmRpY2F0b3JcIikucmVtb3ZlQ2xhc3MoXCJzaG93XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWFsemAmuODmOODg+ODgOOBruODmeODvOOCueOCkuegtOajhFxyXG4gICAgICAgIHByaXZhdGUgcmVsZWFzZUhlYWRlckJhc2UoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgLy8g5Zu65a6a44OY44OD44OA5pmC44Gr5Y+C54Wn44Kr44Km44Oz44OI44KS566h55CGXHJcbiAgICAgICAgICAgIGlmIChcImZpeGVkXCIgPT09IHRoaXMuX293bmVyLiRoZWFkZXIuanFtRGF0YShcInBvc2l0aW9uXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc19yZWZDb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgwID09PSBCYXNlSGVhZGVyVmlldy5zX3JlZkNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IEJhY2tib25lLlZpZXdcclxuXHJcbiAgICAgICAgLy8hIGV2ZW50cyBiaW5kaW5nXHJcbiAgICAgICAgZXZlbnRzKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TWFwID0ge307XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudE1hcFtcInZjbGljayBcIiArIHRoaXMuX29wdGlvbnMuYmFja0NvbW1hbmRTZWxlY3Rvcl0gPSB0aGlzLm9uQ29tbWFuZEJhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50TWFwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGJhY2sg44Gu44OP44Oz44OJ44OpXHJcbiAgICAgICAgcHJpdmF0ZSBvbkNvbW1hbmRCYWNrKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX293bmVyKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVkID0gdGhpcy5fb3duZXIub25Db21tYW5kKGV2ZW50LCB0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kS2luZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFoYW5kbGVkKSB7XHJcbiAgICAgICAgICAgICAgICBSb3V0ZXIuYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IEZyYW1ld29yayA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgY29uc3QgVEFHOiBzdHJpbmcgPSBcIltDRFAuVUkuQmFzZVBhZ2VdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBCYXNlUGFnZU9wdGlvbnNcclxuICAgICAqIEBicmllZiBCYXNlUGFnZSDjgavmjIflrprjgZnjgovjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCYXNlUGFnZU9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEZyYW1ld29yay5QYWdlQ29uc3RydWN0T3B0aW9ucywgQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIGJhc2VIZWFkZXI/OiBuZXcgKG93bmVyOiBGcmFtZXdvcmsuSVBhZ2UsIG9wdGlvbnM/OiBCYXNlSGVhZGVyVmlld09wdGlvbnM8VE1vZGVsPikgPT4gQmFzZUhlYWRlclZpZXc8VE1vZGVsPjsgICAvLyE8IEhlYWRlciDmqZ/og73jgpLmj5DkvpvjgZnjgovln7rlupXjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICBiYWNrQ29tbWFuZEhhbmRsZXI/OiBzdHJpbmc7ICAgICAgICAgICAgICAgIC8vITwgXCLmiLvjgotcIiDjgrPjg57jg7Pjg4njg4/jg7Pjg4njg6njg6Hjgr3jg4Pjg4nlkI0uICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBvblBhZ2VCYWNrXHJcbiAgICAgICAgZG9tRXh0ZW5zaW9uT3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnM7ICAvLyE8IERPTeaLoeW8teOBq+a4oeOBmeOCquODl+OCt+ODp+ODsy4gbnVsbHx1bmRlZmluZWQg44KS5oyH5a6a44GZ44KL44Go5ouh5by144GX44Gq44GEIGRlZmF1bHQ6IHt9XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBCYXNlUGFnZVxyXG4gICAgICogQGJyaWVmIEhlYWRlciDjgpLlgpnjgYjjgosgUGFnZSDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEJhc2VQYWdlPFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuUGFnZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2Jhc2VIZWFkZXI6IEJhc2VIZWFkZXJWaWV3PFRNb2RlbD47ICAgIC8vITwg44OY44OD44OA44Kv44Op44K5XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgdXJsICAgICAgIFtpbl0g44Oa44O844K4IFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgICAgICAgICBpZCAgICAgICAgW2luXSDjg5rjg7zjgrggSURcclxuICAgICAgICAgKiBAcGFyYW0ge0Jhc2VQYWdlT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHByaXZhdGUgX29wdGlvbnM/OiBCYXNlUGFnZU9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcih1cmwsIGlkLCBfb3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgIGJhc2VIZWFkZXI6IEJhc2VIZWFkZXJWaWV3LFxyXG4gICAgICAgICAgICAgICAgYmFja0NvbW1hbmRIYW5kbGVyOiBcIm9uUGFnZUJhY2tcIixcclxuICAgICAgICAgICAgICAgIGJhY2tDb21tYW5kS2luZDogXCJwYWdlYmFja1wiLFxyXG4gICAgICAgICAgICAgICAgZG9tRXh0ZW5zaW9uT3B0aW9uczoge30sXHJcbiAgICAgICAgICAgIH0sIF9vcHRpb25zKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBGcmFtZXdvcmsgUGFnZVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuYmFzZUhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlciA9IG5ldyB0aGlzLl9vcHRpb25zLmJhc2VIZWFkZXIodGhpcywgdGhpcy5fb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUNyZWF0ZShldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX29wdGlvbnMuZG9tRXh0ZW5zaW9uT3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgRXh0ZW5zaW9uTWFuYWdlci5hcHBseURvbUV4dGVuc2lvbih0aGlzLiRwYWdlLCB0aGlzLl9vcHRpb25zLmRvbUV4dGVuc2lvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUluaXQoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge1Nob3dFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlU2hvdyhldmVudCwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWhpZGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhICB7SGlkZUV2ZW50RGF0YX0gICAgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlSGlkZShldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLkhpZGVFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Jhc2VIZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VIZWFkZXIuaW5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUhpZGUoZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VyZW1vdmVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VIZWFkZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZVJlbW92ZShldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIL1cgQmFjayBCdXR0b24g44OP44Oz44OJ44OpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0gZXZlbnQgb2JqZWN0XHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pei5a6a44Gu5Yem55CG44KS6KGM44KP44Gq44GEIC8gZmFsc2U6IOaXouWumuOBruWHpueQhuOCkuihjOOBhlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSGFyZHdhcmVCYWNrQnV0dG9uKGV2ZW50PzogSlF1ZXJ5LkV2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGxldCByZXR2YWwgPSBzdXBlci5vbkhhcmR3YXJlQmFja0J1dHRvbihldmVudCk7XHJcbiAgICAgICAgICAgIGlmICghcmV0dmFsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR2YWwgPSB0aGlzLm9uQ29tbWFuZChldmVudCwgdGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEtpbmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXR2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBDdXN0b20gRXZlbnRcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXCLmiLvjgotcIiBldmVudCDnmbrooYzmmYLjgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaXouWumuOBruWHpueQhuOCkuihjOOCj+OBquOBhCAvIGZhbHNlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgYZcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkNvbW1hbmQoZXZlbnQ6IEpRdWVyeS5FdmVudCwga2luZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kS2luZCA9PT0ga2luZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX293bmVyICYmIHRoaXMuX293bmVyW3RoaXMuX29wdGlvbnMuYmFja0NvbW1hbmRIYW5kbGVyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lclt0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kSGFuZGxlcl0oZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuICAgIGltcG9ydCBQcm9taXNlICAgICAgPSBDRFAuUHJvbWlzZTtcclxuICAgIGltcG9ydCBGcmFtZXdvcmsgICAgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5QYWdlVmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIFJvdXRlciDjgbjjga7nmbvpjLLmg4XloLHjgaggQmFja2JvbmUuVmlldyDjgbjjga7liJ3mnJ/ljJbmg4XloLHjgpLmoLzntI3jgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEJhc2VQYWdlT3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBiYXNlUGFnZT86IG5ldyAodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBGcmFtZXdvcmsuUGFnZUNvbnN0cnVjdE9wdGlvbnMpID0+IEZyYW1ld29yay5QYWdlOyAgICAvLyE8IFBhZ2Ug5qmf6IO944KS5o+Q5L6b44GZ44KL5Z+65bqV44Kk44Oz44K544K/44Oz44K5XHJcbiAgICB9XHJcblxyXG4gICAgLyogdHNsaW50OmRpc2FibGU6bm8tdXNlLWJlZm9yZS1kZWNsYXJlICovXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUGFnZUNvbnRhaW5lclZpZXdPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUGFnZUNvbnRhaW5lciDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYWdlQ29udGFpbmVyVmlld09wdGlvbnM8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEZyYW1ld29yay5WaWV3T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBvd25lcjogUGFnZVZpZXc7XHJcbiAgICAgICAgJGVsPzogSlF1ZXJ5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VDb250YWluZXJWaWV3XHJcbiAgICAgKiBAYnJpZWYgUGFnZVZpZXcg44Go6YCj5pC65Y+v6IO944GqIOOCs+ODs+ODhuODiuODk+ODpeODvOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUGFnZUNvbnRhaW5lclZpZXc8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEZyYW1ld29yay5WaWV3PFRNb2RlbD4ge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9vd25lcjogUGFnZVZpZXcgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFBhZ2VDb250YWluZXJWaWV3T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9vd25lciA9IG9wdGlvbnMub3duZXI7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLiRlbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVsZWdhdGVzID0gKDxhbnk+dGhpcykuZXZlbnRzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50KG9wdGlvbnMuJGVsLCBkZWxlZ2F0ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHNob3J0IGN1dCBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vISBPd25lciDlj5blvpdcclxuICAgICAgICBnZXQgb3duZXIoKTogUGFnZVZpZXcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyogdHNsaW50OmVuYWJsZTpuby11c2UtYmVmb3JlLWRlY2xhcmUgKi9cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VWaWV3XHJcbiAgICAgKiBAYnJpZWYgQ0RQLkZyYW1ld29yay5QYWdlIOOBqCBCYWNrYm9uZS5WaWV3IOOBruS4oeaWueOBruapn+iDveOCkuaPkOS+m+OBmeOCi+ODmuODvOOCuOOBruWfuuW6leOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUGFnZVZpZXc8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEZyYW1ld29yay5WaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBGcmFtZXdvcmsuSVBhZ2UsIElTdGF0dXNNYW5hZ2VyIHtcclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIF9wYWdlT3B0aW9uczogUGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4gPSBudWxsO1xyXG4gICAgICAgIHByb3RlY3RlZCBfYmFzZVBhZ2U6IEZyYW1ld29yay5QYWdlID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF9zdGF0dXNNZ3I6IFN0YXR1c01hbmFnZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHVybCAgICAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgW2luXSDjg5rjg7zjgrggVVJMXHJcbiAgICAgICAgICogQHBhcmFtIGlkICAgICAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgW2luXSDjg5rjg7zjgrggSURcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7UGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogUGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAvLyBQYWdlVmlldyDoqK3lrppcclxuICAgICAgICAgICAgdGhpcy5fcGFnZU9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgeyBvd25lcjogdGhpcyB9LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5fYmFzZVBhZ2UgPSB0aGlzLl9wYWdlT3B0aW9ucy5iYXNlUGFnZSA/IG5ldyB0aGlzLl9wYWdlT3B0aW9ucy5iYXNlUGFnZSh1cmwsIGlkLCB0aGlzLl9wYWdlT3B0aW9ucykgOiBuZXcgQmFzZVBhZ2UodXJsLCBpZCwgdGhpcy5fcGFnZU9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gU3RhdHVzTWFuYWdlclxyXG4gICAgICAgICAgICB0aGlzLl9zdGF0dXNNZ3IgPSBuZXcgU3RhdHVzTWFuYWdlcigpO1xyXG4gICAgICAgICAgICAvLyBCYWNrYm9uZS5WaWV3IOeUqOOBruWIneacn+WMllxyXG4gICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZXMgPSAoPGFueT50aGlzKS5ldmVudHMgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudCh0aGlzLiRwYWdlLCBkZWxlZ2F0ZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJU3RhdHVzTWFuYWdlciDnirbmhYvnrqHnkIZcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54q25oWL5aSJ5pWw44Gu5Y+C54Wn44Kr44Km44Oz44OI44Gu44Kk44Oz44Kv44Oq44Oh44Oz44OIXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzIHtTdHJpbmd9IFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdHVzQWRkUmVmKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1c01nci5zdGF0dXNBZGRSZWYoc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruODh+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyB7U3RyaW5nfSBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXR1c1JlbGVhc2Uoc3RhdHVzOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzTWdyLnN0YXR1c1JlbGVhc2Uoc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWHpueQhuOCueOCs+ODvOODl+avjuOBq+eKtuaFi+WkieaVsOOCkuioreWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyAgIHtTdHJpbmd9ICAgW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9ufSBbaW5dIOWHpueQhuOCs+ODvOODq+ODkOODg+OCr1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXR1c1Njb3BlKHN0YXR1czogc3RyaW5nLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0dXNNZ3Iuc3RhdHVzU2NvcGUoc3RhdHVzLCBjYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmjIflrprjgZfjgZ/nirbmhYvkuK3jgafjgYLjgovjgYvnorroqo1cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMge1N0cmluZ30gICBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOeKtuaFi+WGhSAvIGZhbHNlOiDnirbmhYvlpJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1N0YXR1c0luKHN0YXR1czogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNNZ3IuaXNTdGF0dXNJbihzdGF0dXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJUGFnZSBzdHViIHN0dWZmLlxyXG5cclxuICAgICAgICBnZXQgYWN0aXZlKCk6IGJvb2xlYW4gICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UuYWN0aXZlOyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBnZXQgdXJsKCk6IHN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UudXJsOyAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBnZXQgaWQoKTogc3RyaW5nICAgICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UgPyB0aGlzLl9iYXNlUGFnZS5pZCA6IG51bGw7IH1cclxuICAgICAgICBnZXQgJHBhZ2UoKTogSlF1ZXJ5ICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UuJHBhZ2U7ICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBnZXQgJGhlYWRlcigpOiBKUXVlcnkgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UuJGhlYWRlcjsgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBnZXQgJGZvb3RlcigpOiBKUXVlcnkgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UuJGZvb3RlcjsgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBnZXQgaW50ZW50KCk6IEZyYW1ld29yay5JbnRlbnQgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UuaW50ZW50OyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBzZXQgaW50ZW50KG5ld0ludGVudDogRnJhbWV3b3JrLkludGVudCkgeyB0aGlzLl9iYXNlUGFnZS5pbnRlbnQgPSBuZXdJbnRlbnQ7ICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogT3JpZW50YXRpb24g44Gu5aSJ5pu044KS5Y+X5L+hXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gbmV3T3JpZW50YXRpb24ge09yaWVudGF0aW9ufSBbaW5dIG5ldyBvcmllbnRhdGlvbiBjb2RlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uT3JpZW50YXRpb25DaGFuZ2VkKG5ld09yaWVudGF0aW9uOiBGcmFtZXdvcmsuT3JpZW50YXRpb24pOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEgvVyBCYWNrIEJ1dHRvbiDjg4/jg7Pjg4njg6lcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAgZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSBldmVudCBvYmplY3RcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgo/jgarjgYQgLyBmYWxzZTog5pei5a6a44Gu5Yem55CG44KS6KGM44GGXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25IYXJkd2FyZUJhY2tCdXR0b24oZXZlbnQ/OiBKUXVlcnkuRXZlbnQpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUm91dGVyIFwiYmVmb3JlIHJvdXRlIGNoYW5nZVwiIOODj+ODs+ODieODqVxyXG4gICAgICAgICAqIOODmuODvOOCuOmBt+enu+ebtOWJjeOBq+mdnuWQjOacn+WHpueQhuOCkuihjOOBhuOBk+OBqOOBjOWPr+iDvVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7SVByb21pc2VCYXNlfSBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uQmVmb3JlUm91dGVDaGFuZ2UoKTogSVByb21pc2VCYXNlPGFueT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmsY7nlKjjgrPjg57jg7Pjg4njgpLlj5fkv6FcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAgZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSBldmVudCBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtraW5kfSAgICAgICAgICAgICAgW2luXSBjb21tYW5kIGtpbmQgc3RyaW5nXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pei5a6a44Gu5Yem55CG44KS6KGM44KP44Gq44GEIC8gZmFsc2U6IOaXouWumuOBruWHpueQhuOCkuihjOOBhlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uQ29tbWFuZChldmVudD86IEpRdWVyeS5FdmVudCwga2luZD86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmnIDliJ3jga4gT25QYWdlSW5pdCgpIOOBruOBqOOBjeOBq+OBruOBv+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25Jbml0aWFsaXplKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3JlY3JlYXRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy4kcGFnZSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNyZWF0ZVwiICjml6c6XCJwYWdlaW5pdFwiKSDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUluaXQoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge1Nob3dFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNvbnRhaW5lcnNob3dcIiAo5penOlwicGFnZXNob3dcIikg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge1Nob3dFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWhpZGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhICB7SGlkZUV2ZW50RGF0YX0gICAgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlSGlkZShldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLkhpZGVFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyaGlkZVwiICjml6c6XCJwYWdlaGlkZVwiKSDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhICB7SGlkZUV2ZW50RGF0YX0gICAgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlSGlkZShldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLkhpZGVFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VSZW1vdmUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVsICA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgTW9kZWwgPSBDRFAuRnJhbWV3b3JrLk1vZGVsO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5QYWdlTGlzdFZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUGFnZUxpc3RWaWV3IOOBuOOBruWIneacn+WMluaDheWgseOCkuagvOe0jeOBmeOCi+OCpOODs+OCv+ODvOODleOCp+OCpOOCueOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBMaXN0Vmlld09wdGlvbnMsIFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBhdXRvRGVzdG9yeUVsZW1lbnQ/OiBib29sZWFuOyAgICAgICAgLy8hPCDjg5rjg7zjgrjpgbfnp7vliY3jgasgTGlzdCBFbGVtZW50IOOCkuegtOajhOOBmeOCi+WgtOWQiOOBryB0cnVlIOOCkuaMh+WumlxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIOS7ruaDs+ODquOCueODiOODk+ODpeODvOapn+iDveOCkuaMgeOBpCBQYWdlVmlldyDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VMaXN0VmlldzxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFBhZ2VWaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJTGlzdFZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9zY3JvbGxNZ3I6IFNjcm9sbE1hbmFnZXIgPSBudWxsOyAgICAvLyE8IHNjcm9sbCDjgrPjgqLjg63jgrjjg4Pjgq9cclxuICAgICAgICBwcml2YXRlIF9uZWVkUmVidWlsZDogYm9vbGVhbiA9IGZhbHNlOyAgICAgICAvLyE8IOODmuODvOOCuOihqOekuuaZguOBqyByZWJ1aWxkKCkg44KS44Kz44O844Or44GZ44KL44Gf44KB44Gu5YaF6YOo5aSJ5pWwXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdXJsICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIHRlbXBsYXRlIOOBq+S9v+eUqOOBmeOCiyBVUkxcclxuICAgICAgICAgKiBAcGFyYW0gaWQgICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIOOBq+aMr+OCieOCjOOBnyBJRFxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogUGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHVybCwgaWQsICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgICAgICBhdXRvRGVzdG9yeUVsZW1lbnQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LCBvcHRpb25zKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nciA9IG5ldyBTY3JvbGxNYW5hZ2VyKG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHJlYnVpbGQoKSDjga7jgrnjgrHjgrjjg6Xjg7zjg6rjg7PjgrBcclxuICAgICAgICBwdWJsaWMgcmVzZXJ2ZVJlYnVpbGQoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX25lZWRSZWJ1aWxkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IFBhZ2VWaWV3XHJcblxyXG4gICAgICAgIC8vISBPcmllbnRhdGlvbiDjga7lpInmm7TmpJznn6VcclxuICAgICAgICBvbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbjogRnJhbWV3b3JrLk9yaWVudGF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRCYXNlSGVpZ2h0KHRoaXMuZ2V0UGFnZUJhc2VIZWlnaHQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oa44O844K46YG356e755u05YmN44Kk44OZ44Oz44OI5Yem55CGXHJcbiAgICAgICAgb25CZWZvcmVSb3V0ZUNoYW5nZSgpOiBJUHJvbWlzZUJhc2U8YW55PiB7XHJcbiAgICAgICAgICAgIGlmICgoPFBhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPj50aGlzLl9wYWdlT3B0aW9ucykuYXV0b0Rlc3RvcnlFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5vbkJlZm9yZVJvdXRlQ2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgICAgb25QYWdlQmVmb3JlU2hvdyhldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLlNob3dFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlU2hvdyhldmVudCwgZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5pbml0aWFsaXplKHRoaXMuJHBhZ2UsIHRoaXMuZ2V0UGFnZUJhc2VIZWlnaHQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3Iuc2V0QmFzZUhlaWdodCh0aGlzLmdldFBhZ2VCYXNlSGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbmVlZFJlYnVpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVidWlsZCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmVlZFJlYnVpbGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIub25QYWdlUmVtb3ZlKGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9maWxlIOeuoeeQhlxyXG5cclxuICAgICAgICAvLyEg5Yid5pyf5YyW5riI44G/44GL5Yik5a6aXHJcbiAgICAgICAgaXNJbml0aWFsaXplZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5pc0luaXRpYWxpemVkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OX44Ot44OR44OG44Kj44KS5oyH5a6a44GX44Gm44CBTGlzdEl0ZW0g44KS566h55CGXHJcbiAgICAgICAgYWRkSXRlbShcclxuICAgICAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgICAgIGluaXRpYWxpemVyOiBuZXcgKG9wdGlvbnM/OiBhbnkpID0+IEJhc2VMaXN0SXRlbVZpZXcsXHJcbiAgICAgICAgICAgIGluZm86IGFueSxcclxuICAgICAgICAgICAgaW5zZXJ0VG8/OiBudW1iZXJcclxuICAgICAgICAgICAgKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FkZExpbmUobmV3IExpbmVQcm9maWxlKHRoaXMuX3Njcm9sbE1nciwgTWF0aC5mbG9vcihoZWlnaHQpLCBpbml0aWFsaXplciwgaW5mbyksIGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ8gSXRlbSDjgpLliYrpmaRcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXIsIHNpemU/OiBudW1iZXIsIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXJbXSwgZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IGFueSwgYXJnMj86IG51bWJlciwgYXJnMz86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVtb3ZlSXRlbShpbmRleCwgYXJnMiwgYXJnMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIEl0ZW0g44Gr6Kit5a6a44GX44Gf5oOF5aCx44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBudW1iZXIpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBKUXVlcnkuRXZlbnQpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmdldEl0ZW1JbmZvKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Ki44Kv44OG44Kj44OW44Oa44O844K444KS5pu05pawXHJcbiAgICAgICAgcmVmcmVzaCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlZnJlc2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmnKrjgqLjgrXjgqTjg7Pjg5rjg7zjgrjjgpLmp4vnr4lcclxuICAgICAgICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5rjg7zjgrjjgqLjgrXjgqTjg7PjgpLlho3mp4vmiJBcclxuICAgICAgICByZWJ1aWxkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVidWlsZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeuoei9hOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9maWxlIEJhY2t1cCAvIFJlc3RvcmVcclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODkOODg+OCr+OCouODg+ODl1xyXG4gICAgICAgIGJhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJldHZhbCA9IHRoaXMuX3Njcm9sbE1nci5yZXN0b3JlKGtleSwgcmVidWlsZCk7XHJcbiAgICAgICAgICAgIGlmIChyZXR2YWwgJiYgIXJlYnVpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXJ2ZVJlYnVpbGQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruacieeEoVxyXG4gICAgICAgIGhhc0JhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmhhc0JhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruegtOajhFxyXG4gICAgICAgIGNsZWFyQmFja3VwKGtleT86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmNsZWFyQmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gr44Ki44Kv44K744K5XHJcbiAgICAgICAgZ2V0IGJhY2t1cERhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5iYWNrdXBEYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgU2Nyb2xsXHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldFNjcm9sbEhhbmRsZXIoaGFuZGxlciwgb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+e1guS6huOCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICBzZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldFNjcm9sbFN0b3BIYW5kbGVyKGhhbmRsZXIsIG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3MoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRTY3JvbGxQb3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3NNYXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRTY3JvbGxQb3NNYXgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNjcm9sbFRvKHBvcywgYW5pbWF0ZSwgdGltZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GV44KM44GfIExpc3RJdGVtVmlldyDjga7ooajnpLrjgpLkv53oqLxcclxuICAgICAgICBlbnN1cmVWaXNpYmxlKGluZGV4OiBudW1iZXIsIG9wdGlvbnM/OiBFbnN1cmVWaXNpYmxlT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuZW5zdXJlVmlzaWJsZShpbmRleCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9wZXJ0aWVzXHJcblxyXG4gICAgICAgIC8vISBjb3JlIGZyYW1ld29yayBhY2Nlc3NcclxuICAgICAgICBnZXQgY29yZSgpOiBJTGlzdFZpZXdGcmFtZXdvcmsge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgSW50ZXJuYWwgSS9GXHJcblxyXG4gICAgICAgIC8vISDnmbvpjLIgZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCi1xyXG4gICAgICAgIF9hZGRMaW5lKF9saW5lOiBhbnksIGluc2VydFRvPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5fYWRkTGluZShfbGluZSwgaW5zZXJ0VG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZDpcclxuXHJcbiAgICAgICAgLy8hIOODmuODvOOCuOOBruWfuua6luWApOOCkuWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgZ2V0UGFnZUJhc2VIZWlnaHQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuICQod2luZG93KS5oZWlnaHQoKSAtIHBhcnNlSW50KHRoaXMuJHBhZ2UuY3NzKFwicGFkZGluZy10b3BcIiksIDEwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IE1vZGVsID0gQ0RQLkZyYW1ld29yay5Nb2RlbDtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZUV4cGFuZGFibGVMaXN0Vmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgUGFnZUV4cGFuZGFibGVMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIOmWi+mWieODquOCueODiOODk+ODpeODvOapn+iDveOCkuaMgeOBpCBQYWdlVmlldyDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VFeHBhbmRhYmxlTGlzdFZpZXc8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBQYWdlTGlzdFZpZXc8VE1vZGVsPiBpbXBsZW1lbnRzIElFeHBhbmRhYmxlTGlzdFZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9leHBhbmRNYW5hZ2VyOiBFeHBhbmRNYW5hZ2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB1cmwgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHBhZ2UgdGVtcGxhdGUg44Gr5L2/55So44GZ44KLIFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSBpZCAgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHBhZ2Ug44Gr5oyv44KJ44KM44GfIElEXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge1BhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIodXJsLCBpZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIgPSBuZXcgRXhwYW5kTWFuYWdlcih0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUV4cGFuZGFibGVMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyEg5paw6KaPIEdyb3VwUHJvZmlsZSDjgpLkvZzmiJBcclxuICAgICAgICBuZXdHcm91cChpZD86IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLm5ld0dyb3VwKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnmbvpjLLmuIjjgb8gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0R3JvdXAoaWQ6IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmdldEdyb3VwKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrKwx6ZqO5bGk44GuIEdyb3VwIOeZu+mMslxyXG4gICAgICAgIHJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXA6IEdyb3VwUHJvZmlsZSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOesrDHpmo7lsaTjga4gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0VG9wR3JvdXBzKCk6IEdyb3VwUHJvZmlsZVtdIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuZ2V0VG9wR3JvdXBzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5bGV6ZaLICgx6ZqO5bGkKVxyXG4gICAgICAgIGV4cGFuZEFsbCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5leHBhbmRBbGwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgZnjgbnjgabjga7jgrDjg6vjg7zjg5fjgpLlj47mnZ8gKDHpmo7lsaQpXHJcbiAgICAgICAgY29sbGFwc2VBbGwoZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5jb2xsYXBzZUFsbChkZWxheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5bGV6ZaL5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNFeHBhbmRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmlzRXhwYW5kaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5Y+O5p2f5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNDb2xsYXBzaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5pc0NvbGxhcHNpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDplovplonkuK3jgYvliKTlrppcclxuICAgICAgICBpc1N3aXRjaGluZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuaXNTd2l0Y2hpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBsYXlvdXQga2V5IOOCkuWPluW+l1xyXG4gICAgICAgIGdldCBsYXlvdXRLZXkoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIubGF5b3V0S2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGxheW91dCBrZXkg44KS6Kit5a6aXHJcbiAgICAgICAgc2V0IGxheW91dEtleShrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLmxheW91dEtleSA9IGtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IFBhZ2VMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyEg44OH44O844K/44KS56C05qOEXHJcbiAgICAgICAgcmVsZWFzZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlbGVhc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuYmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44Oq44K544OI44KiXHJcbiAgICAgICAgcmVzdG9yZShrZXk6IHN0cmluZywgcmVidWlsZDogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIucmVzdG9yZShrZXksIHJlYnVpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKipcclxuICogalF1ZXJ5IHBsdWdpbiBkZWZpbml0aW9uXHJcbiAqL1xyXG5pbnRlcmZhY2UgSlF1ZXJ5IHtcclxuICAgIHJpcHBsZShvcHRpb25zPzogQ0RQLlVJLkRvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnk7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICAvLyBqUXVlcnkgcGx1Z2luXHJcbiAgICAkLmZuLnJpcHBsZSA9IGZ1bmN0aW9uIChvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgJGVsID0gJCh0aGlzKTtcclxuICAgICAgICBpZiAoJGVsLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkZWwub24oRnJhbWV3b3JrLlBhdGNoLnNfdmNsaWNrRXZlbnQsIGZ1bmN0aW9uIChldmVudDogSlF1ZXJ5LkV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1cmZhY2UgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gY3JlYXRlIHN1cmZhY2UgaWYgaXQgZG9lc24ndCBleGlzdFxyXG4gICAgICAgICAgICBpZiAoc3VyZmFjZS5maW5kKFwiLnVpLXJpcHBsZS1pbmtcIikubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBzdXJmYWNlLnByZXBlbmQoXCI8ZGl2IGNsYXNzPSd1aS1yaXBwbGUtaW5rJz48L2Rpdj5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBpbmsgPSBzdXJmYWNlLmZpbmQoXCIudWktcmlwcGxlLWlua1wiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHN0b3AgdGhlIHByZXZpb3VzIGFuaW1hdGlvblxyXG4gICAgICAgICAgICBpbmsucmVtb3ZlQ2xhc3MoXCJ1aS1yaXBwbGUtYW5pbWF0ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGluayBzaXplOlxyXG4gICAgICAgICAgICBpZiAoIWluay5oZWlnaHQoKSAmJiAhaW5rLndpZHRoKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGQgPSBNYXRoLm1heChzdXJmYWNlLm91dGVyV2lkdGgoKSwgc3VyZmFjZS5vdXRlckhlaWdodCgpKTtcclxuICAgICAgICAgICAgICAgIGluay5jc3MoeyBoZWlnaHQ6IGQsIHdpZHRoOiBkIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB4ID0gZXZlbnQucGFnZVggLSBzdXJmYWNlLm9mZnNldCgpLmxlZnQgLSAoaW5rLndpZHRoKCkgLyAyKTtcclxuICAgICAgICAgICAgY29uc3QgeSA9IGV2ZW50LnBhZ2VZIC0gc3VyZmFjZS5vZmZzZXQoKS50b3AgLSAoaW5rLmhlaWdodCgpIC8gMik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByaXBwbGVDb2xvciA9IHN1cmZhY2UuZGF0YShcInJpcHBsZS1jb2xvclwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGFuaW1hdGlvbiBlbmQgaGFuZGxlclxyXG4gICAgICAgICAgICBjb25zdCBBTklNQVRJT05fRU5EX0VWRU5UID0gXCJhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kXCI7XHJcbiAgICAgICAgICAgIGluay5vbihBTklNQVRJT05fRU5EX0VWRU5ULCBmdW5jdGlvbiAoZXY6IEpRdWVyeS5FdmVudCkge1xyXG4gICAgICAgICAgICAgICAgaW5rLm9mZigpO1xyXG4gICAgICAgICAgICAgICAgaW5rLnJlbW92ZUNsYXNzKFwidWktcmlwcGxlLWFuaW1hdGVcIik7XHJcbiAgICAgICAgICAgICAgICBpbmsgPSBudWxsO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gYW5kIGFkZCBjbGFzcyAuYW5pbWF0ZVxyXG4gICAgICAgICAgICBpbmsuY3NzKHtcclxuICAgICAgICAgICAgICAgIHRvcDogeSArIFwicHhcIixcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiByaXBwbGVDb2xvclxyXG4gICAgICAgICAgICB9KS5hZGRDbGFzcyhcInVpLXJpcHBsZS1hbmltYXRlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGVyaWFsIERlc2lnbiBSaXBwbGUg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCBOT19SSVBQTEVfQ0xBU1MgPSBbXHJcbiAgICAgICAgICAgIFwiLnVpLXJpcHBsZS1ub25lXCIsXHJcbiAgICAgICAgICAgIFwiLnVpLWZsaXBzd2l0Y2gtb25cIixcclxuICAgICAgICAgICAgXCIudWktc2xpZGVyLWhhbmRsZVwiLFxyXG4gICAgICAgICAgICBcIi51aS1pbnB1dC1jbGVhclwiLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGxldCBzZWxlY3RvciA9IFwiLnVpLWJ0blwiO1xyXG4gICAgICAgIGlmICgkdWkuaGFzQ2xhc3MoXCJ1aS1wYWdlXCIpKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0gXCIudWktY29udGVudCAudWktYnRuXCI7IC8vIGhlYWRlciDjga/oh6rli5UgcmlwcGxlIOWMluWvvuixoeWkllxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHVpLmZpbmQoc2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKGluZGV4LCBlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGVsZW0uaXMoTk9fUklQUExFX0NMQVNTLmpvaW4oXCIsXCIpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcyhcInVpLXJpcHBsZVwiKTtcclxuXHJcbiAgICAgICAgLy8gcmlwcGxpZnlcclxuLy8gICAgICAgICR1aS5maW5kKFwiLnVpLXJpcHBsZVwiKS5yaXBwbGUob3B0aW9ucyk7XHJcbiAgICAgICAgJHVpLmZpbmQoXCIudWktcmlwcGxlXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKChpbmRleDogbnVtYmVyLCBlbGVtOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW0pLnJpcHBsZShvcHRpb25zKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIi8qKlxyXG4gKiBqUXVlcnkgcGx1Z2luIGRlZmluaXRpb25cclxuICovXHJcbmludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgc3Bpbm5lcihvcHRpb25zPzogQ0RQLlVJLkRvbUV4dGVuc2lvbk9wdGlvbnMgfCBcInJlZnJlc2hcIik6IEpRdWVyeTtcclxufVxyXG5cclxubmFtZXNwYWNlIENEUC5VSS5FeHRlbnNpb24ge1xyXG5cclxuICAgIGltcG9ydCBUZW1wbGF0ZSA9IENEUC5Ub29scy5UZW1wbGF0ZTtcclxuICAgIGltcG9ydCBKU1QgICAgICA9IENEUC5Ub29scy5KU1Q7XHJcblxyXG4gICAgbGV0IF90ZW1wbGF0ZTogSlNUO1xyXG5cclxuICAgIC8vIGpRdWVyeSBwbHVnaW5cclxuICAgICQuZm4uc3Bpbm5lciA9IGZ1bmN0aW9uIChvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyB8IFwicmVmcmVzaFwiKSB7XHJcbiAgICAgICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZWZyZXNoKCQodGhpcykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzcGlubmVyaWZ5KCQodGhpcyksIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gc3Bpbm5lcmlmeSgkdGFyZ2V0OiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBpZiAoJHRhcmdldC5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJHRhcmdldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIF90ZW1wbGF0ZSA9IFRlbXBsYXRlLmdldEpTVChgXHJcbiAgICAgICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWJhc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItZ2FwXCIge3tib3JkZXJUb3B9fT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lci1oYWxmLWNpcmNsZVwiIHt7Ym9yZGVyfX0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLWhhbGYtY2lyY2xlXCIge3tib3JkZXJ9fT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtYWtlVGVtcGxhdGVQYXJhbSA9IChjbHI6IHN0cmluZyk6IG9iamVjdCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBib3JkZXJUb3A6IFwic3R5bGU9Ym9yZGVyLXRvcC1jb2xvcjpcIiArIGNsciArIFwiO1wiLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyOiBcInN0eWxlPWJvcmRlci1jb2xvcjpcIiArIGNsciArIFwiO1wiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gJHRhcmdldC5kYXRhKFwic3Bpbm5lci1jb2xvclwiKTtcclxuICAgICAgICBsZXQgcGFyYW0gPSBudWxsO1xyXG4gICAgICAgIGlmIChjb2xvcikge1xyXG4gICAgICAgICAgICAkdGFyZ2V0LmNzcyh7IFwiYmFja2dyb3VuZC1jb2xvclwiOiBjb2xvciB9KTtcclxuICAgICAgICAgICAgcGFyYW0gPSBtYWtlVGVtcGxhdGVQYXJhbShjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICR0YXJnZXQuYXBwZW5kKF90ZW1wbGF0ZShwYXJhbSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVmcmVzaCgkdGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpT1MgMTAuMisgU1ZHIFNNSUwg44Ki44OL44Oh44O844K344On44Oz44GMIDLlm57nm67ku6XpmY3li5XjgYvjgarjgYTllY/poYzjga7lr77nrZZcclxuICAgIC8vIGRhdGE6aW1hZ2Uvc3ZnK3htbDs8Y2FjaGUgYnVzdCBzdHJpbmc+O2Jhc2U2NCwuLi4g44Go44GZ44KL44GT44Go44GnIGRhdGEtdXJsIOOBq+OCgiBjYWNoZSBidXN0aW5nIOOBjOacieWKueOBq+OBquOCi1xyXG4gICAgZnVuY3Rpb24gcmVmcmVzaCgkdGFyZ2V0OiBKUXVlcnkpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IFBSRUZJWCA9IFtcIi13ZWJraXQtXCIsIFwiXCJdO1xyXG5cclxuICAgICAgICBjb25zdCB2YWxpZCA9IChwcm9wKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAocHJvcCAmJiBcIm5vbmVcIiAhPT0gcHJvcCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGFVcmw6IHN0cmluZztcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IFBSRUZJWC5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF2YWxpZChkYXRhVXJsKSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVVybCA9ICR0YXJnZXQuY3NzKFBSRUZJWFtpXSArIFwibWFzay1pbWFnZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxpZChkYXRhVXJsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlPUyDjgafjga8gdXJsKGRhdGEqKiopOyDlhoXjgasgJ1wiJyDjga/lhaXjgonjgarjgYRcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGRhdGFVcmwubWF0Y2goLyh1cmxcXChkYXRhOmltYWdlXFwvc3ZnXFwreG1sOykoW1xcc1xcU10qKT8oYmFzZTY0LFtcXHNcXFNdKlxcKSkvKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVVybCA9IGAke21hdGNoWzFdfWJ1c3Q9JHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX07JHttYXRjaFszXX1gO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFVcmwgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodmFsaWQoZGF0YVVybCkpIHtcclxuICAgICAgICAgICAgICAgICR0YXJnZXQuY3NzKFBSRUZJWFtpXSArIFwibWFzay1pbWFnZVwiLCBkYXRhVXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICR0YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRlcmlhbCBEZXNpZ24gU3Bpbm5lciDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR1aSAgICAgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseURvbUV4dGVuc2lvbigkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgICR1aS5maW5kKFwiLnVpLXNwaW5uZXIsIC51aS1pY29uLWxvYWRpbmdcIilcclxuICAgICAgICAgICAgLmVhY2goKGluZGV4OiBudW1iZXIsIGVsZW06IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICQoZWxlbSkuc3Bpbm5lcihvcHRpb25zKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRleHQgSW5wdXQg55SoIEZsb2F0aW5nIExhYmVsIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlID0gKGVsZW06IEVsZW1lbnQsIGZsb2F0aW5nOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtID0gJChlbGVtKTtcclxuICAgICAgICAgICAgaWYgKGZsb2F0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbS5hZGRDbGFzcyhcInVpLWZsb2F0LWxhYmVsLWZsb2F0aW5nXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGVsZW0ucmVtb3ZlQ2xhc3MoXCJ1aS1mbG9hdC1sYWJlbC1mbG9hdGluZ1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGZsb2F0aW5naWZ5ID0gKGVsZW06IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSAkKGVsZW0pLmF0dHIoXCJmb3JcIik7XHJcbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICR1aS5maW5kKFwiI1wiICsgaWQpO1xyXG4gICAgICAgICAgICBpZiAoXCJzZWFyY2hcIiA9PT0gJGlucHV0LmpxbURhdGEoXCJ0eXBlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW0pLmFkZENsYXNzKFwidWktZmxvYXQtbGFiZWwtaGFzLWljb25cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdXBkYXRlKGVsZW0sICEhJGlucHV0LnZhbCgpKTtcclxuICAgICAgICAgICAgJGlucHV0Lm9uKFwia2V5dXAgY2hhbmdlIGlucHV0IGZvY3VzIGJsdXIgY3V0IHBhc3RlXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGUoZWxlbSwgISEkKGV2ZW50LnRhcmdldCkudmFsKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkdWkuZmluZChcImxhYmVsLnVpLWZsb2F0LWxhYmVsLCAudWktZmxvYXQtbGFiZWwgbGFiZWxcIilcclxuICAgICAgICAgICAgLmVhY2goKGluZGV4OiBudW1iZXIsIGVsZW06IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGZsb2F0aW5naWZ5KGVsZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRdWVyeSBNb2JpbGUgRmxpcCBTd2l0Y2gg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGZsaXBzd2l0Y2gg44Gr57SQ44Gl44GPIGxhYmVsIOOBryBPUyDjgavjgojjgaPjgaYgZXZlbnQg55m66KGM5b2i5byP44GM55Ww44Gq44KL44Gf44KB44OV44OD44Kv44GX44Gm54us6Ieq44Kk44OZ44Oz44OI44Gn5a++5b+c44GZ44KLLlxyXG4gICAgICAgICAqIOOBvuOBnyBmbGlwc3dpdGNoIOOBr+WGhemDqOOBpyBjbGljayDjgpLnmbrooYzjgZfjgabjgYTjgovjgYzjgIF2Y2xpY2sg44Gr5aSJ5pu044GZ44KLLlxyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICBjb25zdCBfZ2V0QWxsU3dpdGNoZXMgPSAoKTogSlF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICR1aS5maW5kKFwiLnVpLWZsaXBzd2l0Y2hcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2dldElucHV0RnJvbVN3aXRjaCA9ICgkc3dpdGNoOiBKUXVlcnkpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkaW5wdXQgPSAkc3dpdGNoLmZpbmQoXCJpbnB1dFwiKTtcclxuICAgICAgICAgICAgaWYgKCRpbnB1dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaW5wdXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgJHNlbGVjdCA9ICRzd2l0Y2guZmluZChcInNlbGVjdFwiKTtcclxuICAgICAgICAgICAgaWYgKCRzZWxlY3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHNlbGVjdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfY2hhbmdlID0gKCRpbnB1dDogSlF1ZXJ5LCB0bzogYm9vbGVhbik6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoJGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJJTlBVVFwiID09PSAkaW5wdXRbMF0ubm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW5wdXQucHJvcChcImNoZWNrZWRcIiwgdG8pLmZsaXBzd2l0Y2goXCJyZWZyZXNoXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcIlNFTEVDVFwiID09PSAkaW5wdXRbMF0ubm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW5wdXQudmFsKHRvID8gXCJvblwiIDogXCJvZmZcIikuZmxpcHN3aXRjaChcInJlZnJlc2hcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfZ2V0TGFiZWxzRnJvbVN3aXRjaCA9ICgkc3dpdGNoOiBKUXVlcnkpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkaW5wdXQgPSBfZ2V0SW5wdXRGcm9tU3dpdGNoKCRzd2l0Y2gpO1xyXG4gICAgICAgICAgICBpZiAoJGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYWJlbHMgPSAoPGFueT4kaW5wdXRbMF0pLmxhYmVscztcclxuICAgICAgICAgICAgICAgIGlmIChsYWJlbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJChsYWJlbHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2dldFN3aXRjaEZyb21MYWJlbCA9ICgkbGFiZWw6IEpRdWVyeSk6IEpRdWVyeSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSAkbGFiZWwuYXR0cihcImZvclwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIF9nZXRBbGxTd2l0Y2hlcygpLmZpbmQoXCJbbmFtZT0nXCIgKyBuYW1lICsgXCInXVwiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBfZ2V0QWxsU3dpdGNoZXMoKVxyXG4gICAgICAgICAgICAub24oXCJ2Y2xpY2sgX2NoYW5nZV9mbGlwc3dpY2hcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRzd2l0Y2ggPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9IF9nZXRJbnB1dEZyb21Td2l0Y2goJHN3aXRjaCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFuZ2VUbyA9ICEkc3dpdGNoLmhhc0NsYXNzKFwidWktZmxpcHN3aXRjaC1hY3RpdmVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCR0YXJnZXQuaGFzQ2xhc3MoXCJ1aS1mbGlwc3dpdGNoLWlucHV0XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2NoYW5nZSgkaW5wdXQsIGNoYW5nZVRvKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJHRhcmdldC5oYXNDbGFzcyhcInVpLWZsaXBzd2l0Y2gtb25cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoRnJhbWV3b3JrLlBsYXRmb3JtLk1vYmlsZSAmJiBGcmFtZXdvcmsuUGF0Y2guaXNTdXBwb3J0ZWRWY2xpY2soKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hhbmdlKCRpbnB1dCwgY2hhbmdlVG8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmVhY2goKGluZGV4OiBudW1iZXIsIGZsaXBzd2l0Y2g6IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIF9nZXRMYWJlbHNGcm9tU3dpdGNoKCQoZmxpcHN3aXRjaCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKFwidmNsaWNrXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0ICRzd2l0Y2ggPSBfZ2V0U3dpdGNoRnJvbUxhYmVsKCQoZXZlbnQudGFyZ2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghJHN3aXRjaC5wYXJlbnQoKS5oYXNDbGFzcyhcInVpLXN0YXRlLWRpc2FibGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3dpdGNoLnRyaWdnZXIoXCJfY2hhbmdlX2ZsaXBzd2ljaFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRdWVyeSBNb2JpbGUgU2xpZGVyIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgJHVpLmZpbmQoXCIudWktc2xpZGVyLWlucHV0XCIpXHJcbiAgICAgICAgICAgIC5vbihcInNsaWRlc3RvcFwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGhhbmRsZXMgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoXCIudWktc2xpZGVyLWhhbmRsZVwiKTtcclxuICAgICAgICAgICAgICAgICRoYW5kbGVzLmJsdXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICAvLyEgaVNjcm9sbC5jbGljayBwYXRjaFxyXG4gICAgY29uc3QgcGF0Y2hfSVNjcm9sbF91dGlsc19jbGljayA9IGZ1bmN0aW9uIChldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQ6IGFueSA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICBjb25zdCBlOiBhbnkgPSBldmVudDtcclxuICAgICAgICBsZXQgZXY6IE1vdXNlRXZlbnQ7XHJcblxyXG4gICAgICAgIC8vIFtDRFAgbW9kaWZpZWRdOiBzZXQgdGFyZ2V0LmNsaWVudFguXHJcbiAgICAgICAgaWYgKG51bGwgPT0gdGFyZ2V0LmNsaWVudFggfHwgbnVsbCA9PSB0YXJnZXQuY2xpZW50WSkge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBlLnBhZ2VYICYmIG51bGwgIT0gZS5wYWdlWSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFggPSBlLnBhZ2VYO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFkgPSBlLnBhZ2VZO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFkgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoISgvKFNFTEVDVHxJTlBVVHxURVhUQVJFQSkvaSkudGVzdCh0YXJnZXQudGFnTmFtZSkpIHtcclxuICAgICAgICAgICAgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIk1vdXNlRXZlbnRzXCIpO1xyXG4gICAgICAgICAgICBldi5pbml0TW91c2VFdmVudChcImNsaWNrXCIsIHRydWUsIHRydWUsIGUudmlldywgMSxcclxuICAgICAgICAgICAgICAgIHRhcmdldC5zY3JlZW5YLCB0YXJnZXQuc2NyZWVuWSwgdGFyZ2V0LmNsaWVudFgsIHRhcmdldC5jbGllbnRZLFxyXG4gICAgICAgICAgICAgICAgZS5jdHJsS2V5LCBlLmFsdEtleSwgZS5zaGlmdEtleSwgZS5tZXRhS2V5LFxyXG4gICAgICAgICAgICAgICAgMCwgbnVsbCk7XHJcblxyXG4gICAgICAgICAgICAoPGFueT5ldikuX2NvbnN0cnVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXYpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGV0IHNfYXBwbGllZCA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogaVNjcm9sbCBQYXRjaCDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR1aSAgICAgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseVBhdGNoKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgaWYgKCFzX2FwcGxpZWQgJiYgZ2xvYmFsLklTY3JvbGwgJiYgZ2xvYmFsLklTY3JvbGwudXRpbHMpIHtcclxuICAgICAgICAgICAgZ2xvYmFsLklTY3JvbGwudXRpbHMuY2xpY2sgPSBwYXRjaF9JU2Nyb2xsX3V0aWxzX2NsaWNrO1xyXG4gICAgICAgICAgICBzX2FwcGxpZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJHVpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseVBhdGNoKTtcclxufVxyXG4iLCJkZWNsYXJlIG1vZHVsZSBcImNkcC51aS5qcW1cIiB7XHJcbiAgICBjb25zdCBVSTogdHlwZW9mIENEUC5VSTtcclxuICAgIGV4cG9ydCA9IFVJO1xyXG59XHJcbiJdfQ==