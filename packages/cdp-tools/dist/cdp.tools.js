﻿/*!
 * cdp.tools.js 2.0.0
 *
 * Date: 2017-08-02T06:54:34.299Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["cdp.core", "cdp.promise"], function () { return factory(root.CDP || (root.CDP = {}), root.jQuery || root.$); }); } else { factory(root.CDP || (root.CDP = {}), root.jQuery || root.$); } }(((this || 0).self || global), function (CDP, $) { CDP.Tools = CDP.Tools || {};
var CDP;
(function (CDP) {
    /**
     * @enum  RESULT_CODE_BASE
     * @brief リザルトコードのオフセット値
     */
    var RESULT_CODE_BASE;
    (function (RESULT_CODE_BASE) {
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_TOOLS_DECLARERATION"] = 0] = "CDP_TOOLS_DECLARERATION";
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_TOOLS"] = 4 * CDP.MODULE_RESULT_CODE_RANGE_CDP] = "CDP_TOOLS";
    })(RESULT_CODE_BASE = CDP.RESULT_CODE_BASE || (CDP.RESULT_CODE_BASE = {}));
    ///////////////////////////////////////////////////////////////////////
    // module error declaration:
    var FUNCTION_CODE_RANGE = 10;
    /**
     * @enum  LOCAL_CODE_BASE
     * @brief cdp.tools 内のローカルコードオフセット値
     */
    var LOCAL_CODE_BASE;
    (function (LOCAL_CODE_BASE) {
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["FUNCTIONS"] = 0] = "FUNCTIONS";
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["BLOB"] = 1 * FUNCTION_CODE_RANGE] = "BLOB";
    })(LOCAL_CODE_BASE || (LOCAL_CODE_BASE = {}));
    /* tslint:disable:max-line-length */
    /**
     * @enum  RESULT_CODE
     * @brief cdp.tools のエラーコード定義
     */
    var RESULT_CODE;
    (function (RESULT_CODE) {
        RESULT_CODE[RESULT_CODE["ERROR_CDP_TOOLS_DECLARATION"] = 0] = "ERROR_CDP_TOOLS_DECLARATION";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_TOOLS_IMAGE_LOAD_FAILED"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_TOOLS, LOCAL_CODE_BASE.FUNCTIONS + 1, "image load failed.")] = "ERROR_CDP_TOOLS_IMAGE_LOAD_FAILED";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_TOOLS_INVALID_IMAGE"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_TOOLS, LOCAL_CODE_BASE.FUNCTIONS + 2, "invalid image.")] = "ERROR_CDP_TOOLS_INVALID_IMAGE";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_TOOLS_FILE_READER_ERROR"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_TOOLS, LOCAL_CODE_BASE.BLOB + 1, "FileReader method failed.")] = "ERROR_CDP_TOOLS_FILE_READER_ERROR";
    })(RESULT_CODE = CDP.RESULT_CODE || (CDP.RESULT_CODE = {}));
    /* tslint:enable:max-line-length */
})(CDP || (CDP = {}));
/// <reference types="jquery" />
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var Promise = CDP.Promise;
        var TAG = "[CDP.Tools.Functions] ";
        /**
         * Math.abs よりも高速な abs
         */
        function abs(x) {
            return x >= 0 ? x : -x;
        }
        Tools.abs = abs;
        /**
         * Math.max よりも高速な max
         */
        function max(lhs, rhs) {
            return lhs >= rhs ? lhs : rhs;
        }
        Tools.max = max;
        /**
         * Math.min よりも高速な min
         */
        function min(lhs, rhs) {
            return lhs <= rhs ? lhs : rhs;
        }
        Tools.min = min;
        /**
         * 数値を 0 詰めして文字列を生成
         */
        function toZeroPadding(no, limit) {
            var signed = "";
            no = Number(no);
            if (isNaN(no) || isNaN(limit) || limit <= 0) {
                return null;
            }
            if (no < 0) {
                no = Tools.abs(no);
                signed = "-";
            }
            return signed + (Array(limit).join("0") + no).slice(-limit);
        }
        Tools.toZeroPadding = toZeroPadding;
        /**
         * 文字列のバイト数をカウント
         */
        function getStringSize(src) {
            return (new CDP.global.Blob([src], { type: "text/plain" })).size;
        }
        Tools.getStringSize = getStringSize;
        /**
         * 文字列をバイト制限して分割
         */
        function toStringChunks(src, limit) {
            // TODO:
            return [src];
        }
        Tools.toStringChunks = toStringChunks;
        /**
         * 多重継承のための実行時継承関数
         *
         * Sub Class 候補オブジェクトに対して Super Class 候補オブジェクトを直前の Super Class として挿入する。
         * prototype のみコピーする。
         * インスタンスメンバをコピーしたい場合、Super Class が疑似コンストラクタを提供する必要がある。
         * 詳細は cdp.tools.Functions.spec.ts を参照。
         *
         * @param subClass   {constructor} [in] オブジェクトの constructor を指定
         * @param superClass {constructor} [in] オブジェクトの constructor を指定
         */
        function inherit(subClass, superClass) {
            var _prototype = subClass.prototype;
            function _inherit() {
                this.constructor = subClass;
            }
            _inherit.prototype = superClass.prototype;
            subClass.prototype = new _inherit();
            $.extend(subClass.prototype, _prototype);
        }
        Tools.inherit = inherit;
        /**
         * mixin 関数
         *
         * TypeScript Official Site に載っている mixin 関数
         * http://www.typescriptlang.org/Handbook#mixins
         * 既に定義されているオブジェクトから、新規にオブジェクトを合成する。
         *
         * @param derived {constructor}    [in] 合成されるオブジェクトの constructor を指定
         * @param bases   {constructor...} [in] 合成元オブジェクトの constructor を指定 (可変引数)
         */
        function mixin(derived) {
            var bases = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                bases[_i - 1] = arguments[_i];
            }
            bases.forEach(function (base) {
                Object.getOwnPropertyNames(base.prototype).forEach(function (name) {
                    derived.prototype[name] = base.prototype[name];
                });
            });
        }
        Tools.mixin = mixin;
        /**
         * \~english
         * Helper function to correctly set up the prototype chain, for subclasses.
         * The function behavior is same as extend() function of Backbone.js.
         *
         * @param protoProps  {Object} [in] set prototype properties as object.
         * @param staticProps {Object} [in] set static properties as object.
         * @return {Object} subclass constructor.
         *
         * \~japanese
         * クラス継承のためのヘルパー関数
         * Backbone.js extend() 関数と同等
         *
         * @param protoProps  {Object} [in] prototype properties をオブジェクトで指定
         * @param staticProps {Object} [in] static properties をオブジェクトで指定
         * @return {Object} サブクラスのコンストラクタ
         */
        function extend(protoProps, staticProps) {
            var parent = this;
            var child;
            if (protoProps && protoProps.hasOwnProperty("constructor")) {
                child = protoProps.constructor;
            }
            else {
                child = function () {
                    return parent.apply(this, arguments);
                };
            }
            $.extend(child, parent, staticProps);
            var Surrogate = function () {
                this.constructor = child;
            };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;
            if (protoProps) {
                $.extend(child.prototype, protoProps);
            }
            child.__super__ = parent.prototype;
            return child;
        }
        Tools.extend = extend;
        /**
         * DPI 取得
         */
        function getDevicePixcelRatio() {
            var mediaQuery;
            var is_firefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
            if (null != window.devicePixelRatio && !is_firefox) {
                return window.devicePixelRatio;
            }
            else if (window.matchMedia) {
                mediaQuery =
                    "(-webkit-min-device-pixel-ratio: 1.5),\
                    (min--moz-device-pixel-ratio: 1.5),\
                    (-o-min-device-pixel-ratio: 3/2),\
                    (min-resolution: 1.5dppx)";
                if (window.matchMedia(mediaQuery).matches) {
                    return 1.5;
                }
                mediaQuery =
                    "(-webkit-min-device-pixel-ratio: 2),\
                    (min--moz-device-pixel-ratio: 2),\
                    (-o-min-device-pixel-ratio: 2/1),\
                    (min-resolution: 2dppx)";
                if (window.matchMedia(mediaQuery).matches) {
                    return 2;
                }
                mediaQuery =
                    "(-webkit-min-device-pixel-ratio: 0.75),\
                    (min--moz-device-pixel-ratio: 0.75),\
                    (-o-min-device-pixel-ratio: 3/4),\
                    (min-resolution: 0.75dppx)";
                if (window.matchMedia(mediaQuery).matches) {
                    return 0.7;
                }
            }
            else {
                return 1;
            }
        }
        Tools.getDevicePixcelRatio = getDevicePixcelRatio;
        // Canvas element のキャッシュ
        var s_canvasFactory;
        // キャッシュ済みの Canvas を取得する
        function getCanvas() {
            s_canvasFactory = s_canvasFactory || document.createElement("canvas");
            return s_canvasFactory.cloneNode(false);
        }
        Tools.getCanvas = getCanvas;
        /**
         * 画像リソースのロード完了を保証
         * ブラウザ既定のプログレッシブロードを走らせないため.
         *
         * @param  {String} url [in] url (data-url)
         * @return {IPromise<string>} 表示可能な url
         */
        function ensureImageLoaded(url) {
            var img = new Image();
            var destroy = function () {
                if (img) {
                    img.src = ""; // 読み込み停止
                    img = null;
                }
            };
            return new Promise(function (resolve, reject) {
                img.onload = function (event) {
                    destroy();
                    resolve(url);
                };
                img.onerror = function (event) {
                    destroy();
                    reject(CDP.makeErrorInfo(CDP.RESULT_CODE.ERROR_CDP_TOOLS_IMAGE_LOAD_FAILED, TAG, "image load failed. [url: " + url + "]"));
                };
                img.src = url;
            }, destroy);
        }
        Tools.ensureImageLoaded = ensureImageLoaded;
        /**
         * 画像のリサイズ
         * 指定した長辺の長さにアスペクト比を維持してリサイズを行う
         * longSideLength より小さな場合はオリジナルサイズで data-url を返却する
         *
         * @param  {String} src            [in] image に指定するソース
         * @param  {Number} longSideLength [in] リサイズに使用する長辺の最大値を指定
         * @return {IPromise<string>} base64 data url を返却
         */
        function resizeImage(src, longSideLength) {
            var img = new Image();
            var destroy = function () {
                if (img) {
                    img.src = ""; // 読み込み停止
                    img = null;
                }
            };
            return new Promise(function (resolve, reject) {
                img.onload = function (event) {
                    var canvas = getCanvas();
                    var ih = img.height, iw = img.width, ia = ih / iw;
                    var cw, ch;
                    if (iw === 0 || 0 === ia) {
                        reject(CDP.makeErrorInfo(CDP.RESULT_CODE.ERROR_CDP_TOOLS_INVALID_IMAGE, TAG, "invalid image. [src: " + src + "]"));
                    }
                    else {
                        if (longSideLength <= 0) {
                            longSideLength = (ia < 1) ? iw : ih;
                        }
                        if (ia < 1) {
                            cw = (longSideLength < iw) ? longSideLength : iw;
                            ch = Math.round(cw * ia);
                        }
                        else {
                            ch = (longSideLength < ih) ? longSideLength : ih;
                            cw = Math.round(ch / ia);
                        }
                        canvas.width = cw;
                        canvas.height = ch;
                        canvas.getContext("2d").drawImage(img, 0, 0, cw, ch);
                        resolve(canvas.toDataURL());
                    }
                    destroy();
                };
                img.onerror = function (event) {
                    destroy();
                    reject(CDP.makeErrorInfo(CDP.RESULT_CODE.ERROR_CDP_TOOLS_IMAGE_LOAD_FAILED, TAG, "image load failed. [src: " + src + "]"));
                };
                img.src = src;
            });
        }
        Tools.resizeImage = resizeImage;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var Promise = CDP.Promise;
        var TAG = "[CDP.Tools.Binary] ";
        /**
         * @class Binary
         * @brief バイナリユーティリティ
         */
        var Binary = (function () {
            // private constructor
            function Binary() {
                // noop
            }
            /**
             * Get BlobBuilder
             *
             * @return {any} BlobBuilder
             */
            Binary.getBlobBuilder = function () {
                return CDP.global.BlobBuilder || CDP.global.WebKitBlobBuilder || CDP.global.MozBlobBuilder || CDP.global.MSBlobBuilder;
            };
            /**
             * エラー情報生成 from DOMError
             *
             * @param resultCode [in] RESULT_CODE を指定
             * @param cause      [in] 下位の DOM エラーを指定
             * @param [tag]      [in] TAG を指定
             * @param [message]  [in] メッセージを指定
             * @returns エラーオブジェクト
             */
            Binary.makeErrorInfoFromDOMError = function (resultCode, cause, tag, message) {
                var _cause;
                if (cause) {
                    _cause = {
                        name: cause.name,
                        message: cause.name,
                    };
                }
                return CDP.makeErrorInfo(resultCode, tag, message, _cause);
            };
            /**
             * ArrayBuffer to Blob
             *
             * @param buf [in] ArrayBuffer data
             * @param mimeType [in] MimeType of data
             * @returns Blob data
             */
            Binary.arrayBufferToBlob = function (buf, mimeType) {
                var blob = null;
                if (CDP.global.Blob) {
                    blob = new CDP.global.Blob([buf], { type: mimeType });
                }
                else {
                    // under Android 4.4 KitKat
                    var blobBuilderObject = Binary.getBlobBuilder();
                    var blobBuilder = new blobBuilderObject();
                    blobBuilder.append(buf);
                    blob = blobBuilder.getBlob(mimeType);
                }
                return blob;
            };
            /**
             * Base64 string to Blob
             *
             * @param base64 {string} [in] Base64 string data
             * @param mimeType {string} [in] MimeType of data
             * @return {Blob} Blob data
             */
            Binary.base64ToBlob = function (base64, mimeType) {
                var blob = null;
                if (CDP.global.Blob) {
                    blob = new CDP.global.Blob([Binary.base64ToArrayBuffer(base64)], { type: mimeType });
                }
                else {
                    // under Android 4.4 KitKat
                    var blobBuilderObject = Binary.getBlobBuilder();
                    var blobBuilder = new blobBuilderObject();
                    blobBuilder.append(Binary.base64ToArrayBuffer(base64));
                    blob = blobBuilder.getBlob(mimeType);
                }
                return blob;
            };
            /**
             * data-url 形式画像から Blob オブジェクトへ変換
             *
             * @param  {String} dataUrl    [in] data url
             * @param  {String} [mimeType] [in] mime type を指定. 既定では "image/png"
             * @return {Blob} Blob インスタンス
             */
            Binary.dataUrlToBlob = function (dataUrl, mimeType) {
                if (mimeType === void 0) { mimeType = "image/png"; }
                var base64 = dataUrl.split(",")[1];
                return Binary.base64ToBlob(base64, mimeType);
            };
            /**
             * Base64 string to ArrayBuffer
             *
             * @param base64 {string} [in] Base64 string data
             * @return {ArrayBuffer} ArrayBuffer data
             */
            Binary.base64ToArrayBuffer = function (base64) {
                var bytes = window.atob(base64);
                var arrayBuffer = new ArrayBuffer(bytes.length);
                var data = new Uint8Array(arrayBuffer);
                for (var i = 0, len = bytes.length; i < len; ++i) {
                    data[i] = bytes.charCodeAt(i);
                }
                return arrayBuffer;
            };
            /**
             * Base64 string to Uint8Array
             *
             * @param base64 {string} [in] Base64 string data
             * @return {Uint8Array} Uint8Array data
             */
            Binary.base64ToUint8Array = function (encoded) {
                var bytes = window.atob(encoded);
                var data = new Uint8Array(bytes.length);
                for (var i = 0, len = bytes.length; i < len; ++i) {
                    data[i] = bytes.charCodeAt(i);
                }
                return data;
            };
            /**
             * ArrayBuffer to base64 string
             *
             * @param arrayBuffer {ArrayBuffer} [in] ArrayBuffer data
             * @return {string} base64 data
             */
            Binary.arrayBufferToBase64 = function (arrayBuffer) {
                var bytes = new Uint8Array(arrayBuffer);
                return Binary.uint8ArrayToBase64(bytes);
            };
            /**
             * Uint8Array to base64 string
             *
             * @param bytes {Uint8Array} [in] Uint8Array data
             * @return {string} base64 data
             */
            Binary.uint8ArrayToBase64 = function (bytes) {
                var data = "";
                for (var i = 0, len = bytes.byteLength; i < len; ++i) {
                    data += String.fromCharCode(bytes[i]);
                }
                return window.btoa(data);
            };
            /**
             * read Blob as ArrayBuffer
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<ArrayBuffer>} promise object
             */
            Binary.readBlobAsArrayBuffer = function (blob) {
                var reader = new FileReader();
                var cancel = function () { return reader.abort(); };
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function () {
                        reject(Binary.makeErrorInfoFromDOMError(CDP.RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR, reader.error, TAG, "FileReader.readAsArrayBuffer() failed."));
                    };
                    reader.readAsArrayBuffer(blob);
                }, cancel);
            };
            /**
             * read Blob as Uint8Array
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<Uint8Array>} promise object
             */
            Binary.readBlobAsUint8Array = function (blob) {
                return new Promise(function (resolve, reject, dependOn) {
                    dependOn(Binary.readBlobAsArrayBuffer(blob))
                        .then(function (result) {
                        resolve(new Uint8Array(result));
                    })
                        .catch(function (error) {
                        reject(error);
                    });
                });
            };
            /**
             * read Blob as text string
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<Uint8Array>} promise object
             */
            Binary.readBlobAsText = function (blob, encode) {
                if (encode === void 0) { encode = "utf-8"; }
                var reader = new FileReader();
                var cancel = function () { return reader.abort(); };
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function () {
                        reject(Binary.makeErrorInfoFromDOMError(CDP.RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR, reader.error, TAG, "FileReader.readAsText() failed."));
                    };
                    reader.readAsText(blob, encode);
                }, cancel);
            };
            /**
             * read Blob as Data URL
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<string>} promise object
             */
            Binary.readBlobAsDataURL = function (blob) {
                var reader = new FileReader();
                var cancel = function () { return reader.abort(); };
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function () {
                        reject(Binary.makeErrorInfoFromDOMError(CDP.RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR, reader.error, TAG, "FileReader.readAsDataURL() failed."));
                    };
                    reader.readAsDataURL(blob);
                }, cancel);
            };
            /**
             * URL Object
             *
             * @obsolete
             * @return {any} URL Object
             */
            Binary.blobURL = (function () {
                return CDP.global.URL || CDP.global.webkitURL;
            })();
            return Binary;
        }());
        Tools.Binary = Binary;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));
/**
 * @file  BinaryTransport.ts
 * @brief jQuery ajax transport for making binary data type requests.
 *
 *        original: https://github.com/henrya/js-jquery/blob/master/BinaryTransport/jquery.binarytransport.js
 *        author:   Henry Algus <henryalgus@gmail.com>
 */
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        // Support file protocol. (as same as official way)
        var xhrSuccessStatus = {
            0: 200,
            1223: 204
        };
        $.ajaxTransport("+binary", function (options, originalOptions, jqXHR) {
            if (CDP.global.FormData &&
                ((options.dataType && (options.dataType === "binary")) ||
                    (options.data && ((CDP.global.ArrayBuffer && options.data instanceof ArrayBuffer) ||
                        (CDP.global.Blob && options.data instanceof CDP.global.Blob))))) {
                var abortCallback_1;
                return {
                    send: function (headers, callback) {
                        // setup all variables
                        var xhr = new XMLHttpRequest();
                        var url = options.url;
                        var type = options.type;
                        var async = options.async || true;
                        // blob or arraybuffer. Default is blob
                        var dataType = options.responseType || "blob";
                        var data = options.data || null;
                        var username = options.username || null;
                        var password = options.password || null;
                        var _callback = callback || (function () { });
                        // succeeded handler
                        xhr.addEventListener("load", function () {
                            var _data = {};
                            _data[options.dataType] = xhr.response;
                            _callback(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, _data, xhr.getAllResponseHeaders());
                        });
                        // error handler
                        xhr.addEventListener("error", function () {
                            var _data = {};
                            _data[options.dataType] = xhr.response;
                            // make callback and send data
                            _callback(xhr.status, xhr.statusText, _data, xhr.getAllResponseHeaders());
                        });
                        // abort handler
                        xhr.addEventListener("abort", function () {
                            var _data = {};
                            _data[options.dataType] = xhr.response;
                            // make callback and send data
                            _callback(xhr.status, xhr.statusText, _data, xhr.getAllResponseHeaders());
                        });
                        // abort callback
                        abortCallback_1 = function () {
                            xhr.abort();
                        };
                        xhr.open(type, url, async, username, password);
                        // setup custom headers
                        for (var i in headers) {
                            if (headers.hasOwnProperty(i)) {
                                xhr.setRequestHeader(i, headers[i]);
                            }
                        }
                        xhr.responseType = dataType;
                        xhr.send(data);
                    },
                    abort: function () {
                        if (abortCallback_1) {
                            abortCallback_1();
                        }
                    }
                };
            }
        });
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));
/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.DateTime] ";
        /**
         * @class DateTime
         * @brief 時刻操作のユーティリティクラス
         */
        var DateTime = (function () {
            function DateTime() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static method
            /**
             * 基点となる日付から、n日後、n日前を算出
             *
             * @param base    {Date}   [in] 基準日
             * @param addDays {Number} [in] 加算日. マイナス指定でn日前も設定可能
             * @return {Date} 日付オブジェクト
             */
            DateTime.computeDate = function (base, addDays) {
                var dt = new Date(base.getTime());
                var baseSec = dt.getTime();
                var addSec = addDays * 86400000; //日数 * 1日のミリ秒数
                var targetSec = baseSec + addSec;
                dt.setTime(targetSec);
                return dt;
            };
            /**
             * Convert string to date object
             *
             * @param {String} date string ex) YYYY-MM-DDTHH:mm:SS.SSS
             * @return {Object} date object
             */
            DateTime.convertISOStringToDate = function (dateString) {
                var dateTime = dateString.split("T"), dateArray = dateTime[0].split("-");
                var timeArray, secArray, dateObject;
                if (dateTime[1]) {
                    timeArray = dateTime[1].split(":");
                    secArray = timeArray[2].split(".");
                }
                if (timeArray) {
                    dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], secArray[0], secArray[1]);
                }
                else {
                    if (dateArray[2]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                    }
                    else if (dateArray[1]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1);
                    }
                    else {
                        dateObject = new Date(dateArray[0]);
                    }
                }
                return dateObject;
            };
            /**
             *  Convert a date object into a string in PMOAPI recorded_date format(the ISO 8601 Extended Format)
             *
             * @param date   {Date}   [in] date object
             * @param target {String} [in] {year | month | date | hour | min | sec | msec }
             * @return {String}
             */
            DateTime.convertDateToISOString = function (date, target) {
                if (target === void 0) { target = "msec"; }
                var isoDateString;
                switch (target) {
                    case "year":
                    case "month":
                    case "date":
                    case "hour":
                    case "min":
                    case "sec":
                    case "msec":
                        break;
                    default:
                        console.warn(TAG + "unknown target: " + target);
                        target = "msec";
                }
                isoDateString = date.getFullYear();
                if ("year" === target) {
                    return isoDateString;
                }
                isoDateString += ("-" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1));
                if ("month" === target) {
                    return isoDateString;
                }
                isoDateString += ("-" + DateTime.numberToDoubleDigitsString(date.getDate()));
                if ("date" === target) {
                    return isoDateString;
                }
                isoDateString += ("T" + DateTime.numberToDoubleDigitsString(date.getHours()));
                if ("hour" === target) {
                    return isoDateString;
                }
                isoDateString += (":" + DateTime.numberToDoubleDigitsString(date.getMinutes()));
                if ("min" === target) {
                    return isoDateString;
                }
                isoDateString += (":" + DateTime.numberToDoubleDigitsString(date.getSeconds()));
                if ("sec" === target) {
                    return isoDateString;
                }
                isoDateString += ("." + String((date.getMilliseconds() / 1000).toFixed(3)).slice(2, 5));
                return isoDateString;
            };
            /**
             * Convert file system compatible string to date object
             *
             * @param {String} date string ex) yyyy_MM_ddTHH_mm_ss_SSS
             * @return {Object} date object
             */
            DateTime.convertFileSystemStringToDate = function (dateString) {
                var dateTime = dateString.split("T"), dateArray = dateTime[0].split("_");
                var timeArray, dateObject;
                if (dateTime[1]) {
                    timeArray = dateTime[1].split("_");
                }
                if (timeArray) {
                    dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], timeArray[2], timeArray[3]);
                }
                else {
                    if (dateArray[2]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                    }
                    else if (dateArray[1]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1);
                    }
                    else {
                        dateObject = new Date(dateArray[0]);
                    }
                }
                return dateObject;
            };
            /**
             *  Convert a date object into a string in file system compatible format(yyyy_MM_ddTHH_mm_ss_SSS)
             *
             * @param date   {Date}   [in] date object
             * @param target {String} [in] {year | month | date | hour | min | sec | msec }
             * @return {String}
             */
            DateTime.convertDateToFileSystemString = function (date, target) {
                if (target === void 0) { target = "msec"; }
                var fileSystemString;
                switch (target) {
                    case "year":
                    case "month":
                    case "date":
                    case "hour":
                    case "min":
                    case "sec":
                    case "msec":
                        break;
                    default:
                        console.warn(TAG + "unknown target: " + target);
                        target = "msec";
                }
                fileSystemString = date.getFullYear();
                if ("year" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1));
                if ("month" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getDate()));
                if ("date" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("T" + DateTime.numberToDoubleDigitsString(date.getHours()));
                if ("hour" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getMinutes()));
                if ("min" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getSeconds()));
                if ("sec" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + String((date.getMilliseconds() / 1000).toFixed(3)).slice(2, 5));
                return fileSystemString;
            };
            ///////////////////////////////////////////////////////////////////////
            // private static method
            /**
             * Convert num to string(double digits)
             *
             * @param  {Number} number (0 <number < 100)
             * @return {String} double digits string
             */
            DateTime.numberToDoubleDigitsString = function (num) {
                if (num < 0 || num > 100) {
                    return null;
                }
                if (num < 10) {
                    return "0" + num;
                }
                return "" + num;
            };
            return DateTime;
        }());
        Tools.DateTime = DateTime;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));
/// <reference types="jquery" />
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.Template] ";
        //___________________________________________________________________________________________________________________//
        /**
         * @class Template
         * @brief template script を管理するユーティリティクラス
         */
        var Template = (function () {
            function Template() {
            }
            ///////////////////////////////////////////////////////////////////////
            // 公開メソッド
            /**
             * 指定した id, class 名, Tag 名をキーにテンプレートの JQuery Element を取得する。
             *
             * @param {String}  key     [in] id, class, tag を表す文字列
             * @param {String}  [src]   [in] 外部 html を指定する場合は url を設定
             * @param {Boolean} [cache] [in] src html をキャッシュする場合は true. src が指定されているときのみ有効
             * @return template が格納されている JQuery Element
             */
            Template.getTemplateElement = function (key, src, cache) {
                if (src === void 0) { src = null; }
                if (cache === void 0) { cache = true; }
                var mapElement = Template.getElementMap();
                var $element = mapElement[key];
                try {
                    if (!$element) {
                        if (src) {
                            var html = Template.findHtmlFromSource(src);
                            $element = $(html).find(key);
                        }
                        else {
                            $element = $(key);
                        }
                        // 要素の検証
                        if ($element <= 0) {
                            throw ("invalid [key, src] = [" + key + ", " + src + "]");
                        }
                        if (src && cache) {
                            mapElement[key] = $element;
                        }
                    }
                }
                catch (exception) {
                    console.error(TAG + exception);
                    return null;
                }
                return $element;
            };
            /**
             * Map オブジェクトの削除
             * 明示的にキャッシュを開放する場合は本メソッドをコールする
             */
            Template.empty = function () {
                Template._mapElement = null;
                Template._mapSource = null;
            };
            Template.getJST = function (key, src, cache) {
                var template = null;
                var jst;
                var $element;
                if (key instanceof jQuery) {
                    $element = key;
                }
                else {
                    $element = Template.getTemplateElement(key, src, cache);
                }
                if (null != CDP.global.Hogan) {
                    template = Hogan.compile($element.text());
                    jst = function (data) {
                        return template.render(data);
                    };
                }
                else if (null != CDP.global._) {
                    template = _.template($element.html());
                    jst = function (data) {
                        // 改行とタブは削除する
                        return template(data).replace(/\n|\t/g, "");
                    };
                }
                else {
                    console.warn(TAG + "cannot find template engine module.");
                    console.warn("    'hogan' or 'underscore' is required.");
                }
                return jst;
            };
            ///////////////////////////////////////////////////////////////////////
            // 内部メソッド
            //! Element Map オブジェクトの取得
            Template.getElementMap = function () {
                if (!Template._mapElement) {
                    Template._mapElement = {};
                }
                return Template._mapElement;
            };
            //! URL Map オブジェクトの取得
            Template.getSourceMap = function () {
                if (!Template._mapSource) {
                    Template._mapSource = {};
                }
                return Template._mapSource;
            };
            //! URL Map から HTML を検索. 失敗した場合は undefined が返る
            Template.findHtmlFromSource = function (src) {
                var mapSource = Template.getSourceMap();
                var html = mapSource[src];
                if (!html) {
                    $.ajax({
                        url: src,
                        method: "GET",
                        async: false,
                        dataType: "html",
                        success: function (data) {
                            html = data;
                        },
                        error: function (data, status) {
                            throw ("ajax request failed. status: " + status);
                        }
                    });
                    // キャッシュに格納
                    mapSource[src] = html;
                }
                return html;
            };
            return Template;
        }());
        Tools.Template = Template;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.ProgressCounter] ";
        /**
         * @class ProgressCounter
         * @brief 進捗の時間を扱うユーティリティクラス
         */
        var ProgressCounter = (function () {
            /**
             * constructor
             *
             * @param [options] オプション
             */
            function ProgressCounter(options) {
                this.reset(options);
            }
            /**
             * 開始時間を初期化
             */
            ProgressCounter.prototype.reset = function (options) {
                this._settings = __assign({
                    max: 100,
                    beginTime: Date.now(),
                    allowIncrementeRemain: false,
                    lastRemainTime: Infinity,
                }, options);
            };
            /**
             * 経過時間と推定残り時間を取得する
             * 進捗値が 0 の場合は、推定残り時間に Infinity を返す
             *
             * @param   progress [in] 進捗値
             * @returns 経過時間と推定残り時間 [msec]
             */
            ProgressCounter.prototype.compute = function (progress) {
                var passTime = Date.now() - this._settings.beginTime;
                var remainTime = Infinity;
                if (null != progress && 0 !== progress) {
                    remainTime = passTime * this._settings.max / progress - passTime;
                }
                if (this._settings.allowIncrementeRemain || (remainTime < this._settings.lastRemainTime)) {
                    this._settings.lastRemainTime = remainTime;
                }
                else {
                    remainTime = this._settings.lastRemainTime;
                }
                return { passTime: passTime, remainTime: remainTime };
            };
            return ProgressCounter;
        }());
        Tools.ProgressCounter = ProgressCounter;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));

return CDP.Tools; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVG9vbHMvRXJyb3JEZWZzLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9GdW5jdGlvbnMudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL0JpbmFyeS50cyIsImNkcDovLy9DRFAvVG9vbHMvQmluYXJ5VHJhbnNwb3J0LnRzIiwiY2RwOi8vL0NEUC9Ub29scy9EYXRlVGltZS50cyIsImNkcDovLy9DRFAvVG9vbHMvVGVtcGxhdGUudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL1Byb2dyZXNzQ291bnRlci50cyIsImNkcDovLy9DRFAvVG9vbHMvSW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0FxQ1o7QUFyQ0QsV0FBVSxHQUFHO0lBRVQ7OztPQUdHO0lBQ0gsSUFBWSxnQkFHWDtJQUhELFdBQVksZ0JBQWdCO1FBQ3hCLDZGQUEyQjtRQUMzQixpREFBWSxDQUFDLEdBQUcsZ0NBQTRCO0lBQ2hELENBQUMsRUFIVyxnQkFBZ0IsR0FBaEIsb0JBQWdCLEtBQWhCLG9CQUFnQixRQUczQjtJQUVELHVFQUF1RTtJQUN2RSw0QkFBNEI7SUFFNUIsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFFL0I7OztPQUdHO0lBQ0gsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLCtEQUFlO1FBQ2YsMENBQWMsQ0FBQyxHQUFHLG1CQUFtQjtJQUN6QyxDQUFDLEVBSEksZUFBZSxLQUFmLGVBQWUsUUFHbkI7SUFFRCxvQ0FBb0M7SUFDcEM7OztPQUdHO0lBQ0gsSUFBWSxXQUtYO0lBTEQsV0FBWSxXQUFXO1FBQ25CLDJGQUF1QztRQUN2QywrREFBc0Msc0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLG9CQUFvQixDQUFDO1FBQ3pJLDJEQUFzQyxzQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsR0FBRyxD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SUFBSSxJQUFJLFFBQVEsSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDckMsVUFBVSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxRQUFRLEdBQUcsUUFBUSxDQUFDO2dCQUNyRSxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZGLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQztnQkFDL0MsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7Z0JBQy9DLENBQUM7Z0JBRUQsTUFBTSxDQUFDLEVBQUUsUUFBUSxZQUFFLFVBQVUsY0FBRSxDQUFDO1lBQ3BDLENBQUM7WUFDTCxzQkFBQztRQUFELENBQUM7UUF0RFkscUJBQWUsa0JBc0QzQjtJQUNMLENBQUMsRUFsRmEsS0FBSyxHQUFMLFNBQUssS0FBTCxTQUFLLFFBa0ZsQjtBQUFELENBQUMsRUFsRlMsR0FBRyxLQUFILEdBQUcsUUFrRloiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgQ0RQIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbnVtICBSRVNVTFRfQ09ERV9CQVNFXHJcbiAgICAgKiBAYnJpZWYg44Oq44K244Or44OI44Kz44O844OJ44Gu44Kq44OV44K744OD44OI5YCkXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIENEUF9UT09MU19ERUNMQVJFUkFUSU9OID0gMCwgICAgLy8gVFMyNDMyIOWvvuetllxyXG4gICAgICAgIENEUF9UT09MUyA9IDQgKiBNT0RVTEVfUkVTVUxUX0NPREVfUkFOR0VfQ0RQLFxyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBtb2R1bGUgZXJyb3IgZGVjbGFyYXRpb246XHJcblxyXG4gICAgY29uc3QgRlVOQ1RJT05fQ09ERV9SQU5HRSA9IDEwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIExPQ0FMX0NPREVfQkFTRVxyXG4gICAgICogQGJyaWVmIGNkcC50b29scyDlhoXjga7jg63jg7zjgqvjg6vjgrPjg7zjg4njgqrjg5Xjgrvjg4Pjg4jlgKRcclxuICAgICAqL1xyXG4gICAgZW51bSBMT0NBTF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIEZVTkNUSU9OUyAgID0gMCxcclxuICAgICAgICBCTE9CICAgICAgICA9IDEgKiBGVU5DVElPTl9DT0RFX1JBTkdFLFxyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW51bSAgUkVTVUxUX0NPREVcclxuICAgICAqIEBicmllZiBjZHAudG9vbHMg44Gu44Ko44Op44O844Kz44O844OJ5a6a576pXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFIHtcclxuICAgICAgICBFUlJPUl9DRFBfVE9PTFNfREVDTEFSQVRJT04gICAgICAgICA9IDAsIC8vIFRTMjQzMiDlr77nrZZcclxuICAgICAgICBFUlJPUl9DRFBfVE9PTFNfSU1BR0VfTE9BRF9GQUlMRUQgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9UT09MUywgTE9DQUxfQ09ERV9CQVNFLkZVTkNUSU9OUyArIDEsIFwiaW1hZ2UgbG9hZCBmYWlsZWQuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19JTlZBTElEX0lNQUdFICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX1RPT0xTLCBMT0NBTF9DT0RFX0JBU0UuRlVOQ1RJT05TICsgMiwgXCJpbnZhbGlkIGltYWdlLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9UT09MUywgTE9DQUxfQ09ERV9CQVNFLkJMT0IgKyAxLCBcIkZpbGVSZWFkZXIgbWV0aG9kIGZhaWxlZC5cIiksXHJcbiAgICB9XHJcbiAgICAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwianF1ZXJ5XCIgLz5cclxuXHJcbm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGltcG9ydCBQcm9taXNlID0gQ0RQLlByb21pc2U7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlRvb2xzLkZ1bmN0aW9uc10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRoLmFicyDjgojjgorjgoLpq5jpgJ/jgaogYWJzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBhYnMoeDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4geCA+PSAwID8geCA6IC14O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF0aC5tYXgg44KI44KK44KC6auY6YCf44GqIG1heFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWF4KGxoczogbnVtYmVyLCByaHM6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGxocyA+PSByaHMgPyBsaHMgOiByaHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRoLm1pbiDjgojjgorjgoLpq5jpgJ/jgaogbWluXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtaW4obGhzOiBudW1iZXIsIHJoczogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gbGhzIDw9IHJocyA/IGxocyA6IHJocztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaVsOWApOOCkiAwIOipsOOCgeOBl+OBpuaWh+Wtl+WIl+OCkueUn+aIkFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gdG9aZXJvUGFkZGluZyhubzogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgc2lnbmVkID0gXCJcIjtcclxuICAgICAgICBubyA9IE51bWJlcihubyk7XHJcblxyXG4gICAgICAgIGlmIChpc05hTihubykgfHwgaXNOYU4obGltaXQpIHx8IGxpbWl0IDw9IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobm8gPCAwKSB7XHJcbiAgICAgICAgICAgIG5vID0gVG9vbHMuYWJzKG5vKTtcclxuICAgICAgICAgICAgc2lnbmVkID0gXCItXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2lnbmVkICsgKEFycmF5KGxpbWl0KS5qb2luKFwiMFwiKSArIG5vKS5zbGljZSgtbGltaXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5paH5a2X5YiX44Gu44OQ44Kk44OI5pWw44KS44Kr44Km44Oz44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRTdHJpbmdTaXplKHNyYzogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKG5ldyBnbG9iYWwuQmxvYihbc3JjXSwgeyB0eXBlOiBcInRleHQvcGxhaW5cIiB9KSkuc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaWh+Wtl+WIl+OCkuODkOOCpOODiOWItumZkOOBl+OBpuWIhuWJslxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gdG9TdHJpbmdDaHVua3Moc3JjOiBzdHJpbmcsIGxpbWl0OiBudW1iZXIpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgLy8gVE9ETzpcclxuICAgICAgICByZXR1cm4gW3NyY107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlpJrph43ntpnmib/jga7jgZ/jgoHjga7lrp/ooYzmmYLntpnmib/plqLmlbBcclxuICAgICAqXHJcbiAgICAgKiBTdWIgQ2xhc3Mg5YCZ6KOc44Kq44OW44K444Kn44Kv44OI44Gr5a++44GX44GmIFN1cGVyIENsYXNzIOWAmeijnOOCquODluOCuOOCp+OCr+ODiOOCkuebtOWJjeOBriBTdXBlciBDbGFzcyDjgajjgZfjgabmjL/lhaXjgZnjgovjgIJcclxuICAgICAqIHByb3RvdHlwZSDjga7jgb/jgrPjg5Tjg7zjgZnjgovjgIJcclxuICAgICAqIOOCpOODs+OCueOCv+ODs+OCueODoeODs+ODkOOCkuOCs+ODlOODvOOBl+OBn+OBhOWgtOWQiOOAgVN1cGVyIENsYXNzIOOBjOeWkeS8vOOCs+ODs+OCueODiOODqeOCr+OCv+OCkuaPkOS+m+OBmeOCi+W/heimgeOBjOOBguOCi+OAglxyXG4gICAgICog6Kmz57Sw44GvIGNkcC50b29scy5GdW5jdGlvbnMuc3BlYy50cyDjgpLlj4LnhafjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc3ViQ2xhc3MgICB7Y29uc3RydWN0b3J9IFtpbl0g44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIHN1cGVyQ2xhc3Mge2NvbnN0cnVjdG9yfSBbaW5dIOOCquODluOCuOOCp+OCr+ODiOOBriBjb25zdHJ1Y3RvciDjgpLmjIflrppcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaGVyaXQoc3ViQ2xhc3M6IGFueSwgc3VwZXJDbGFzczogYW55KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgX3Byb3RvdHlwZSA9IHN1YkNsYXNzLnByb3RvdHlwZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2luaGVyaXQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBzdWJDbGFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgX2luaGVyaXQucHJvdG90eXBlID0gc3VwZXJDbGFzcy5wcm90b3R5cGU7XHJcbiAgICAgICAgc3ViQ2xhc3MucHJvdG90eXBlID0gbmV3IF9pbmhlcml0KCk7XHJcblxyXG4gICAgICAgICQuZXh0ZW5kKHN1YkNsYXNzLnByb3RvdHlwZSwgX3Byb3RvdHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtaXhpbiDplqLmlbBcclxuICAgICAqXHJcbiAgICAgKiBUeXBlU2NyaXB0IE9mZmljaWFsIFNpdGUg44Gr6LyJ44Gj44Gm44GE44KLIG1peGluIOmWouaVsFxyXG4gICAgICogaHR0cDovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvSGFuZGJvb2sjbWl4aW5zXHJcbiAgICAgKiDml6LjgavlrprnvqnjgZXjgozjgabjgYTjgovjgqrjg5bjgrjjgqfjgq/jg4jjgYvjgonjgIHmlrDopo/jgavjgqrjg5bjgrjjgqfjgq/jg4jjgpLlkIjmiJDjgZnjgovjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVyaXZlZCB7Y29uc3RydWN0b3J9ICAgIFtpbl0g5ZCI5oiQ44GV44KM44KL44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIGJhc2VzICAge2NvbnN0cnVjdG9yLi4ufSBbaW5dIOWQiOaIkOWFg+OCquODluOCuOOCp+OCr+ODiOOBriBjb25zdHJ1Y3RvciDjgpLmjIflrpogKOWPr+WkieW8leaVsClcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1peGluKGRlcml2ZWQ6IGFueSwgLi4uYmFzZXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgYmFzZXMuZm9yRWFjaCgoYmFzZSkgPT4ge1xyXG4gICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlLnByb3RvdHlwZSkuZm9yRWFjaChuYW1lID0+IHtcclxuICAgICAgICAgICAgICAgIGRlcml2ZWQucHJvdG90eXBlW25hbWVdID0gYmFzZS5wcm90b3R5cGVbbmFtZV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNvcnJlY3RseSBzZXQgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiwgZm9yIHN1YmNsYXNzZXMuXHJcbiAgICAgKiBUaGUgZnVuY3Rpb24gYmVoYXZpb3IgaXMgc2FtZSBhcyBleHRlbmQoKSBmdW5jdGlvbiBvZiBCYWNrYm9uZS5qcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcHJvdG9Qcm9wcyAge09iamVjdH0gW2luXSBzZXQgcHJvdG90eXBlIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHN0YXRpY1Byb3BzIHtPYmplY3R9IFtpbl0gc2V0IHN0YXRpYyBwcm9wZXJ0aWVzIGFzIG9iamVjdC5cclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gc3ViY2xhc3MgY29uc3RydWN0b3IuXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIOOCr+ODqeOCuee2meaJv+OBruOBn+OCgeOBruODmOODq+ODkeODvOmWouaVsFxyXG4gICAgICogQmFja2JvbmUuanMgZXh0ZW5kKCkg6Zai5pWw44Go5ZCM562JXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHByb3RvUHJvcHMgIHtPYmplY3R9IFtpbl0gcHJvdG90eXBlIHByb3BlcnRpZXMg44KS44Kq44OW44K444Kn44Kv44OI44Gn5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gc3RhdGljUHJvcHMge09iamVjdH0gW2luXSBzdGF0aWMgcHJvcGVydGllcyDjgpLjgqrjg5bjgrjjgqfjgq/jg4jjgafmjIflrppcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0g44K144OW44Kv44Op44K544Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBleHRlbmQocHJvdG9Qcm9wczogb2JqZWN0LCBzdGF0aWNQcm9wcz86IG9iamVjdCk6IG9iamVjdCB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcztcclxuICAgICAgICBsZXQgY2hpbGQ7XHJcblxyXG4gICAgICAgIGlmIChwcm90b1Byb3BzICYmIHByb3RvUHJvcHMuaGFzT3duUHJvcGVydHkoXCJjb25zdHJ1Y3RvclwiKSkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hpbGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmV4dGVuZChjaGlsZCwgcGFyZW50LCBzdGF0aWNQcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IFN1cnJvZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3Vycm9nYXRlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XHJcbiAgICAgICAgY2hpbGQucHJvdG90eXBlID0gbmV3IFN1cnJvZ2F0ZTtcclxuXHJcbiAgICAgICAgaWYgKHByb3RvUHJvcHMpIHtcclxuICAgICAgICAgICAgJC5leHRlbmQoY2hpbGQucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgIHJldHVybiBjaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERQSSDlj5blvpdcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldERldmljZVBpeGNlbFJhdGlvKCk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IG1lZGlhUXVlcnk7XHJcbiAgICAgICAgY29uc3QgaXNfZmlyZWZveCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiZmlyZWZveFwiKSA+IC0xO1xyXG4gICAgICAgIGlmIChudWxsICE9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICYmICFpc19maXJlZm94KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKSB7XHJcbiAgICAgICAgICAgIG1lZGlhUXVlcnkgPVxyXG4gICAgICAgICAgICAgICAgXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMS41KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAzLzIpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi1yZXNvbHV0aW9uOiAxLjVkcHB4KVwiO1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDEuNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZWRpYVF1ZXJ5ID1cclxuICAgICAgICAgICAgICAgIFwiKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMiksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSxcXFxyXG4gICAgICAgICAgICAgICAgICAgICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyLzEpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi1yZXNvbHV0aW9uOiAyZHBweClcIjtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnkpLm1hdGNoZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1lZGlhUXVlcnkgPVxyXG4gICAgICAgICAgICAgICAgXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAwLjc1KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDAuNzUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDMvNCksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLXJlc29sdXRpb246IDAuNzVkcHB4KVwiO1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDYW52YXMgZWxlbWVudCDjga7jgq3jg6Pjg4Pjgrfjg6VcclxuICAgIGxldCBzX2NhbnZhc0ZhY3Rvcnk6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cclxuICAgIC8vIOOCreODo+ODg+OCt+ODpea4iOOBv+OBriBDYW52YXMg44KS5Y+W5b6X44GZ44KLXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q2FudmFzKCk6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgICAgICBzX2NhbnZhc0ZhY3RvcnkgPSBzX2NhbnZhc0ZhY3RvcnkgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICByZXR1cm4gPEhUTUxDYW52YXNFbGVtZW50PnNfY2FudmFzRmFjdG9yeS5jbG9uZU5vZGUoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55S75YOP44Oq44K944O844K544Gu44Ot44O844OJ5a6M5LqG44KS5L+d6Ki8XHJcbiAgICAgKiDjg5bjg6njgqbjgrbml6Llrprjga7jg5fjg63jgrDjg6zjg4Pjgrfjg5bjg63jg7zjg4njgpLotbDjgonjgZvjgarjgYTjgZ/jgoEuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSB1cmwgW2luXSB1cmwgKGRhdGEtdXJsKVxyXG4gICAgICogQHJldHVybiB7SVByb21pc2U8c3RyaW5nPn0g6KGo56S65Y+v6IO944GqIHVybFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZW5zdXJlSW1hZ2VMb2FkZWQodXJsOiBzdHJpbmcpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpbWcpIHtcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBcIlwiOyAgIC8vIOiqreOBv+i+vOOBv+WBnOatolxyXG4gICAgICAgICAgICAgICAgaW1nID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHVybCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWcub25lcnJvciA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19JTUFHRV9MT0FEX0ZBSUxFRCxcclxuICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZSBsb2FkIGZhaWxlZC4gW3VybDogXCIgKyB1cmwgKyBcIl1cIlxyXG4gICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG5cclxuICAgICAgICB9LCBkZXN0cm95KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeUu+WDj+OBruODquOCteOCpOOCulxyXG4gICAgICog5oyH5a6a44GX44Gf6ZW36L6644Gu6ZW344GV44Gr44Ki44K544Oa44Kv44OI5q+U44KS57at5oyB44GX44Gm44Oq44K144Kk44K644KS6KGM44GGXHJcbiAgICAgKiBsb25nU2lkZUxlbmd0aCDjgojjgorlsI/jgZXjgarloLTlkIjjga/jgqrjg6rjgrjjg4rjg6vjgrXjgqTjgrrjgacgZGF0YS11cmwg44KS6L+U5Y2044GZ44KLXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBzcmMgICAgICAgICAgICBbaW5dIGltYWdlIOOBq+aMh+WumuOBmeOCi+OCveODvOOCuVxyXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBsb25nU2lkZUxlbmd0aCBbaW5dIOODquOCteOCpOOCuuOBq+S9v+eUqOOBmeOCi+mVt+i+uuOBruacgOWkp+WApOOCkuaMh+WumlxyXG4gICAgICogQHJldHVybiB7SVByb21pc2U8c3RyaW5nPn0gYmFzZTY0IGRhdGEgdXJsIOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmVzaXplSW1hZ2Uoc3JjOiBzdHJpbmcsIGxvbmdTaWRlTGVuZ3RoOiBudW1iZXIpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpbWcpIHtcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBcIlwiOyAgIC8vIOiqreOBv+i+vOOBv+WBnOatolxyXG4gICAgICAgICAgICAgICAgaW1nID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYW52YXMgPSBnZXRDYW52YXMoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGloID0gaW1nLmhlaWdodCwgaXcgPSBpbWcud2lkdGgsIGlhID0gaWggLyBpdztcclxuICAgICAgICAgICAgICAgIGxldCBjdzogbnVtYmVyLCBjaDogbnVtYmVyO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdyA9PT0gMCB8fCAwID09PSBpYSkgeyAvLyDlv7Xjga7jgZ/jgoHkuI3mraPjgarnlLvlg4/jgpLjgqzjg7zjg4lcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QobWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0lOVkFMSURfSU1BR0UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbnZhbGlkIGltYWdlLiBbc3JjOiBcIiArIHNyYyArIFwiXVwiXHJcbiAgICAgICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb25nU2lkZUxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdTaWRlTGVuZ3RoID0gKGlhIDwgMSkgPyBpdyA6IGloO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWEgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ID0gKGxvbmdTaWRlTGVuZ3RoIDwgaXcpID8gbG9uZ1NpZGVMZW5ndGggOiBpdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSBNYXRoLnJvdW5kKGN3ICogaWEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoID0gKGxvbmdTaWRlTGVuZ3RoIDwgaWgpID8gbG9uZ1NpZGVMZW5ndGggOiBpaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3cgPSBNYXRoLnJvdW5kKGNoIC8gaWEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLndpZHRoID0gY3c7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGNoO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikuZHJhd0ltYWdlKGltZywgMCwgMCwgY3csIGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjYW52YXMudG9EYXRhVVJMKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5vbmVycm9yID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG1ha2VFcnJvckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0lNQUdFX0xPQURfRkFJTEVELFxyXG4gICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICBcImltYWdlIGxvYWQgZmFpbGVkLiBbc3JjOiBcIiArIHNyYyArIFwiXVwiXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBzcmM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgPSBDRFAuUHJvbWlzZTtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuQmluYXJ5XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBCaW5hcnlcclxuICAgICAqIEBicmllZiDjg5DjgqTjg4rjg6rjg6bjg7zjg4bjgqPjg6rjg4bjgqNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEJpbmFyeSB7XHJcblxyXG4gICAgICAgIC8vIHByaXZhdGUgY29uc3RydWN0b3JcclxuICAgICAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICAvLyBub29wXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgQmxvYkJ1aWxkZXJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge2FueX0gQmxvYkJ1aWxkZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRCbG9iQnVpbGRlcigpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsLkJsb2JCdWlsZGVyIHx8IGdsb2JhbC5XZWJLaXRCbG9iQnVpbGRlciB8fCBnbG9iYWwuTW96QmxvYkJ1aWxkZXIgfHwgZ2xvYmFsLk1TQmxvYkJ1aWxkZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqjjg6njg7zmg4XloLHnlJ/miJAgZnJvbSBET01FcnJvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHJlc3VsdENvZGUgW2luXSBSRVNVTFRfQ09ERSDjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gY2F1c2UgICAgICBbaW5dIOS4i+S9jeOBriBET00g44Ko44Op44O844KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIFt0YWddICAgICAgW2luXSBUQUcg44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIFttZXNzYWdlXSAgW2luXSDjg6Hjg4Pjgrvjg7zjgrjjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJucyDjgqjjg6njg7zjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBtYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKHJlc3VsdENvZGU6IFJFU1VMVF9DT0RFLCBjYXVzZTogRE9NRXJyb3IsIHRhZz86IHN0cmluZywgbWVzc2FnZT86IHN0cmluZyk6IEVycm9ySW5mbyB7XHJcbiAgICAgICAgICAgIGxldCBfY2F1c2U6IEVycm9yO1xyXG4gICAgICAgICAgICBpZiAoY2F1c2UpIHtcclxuICAgICAgICAgICAgICAgIF9jYXVzZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjYXVzZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNhdXNlLm5hbWUsICAgIC8vIERPTUVycm9yLm1lc3NhZ2Ug44GM5pyq44K144Od44O844OIXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlRXJyb3JJbmZvKHJlc3VsdENvZGUsIHRhZywgbWVzc2FnZSwgX2NhdXNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFycmF5QnVmZmVyIHRvIEJsb2JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBidWYgW2luXSBBcnJheUJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICogQHBhcmFtIG1pbWVUeXBlIFtpbl0gTWltZVR5cGUgb2YgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm5zIEJsb2IgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXJyYXlCdWZmZXJUb0Jsb2IoYnVmOiBBcnJheUJ1ZmZlciwgbWltZVR5cGU6IHN0cmluZyk6IEJsb2Ige1xyXG4gICAgICAgICAgICBsZXQgYmxvYjogQmxvYiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ2xvYmFsLkJsb2IpIHtcclxuICAgICAgICAgICAgICAgIGJsb2IgPSBuZXcgZ2xvYmFsLkJsb2IoW2J1Zl0sIHsgdHlwZTogbWltZVR5cGUgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1bmRlciBBbmRyb2lkIDQuNCBLaXRLYXRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2JCdWlsZGVyT2JqZWN0OiBhbnkgPSBCaW5hcnkuZ2V0QmxvYkJ1aWxkZXIoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2JCdWlsZGVyOiBhbnkgPSBuZXcgYmxvYkJ1aWxkZXJPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgIGJsb2JCdWlsZGVyLmFwcGVuZChidWYpO1xyXG4gICAgICAgICAgICAgICAgYmxvYiA9IGJsb2JCdWlsZGVyLmdldEJsb2IobWltZVR5cGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBibG9iO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmFzZTY0IHN0cmluZyB0byBCbG9iXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYmFzZTY0IHtzdHJpbmd9IFtpbl0gQmFzZTY0IHN0cmluZyBkYXRhXHJcbiAgICAgICAgICogQHBhcmFtIG1pbWVUeXBlIHtzdHJpbmd9IFtpbl0gTWltZVR5cGUgb2YgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jsb2J9IEJsb2IgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmFzZTY0VG9CbG9iKGJhc2U2NDogc3RyaW5nLCBtaW1lVHlwZTogc3RyaW5nKTogQmxvYiB7XHJcbiAgICAgICAgICAgIGxldCBibG9iOiBCbG9iID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChnbG9iYWwuQmxvYikge1xyXG4gICAgICAgICAgICAgICAgYmxvYiA9IG5ldyBnbG9iYWwuQmxvYihbQmluYXJ5LmJhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KV0sIHsgdHlwZTogbWltZVR5cGUgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1bmRlciBBbmRyb2lkIDQuNCBLaXRLYXRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2JCdWlsZGVyT2JqZWN0OiBhbnkgPSBCaW5hcnkuZ2V0QmxvYkJ1aWxkZXIoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2JCdWlsZGVyOiBhbnkgPSBuZXcgYmxvYkJ1aWxkZXJPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgIGJsb2JCdWlsZGVyLmFwcGVuZChCaW5hcnkuYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQpKTtcclxuICAgICAgICAgICAgICAgIGJsb2IgPSBibG9iQnVpbGRlci5nZXRCbG9iKG1pbWVUeXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmxvYjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRhdGEtdXJsIOW9ouW8j+eUu+WDj+OBi+OCiSBCbG9iIOOCquODluOCuOOCp+OCr+ODiOOBuOWkieaPm1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBkYXRhVXJsICAgIFtpbl0gZGF0YSB1cmxcclxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IFttaW1lVHlwZV0gW2luXSBtaW1lIHR5cGUg44KS5oyH5a6aLiDml6Llrprjgafjga8gXCJpbWFnZS9wbmdcIlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jsb2J9IEJsb2Ig44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkYXRhVXJsVG9CbG9iKGRhdGFVcmw6IHN0cmluZywgbWltZVR5cGU6IHN0cmluZyA9IFwiaW1hZ2UvcG5nXCIpOiBCbG9iIHtcclxuICAgICAgICAgICAgY29uc3QgYmFzZTY0ID0gZGF0YVVybC5zcGxpdChcIixcIilbMV07XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkuYmFzZTY0VG9CbG9iKGJhc2U2NCwgbWltZVR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmFzZTY0IHN0cmluZyB0byBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2U2NCB7c3RyaW5nfSBbaW5dIEJhc2U2NCBzdHJpbmcgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5QnVmZmVyfSBBcnJheUJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBiYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NDogc3RyaW5nKTogQXJyYXlCdWZmZXIge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IHdpbmRvdy5hdG9iKGJhc2U2NCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYnl0ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFbaV0gPSBieXRlcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheUJ1ZmZlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhc2U2NCBzdHJpbmcgdG8gVWludDhBcnJheVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2U2NCB7c3RyaW5nfSBbaW5dIEJhc2U2NCBzdHJpbmcgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge1VpbnQ4QXJyYXl9IFVpbnQ4QXJyYXkgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmFzZTY0VG9VaW50OEFycmF5KGVuY29kZWQ6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IHdpbmRvdy5hdG9iKGVuY29kZWQpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBieXRlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtpXSA9IGJ5dGVzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcnJheUJ1ZmZlciB0byBiYXNlNjQgc3RyaW5nXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYXJyYXlCdWZmZXIge0FycmF5QnVmZmVyfSBbaW5dIEFycmF5QnVmZmVyIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJhc2U2NCBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBhcnJheUJ1ZmZlclRvQmFzZTY0KGFycmF5QnVmZmVyOiBBcnJheUJ1ZmZlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5LnVpbnQ4QXJyYXlUb0Jhc2U2NChieXRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVaW50OEFycmF5IHRvIGJhc2U2NCBzdHJpbmdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBieXRlcyB7VWludDhBcnJheX0gW2luXSBVaW50OEFycmF5IGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJhc2U2NCBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB1aW50OEFycmF5VG9CYXNlNjQoYnl0ZXM6IFVpbnQ4QXJyYXkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgZGF0YTogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBieXRlcy5ieXRlTGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5idG9hKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7QmxvYn0gYmxvYiBbaW5dIGJsb2IgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0NEUC5JUHJvbWlzZTxBcnJheUJ1ZmZlcj59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYjogQmxvYik6IElQcm9taXNlPEFycmF5QnVmZmVyPiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbCA9ICgpID0+IHJlYWRlci5hYm9ydCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoQmluYXJ5Lm1ha2VFcnJvckluZm9Gcm9tRE9NRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19GSUxFX1JFQURFUl9FUlJPUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLmVycm9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRmlsZVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcigpIGZhaWxlZC5cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcclxuICAgICAgICAgICAgfSwgY2FuY2VsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyBVaW50OEFycmF5XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtCbG9ifSBibG9iIFtpbl0gYmxvYiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7Q0RQLklQcm9taXNlPFVpbnQ4QXJyYXk+fSBwcm9taXNlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZEJsb2JBc1VpbnQ4QXJyYXkoYmxvYjogQmxvYik6IElQcm9taXNlPFVpbnQ4QXJyYXk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QsIGRlcGVuZE9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRPbihCaW5hcnkucmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IEFycmF5QnVmZmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IFVpbnQ4QXJyYXkocmVzdWx0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yOiBFcnJvckluZm8pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgdGV4dCBzdHJpbmdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8VWludDhBcnJheT59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkQmxvYkFzVGV4dChibG9iOiBCbG9iLCBlbmNvZGU6IHN0cmluZyA9IFwidXRmLThcIik6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjYW5jZWwgPSAoKSA9PiByZWFkZXIuYWJvcnQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEJpbmFyeS5tYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZpbGVSZWFkZXIucmVhZEFzVGV4dCgpIGZhaWxlZC5cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IsIGVuY29kZSk7XHJcbiAgICAgICAgICAgIH0sIGNhbmNlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgRGF0YSBVUkxcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8c3RyaW5nPn0gcHJvbWlzZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRCbG9iQXNEYXRhVVJMKGJsb2I6IEJsb2IpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4gcmVhZGVyLmFib3J0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChCaW5hcnkubWFrZUVycm9ySW5mb0Zyb21ET01FcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0ZJTEVfUkVBREVSX0VSUk9SLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIuZXJyb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJGaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoKSBmYWlsZWQuXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChibG9iKTtcclxuICAgICAgICAgICAgfSwgY2FuY2VsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVSTCBPYmplY3RcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBvYnNvbGV0ZVxyXG4gICAgICAgICAqIEByZXR1cm4ge2FueX0gVVJMIE9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmxvYlVSTDogVVJMID0gKCgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbC5VUkwgfHwgZ2xvYmFsLndlYmtpdFVSTDtcclxuICAgICAgICB9KSgpO1xyXG4gICAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBAZmlsZSAgQmluYXJ5VHJhbnNwb3J0LnRzXHJcbiAqIEBicmllZiBqUXVlcnkgYWpheCB0cmFuc3BvcnQgZm9yIG1ha2luZyBiaW5hcnkgZGF0YSB0eXBlIHJlcXVlc3RzLlxyXG4gKlxyXG4gKiAgICAgICAgb3JpZ2luYWw6IGh0dHBzOi8vZ2l0aHViLmNvbS9oZW5yeWEvanMtanF1ZXJ5L2Jsb2IvbWFzdGVyL0JpbmFyeVRyYW5zcG9ydC9qcXVlcnkuYmluYXJ5dHJhbnNwb3J0LmpzXHJcbiAqICAgICAgICBhdXRob3I6ICAgSGVucnkgQWxndXMgPGhlbnJ5YWxndXNAZ21haWwuY29tPlxyXG4gKi9cclxubmFtZXNwYWNlIENEUC5Ub29scyB7XHJcbiAgICAvLyBTdXBwb3J0IGZpbGUgcHJvdG9jb2wuIChhcyBzYW1lIGFzIG9mZmljaWFsIHdheSlcclxuICAgIGNvbnN0IHhoclN1Y2Nlc3NTdGF0dXMgPSB7XHJcbiAgICAgICAgMDogMjAwLFxyXG4gICAgICAgIDEyMjM6IDIwNFxyXG4gICAgfTtcclxuXHJcbiAgICAkLmFqYXhUcmFuc3BvcnQoXCIrYmluYXJ5XCIsIChvcHRpb25zOiBKUXVlcnkuQWpheFNldHRpbmdzLCBvcmlnaW5hbE9wdGlvbnM6IEpRdWVyeS5BamF4U2V0dGluZ3MsIGpxWEhSOiBKUXVlcnlYSFIpID0+IHtcclxuICAgICAgICBpZiAoZ2xvYmFsLkZvcm1EYXRhICYmXHJcbiAgICAgICAgICAgICgob3B0aW9ucy5kYXRhVHlwZSAmJiAob3B0aW9ucy5kYXRhVHlwZSA9PT0gXCJiaW5hcnlcIikpIHx8XHJcbiAgICAgICAgICAgIChvcHRpb25zLmRhdGEgJiYgKChnbG9iYWwuQXJyYXlCdWZmZXIgJiYgb3B0aW9ucy5kYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8XHJcbiAgICAgICAgICAgIChnbG9iYWwuQmxvYiAmJiBvcHRpb25zLmRhdGEgaW5zdGFuY2VvZiBnbG9iYWwuQmxvYikpKSkpIHtcclxuICAgICAgICAgICAgbGV0IGFib3J0Q2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kOiBmdW5jdGlvbiAoaGVhZGVyczogSlF1ZXJ5LlBsYWluT2JqZWN0LCBjYWxsYmFjazogSlF1ZXJ5LlRyYW5zcG9ydC5TdWNjZXNzQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXR1cCBhbGwgdmFyaWFibGVzXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gb3B0aW9ucy51cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IG9wdGlvbnMudHlwZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3luYyA9IG9wdGlvbnMuYXN5bmMgfHwgdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmxvYiBvciBhcnJheWJ1ZmZlci4gRGVmYXVsdCBpcyBibG9iXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YVR5cGUgPSAoPGFueT5vcHRpb25zKS5yZXNwb25zZVR5cGUgfHwgXCJibG9iXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJuYW1lID0gb3B0aW9ucy51c2VybmFtZSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZCB8fCBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBfY2FsbGJhY2s6IEpRdWVyeS5UcmFuc3BvcnQuU3VjY2Vzc0NhbGxiYWNrID0gY2FsbGJhY2sgfHwgKCgpID0+IHsgLyogbm9vcCAqLyB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3VjY2VlZGVkIGhhbmRsZXJcclxuICAgICAgICAgICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZGF0YVtvcHRpb25zLmRhdGFUeXBlXSA9IHhoci5yZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyU3VjY2Vzc1N0YXR1c1t4aHIuc3RhdHVzXSB8fCB4aHIuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEpRdWVyeS5BamF4LlRleHRTdGF0dXM+eGhyLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBoYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9kYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhW29wdGlvbnMuZGF0YVR5cGVdID0geGhyLnJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIGNhbGxiYWNrIGFuZCBzZW5kIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxKUXVlcnkuQWpheC5UZXh0U3RhdHVzPnhoci5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWJvcnQgaGFuZGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZGF0YVtvcHRpb25zLmRhdGFUeXBlXSA9IHhoci5yZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBjYWxsYmFjayBhbmQgc2VuZCBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jYWxsYmFjayhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SlF1ZXJ5LkFqYXguVGV4dFN0YXR1cz54aHIuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFib3J0IGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICAgICAgYWJvcnRDYWxsYmFjayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLm9wZW4odHlwZSwgdXJsLCBhc3luYywgdXNlcm5hbWUsIHBhc3N3b3JkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0dXAgY3VzdG9tIGhlYWRlcnNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gaGVhZGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaSwgaGVhZGVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSBkYXRhVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhYm9ydDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhYm9ydENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFib3J0Q2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuRGF0ZVRpbWVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIERhdGVUaW1lXHJcbiAgICAgKiBAYnJpZWYg5pmC5Yi75pON5L2c44Gu44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBEYXRlVGltZSB7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Z+654K544Go44Gq44KL5pel5LuY44GL44KJ44CBbuaXpeW+jOOAgW7ml6XliY3jgpLnrpflh7pcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBiYXNlICAgIHtEYXRlfSAgIFtpbl0g5Z+65rqW5pelXHJcbiAgICAgICAgICogQHBhcmFtIGFkZERheXMge051bWJlcn0gW2luXSDliqDnrpfml6UuIOODnuOCpOODiuOCueaMh+WumuOBp27ml6XliY3jgoLoqK3lrprlj6/og71cclxuICAgICAgICAgKiBAcmV0dXJuIHtEYXRlfSDml6Xku5jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbXB1dGVEYXRlKGJhc2U6IERhdGUsIGFkZERheXM6IG51bWJlcik6IERhdGUge1xyXG4gICAgICAgICAgICBjb25zdCBkdCA9IG5ldyBEYXRlKGJhc2UuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgY29uc3QgYmFzZVNlYyA9IGR0LmdldFRpbWUoKTtcclxuICAgICAgICAgICAgY29uc3QgYWRkU2VjID0gYWRkRGF5cyAqIDg2NDAwMDAwOyAgICAvL+aXpeaVsCAqIDHml6Xjga7jg5/jg6rnp5LmlbBcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0U2VjID0gYmFzZVNlYyArIGFkZFNlYztcclxuICAgICAgICAgICAgZHQuc2V0VGltZSh0YXJnZXRTZWMpO1xyXG4gICAgICAgICAgICByZXR1cm4gZHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IHN0cmluZyB0byBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGUgc3RyaW5nIGV4KSBZWVlZLU1NLUREVEhIOm1tOlNTLlNTU1xyXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnZlcnRJU09TdHJpbmdUb0RhdGUoZGF0ZVN0cmluZzogc3RyaW5nKTogRGF0ZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGVUaW1lID0gZGF0ZVN0cmluZy5zcGxpdChcIlRcIiksXHJcbiAgICAgICAgICAgICAgICBkYXRlQXJyYXkgPSBkYXRlVGltZVswXS5zcGxpdChcIi1cIik7XHJcbiAgICAgICAgICAgIGxldCB0aW1lQXJyYXksIHNlY0FycmF5LCBkYXRlT2JqZWN0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGVUaW1lWzFdKSB7XHJcbiAgICAgICAgICAgICAgICB0aW1lQXJyYXkgPSBkYXRlVGltZVsxXS5zcGxpdChcIjpcIik7XHJcbiAgICAgICAgICAgICAgICBzZWNBcnJheSA9IHRpbWVBcnJheVsyXS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aW1lQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSwgPGFueT5kYXRlQXJyYXlbMV0gLSAxLCA8YW55PmRhdGVBcnJheVsyXSxcclxuICAgICAgICAgICAgICAgICAgICA8YW55PnRpbWVBcnJheVswXSwgPGFueT50aW1lQXJyYXlbMV0sIDxhbnk+c2VjQXJyYXlbMF0sIDxhbnk+c2VjQXJyYXlbMV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGVBcnJheVsyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSwgPGFueT5kYXRlQXJyYXlbMV0gLSAxLCA8YW55PmRhdGVBcnJheVsyXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGVBcnJheVsxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSwgPGFueT5kYXRlQXJyYXlbMV0gLSAxKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZU9iamVjdCA9IG5ldyBEYXRlKDxhbnk+ZGF0ZUFycmF5WzBdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGVPYmplY3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiAgQ29udmVydCBhIGRhdGUgb2JqZWN0IGludG8gYSBzdHJpbmcgaW4gUE1PQVBJIHJlY29yZGVkX2RhdGUgZm9ybWF0KHRoZSBJU08gODYwMSBFeHRlbmRlZCBGb3JtYXQpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGF0ZSAgIHtEYXRlfSAgIFtpbl0gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IHtTdHJpbmd9IFtpbl0ge3llYXIgfCBtb250aCB8IGRhdGUgfCBob3VyIHwgbWluIHwgc2VjIHwgbXNlYyB9XHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydERhdGVUb0lTT1N0cmluZyhkYXRlOiBEYXRlLCB0YXJnZXQ6IHN0cmluZyA9IFwibXNlY1wiKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGlzb0RhdGVTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInllYXJcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtb250aFwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcImRhdGVcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJob3VyXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibWluXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VjXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibXNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIHRhcmdldDogXCIgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IFwibXNlY1wiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICBpZiAoXCJ5ZWFyXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlzb0RhdGVTdHJpbmcgKz0gKFwiLVwiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXRNb250aCgpICsgMSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJtb250aFwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nICs9IChcIi1cIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0RGF0ZSgpKSk7XHJcbiAgICAgICAgICAgIGlmIChcImRhdGVcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXNvRGF0ZVN0cmluZyArPSAoXCJUXCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldEhvdXJzKCkpKTtcclxuICAgICAgICAgICAgaWYgKFwiaG91clwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nICs9IChcIjpcIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0TWludXRlcygpKSk7XHJcbiAgICAgICAgICAgIGlmIChcIm1pblwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nICs9IChcIjpcIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0U2Vjb25kcygpKSk7XHJcbiAgICAgICAgICAgIGlmIChcInNlY1wiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nICs9IChcIi5cIiArIFN0cmluZygoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDApLnRvRml4ZWQoMykpLnNsaWNlKDIsIDUpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIHN0cmluZyB0byBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGUgc3RyaW5nIGV4KSB5eXl5X01NX2RkVEhIX21tX3NzX1NTU1xyXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnZlcnRGaWxlU3lzdGVtU3RyaW5nVG9EYXRlKGRhdGVTdHJpbmc6IHN0cmluZyk6IERhdGUge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlVGltZSA9IGRhdGVTdHJpbmcuc3BsaXQoXCJUXCIpLFxyXG4gICAgICAgICAgICAgICAgZGF0ZUFycmF5ID0gZGF0ZVRpbWVbMF0uc3BsaXQoXCJfXCIpO1xyXG4gICAgICAgICAgICBsZXQgdGltZUFycmF5LCBkYXRlT2JqZWN0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGVUaW1lWzFdKSB7XHJcbiAgICAgICAgICAgICAgICB0aW1lQXJyYXkgPSBkYXRlVGltZVsxXS5zcGxpdChcIl9cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aW1lQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSwgPGFueT5kYXRlQXJyYXlbMV0gLSAxLCA8YW55PmRhdGVBcnJheVsyXSxcclxuICAgICAgICAgICAgICAgICAgICA8YW55PnRpbWVBcnJheVswXSwgPGFueT50aW1lQXJyYXlbMV0sIDxhbnk+dGltZUFycmF5WzJdLCA8YW55PnRpbWVBcnJheVszXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0ZUFycmF5WzJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZU9iamVjdCA9IG5ldyBEYXRlKDxhbnk+ZGF0ZUFycmF5WzBdLCA8YW55PmRhdGVBcnJheVsxXSAtIDEsIDxhbnk+ZGF0ZUFycmF5WzJdKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0ZUFycmF5WzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZU9iamVjdCA9IG5ldyBEYXRlKDxhbnk+ZGF0ZUFycmF5WzBdLCA8YW55PmRhdGVBcnJheVsxXSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRlT2JqZWN0ID0gbmV3IERhdGUoPGFueT5kYXRlQXJyYXlbMF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGF0ZU9iamVjdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqICBDb252ZXJ0IGEgZGF0ZSBvYmplY3QgaW50byBhIHN0cmluZyBpbiBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIGZvcm1hdCh5eXl5X01NX2RkVEhIX21tX3NzX1NTUylcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRlICAge0RhdGV9ICAgW2luXSBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQge1N0cmluZ30gW2luXSB7eWVhciB8IG1vbnRoIHwgZGF0ZSB8IGhvdXIgfCBtaW4gfCBzZWMgfCBtc2VjIH1cclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb252ZXJ0RGF0ZVRvRmlsZVN5c3RlbVN0cmluZyhkYXRlOiBEYXRlLCB0YXJnZXQ6IHN0cmluZyA9IFwibXNlY1wiKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGZpbGVTeXN0ZW1TdHJpbmc7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInllYXJcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtb250aFwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcImRhdGVcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJob3VyXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibWluXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VjXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibXNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIHRhcmdldDogXCIgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IFwibXNlY1wiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICBpZiAoXCJ5ZWFyXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW1TdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHJpbmcgKz0gKFwiX1wiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXRNb250aCgpICsgMSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJtb250aFwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nICs9IChcIl9cIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0RGF0ZSgpKSk7XHJcbiAgICAgICAgICAgIGlmIChcImRhdGVcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZVN5c3RlbVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlsZVN5c3RlbVN0cmluZyArPSAoXCJUXCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldEhvdXJzKCkpKTtcclxuICAgICAgICAgICAgaWYgKFwiaG91clwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nICs9IChcIl9cIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0TWludXRlcygpKSk7XHJcbiAgICAgICAgICAgIGlmIChcIm1pblwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nICs9IChcIl9cIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0U2Vjb25kcygpKSk7XHJcbiAgICAgICAgICAgIGlmIChcInNlY1wiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nICs9IChcIl9cIiArIFN0cmluZygoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDApLnRvRml4ZWQoMykpLnNsaWNlKDIsIDUpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW1TdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgc3RhdGljIG1ldGhvZFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IG51bSB0byBzdHJpbmcoZG91YmxlIGRpZ2l0cylcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge051bWJlcn0gbnVtYmVyICgwIDxudW1iZXIgPCAxMDApXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBkb3VibGUgZGlnaXRzIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKG51bTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKG51bSA8IDAgfHwgbnVtID4gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobnVtIDwgMTApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIjBcIiArIG51bTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIiArIG51bTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJqcXVlcnlcIiAvPlxyXG5cclxubmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlRvb2xzLlRlbXBsYXRlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSlNUXHJcbiAgICAgKiBAYnJpZWYg44Kz44Oz44OR44Kk44Or5riI44G/IOODhuODs+ODl+ODrOODvOODiOagvOe0jeOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEpTVCB7XHJcbiAgICAgICAgKGRhdGE/OiBhbnkpOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBUZW1wbGF0ZVxyXG4gICAgICogQGJyaWVmIHRlbXBsYXRlIHNjcmlwdCDjgpLnrqHnkIbjgZnjgovjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFRlbXBsYXRlIHtcclxuXHJcbiAgICAgICAgc3RhdGljIF9tYXBFbGVtZW50OiBhbnk7ICAgIC8vITwg44Kt44O844GoIEpRdWVyeSBFbGVtZW50IOOBriBNYXAg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgc3RhdGljIF9tYXBTb3VyY2U6IGFueTsgICAgIC8vITwgVVJMIOOBqCDjgr3jg7zjgrnjg5XjgqHjgqTjg6soSFRNTCkg44GuIE1hcCDjgqrjg5bjgrjjgqfjgq/jg4hcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyDlhazplovjg6Hjgr3jg4Pjg4lcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44GfIGlkLCBjbGFzcyDlkI0sIFRhZyDlkI3jgpLjgq3jg7zjgavjg4bjg7Pjg5fjg6zjg7zjg4jjga4gSlF1ZXJ5IEVsZW1lbnQg44KS5Y+W5b6X44GZ44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIGtleSAgICAgW2luXSBpZCwgY2xhc3MsIHRhZyDjgpLooajjgZnmloflrZfliJdcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzcmNdICAgW2luXSDlpJbpg6ggaHRtbCDjgpLmjIflrprjgZnjgovloLTlkIjjga8gdXJsIOOCkuioreWumlxyXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NhY2hlXSBbaW5dIHNyYyBodG1sIOOCkuOCreODo+ODg+OCt+ODpeOBmeOCi+WgtOWQiOOBryB0cnVlLiBzcmMg44GM5oyH5a6a44GV44KM44Gm44GE44KL44Go44GN44Gu44G/5pyJ5Yq5XHJcbiAgICAgICAgICogQHJldHVybiB0ZW1wbGF0ZSDjgYzmoLzntI3jgZXjgozjgabjgYTjgosgSlF1ZXJ5IEVsZW1lbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgZ2V0VGVtcGxhdGVFbGVtZW50KGtleTogc3RyaW5nLCBzcmM6IHN0cmluZyA9IG51bGwsIGNhY2hlOiBib29sZWFuID0gdHJ1ZSk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcEVsZW1lbnQgPSBUZW1wbGF0ZS5nZXRFbGVtZW50TWFwKCk7XHJcbiAgICAgICAgICAgIGxldCAkZWxlbWVudCA9IG1hcEVsZW1lbnRba2V5XTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISRlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNyYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBodG1sID0gVGVtcGxhdGUuZmluZEh0bWxGcm9tU291cmNlKHNyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50ID0gJChodG1sKS5maW5kKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQgPSAkKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOimgee0oOOBruaknOiovFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkZWxlbWVudCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IChcImludmFsaWQgW2tleSwgc3JjXSA9IFtcIiArIGtleSArIFwiLCBcIiArIHNyYyArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNyYyAmJiBjYWNoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBFbGVtZW50W2tleV0gPSAkZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBleGNlcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkZWxlbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1hcCDjgqrjg5bjgrjjgqfjgq/jg4jjga7liYrpmaRcclxuICAgICAgICAgKiDmmI7npLrnmoTjgavjgq3jg6Pjg4Pjgrfjg6XjgpLplovmlL7jgZnjgovloLTlkIjjga/mnKzjg6Hjgr3jg4Pjg4njgpLjgrPjg7zjg6vjgZnjgotcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgZW1wdHkoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIFRlbXBsYXRlLl9tYXBFbGVtZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgVGVtcGxhdGUuX21hcFNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmjIflrprjgZfjgZ8gaWQsIGNsYXNzIOWQjSwgVGFnIOWQjeOCkuOCreODvOOBqyBKU1Qg44KS5Y+W5b6X44GZ44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZyB8IGpRdWVyeX0ga2V5ICAgICBbaW5dIGlkLCBjbGFzcywgdGFnIOOCkuihqOOBmeaWh+Wtl+WIlyDjgb7jgZ/jga8g44OG44Oz44OX44Os44O844OI5paH5a2X5YiXLCDjgb7jgZ/jga8galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgICAgICAgICBbc3JjXSAgIFtpbl0g5aSW6YOoIGh0bWwg44KS5oyH5a6a44GZ44KL5aC05ZCI44GvIHVybCDjgpLoqK3lrppcclxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59ICAgICAgICAgW2NhY2hlXSBbaW5dIHNyYyBodG1sIOOCkuOCreODo+ODg+OCt+ODpeOBmeOCi+WgtOWQiOOBryB0cnVlLiBzcmMg44GM5oyH5a6a44GV44KM44Gm44GE44KL44Go44GN44Gu44G/5pyJ5Yq5XHJcbiAgICAgICAgICogQHJldHVybiDjgrPjg7Pjg5HjgqTjg6vjgZXjgozjgZ8gSlNUIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBnZXRKU1Qoa2V5OiBKUXVlcnkpOiBKU1Q7XHJcbiAgICAgICAgc3RhdGljIGdldEpTVChrZXk6IHN0cmluZywgc3JjPzogc3RyaW5nLCBjYWNoZT86IGJvb2xlYW4pOiBKU1Q7XHJcbiAgICAgICAgc3RhdGljIGdldEpTVChrZXk6IGFueSwgc3JjPzogc3RyaW5nLCBjYWNoZT86IGJvb2xlYW4pOiBKU1Qge1xyXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGU6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBqc3Q6IEpTVDtcclxuICAgICAgICAgICAgbGV0ICRlbGVtZW50OiBKUXVlcnk7XHJcbiAgICAgICAgICAgIGlmIChrZXkgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuICAgICAgICAgICAgICAgICRlbGVtZW50ID0ga2V5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQgPSBUZW1wbGF0ZS5nZXRUZW1wbGF0ZUVsZW1lbnQoa2V5LCBzcmMsIGNhY2hlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBnbG9iYWwuSG9nYW4pIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gSG9nYW4uY29tcGlsZSgkZWxlbWVudC50ZXh0KCkpO1xyXG4gICAgICAgICAgICAgICAganN0ID0gZnVuY3Rpb24gKGRhdGE/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZS5yZW5kZXIoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG51bGwgIT0gZ2xvYmFsLl8pIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkZWxlbWVudC5odG1sKCkpO1xyXG4gICAgICAgICAgICAgICAganN0ID0gZnVuY3Rpb24gKGRhdGE/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOaUueihjOOBqOOCv+ODluOBr+WJiumZpOOBmeOCi1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZShkYXRhKS5yZXBsYWNlKC9cXG58XFx0L2csIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImNhbm5vdCBmaW5kIHRlbXBsYXRlIGVuZ2luZSBtb2R1bGUuXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiICAgICdob2dhbicgb3IgJ3VuZGVyc2NvcmUnIGlzIHJlcXVpcmVkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ganN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyDlhoXpg6jjg6Hjgr3jg4Pjg4lcclxuXHJcbiAgICAgICAgLy8hIEVsZW1lbnQgTWFwIOOCquODluOCuOOCp+OCr+ODiOOBruWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGdldEVsZW1lbnRNYXAoKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFUZW1wbGF0ZS5fbWFwRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgVGVtcGxhdGUuX21hcEVsZW1lbnQgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVGVtcGxhdGUuX21hcEVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgVVJMIE1hcCDjgqrjg5bjgrjjgqfjgq/jg4jjga7lj5blvpdcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRTb3VyY2VNYXAoKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFUZW1wbGF0ZS5fbWFwU291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBUZW1wbGF0ZS5fbWFwU291cmNlID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFRlbXBsYXRlLl9tYXBTb3VyY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgVVJMIE1hcCDjgYvjgokgSFRNTCDjgpLmpJzntKIuIOWkseaVl+OBl+OBn+WgtOWQiOOBryB1bmRlZmluZWQg44GM6L+U44KLXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZmluZEh0bWxGcm9tU291cmNlKHNyYzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgbWFwU291cmNlID0gVGVtcGxhdGUuZ2V0U291cmNlTWFwKCk7XHJcbiAgICAgICAgICAgIGxldCBodG1sID0gbWFwU291cmNlW3NyY107XHJcblxyXG4gICAgICAgICAgICBpZiAoIWh0bWwpIHtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJodG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAoZGF0YTogYW55LCBzdGF0dXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAoXCJhamF4IHJlcXVlc3QgZmFpbGVkLiBzdGF0dXM6IFwiICsgc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIOOCreODo+ODg+OCt+ODpeOBq+agvOe0jVxyXG4gICAgICAgICAgICAgICAgbWFwU291cmNlW3NyY10gPSBodG1sO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuUHJvZ3Jlc3NDb3VudGVyXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUHJvZ3Jlc3NDb3VudGVyT3B0aW9uc1xyXG4gICAgICogQGJyaWVmIFByb2dyZXNzQ291bnRlciDjgavmjIflrprjgZnjgovjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQcm9ncmVzc0NvdW50ZXJPcHRpb25zIHtcclxuICAgICAgICBtYXg/OiBudW1iZXI7ICAgICAgICAgICAgICAgICAgICAgICAvLyDpgLLmjZflgKTjga7mnIDlpKflgKQg5pei5a6aOiAxMDBcclxuICAgICAgICBhbGxvd0luY3JlbWVudFJlbWFpbj86IGJvb2xlYW47ICAgICAvLyDmrovjgormjqjlrprmmYLplpPjgYzlopfjgYjjgabjgojjgYTloLTlkIjjgavjga8gdHJ1ZSDml6Llrpo6IGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFByb2dyZXNzQ291bnRlclJlc3VsdFxyXG4gICAgICogQGJyaWVmIOmAsuaNl+OBruaZgumWk+OCkuaMgeOBpOOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICogICAgICAgIOWNmOS9jeOBryBbbXNlY11cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQcm9ncmVzc0NvdW50ZXJSZXN1bHQge1xyXG4gICAgICAgIHBhc3NUaW1lOiBudW1iZXI7ICAgICAgIC8vIOe1jOmBjuaZgumWk1xyXG4gICAgICAgIHJlbWFpblRpbWU6IG51bWJlcjsgICAgIC8vIOaui+OCiuaOqOWumuaZgumWk1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFByb2dyZXNzQ291bnRlclxyXG4gICAgICogQGJyaWVmIOmAsuaNl+OBruaZgumWk+OCkuaJseOBhuODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUHJvZ3Jlc3NDb3VudGVyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgbWF4OiBudW1iZXI7XHJcbiAgICAgICAgICAgIGJlZ2luVGltZTogbnVtYmVyO1xyXG4gICAgICAgICAgICBhbGxvd0luY3JlbWVudGVSZW1haW46IGJvb2xlYW47XHJcbiAgICAgICAgICAgIGxhc3RSZW1haW5UaW1lOiBudW1iZXI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBbb3B0aW9uc10g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9ucz86IFByb2dyZXNzQ291bnRlck9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldChvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmWi+Wni+aZgumWk+OCkuWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyByZXNldChvcHRpb25zPzogUHJvZ3Jlc3NDb3VudGVyT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgICAgIC4uLntcclxuICAgICAgICAgICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgICAgICAgICBiZWdpblRpbWU6IERhdGUubm93KCksXHJcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dJbmNyZW1lbnRlUmVtYWluOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBsYXN0UmVtYWluVGltZTogSW5maW5pdHksXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAsIC4uLjxhbnk+b3B0aW9uc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog57WM6YGO5pmC6ZaT44Go5o6o5a6a5q6L44KK5pmC6ZaT44KS5Y+W5b6X44GZ44KLXHJcbiAgICAgICAgICog6YCy5o2X5YCk44GMIDAg44Gu5aC05ZCI44Gv44CB5o6o5a6a5q6L44KK5pmC6ZaT44GrIEluZmluaXR5IOOCkui/lOOBmVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICAgcHJvZ3Jlc3MgW2luXSDpgLLmjZflgKRcclxuICAgICAgICAgKiBAcmV0dXJucyDntYzpgY7mmYLplpPjgajmjqjlrprmrovjgormmYLplpMgW21zZWNdXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNvbXB1dGUocHJvZ3Jlc3M6IG51bWJlcik6IFByb2dyZXNzQ291bnRlclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhc3NUaW1lID0gRGF0ZS5ub3coKSAtIHRoaXMuX3NldHRpbmdzLmJlZ2luVGltZTtcclxuICAgICAgICAgICAgbGV0IHJlbWFpblRpbWUgPSBJbmZpbml0eTtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gcHJvZ3Jlc3MgJiYgMCAhPT0gcHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgICAgIHJlbWFpblRpbWUgPSBwYXNzVGltZSAqIHRoaXMuX3NldHRpbmdzLm1heCAvIHByb2dyZXNzIC0gcGFzc1RpbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmFsbG93SW5jcmVtZW50ZVJlbWFpbiB8fCAocmVtYWluVGltZSA8IHRoaXMuX3NldHRpbmdzLmxhc3RSZW1haW5UaW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MubGFzdFJlbWFpblRpbWUgPSByZW1haW5UaW1lO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVtYWluVGltZSA9IHRoaXMuX3NldHRpbmdzLmxhc3RSZW1haW5UaW1lO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4geyBwYXNzVGltZSwgcmVtYWluVGltZSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJkZWNsYXJlIG1vZHVsZSBcImNkcC50b29sc1wiIHtcclxuICAgIGNvbnN0IFRvb2xzOiB0eXBlb2YgQ0RQLlRvb2xzO1xyXG4gICAgZXhwb3J0ID0gVG9vbHM7XHJcbn1cclxuIl19