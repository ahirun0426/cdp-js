﻿/*!
 * cdp.tools.js 2.2.0
 *
 * Date: 2018-01-25T06:29:57.651Z
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
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_TOOLS"] = 4 * CDP._MODULE_RESULT_CODE_RANGE_CDP] = "CDP_TOOLS";
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
        var Binary = /** @class */ (function () {
            // private constructor
            function Binary() {
                // noop
            }
            /**
             * Get BlobBuilder
             *
             * @obsolete
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
             * Get BlobBuilder
             *
             * @obsolete
             * @return 構築済み Blob オブジェクト
             */
            Binary.newBlob = function (blobParts, options) {
                if (blobParts === void 0) { blobParts = []; }
                if (options === void 0) { options = {}; }
                if (CDP.global.Blob) {
                    return new CDP.global.Blob(blobParts, options);
                }
                else {
                    // under Android 4.4 KitKat
                    options = options || {};
                    var blobBuilderObject = Binary.getBlobBuilder();
                    var blobBuilder = new blobBuilderObject();
                    var parts = (blobParts instanceof Array) ? blobParts[0] : blobParts;
                    blobBuilder.append(parts);
                    return blobBuilder.getBlob(options.type);
                }
            };
            /**
             * ArrayBuffer to Blob
             *
             * @param buffer [in] ArrayBuffer data
             * @param mimeType [in] MimeType of data
             * @returns Blob data
             */
            Binary.arrayBufferToBlob = function (buffer, mimeType) {
                if (mimeType === void 0) { mimeType = "application/octet-stream"; }
                return Binary.newBlob([buffer], { type: mimeType });
            };
            /**
             * Uint8Array to Blob
             *
             * @param array [in] Uint8Array data
             * @param mimeType [in] MimeType of data
             * @returns Blob data
             */
            Binary.uint8ArrayToBlob = function (array, mimeType) {
                if (mimeType === void 0) { mimeType = "application/octet-stream"; }
                return Binary.newBlob([array], { type: mimeType });
            };
            /**
             * data URL string to Blob
             *
             * @param  {String} dataURL [in] data URL string
             * @return {Blob} Blob data
             */
            Binary.dataURLToBlob = function (dataURL) {
                var result = Binary.execDataURLRegExp(dataURL);
                if (result.base64) {
                    return Binary.base64ToBlob(result.data, result.mimeType);
                }
                else {
                    return Binary.textToBlob(result.data, result.mimeType);
                }
            };
            /**
             * Base64 string to Blob
             *
             * @param base64 {string} [in] Base64 string data
             * @param mimeType {string} [in] MimeType of data
             * @return {Blob} Blob data
             */
            Binary.base64ToBlob = function (base64, mimeType) {
                if (mimeType === void 0) { mimeType = "text/plain"; }
                var bytes = Binary.base64ToByteString(base64);
                var array = Binary.byteStringToUint8Array(bytes);
                return Binary.uint8ArrayToBlob(array, mimeType);
            };
            /**
             * text string to Blob
             *
             * @param text {string} [in] text string data
             * @param mimeType {string} [in] MimeType of data
             * @return {Blob} Blob data
             */
            Binary.textToBlob = function (text, mimeType) {
                if (mimeType === void 0) { mimeType = "text/plain"; }
                return Binary.newBlob([text], { type: mimeType });
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
                        .then(function (buffer) {
                        resolve(new Uint8Array(buffer));
                    })
                        .catch(function (error) {
                        reject(error);
                    });
                });
            };
            /**
             * read Blob as data URL
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
             * read Blob as Base64 string
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<string>} promise object
             */
            Binary.readBlobAsBase64 = function (blob) {
                return new Promise(function (resolve, reject, dependOn) {
                    dependOn(Binary.readBlobAsDataURL(blob))
                        .then(function (dataURL) {
                        // dataURL is always encoded base64
                        var base64 = dataURL.split(",")[1];
                        resolve(base64);
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
            Binary.readBlobAsText = function (blob, encoding) {
                if (encoding === void 0) { encoding = "utf-8"; }
                var reader = new FileReader();
                var cancel = function () { return reader.abort(); };
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(decodeURIComponent(reader.result));
                    };
                    reader.onerror = function () {
                        reject(Binary.makeErrorInfoFromDOMError(CDP.RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR, reader.error, TAG, "FileReader.readAsText() failed."));
                    };
                    reader.readAsText(blob, encoding);
                }, cancel);
            };
            /**
             * data URL string to ArrayBuffer
             */
            Binary.dataURLToArrayBuffer = function (dataURL) {
                var array = Binary.dataURLToUint8Array(dataURL);
                return array.buffer;
            };
            /**
             * data URL string to Uint8Array
             */
            Binary.dataURLToUint8Array = function (dataURL) {
                var result = Binary.execDataURLRegExp(dataURL);
                if (result.base64) {
                    return Binary.base64ToUint8Array(result.data);
                }
                else {
                    return Binary.textToUint8Array(result.data);
                }
            };
            /**
             * Base64 string to ArrayBuffer
             */
            Binary.base64ToArrayBuffer = function (base64) {
                var array = Binary.base64ToUint8Array(base64);
                return array.buffer;
            };
            /**
             * Base64 string to Uint8Array
             */
            Binary.base64ToUint8Array = function (base64) {
                var bytes = Binary.base64ToByteString(base64);
                return Binary.byteStringToUint8Array(bytes);
            };
            /**
             * text string to ArrayBuffer
             */
            Binary.textToArrayBuffer = function (text) {
                var array = Binary.textToUint8Array(text);
                return array.buffer;
            };
            /**
             * text string to Uint8Array
             */
            Binary.textToUint8Array = function (text) {
                var bytes = Binary.textToByteString(text);
                return Binary.byteStringToUint8Array(bytes);
            };
            /**
             * ArrayBuffer to data URL string
             */
            Binary.arrayBufferToDataURL = function (buffer, mimeType) {
                if (mimeType === void 0) { mimeType = "text/plain"; }
                return Binary.uint8ArrayToDataURL(new Uint8Array(buffer), mimeType);
            };
            /**
             * ArrayBuffer to Base64 string
             */
            Binary.arrayBufferToBase64 = function (buffer) {
                return Binary.uint8ArrayToBase64(new Uint8Array(buffer));
            };
            /**
             * ArrayBuffer to text string
             */
            Binary.arrayBufferToText = function (buffer) {
                return Binary.uint8ArrayToText(new Uint8Array(buffer));
            };
            /**
             * Uint8Array to data URL string
             */
            Binary.uint8ArrayToDataURL = function (array, mimeType) {
                if (mimeType === void 0) { mimeType = "text/plain"; }
                var base64 = Binary.uint8ArrayToBase64(array);
                return "data:" + mimeType + ";base64," + base64;
            };
            /**
             * Uint8Array to Base64 string
             */
            Binary.uint8ArrayToBase64 = function (array) {
                var bytes = Binary.uint8ArrayToByteString(array);
                return Binary.byteStringToBase64(bytes);
            };
            /**
             * Uint8Array to text string
             */
            Binary.uint8ArrayToText = function (array) {
                var bytes = Binary.uint8ArrayToByteString(array);
                return Binary.byteStringToText(bytes);
            };
            /**
             * data URL string to text string
             */
            Binary.dataURLToText = function (dataURL) {
                var result = Binary.execDataURLRegExp(dataURL);
                if (result.base64) {
                    return Binary.base64ToText(result.data);
                }
                else {
                    return decodeURIComponent(result.data);
                }
            };
            /**
             * Base64 string to text string
             */
            Binary.base64ToText = function (base64) {
                var bytes = Binary.base64ToByteString(base64);
                return Binary.byteStringToText(bytes);
            };
            /**
             * text string to data URL string
             */
            Binary.textToDataURL = function (text, mimeType) {
                if (mimeType === void 0) { mimeType = "text/plain"; }
                var base64 = Binary.textToBase64(text);
                return "data:" + mimeType + ";base64," + base64;
            };
            /**
             * text string to Base64 string
             */
            Binary.textToBase64 = function (text) {
                var bytes = Binary.textToByteString(text);
                return Binary.byteStringToBase64(bytes);
            };
            /**
             * data URI 形式の正規表現
             * 参考: https://developer.mozilla.org/ja/docs/data_URIs
             */
            Binary.execDataURLRegExp = function (dataURL) {
                /**
                 * [match] 1: MimeType
                 *         2: ";base64" を含むオプション
                 *         3: data 本体
                 */
                var reDataURL = /^data:(.+?\/.+?)?(;.+?)?,(.*)$/;
                var result = reDataURL.exec(dataURL);
                var component = {
                    mimeType: "",
                    base64: true,
                    data: "",
                };
                if (null != result) {
                    component.mimeType = result[1];
                    component.base64 = /;base64/.test(result[2]);
                    component.data = result[3];
                }
                return component;
            };
            Binary.uint8ArrayToByteString = function (array) {
                return Array.prototype.map.call(array, function (i) { return String.fromCharCode(i); }).join("");
            };
            Binary.base64ToByteString = function (base64) {
                return window.atob(base64);
            };
            Binary.textToByteString = function (text) {
                // first we use encodeURIComponent to get percent-encoded UTF-8,
                // then we convert the percent encodings into raw bytes which
                // can be fed into btoa.
                return encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, function (match, p1) { return String.fromCharCode(parseInt(p1, 16)); });
            };
            Binary.byteStringToUint8Array = function (bytes) {
                var array = bytes.split("").map(function (c) { return c.charCodeAt(0); });
                return new Uint8Array(array);
            };
            Binary.byteStringToBase64 = function (bytes) {
                return window.btoa(bytes);
            };
            Binary.byteStringToText = function (bytes) {
                // going backwards: from bytestream, to percent-encoding, to original string.
                return decodeURIComponent(bytes.split("").map(function (c) { return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2); }).join(""));
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
            return (Tools.Binary.newBlob([src], { type: "text/plain" })).size;
        }
        Tools.getStringSize = getStringSize;
        /**
         * 文字列をバイト制限して分割
         */
        function toStringChunks(src, limit) {
            var chunks = [];
            var setChunk = function (input) {
                if (limit < getStringSize(input)) {
                    var half = Math.floor(input.length / 2);
                    var lhs = input.slice(0, half);
                    var rhs = input.slice(half);
                    return [lhs, rhs];
                }
                else {
                    chunks.push(input);
                    return [];
                }
            };
            var makeChunk = function (work) {
                var failures = setChunk(work);
                while (0 < failures.length) {
                    makeChunk(failures.shift());
                }
            };
            makeChunk(src);
            return chunks;
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
        var DateTime = /** @class */ (function () {
            function DateTime() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static method
            /**
             * 基点となる日付から、n日後、n日前を算出
             *
             * @param base   {Date}   [in] 基準日
             * @param add    {Number} [in] 加算日. マイナス指定でn日前も設定可能
             * @param target {String} [in] { year | month | date | hour | min | sec | msec }
             * @return {Date} 日付オブジェクト
             */
            DateTime.computeDate = function (base, add, target) {
                if (target === void 0) { target = "date"; }
                var date = new Date(base.getTime());
                switch (target) {
                    case "year":
                        date.setUTCFullYear(base.getUTCFullYear() + add);
                        break;
                    case "month":
                        date.setUTCMonth(base.getUTCMonth() + add);
                        break;
                    case "date":
                        date.setUTCDate(base.getUTCDate() + add);
                        break;
                    case "hour":
                        date.setUTCHours(base.getUTCHours() + add);
                        break;
                    case "min":
                        date.setUTCMinutes(base.getUTCMinutes() + add);
                        break;
                    case "sec":
                        date.setUTCSeconds(base.getUTCSeconds() + add);
                        break;
                    case "msec":
                        date.setUTCMilliseconds(base.getUTCMilliseconds() + add);
                        break;
                    default:
                        console.warn(TAG + "unknown target: " + target);
                        date.setUTCDate(base.getUTCDate() + add);
                }
                return date;
            };
            /**
             * Convert string to date object
             *
             * @param {String} date string ex) YYYY-MM-DDTHH:mm:ss.sssZ
             * @return {Object} date object
             */
            DateTime.convertISOStringToDate = function (dateString) {
                var dateValue = this.convertISOStringToDateValue(dateString);
                return new Date(dateValue);
            };
            /**
             * Convert date object into string (the ISO 8601 Extended Format)
             *
             * @param date   {Date}   [in] date object
             * @param target {String} [in] { year | month | date | min | sec | msec | tz }
             * @return {String} date string
             */
            DateTime.convertDateToISOString = function (date, target) {
                if (target === void 0) { target = "tz"; }
                var isoDateString = date.toISOString();
                // need offset if extended format (±YYYYYY-MM-DDTHH:mm:ss.sssZ)
                var offset = 27 === isoDateString.length ? 3 : 0;
                switch (target) {
                    case "year":
                        return isoDateString.substr(0, offset + 4);
                    case "month":
                        return isoDateString.substr(0, offset + 7);
                    case "date":
                        return isoDateString.substr(0, offset + 10);
                    case "min":
                        return isoDateString.substr(0, offset + 16);
                    case "sec":
                        return isoDateString.substr(0, offset + 19);
                    case "msec":
                        return isoDateString.substr(0, offset + 23);
                    case "tz":
                        return isoDateString;
                    default:
                        console.warn(TAG + "unknown target: " + target);
                        return isoDateString;
                }
            };
            /**
             * Convert file system compatible string to date object
             *
             * @param {String} date string ex) YYYY_MM_DDTHH_mm_ss_sss
             * @return {Object} date object
             */
            DateTime.convertFileSystemStringToDate = function (dateString) {
                var dateValue = this.convertFileSystemStringToDateValue(dateString);
                return new Date(dateValue);
            };
            /**
             * Convert date object into string in file system compatible format (YYYY_MM_DDTHH_mm_ss_sss)
             *
             * @param date   {Date}   [in] date object
             * @param target {String} [in] { year | month | date | min | sec | msec }
             * @return {String} file system compatible string
             */
            DateTime.convertDateToFileSystemString = function (date, target) {
                if (target === void 0) { target = "msec"; }
                var isoDateString = DateTime.convertDateToISOString(date, target);
                var fileSystemString = isoDateString.replace(/[-:.]/g, "_");
                return fileSystemString;
            };
            /**
             * Convert ISO string to value of date (milliseconds)
             *
             * @param isoString {String} [in] date string
             * @return {Number} value of date (ms)
             */
            DateTime.convertISOStringToDateValue = function (isoString) {
                var reYear = /(\d{4}|[-+]\d{6})/;
                var reMonth = /(\d{2})/;
                var reDay = /(\d{2})/;
                var reDate = new RegExp(reYear.source + "(?:-" + reMonth.source + "(?:-" + reDay.source + ")*)*");
                var reHours = /(\d{2})/;
                var reMinutes = /(\d{2})/;
                var reSeconds = /(\d{2})/;
                var reMs = /(\d{3})/;
                var reTime = new RegExp("T" + reHours.source + ":" + reMinutes.source + "(?::" + reSeconds.source + "(?:." + reMs.source + ")*)*");
                var reTz = /(Z|[-+]\d{2}:\d{2})/;
                var reISOString = new RegExp("^" + reDate.source + "(?:" + reTime.source + "(?:" + reTz.source + ")*)*$");
                var result = reISOString.exec(isoString);
                if (null == result) {
                    // invalid ISO string
                    return NaN;
                }
                var year = parseInt(result[1], 10);
                var month = parseInt(result[2], 10) - 1 || 0;
                var date = parseInt(result[3], 10) || 1;
                var hours = parseInt(result[4], 10) || 0;
                var minutes = parseInt(result[5], 10) || 0;
                var seconds = parseInt(result[6], 10) || 0;
                var ms = parseInt(result[7], 10) || 0;
                if (result[8]) {
                    // timezone offset
                    switch (result[8][0]) {
                        case "Z":
                            break;
                        case "-":
                            // -HH:mm
                            hours += parseInt(result[8].substr(1, 2), 10) || 0;
                            minutes += parseInt(result[8].substr(4, 2), 10) || 0;
                            break;
                        case "+":
                            // +HH:mm
                            hours -= parseInt(result[8].substr(1, 2), 10) || 0;
                            minutes -= parseInt(result[8].substr(4, 2), 10) || 0;
                            break;
                        default:
                            console.warn("invalid timezone in ISO string");
                    }
                }
                return Date.UTC(year, month, date, hours, minutes, seconds, ms);
            };
            /**
             * Convert file system compatible string to to value of date (milliseconds)
             *
             * @param dateString {String} [in] date string (YYYY_MM_DDTHH_mm_ss_sss)
             * @return {String} converted string
             */
            DateTime.convertFileSystemStringToDateValue = function (dateString) {
                var reYear = /(\d{4}|[-+]\d{6})/;
                var reMonth = /(\d{2})/;
                var reDay = /(\d{2})/;
                var reDate = new RegExp(reYear.source + "(?:_" + reMonth.source + "(?:_" + reDay.source + ")?)?");
                var reHours = /(\d{2})/;
                var reMinutes = /(\d{2})/;
                var reSeconds = /(\d{2})/;
                var reMs = /(\d{3})/;
                var reTime = new RegExp("T" + reHours.source + "_" + reMinutes.source + "(?:_" + reSeconds.source + "(?:_" + reMs.source + ")?)?");
                var reFileSystemString = new RegExp("^" + reDate.source + "(?:" + reTime.source + ")*$");
                var result = reFileSystemString.exec(dateString);
                if (null == result) {
                    // invalid file system string
                    return NaN;
                }
                var year = parseInt(result[1], 10);
                var month = parseInt(result[2], 10) - 1 || 0;
                var date = parseInt(result[3], 10) || 1;
                var hours = parseInt(result[4], 10) || 0;
                var minutes = parseInt(result[5], 10) || 0;
                var seconds = parseInt(result[6], 10) || 0;
                var ms = parseInt(result[7], 10) || 0;
                return Date.UTC(year, month, date, hours, minutes, seconds, ms);
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
        var Template = /** @class */ (function () {
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
        var ProgressCounter = /** @class */ (function () {
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
                    allowIncrementRemain: false,
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
                if (this._settings.allowIncrementRemain || (remainTime < this._settings.lastRemainTime)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVG9vbHMvRXJyb3JEZWZzLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9CaW5hcnkudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL0JpbmFyeVRyYW5zcG9ydC50cyIsImNkcDovLy9DRFAvVG9vbHMvRnVuY3Rpb25zLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9EYXRlVGltZS50cyIsImNkcDovLy9DRFAvVG9vbHMvVGVtcGxhdGUudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL1Byb2dyZXNzQ291bnRlci50cyIsImNkcDovLy9DRFAvVG9vbHMvSW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0FxQ1o7QUFyQ0QsV0FBVSxHQUFHO0lBRVQ7OztPQUdHO0lBQ0gsSUFBWSxnQkFHWDtJQUhELFdBQVksZ0JBQWdCO1FBQ3hCLDZGQUEyQjtRQUMzQixpREFBWSxDQUFDLEdBQUcsaUNBQTZCO0lBQ2pELENBQUMsRUFIVyxnQkFBZ0IsR0FBaEIsb0JBQWdCLEtBQWhCLG9CQUFnQixRQUczQjtJQUVELHVFQUF1RTtJQUN2RSw0QkFBNEI7SUFFNUIsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFFL0I7OztPQUdHO0lBQ0gsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLCtEQUFlO1FBQ2YsMENBQWMsQ0FBQyxHQUFHLG1CQUFtQjtJQUN6QyxDQUFDLEVBSEksZUFBZSxLQUFmLGVBQWUsUUFHbkI7SUFFRCxvQ0FBb0M7SUFDcEM7OztPQUdHO0lBQ0gsSUFBWSxXQUtYO0lBTEQsV0FBWSxXQUFXO1FBQ25CLDJGQUF1QztRQUN2QywrREFBc0Msc0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLG9CQUFvQixDQUFDO1FBQ3pJLDJEQUFzQyxzQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsR0FBRyxD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WUFDcEMsQ0FBQztZQUNMLHNCQUFDO1FBQUQsQ0FBQztRQXREWSxxQkFBZSxrQkFzRDNCO0lBQ0wsQ0FBQyxFQWxGYSxLQUFLLEdBQUwsU0FBSyxLQUFMLFNBQUssUUFrRmxCO0FBQUQsQ0FBQyxFQWxGUyxHQUFHLEtBQUgsR0FBRyxRQWtGWiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBDRFAge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIFJFU1VMVF9DT0RFX0JBU0VcclxuICAgICAqIEBicmllZiDjg6rjgrbjg6vjg4jjgrPjg7zjg4njga7jgqrjg5Xjgrvjg4Pjg4jlgKRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREVfQkFTRSB7XHJcbiAgICAgICAgQ0RQX1RPT0xTX0RFQ0xBUkVSQVRJT04gPSAwLCAgICAvLyBUUzI0MzIg5a++562WXHJcbiAgICAgICAgQ0RQX1RPT0xTID0gNCAqIF9NT0RVTEVfUkVTVUxUX0NPREVfUkFOR0VfQ0RQLFxyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBtb2R1bGUgZXJyb3IgZGVjbGFyYXRpb246XHJcblxyXG4gICAgY29uc3QgRlVOQ1RJT05fQ09ERV9SQU5HRSA9IDEwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIExPQ0FMX0NPREVfQkFTRVxyXG4gICAgICogQGJyaWVmIGNkcC50b29scyDlhoXjga7jg63jg7zjgqvjg6vjgrPjg7zjg4njgqrjg5Xjgrvjg4Pjg4jlgKRcclxuICAgICAqL1xyXG4gICAgZW51bSBMT0NBTF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIEZVTkNUSU9OUyAgID0gMCxcclxuICAgICAgICBCTE9CICAgICAgICA9IDEgKiBGVU5DVElPTl9DT0RFX1JBTkdFLFxyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW51bSAgUkVTVUxUX0NPREVcclxuICAgICAqIEBicmllZiBjZHAudG9vbHMg44Gu44Ko44Op44O844Kz44O844OJ5a6a576pXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFIHtcclxuICAgICAgICBFUlJPUl9DRFBfVE9PTFNfREVDTEFSQVRJT04gICAgICAgICA9IDAsIC8vIFRTMjQzMiDlr77nrZZcclxuICAgICAgICBFUlJPUl9DRFBfVE9PTFNfSU1BR0VfTE9BRF9GQUlMRUQgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9UT09MUywgTE9DQUxfQ09ERV9CQVNFLkZVTkNUSU9OUyArIDEsIFwiaW1hZ2UgbG9hZCBmYWlsZWQuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19JTlZBTElEX0lNQUdFICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX1RPT0xTLCBMT0NBTF9DT0RFX0JBU0UuRlVOQ1RJT05TICsgMiwgXCJpbnZhbGlkIGltYWdlLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9UT09MUywgTE9DQUxfQ09ERV9CQVNFLkJMT0IgKyAxLCBcIkZpbGVSZWFkZXIgbWV0aG9kIGZhaWxlZC5cIiksXHJcbiAgICB9XHJcbiAgICAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGltcG9ydCBQcm9taXNlID0gQ0RQLlByb21pc2U7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlRvb2xzLkJpbmFyeV0gXCI7XHJcblxyXG4gICAgaW50ZXJmYWNlIElEYXRhVVJMQ29tcG9uZW50IHtcclxuICAgICAgICBtaW1lVHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGJhc2U2NDogYm9vbGVhbjtcclxuICAgICAgICBkYXRhOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgQmluYXJ5XHJcbiAgICAgKiBAYnJpZWYg44OQ44Kk44OK44Oq44Om44O844OG44Kj44Oq44OG44KjXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBCaW5hcnkge1xyXG5cclxuICAgICAgICAvLyBwcml2YXRlIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgLy8gbm9vcFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IEJsb2JCdWlsZGVyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAb2Jzb2xldGVcclxuICAgICAgICAgKiBAcmV0dXJuIHthbnl9IEJsb2JCdWlsZGVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZ2V0QmxvYkJ1aWxkZXIoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbC5CbG9iQnVpbGRlciB8fCBnbG9iYWwuV2ViS2l0QmxvYkJ1aWxkZXIgfHwgZ2xvYmFsLk1vekJsb2JCdWlsZGVyIHx8IGdsb2JhbC5NU0Jsb2JCdWlsZGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Ko44Op44O85oOF5aCx55Sf5oiQIGZyb20gRE9NRXJyb3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSByZXN1bHRDb2RlIFtpbl0gUkVTVUxUX0NPREUg44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIGNhdXNlICAgICAgW2luXSDkuIvkvY3jga4gRE9NIOOCqOODqeODvOOCkuaMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSBbdGFnXSAgICAgIFtpbl0gVEFHIOOCkuaMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSBbbWVzc2FnZV0gIFtpbl0g44Oh44OD44K744O844K444KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnMg44Ko44Op44O844Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgbWFrZUVycm9ySW5mb0Zyb21ET01FcnJvcihyZXN1bHRDb2RlOiBSRVNVTFRfQ09ERSwgY2F1c2U6IERPTUVycm9yLCB0YWc/OiBzdHJpbmcsIG1lc3NhZ2U/OiBzdHJpbmcpOiBFcnJvckluZm8ge1xyXG4gICAgICAgICAgICBsZXQgX2NhdXNlOiBFcnJvcjtcclxuICAgICAgICAgICAgaWYgKGNhdXNlKSB7XHJcbiAgICAgICAgICAgICAgICBfY2F1c2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogY2F1c2UubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjYXVzZS5uYW1lLCAgICAvLyBET01FcnJvci5tZXNzYWdlIOOBjOacquOCteODneODvOODiFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbWFrZUVycm9ySW5mbyhyZXN1bHRDb2RlLCB0YWcsIG1lc3NhZ2UsIF9jYXVzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgQmxvYkJ1aWxkZXJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBvYnNvbGV0ZVxyXG4gICAgICAgICAqIEByZXR1cm4g5qeL56+J5riI44G/IEJsb2Ig44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBuZXdCbG9iKGJsb2JQYXJ0czogYW55W10gPSBbXSwgb3B0aW9uczogQmxvYlByb3BlcnR5QmFnID0ge30pOiBCbG9iIHtcclxuICAgICAgICAgICAgaWYgKGdsb2JhbC5CbG9iKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGdsb2JhbC5CbG9iKGJsb2JQYXJ0cywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1bmRlciBBbmRyb2lkIDQuNCBLaXRLYXRcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvYkJ1aWxkZXJPYmplY3Q6IGFueSA9IEJpbmFyeS5nZXRCbG9iQnVpbGRlcigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvYkJ1aWxkZXI6IGFueSA9IG5ldyBibG9iQnVpbGRlck9iamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFydHMgPSAoYmxvYlBhcnRzIGluc3RhbmNlb2YgQXJyYXkpID8gYmxvYlBhcnRzWzBdIDogYmxvYlBhcnRzO1xyXG4gICAgICAgICAgICAgICAgYmxvYkJ1aWxkZXIuYXBwZW5kKHBhcnRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBibG9iQnVpbGRlci5nZXRCbG9iKG9wdGlvbnMudHlwZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVSTCBPYmplY3RcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBvYnNvbGV0ZVxyXG4gICAgICAgICAqIEByZXR1cm4ge2FueX0gVVJMIE9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmxvYlVSTDogVVJMID0gKCgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbC5VUkwgfHwgZ2xvYmFsLndlYmtpdFVSTDtcclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcnJheUJ1ZmZlciB0byBCbG9iXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYnVmZmVyIFtpbl0gQXJyYXlCdWZmZXIgZGF0YVxyXG4gICAgICAgICAqIEBwYXJhbSBtaW1lVHlwZSBbaW5dIE1pbWVUeXBlIG9mIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJucyBCbG9iIGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGFycmF5QnVmZmVyVG9CbG9iKGJ1ZmZlcjogQXJyYXlCdWZmZXIsIG1pbWVUeXBlOiBzdHJpbmcgPSBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKTogQmxvYiB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkubmV3QmxvYihbYnVmZmVyXSwgeyB0eXBlOiBtaW1lVHlwZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVpbnQ4QXJyYXkgdG8gQmxvYlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGFycmF5IFtpbl0gVWludDhBcnJheSBkYXRhXHJcbiAgICAgICAgICogQHBhcmFtIG1pbWVUeXBlIFtpbl0gTWltZVR5cGUgb2YgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm5zIEJsb2IgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdWludDhBcnJheVRvQmxvYihhcnJheTogVWludDhBcnJheSwgbWltZVR5cGU6IHN0cmluZyA9IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpOiBCbG9iIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS5uZXdCbG9iKFthcnJheV0sIHsgdHlwZTogbWltZVR5cGUgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBkYXRhIFVSTCBzdHJpbmcgdG8gQmxvYlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBkYXRhVVJMIFtpbl0gZGF0YSBVUkwgc3RyaW5nXHJcbiAgICAgICAgICogQHJldHVybiB7QmxvYn0gQmxvYiBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkYXRhVVJMVG9CbG9iKGRhdGFVUkw6IHN0cmluZyk6IEJsb2Ige1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBCaW5hcnkuZXhlY0RhdGFVUkxSZWdFeHAoZGF0YVVSTCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmJhc2U2NCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS5iYXNlNjRUb0Jsb2IocmVzdWx0LmRhdGEsIHJlc3VsdC5taW1lVHlwZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQmluYXJ5LnRleHRUb0Jsb2IocmVzdWx0LmRhdGEsIHJlc3VsdC5taW1lVHlwZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhc2U2NCBzdHJpbmcgdG8gQmxvYlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2U2NCB7c3RyaW5nfSBbaW5dIEJhc2U2NCBzdHJpbmcgZGF0YVxyXG4gICAgICAgICAqIEBwYXJhbSBtaW1lVHlwZSB7c3RyaW5nfSBbaW5dIE1pbWVUeXBlIG9mIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtCbG9ifSBCbG9iIGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJhc2U2NFRvQmxvYihiYXNlNjQ6IHN0cmluZywgbWltZVR5cGU6IHN0cmluZyA9IFwidGV4dC9wbGFpblwiKTogQmxvYiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0gQmluYXJ5LmJhc2U2NFRvQnl0ZVN0cmluZyhiYXNlNjQpO1xyXG4gICAgICAgICAgICBjb25zdCBhcnJheSA9IEJpbmFyeS5ieXRlU3RyaW5nVG9VaW50OEFycmF5KGJ5dGVzKTtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS51aW50OEFycmF5VG9CbG9iKGFycmF5LCBtaW1lVHlwZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiB0ZXh0IHN0cmluZyB0byBCbG9iXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdGV4dCB7c3RyaW5nfSBbaW5dIHRleHQgc3RyaW5nIGRhdGFcclxuICAgICAgICAgKiBAcGFyYW0gbWltZVR5cGUge3N0cmluZ30gW2luXSBNaW1lVHlwZSBvZiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7QmxvYn0gQmxvYiBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB0ZXh0VG9CbG9iKHRleHQ6IHN0cmluZywgbWltZVR5cGU6IHN0cmluZyA9IFwidGV4dC9wbGFpblwiKTogQmxvYiB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkubmV3QmxvYihbdGV4dF0sIHsgdHlwZTogbWltZVR5cGUgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgQXJyYXlCdWZmZXJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8QXJyYXlCdWZmZXI+fSBwcm9taXNlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2I6IEJsb2IpOiBJUHJvbWlzZTxBcnJheUJ1ZmZlcj4ge1xyXG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjYW5jZWwgPSAoKSA9PiByZWFkZXIuYWJvcnQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEJpbmFyeS5tYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoKSBmYWlsZWQuXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYik7XHJcbiAgICAgICAgICAgIH0sIGNhbmNlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgVWludDhBcnJheVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7QmxvYn0gYmxvYiBbaW5dIGJsb2IgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0NEUC5JUHJvbWlzZTxVaW50OEFycmF5Pn0gcHJvbWlzZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRCbG9iQXNVaW50OEFycmF5KGJsb2I6IEJsb2IpOiBJUHJvbWlzZTxVaW50OEFycmF5PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0LCBkZXBlbmRPbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVwZW5kT24oQmluYXJ5LnJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigoYnVmZmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yOiBFcnJvckluZm8pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgZGF0YSBVUkxcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8c3RyaW5nPn0gcHJvbWlzZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRCbG9iQXNEYXRhVVJMKGJsb2I6IEJsb2IpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4gcmVhZGVyLmFib3J0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChCaW5hcnkubWFrZUVycm9ySW5mb0Zyb21ET01FcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0ZJTEVfUkVBREVSX0VSUk9SLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIuZXJyb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJGaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoKSBmYWlsZWQuXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChibG9iKTtcclxuICAgICAgICAgICAgfSwgY2FuY2VsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyBCYXNlNjQgc3RyaW5nXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtCbG9ifSBibG9iIFtpbl0gYmxvYiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7Q0RQLklQcm9taXNlPHN0cmluZz59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkQmxvYkFzQmFzZTY0KGJsb2I6IEJsb2IpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QsIGRlcGVuZE9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRPbihCaW5hcnkucmVhZEJsb2JBc0RhdGFVUkwoYmxvYikpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGRhdGFVUkwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGF0YVVSTCBpcyBhbHdheXMgZW5jb2RlZCBiYXNlNjRcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFzZTY0ID0gZGF0YVVSTC5zcGxpdChcIixcIilbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYmFzZTY0KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3I6IEVycm9ySW5mbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyB0ZXh0IHN0cmluZ1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7QmxvYn0gYmxvYiBbaW5dIGJsb2IgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0NEUC5JUHJvbWlzZTxVaW50OEFycmF5Pn0gcHJvbWlzZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRCbG9iQXNUZXh0KGJsb2I6IEJsb2IsIGVuY29kaW5nOiBzdHJpbmcgPSBcInV0Zi04XCIpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4gcmVhZGVyLmFib3J0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRlY29kZVVSSUNvbXBvbmVudChyZWFkZXIucmVzdWx0KSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEJpbmFyeS5tYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZpbGVSZWFkZXIucmVhZEFzVGV4dCgpIGZhaWxlZC5cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IsIGVuY29kaW5nKTtcclxuICAgICAgICAgICAgfSwgY2FuY2VsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRhdGEgVVJMIHN0cmluZyB0byBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGF0YVVSTFRvQXJyYXlCdWZmZXIoZGF0YVVSTDogc3RyaW5nKTogQXJyYXlCdWZmZXIge1xyXG4gICAgICAgICAgICBjb25zdCBhcnJheSA9IEJpbmFyeS5kYXRhVVJMVG9VaW50OEFycmF5KGRhdGFVUkwpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXkuYnVmZmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZGF0YSBVUkwgc3RyaW5nIHRvIFVpbnQ4QXJyYXlcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRhdGFVUkxUb1VpbnQ4QXJyYXkoZGF0YVVSTDogc3RyaW5nKTogVWludDhBcnJheSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IEJpbmFyeS5leGVjRGF0YVVSTFJlZ0V4cChkYXRhVVJMKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuYmFzZTY0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQmluYXJ5LmJhc2U2NFRvVWludDhBcnJheShyZXN1bHQuZGF0YSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQmluYXJ5LnRleHRUb1VpbnQ4QXJyYXkocmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCYXNlNjQgc3RyaW5nIHRvIEFycmF5QnVmZmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBiYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NDogc3RyaW5nKTogQXJyYXlCdWZmZXIge1xyXG4gICAgICAgICAgICBjb25zdCBhcnJheSA9IEJpbmFyeS5iYXNlNjRUb1VpbnQ4QXJyYXkoYmFzZTY0KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5LmJ1ZmZlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhc2U2NCBzdHJpbmcgdG8gVWludDhBcnJheVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmFzZTY0VG9VaW50OEFycmF5KGJhc2U2NDogc3RyaW5nKTogVWludDhBcnJheSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0gQmluYXJ5LmJhc2U2NFRvQnl0ZVN0cmluZyhiYXNlNjQpO1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5LmJ5dGVTdHJpbmdUb1VpbnQ4QXJyYXkoYnl0ZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdGV4dCBzdHJpbmcgdG8gQXJyYXlCdWZmZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHRleHRUb0FycmF5QnVmZmVyKHRleHQ6IHN0cmluZyk6IEFycmF5QnVmZmVyIHtcclxuICAgICAgICAgICAgY29uc3QgYXJyYXkgPSBCaW5hcnkudGV4dFRvVWludDhBcnJheSh0ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5LmJ1ZmZlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHRleHQgc3RyaW5nIHRvIFVpbnQ4QXJyYXlcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHRleHRUb1VpbnQ4QXJyYXkodGV4dDogc3RyaW5nKTogVWludDhBcnJheSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0gQmluYXJ5LnRleHRUb0J5dGVTdHJpbmcodGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkuYnl0ZVN0cmluZ1RvVWludDhBcnJheShieXRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcnJheUJ1ZmZlciB0byBkYXRhIFVSTCBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGFycmF5QnVmZmVyVG9EYXRhVVJMKGJ1ZmZlcjogQXJyYXlCdWZmZXIsIG1pbWVUeXBlOiBzdHJpbmcgPSBcInRleHQvcGxhaW5cIik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkudWludDhBcnJheVRvRGF0YVVSTChuZXcgVWludDhBcnJheShidWZmZXIpLCBtaW1lVHlwZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcnJheUJ1ZmZlciB0byBCYXNlNjQgc3RyaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBhcnJheUJ1ZmZlclRvQmFzZTY0KGJ1ZmZlcjogQXJyYXlCdWZmZXIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5LnVpbnQ4QXJyYXlUb0Jhc2U2NChuZXcgVWludDhBcnJheShidWZmZXIpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFycmF5QnVmZmVyIHRvIHRleHQgc3RyaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBhcnJheUJ1ZmZlclRvVGV4dChidWZmZXI6IEFycmF5QnVmZmVyKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS51aW50OEFycmF5VG9UZXh0KG5ldyBVaW50OEFycmF5KGJ1ZmZlcikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVWludDhBcnJheSB0byBkYXRhIFVSTCBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHVpbnQ4QXJyYXlUb0RhdGFVUkwoYXJyYXk6IFVpbnQ4QXJyYXksIG1pbWVUeXBlOiBzdHJpbmcgPSBcInRleHQvcGxhaW5cIik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IEJpbmFyeS51aW50OEFycmF5VG9CYXNlNjQoYXJyYXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYGRhdGE6JHttaW1lVHlwZX07YmFzZTY0LCR7YmFzZTY0fWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVaW50OEFycmF5IHRvIEJhc2U2NCBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHVpbnQ4QXJyYXlUb0Jhc2U2NChhcnJheTogVWludDhBcnJheSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0gQmluYXJ5LnVpbnQ4QXJyYXlUb0J5dGVTdHJpbmcoYXJyYXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5LmJ5dGVTdHJpbmdUb0Jhc2U2NChieXRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVaW50OEFycmF5IHRvIHRleHQgc3RyaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB1aW50OEFycmF5VG9UZXh0KGFycmF5OiBVaW50OEFycmF5KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSBCaW5hcnkudWludDhBcnJheVRvQnl0ZVN0cmluZyhhcnJheSk7XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkuYnl0ZVN0cmluZ1RvVGV4dChieXRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBkYXRhIFVSTCBzdHJpbmcgdG8gdGV4dCBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRhdGFVUkxUb1RleHQoZGF0YVVSTDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gQmluYXJ5LmV4ZWNEYXRhVVJMUmVnRXhwKGRhdGFVUkwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5iYXNlNjQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBCaW5hcnkuYmFzZTY0VG9UZXh0KHJlc3VsdC5kYXRhKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCYXNlNjQgc3RyaW5nIHRvIHRleHQgc3RyaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBiYXNlNjRUb1RleHQoYmFzZTY0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IEJpbmFyeS5iYXNlNjRUb0J5dGVTdHJpbmcoYmFzZTY0KTtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS5ieXRlU3RyaW5nVG9UZXh0KGJ5dGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHRleHQgc3RyaW5nIHRvIGRhdGEgVVJMIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdGV4dFRvRGF0YVVSTCh0ZXh0OiBzdHJpbmcsIG1pbWVUeXBlOiBzdHJpbmcgPSBcInRleHQvcGxhaW5cIik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IEJpbmFyeS50ZXh0VG9CYXNlNjQodGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBgZGF0YToke21pbWVUeXBlfTtiYXNlNjQsJHtiYXNlNjR9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHRleHQgc3RyaW5nIHRvIEJhc2U2NCBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHRleHRUb0Jhc2U2NCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IEJpbmFyeS50ZXh0VG9CeXRlU3RyaW5nKHRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5LmJ5dGVTdHJpbmdUb0Jhc2U2NChieXRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBkYXRhIFVSSSDlvaLlvI/jga7mraPopo/ooajnj75cclxuICAgICAgICAgKiDlj4LogIM6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2phL2RvY3MvZGF0YV9VUklzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZXhlY0RhdGFVUkxSZWdFeHAoZGF0YVVSTDogc3RyaW5nKTogSURhdGFVUkxDb21wb25lbnQge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogW21hdGNoXSAxOiBNaW1lVHlwZVxyXG4gICAgICAgICAgICAgKiAgICAgICAgIDI6IFwiO2Jhc2U2NFwiIOOCkuWQq+OCgOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAgICAgKiAgICAgICAgIDM6IGRhdGEg5pys5L2TXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBjb25zdCByZURhdGFVUkwgPSAvXmRhdGE6KC4rP1xcLy4rPyk/KDsuKz8pPywoLiopJC87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlRGF0YVVSTC5leGVjKGRhdGFVUkwpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50OiBJRGF0YVVSTENvbXBvbmVudCA9IHtcclxuICAgICAgICAgICAgICAgIG1pbWVUeXBlOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgYmFzZTY0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogXCJcIixcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Lm1pbWVUeXBlID0gcmVzdWx0WzFdO1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmJhc2U2NCA9IC87YmFzZTY0Ly50ZXN0KHJlc3VsdFsyXSk7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuZGF0YSA9IHJlc3VsdFszXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHVpbnQ4QXJyYXlUb0J5dGVTdHJpbmcoYXJyYXk6IFVpbnQ4QXJyYXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChhcnJheSwgaSA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpKS5qb2luKFwiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgYmFzZTY0VG9CeXRlU3RyaW5nKGJhc2U2NDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5hdG9iKGJhc2U2NCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB0ZXh0VG9CeXRlU3RyaW5nKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8vIGZpcnN0IHdlIHVzZSBlbmNvZGVVUklDb21wb25lbnQgdG8gZ2V0IHBlcmNlbnQtZW5jb2RlZCBVVEYtOCxcclxuICAgICAgICAgICAgLy8gdGhlbiB3ZSBjb252ZXJ0IHRoZSBwZXJjZW50IGVuY29kaW5ncyBpbnRvIHJhdyBieXRlcyB3aGljaFxyXG4gICAgICAgICAgICAvLyBjYW4gYmUgZmVkIGludG8gYnRvYS5cclxuICAgICAgICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh0ZXh0KS5yZXBsYWNlKC8lKFswLTlBLUZdezJ9KS9nLFxyXG4gICAgICAgICAgICAgICAgKG1hdGNoLCBwMSkgPT4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChwMSwgMTYpKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgYnl0ZVN0cmluZ1RvVWludDhBcnJheShieXRlczogc3RyaW5nKTogVWludDhBcnJheSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gYnl0ZXMuc3BsaXQoXCJcIikubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGFycmF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGJ5dGVTdHJpbmdUb0Jhc2U2NChieXRlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5idG9hKGJ5dGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGJ5dGVTdHJpbmdUb1RleHQoYnl0ZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8vIGdvaW5nIGJhY2t3YXJkczogZnJvbSBieXRlc3RyZWFtLCB0byBwZXJjZW50LWVuY29kaW5nLCB0byBvcmlnaW5hbCBzdHJpbmcuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoYnl0ZXMuc3BsaXQoXCJcIikubWFwKFxyXG4gICAgICAgICAgICAgICAgYyA9PiBgJSR7KFwiMDBcIiArIGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC0yKX1gXHJcbiAgICAgICAgICAgICkuam9pbihcIlwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBAZmlsZSAgQmluYXJ5VHJhbnNwb3J0LnRzXHJcbiAqIEBicmllZiBqUXVlcnkgYWpheCB0cmFuc3BvcnQgZm9yIG1ha2luZyBiaW5hcnkgZGF0YSB0eXBlIHJlcXVlc3RzLlxyXG4gKlxyXG4gKiAgICAgICAgb3JpZ2luYWw6IGh0dHBzOi8vZ2l0aHViLmNvbS9oZW5yeWEvanMtanF1ZXJ5L2Jsb2IvbWFzdGVyL0JpbmFyeVRyYW5zcG9ydC9qcXVlcnkuYmluYXJ5dHJhbnNwb3J0LmpzXHJcbiAqICAgICAgICBhdXRob3I6ICAgSGVucnkgQWxndXMgPGhlbnJ5YWxndXNAZ21haWwuY29tPlxyXG4gKi9cclxubmFtZXNwYWNlIENEUC5Ub29scyB7XHJcbiAgICAvLyBTdXBwb3J0IGZpbGUgcHJvdG9jb2wuIChhcyBzYW1lIGFzIG9mZmljaWFsIHdheSlcclxuICAgIGNvbnN0IHhoclN1Y2Nlc3NTdGF0dXMgPSB7XHJcbiAgICAgICAgMDogMjAwLFxyXG4gICAgICAgIDEyMjM6IDIwNFxyXG4gICAgfTtcclxuXHJcbiAgICAkLmFqYXhUcmFuc3BvcnQoXCIrYmluYXJ5XCIsIChvcHRpb25zOiBKUXVlcnkuQWpheFNldHRpbmdzLCBvcmlnaW5hbE9wdGlvbnM6IEpRdWVyeS5BamF4U2V0dGluZ3MsIGpxWEhSOiBKUXVlcnlYSFIpID0+IHtcclxuICAgICAgICBpZiAoZ2xvYmFsLkZvcm1EYXRhICYmXHJcbiAgICAgICAgICAgICgob3B0aW9ucy5kYXRhVHlwZSAmJiAob3B0aW9ucy5kYXRhVHlwZSA9PT0gXCJiaW5hcnlcIikpIHx8XHJcbiAgICAgICAgICAgIChvcHRpb25zLmRhdGEgJiYgKChnbG9iYWwuQXJyYXlCdWZmZXIgJiYgb3B0aW9ucy5kYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8XHJcbiAgICAgICAgICAgIChnbG9iYWwuQmxvYiAmJiBvcHRpb25zLmRhdGEgaW5zdGFuY2VvZiBnbG9iYWwuQmxvYikpKSkpIHtcclxuICAgICAgICAgICAgbGV0IGFib3J0Q2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kOiBmdW5jdGlvbiAoaGVhZGVyczogSlF1ZXJ5LlBsYWluT2JqZWN0LCBjYWxsYmFjazogSlF1ZXJ5LlRyYW5zcG9ydC5TdWNjZXNzQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXR1cCBhbGwgdmFyaWFibGVzXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gb3B0aW9ucy51cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IG9wdGlvbnMudHlwZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3luYyA9IG9wdGlvbnMuYXN5bmMgfHwgdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmxvYiBvciBhcnJheWJ1ZmZlci4gRGVmYXVsdCBpcyBibG9iXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YVR5cGUgPSAoPGFueT5vcHRpb25zKS5yZXNwb25zZVR5cGUgfHwgXCJibG9iXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJuYW1lID0gb3B0aW9ucy51c2VybmFtZSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZCB8fCBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBfY2FsbGJhY2s6IEpRdWVyeS5UcmFuc3BvcnQuU3VjY2Vzc0NhbGxiYWNrID0gY2FsbGJhY2sgfHwgKCgpID0+IHsgLyogbm9vcCAqLyB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3VjY2VlZGVkIGhhbmRsZXJcclxuICAgICAgICAgICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZGF0YVtvcHRpb25zLmRhdGFUeXBlXSA9IHhoci5yZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyU3VjY2Vzc1N0YXR1c1t4aHIuc3RhdHVzXSB8fCB4aHIuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEpRdWVyeS5BamF4LlRleHRTdGF0dXM+eGhyLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBoYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9kYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhW29wdGlvbnMuZGF0YVR5cGVdID0geGhyLnJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIGNhbGxiYWNrIGFuZCBzZW5kIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxKUXVlcnkuQWpheC5UZXh0U3RhdHVzPnhoci5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWJvcnQgaGFuZGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZGF0YVtvcHRpb25zLmRhdGFUeXBlXSA9IHhoci5yZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBjYWxsYmFjayBhbmQgc2VuZCBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jYWxsYmFjayhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SlF1ZXJ5LkFqYXguVGV4dFN0YXR1cz54aHIuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFib3J0IGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICAgICAgYWJvcnRDYWxsYmFjayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLm9wZW4odHlwZSwgdXJsLCBhc3luYywgdXNlcm5hbWUsIHBhc3N3b3JkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0dXAgY3VzdG9tIGhlYWRlcnNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gaGVhZGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaSwgaGVhZGVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSBkYXRhVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhYm9ydDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhYm9ydENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFib3J0Q2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJqcXVlcnlcIiAvPlxyXG5cclxubmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgPSBDRFAuUHJvbWlzZTtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuRnVuY3Rpb25zXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGguYWJzIOOCiOOCiuOCgumrmOmAn+OBqiBhYnNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGFicyh4OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB4ID49IDAgPyB4IDogLXg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRoLm1heCDjgojjgorjgoLpq5jpgJ/jgaogbWF4XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtYXgobGhzOiBudW1iZXIsIHJoczogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gbGhzID49IHJocyA/IGxocyA6IHJocztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGgubWluIOOCiOOCiuOCgumrmOmAn+OBqiBtaW5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1pbihsaHM6IG51bWJlciwgcmhzOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBsaHMgPD0gcmhzID8gbGhzIDogcmhzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pWw5YCk44KSIDAg6Kmw44KB44GX44Gm5paH5a2X5YiX44KS55Sf5oiQXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiB0b1plcm9QYWRkaW5nKG5vOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBzaWduZWQgPSBcIlwiO1xyXG4gICAgICAgIG5vID0gTnVtYmVyKG5vKTtcclxuXHJcbiAgICAgICAgaWYgKGlzTmFOKG5vKSB8fCBpc05hTihsaW1pdCkgfHwgbGltaXQgPD0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChubyA8IDApIHtcclxuICAgICAgICAgICAgbm8gPSBUb29scy5hYnMobm8pO1xyXG4gICAgICAgICAgICBzaWduZWQgPSBcIi1cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzaWduZWQgKyAoQXJyYXkobGltaXQpLmpvaW4oXCIwXCIpICsgbm8pLnNsaWNlKC1saW1pdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmloflrZfliJfjga7jg5DjgqTjg4jmlbDjgpLjgqvjgqbjg7Pjg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFN0cmluZ1NpemUoc3JjOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAoQmluYXJ5Lm5ld0Jsb2IoW3NyY10sIHsgdHlwZTogXCJ0ZXh0L3BsYWluXCIgfSkpLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmloflrZfliJfjgpLjg5DjgqTjg4jliLbpmZDjgZfjgabliIblibJcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHRvU3RyaW5nQ2h1bmtzKHNyYzogc3RyaW5nLCBsaW1pdDogbnVtYmVyKTogc3RyaW5nW10ge1xyXG5cclxuICAgICAgICBjb25zdCBjaHVua3MgPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2V0Q2h1bmsgPSAoaW5wdXQ6IHN0cmluZyk6IHN0cmluZ1tdID0+IHtcclxuICAgICAgICAgICAgaWYgKGxpbWl0IDwgZ2V0U3RyaW5nU2l6ZShpbnB1dCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbGYgPSBNYXRoLmZsb29yKGlucHV0Lmxlbmd0aCAvIDIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGhzID0gaW5wdXQuc2xpY2UoMCwgaGFsZik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByaHMgPSBpbnB1dC5zbGljZShoYWxmKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbbGhzLCByaHNdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2h1bmtzLnB1c2goaW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgbWFrZUNodW5rID0gKHdvcms6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmYWlsdXJlcyA9IHNldENodW5rKHdvcmspO1xyXG4gICAgICAgICAgICB3aGlsZSAoMCA8IGZhaWx1cmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgbWFrZUNodW5rKGZhaWx1cmVzLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbWFrZUNodW5rKHNyYyk7XHJcblxyXG4gICAgICAgIHJldHVybiBjaHVua3M7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlpJrph43ntpnmib/jga7jgZ/jgoHjga7lrp/ooYzmmYLntpnmib/plqLmlbBcclxuICAgICAqXHJcbiAgICAgKiBTdWIgQ2xhc3Mg5YCZ6KOc44Kq44OW44K444Kn44Kv44OI44Gr5a++44GX44GmIFN1cGVyIENsYXNzIOWAmeijnOOCquODluOCuOOCp+OCr+ODiOOCkuebtOWJjeOBriBTdXBlciBDbGFzcyDjgajjgZfjgabmjL/lhaXjgZnjgovjgIJcclxuICAgICAqIHByb3RvdHlwZSDjga7jgb/jgrPjg5Tjg7zjgZnjgovjgIJcclxuICAgICAqIOOCpOODs+OCueOCv+ODs+OCueODoeODs+ODkOOCkuOCs+ODlOODvOOBl+OBn+OBhOWgtOWQiOOAgVN1cGVyIENsYXNzIOOBjOeWkeS8vOOCs+ODs+OCueODiOODqeOCr+OCv+OCkuaPkOS+m+OBmeOCi+W/heimgeOBjOOBguOCi+OAglxyXG4gICAgICog6Kmz57Sw44GvIGNkcC50b29scy5GdW5jdGlvbnMuc3BlYy50cyDjgpLlj4LnhafjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc3ViQ2xhc3MgICB7Y29uc3RydWN0b3J9IFtpbl0g44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIHN1cGVyQ2xhc3Mge2NvbnN0cnVjdG9yfSBbaW5dIOOCquODluOCuOOCp+OCr+ODiOOBriBjb25zdHJ1Y3RvciDjgpLmjIflrppcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaGVyaXQoc3ViQ2xhc3M6IGFueSwgc3VwZXJDbGFzczogYW55KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgX3Byb3RvdHlwZSA9IHN1YkNsYXNzLnByb3RvdHlwZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2luaGVyaXQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBzdWJDbGFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgX2luaGVyaXQucHJvdG90eXBlID0gc3VwZXJDbGFzcy5wcm90b3R5cGU7XHJcbiAgICAgICAgc3ViQ2xhc3MucHJvdG90eXBlID0gbmV3IF9pbmhlcml0KCk7XHJcblxyXG4gICAgICAgICQuZXh0ZW5kKHN1YkNsYXNzLnByb3RvdHlwZSwgX3Byb3RvdHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtaXhpbiDplqLmlbBcclxuICAgICAqXHJcbiAgICAgKiBUeXBlU2NyaXB0IE9mZmljaWFsIFNpdGUg44Gr6LyJ44Gj44Gm44GE44KLIG1peGluIOmWouaVsFxyXG4gICAgICogaHR0cDovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvSGFuZGJvb2sjbWl4aW5zXHJcbiAgICAgKiDml6LjgavlrprnvqnjgZXjgozjgabjgYTjgovjgqrjg5bjgrjjgqfjgq/jg4jjgYvjgonjgIHmlrDopo/jgavjgqrjg5bjgrjjgqfjgq/jg4jjgpLlkIjmiJDjgZnjgovjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVyaXZlZCB7Y29uc3RydWN0b3J9ICAgIFtpbl0g5ZCI5oiQ44GV44KM44KL44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIGJhc2VzICAge2NvbnN0cnVjdG9yLi4ufSBbaW5dIOWQiOaIkOWFg+OCquODluOCuOOCp+OCr+ODiOOBriBjb25zdHJ1Y3RvciDjgpLmjIflrpogKOWPr+WkieW8leaVsClcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1peGluKGRlcml2ZWQ6IGFueSwgLi4uYmFzZXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgYmFzZXMuZm9yRWFjaCgoYmFzZSkgPT4ge1xyXG4gICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlLnByb3RvdHlwZSkuZm9yRWFjaChuYW1lID0+IHtcclxuICAgICAgICAgICAgICAgIGRlcml2ZWQucHJvdG90eXBlW25hbWVdID0gYmFzZS5wcm90b3R5cGVbbmFtZV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNvcnJlY3RseSBzZXQgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiwgZm9yIHN1YmNsYXNzZXMuXHJcbiAgICAgKiBUaGUgZnVuY3Rpb24gYmVoYXZpb3IgaXMgc2FtZSBhcyBleHRlbmQoKSBmdW5jdGlvbiBvZiBCYWNrYm9uZS5qcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcHJvdG9Qcm9wcyAge09iamVjdH0gW2luXSBzZXQgcHJvdG90eXBlIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHN0YXRpY1Byb3BzIHtPYmplY3R9IFtpbl0gc2V0IHN0YXRpYyBwcm9wZXJ0aWVzIGFzIG9iamVjdC5cclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gc3ViY2xhc3MgY29uc3RydWN0b3IuXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIOOCr+ODqeOCuee2meaJv+OBruOBn+OCgeOBruODmOODq+ODkeODvOmWouaVsFxyXG4gICAgICogQmFja2JvbmUuanMgZXh0ZW5kKCkg6Zai5pWw44Go5ZCM562JXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHByb3RvUHJvcHMgIHtPYmplY3R9IFtpbl0gcHJvdG90eXBlIHByb3BlcnRpZXMg44KS44Kq44OW44K444Kn44Kv44OI44Gn5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gc3RhdGljUHJvcHMge09iamVjdH0gW2luXSBzdGF0aWMgcHJvcGVydGllcyDjgpLjgqrjg5bjgrjjgqfjgq/jg4jjgafmjIflrppcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0g44K144OW44Kv44Op44K544Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBleHRlbmQocHJvdG9Qcm9wczogb2JqZWN0LCBzdGF0aWNQcm9wcz86IG9iamVjdCk6IG9iamVjdCB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcztcclxuICAgICAgICBsZXQgY2hpbGQ7XHJcblxyXG4gICAgICAgIGlmIChwcm90b1Byb3BzICYmIHByb3RvUHJvcHMuaGFzT3duUHJvcGVydHkoXCJjb25zdHJ1Y3RvclwiKSkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hpbGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmV4dGVuZChjaGlsZCwgcGFyZW50LCBzdGF0aWNQcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IFN1cnJvZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3Vycm9nYXRlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XHJcbiAgICAgICAgY2hpbGQucHJvdG90eXBlID0gbmV3IFN1cnJvZ2F0ZTtcclxuXHJcbiAgICAgICAgaWYgKHByb3RvUHJvcHMpIHtcclxuICAgICAgICAgICAgJC5leHRlbmQoY2hpbGQucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgIHJldHVybiBjaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERQSSDlj5blvpdcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldERldmljZVBpeGNlbFJhdGlvKCk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IG1lZGlhUXVlcnk7XHJcbiAgICAgICAgY29uc3QgaXNfZmlyZWZveCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiZmlyZWZveFwiKSA+IC0xO1xyXG4gICAgICAgIGlmIChudWxsICE9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICYmICFpc19maXJlZm94KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKSB7XHJcbiAgICAgICAgICAgIG1lZGlhUXVlcnkgPVxyXG4gICAgICAgICAgICAgICAgXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMS41KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAzLzIpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi1yZXNvbHV0aW9uOiAxLjVkcHB4KVwiO1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDEuNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZWRpYVF1ZXJ5ID1cclxuICAgICAgICAgICAgICAgIFwiKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMiksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSxcXFxyXG4gICAgICAgICAgICAgICAgICAgICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyLzEpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi1yZXNvbHV0aW9uOiAyZHBweClcIjtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnkpLm1hdGNoZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1lZGlhUXVlcnkgPVxyXG4gICAgICAgICAgICAgICAgXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAwLjc1KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDAuNzUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDMvNCksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLXJlc29sdXRpb246IDAuNzVkcHB4KVwiO1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDYW52YXMgZWxlbWVudCDjga7jgq3jg6Pjg4Pjgrfjg6VcclxuICAgIGxldCBzX2NhbnZhc0ZhY3Rvcnk6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cclxuICAgIC8vIOOCreODo+ODg+OCt+ODpea4iOOBv+OBriBDYW52YXMg44KS5Y+W5b6X44GZ44KLXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q2FudmFzKCk6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgICAgICBzX2NhbnZhc0ZhY3RvcnkgPSBzX2NhbnZhc0ZhY3RvcnkgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICByZXR1cm4gPEhUTUxDYW52YXNFbGVtZW50PnNfY2FudmFzRmFjdG9yeS5jbG9uZU5vZGUoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55S75YOP44Oq44K944O844K544Gu44Ot44O844OJ5a6M5LqG44KS5L+d6Ki8XHJcbiAgICAgKiDjg5bjg6njgqbjgrbml6Llrprjga7jg5fjg63jgrDjg6zjg4Pjgrfjg5bjg63jg7zjg4njgpLotbDjgonjgZvjgarjgYTjgZ/jgoEuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSB1cmwgW2luXSB1cmwgKGRhdGEtdXJsKVxyXG4gICAgICogQHJldHVybiB7SVByb21pc2U8c3RyaW5nPn0g6KGo56S65Y+v6IO944GqIHVybFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZW5zdXJlSW1hZ2VMb2FkZWQodXJsOiBzdHJpbmcpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpbWcpIHtcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBcIlwiOyAgIC8vIOiqreOBv+i+vOOBv+WBnOatolxyXG4gICAgICAgICAgICAgICAgaW1nID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHVybCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWcub25lcnJvciA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19JTUFHRV9MT0FEX0ZBSUxFRCxcclxuICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZSBsb2FkIGZhaWxlZC4gW3VybDogXCIgKyB1cmwgKyBcIl1cIlxyXG4gICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG5cclxuICAgICAgICB9LCBkZXN0cm95KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeUu+WDj+OBruODquOCteOCpOOCulxyXG4gICAgICog5oyH5a6a44GX44Gf6ZW36L6644Gu6ZW344GV44Gr44Ki44K544Oa44Kv44OI5q+U44KS57at5oyB44GX44Gm44Oq44K144Kk44K644KS6KGM44GGXHJcbiAgICAgKiBsb25nU2lkZUxlbmd0aCDjgojjgorlsI/jgZXjgarloLTlkIjjga/jgqrjg6rjgrjjg4rjg6vjgrXjgqTjgrrjgacgZGF0YS11cmwg44KS6L+U5Y2044GZ44KLXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBzcmMgICAgICAgICAgICBbaW5dIGltYWdlIOOBq+aMh+WumuOBmeOCi+OCveODvOOCuVxyXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBsb25nU2lkZUxlbmd0aCBbaW5dIOODquOCteOCpOOCuuOBq+S9v+eUqOOBmeOCi+mVt+i+uuOBruacgOWkp+WApOOCkuaMh+WumlxyXG4gICAgICogQHJldHVybiB7SVByb21pc2U8c3RyaW5nPn0gYmFzZTY0IGRhdGEgdXJsIOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmVzaXplSW1hZ2Uoc3JjOiBzdHJpbmcsIGxvbmdTaWRlTGVuZ3RoOiBudW1iZXIpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpbWcpIHtcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBcIlwiOyAgIC8vIOiqreOBv+i+vOOBv+WBnOatolxyXG4gICAgICAgICAgICAgICAgaW1nID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYW52YXMgPSBnZXRDYW52YXMoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGloID0gaW1nLmhlaWdodCwgaXcgPSBpbWcud2lkdGgsIGlhID0gaWggLyBpdztcclxuICAgICAgICAgICAgICAgIGxldCBjdzogbnVtYmVyLCBjaDogbnVtYmVyO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdyA9PT0gMCB8fCAwID09PSBpYSkgeyAvLyDlv7Xjga7jgZ/jgoHkuI3mraPjgarnlLvlg4/jgpLjgqzjg7zjg4lcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QobWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0lOVkFMSURfSU1BR0UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbnZhbGlkIGltYWdlLiBbc3JjOiBcIiArIHNyYyArIFwiXVwiXHJcbiAgICAgICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb25nU2lkZUxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdTaWRlTGVuZ3RoID0gKGlhIDwgMSkgPyBpdyA6IGloO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWEgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ID0gKGxvbmdTaWRlTGVuZ3RoIDwgaXcpID8gbG9uZ1NpZGVMZW5ndGggOiBpdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSBNYXRoLnJvdW5kKGN3ICogaWEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoID0gKGxvbmdTaWRlTGVuZ3RoIDwgaWgpID8gbG9uZ1NpZGVMZW5ndGggOiBpaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3cgPSBNYXRoLnJvdW5kKGNoIC8gaWEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLndpZHRoID0gY3c7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGNoO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikuZHJhd0ltYWdlKGltZywgMCwgMCwgY3csIGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjYW52YXMudG9EYXRhVVJMKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5vbmVycm9yID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG1ha2VFcnJvckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0lNQUdFX0xPQURfRkFJTEVELFxyXG4gICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICBcImltYWdlIGxvYWQgZmFpbGVkLiBbc3JjOiBcIiArIHNyYyArIFwiXVwiXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBzcmM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuRGF0ZVRpbWVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIERhdGVUaW1lXHJcbiAgICAgKiBAYnJpZWYg5pmC5Yi75pON5L2c44Gu44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBEYXRlVGltZSB7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Z+654K544Go44Gq44KL5pel5LuY44GL44KJ44CBbuaXpeW+jOOAgW7ml6XliY3jgpLnrpflh7pcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBiYXNlICAge0RhdGV9ICAgW2luXSDln7rmupbml6VcclxuICAgICAgICAgKiBAcGFyYW0gYWRkICAgIHtOdW1iZXJ9IFtpbl0g5Yqg566X5pelLiDjg57jgqTjg4rjgrnmjIflrprjgadu5pel5YmN44KC6Kit5a6a5Y+v6IO9XHJcbiAgICAgICAgICogQHBhcmFtIHRhcmdldCB7U3RyaW5nfSBbaW5dIHsgeWVhciB8IG1vbnRoIHwgZGF0ZSB8IGhvdXIgfCBtaW4gfCBzZWMgfCBtc2VjIH1cclxuICAgICAgICAgKiBAcmV0dXJuIHtEYXRlfSDml6Xku5jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbXB1dGVEYXRlKGJhc2U6IERhdGUsIGFkZDogbnVtYmVyLCB0YXJnZXQ6IHN0cmluZyA9IFwiZGF0ZVwiKTogRGF0ZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShiYXNlLmdldFRpbWUoKSk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInllYXJcIjpcclxuICAgICAgICAgICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKGJhc2UuZ2V0VVRDRnVsbFllYXIoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibW9udGhcIjpcclxuICAgICAgICAgICAgICAgICAgICBkYXRlLnNldFVUQ01vbnRoKGJhc2UuZ2V0VVRDTW9udGgoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDRGF0ZShiYXNlLmdldFVUQ0RhdGUoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaG91clwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDSG91cnMoYmFzZS5nZXRVVENIb3VycygpICsgYWRkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtaW5cIjpcclxuICAgICAgICAgICAgICAgICAgICBkYXRlLnNldFVUQ01pbnV0ZXMoYmFzZS5nZXRVVENNaW51dGVzKCkgKyBhZGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDU2Vjb25kcyhiYXNlLmdldFVUQ1NlY29uZHMoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibXNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDTWlsbGlzZWNvbmRzKGJhc2UuZ2V0VVRDTWlsbGlzZWNvbmRzKCkgKyBhZGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIHRhcmdldDogXCIgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDRGF0ZShiYXNlLmdldFVUQ0RhdGUoKSArIGFkZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBzdHJpbmcgdG8gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRlIHN0cmluZyBleCkgWVlZWS1NTS1ERFRISDptbTpzcy5zc3NaXHJcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydElTT1N0cmluZ1RvRGF0ZShkYXRlU3RyaW5nOiBzdHJpbmcpOiBEYXRlIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZVZhbHVlID0gdGhpcy5jb252ZXJ0SVNPU3RyaW5nVG9EYXRlVmFsdWUoZGF0ZVN0cmluZyk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlVmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBkYXRlIG9iamVjdCBpbnRvIHN0cmluZyAodGhlIElTTyA4NjAxIEV4dGVuZGVkIEZvcm1hdClcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRlICAge0RhdGV9ICAgW2luXSBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQge1N0cmluZ30gW2luXSB7IHllYXIgfCBtb250aCB8IGRhdGUgfCBtaW4gfCBzZWMgfCBtc2VjIHwgdHogfVxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gZGF0ZSBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnZlcnREYXRlVG9JU09TdHJpbmcoZGF0ZTogRGF0ZSwgdGFyZ2V0OiBzdHJpbmcgPSBcInR6XCIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBpc29EYXRlU3RyaW5nID0gZGF0ZS50b0lTT1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgLy8gbmVlZCBvZmZzZXQgaWYgZXh0ZW5kZWQgZm9ybWF0ICjCsVlZWVlZWS1NTS1ERFRISDptbTpzcy5zc3NaKVxyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXQgPSAyNyA9PT0gaXNvRGF0ZVN0cmluZy5sZW5ndGggPyAzIDogMDtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwieWVhclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nLnN1YnN0cigwLCBvZmZzZXQgKyA0KTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtb250aFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nLnN1YnN0cigwLCBvZmZzZXQgKyA3KTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCArIDEwKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtaW5cIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZy5zdWJzdHIoMCwgb2Zmc2V0ICsgMTYpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nLnN1YnN0cigwLCBvZmZzZXQgKyAxOSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibXNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nLnN1YnN0cigwLCBvZmZzZXQgKyAyMyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwidHpcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5rbm93biB0YXJnZXQ6IFwiICsgdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnQgZmlsZSBzeXN0ZW0gY29tcGF0aWJsZSBzdHJpbmcgdG8gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRlIHN0cmluZyBleCkgWVlZWV9NTV9ERFRISF9tbV9zc19zc3NcclxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb252ZXJ0RmlsZVN5c3RlbVN0cmluZ1RvRGF0ZShkYXRlU3RyaW5nOiBzdHJpbmcpOiBEYXRlIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZVZhbHVlID0gdGhpcy5jb252ZXJ0RmlsZVN5c3RlbVN0cmluZ1RvRGF0ZVZhbHVlKGRhdGVTdHJpbmcpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZVZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnQgZGF0ZSBvYmplY3QgaW50byBzdHJpbmcgaW4gZmlsZSBzeXN0ZW0gY29tcGF0aWJsZSBmb3JtYXQgKFlZWVlfTU1fRERUSEhfbW1fc3Nfc3NzKVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGUgICB7RGF0ZX0gICBbaW5dIGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHRhcmdldCB7U3RyaW5nfSBbaW5dIHsgeWVhciB8IG1vbnRoIHwgZGF0ZSB8IG1pbiB8IHNlYyB8IG1zZWMgfVxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gZmlsZSBzeXN0ZW0gY29tcGF0aWJsZSBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnZlcnREYXRlVG9GaWxlU3lzdGVtU3RyaW5nKGRhdGU6IERhdGUsIHRhcmdldDogc3RyaW5nID0gXCJtc2VjXCIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBpc29EYXRlU3RyaW5nID0gRGF0ZVRpbWUuY29udmVydERhdGVUb0lTT1N0cmluZyhkYXRlLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlU3lzdGVtU3RyaW5nID0gaXNvRGF0ZVN0cmluZy5yZXBsYWNlKC9bLTouXS9nLCBcIl9cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBJU08gc3RyaW5nIHRvIHZhbHVlIG9mIGRhdGUgKG1pbGxpc2Vjb25kcylcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBpc29TdHJpbmcge1N0cmluZ30gW2luXSBkYXRlIHN0cmluZ1xyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0gdmFsdWUgb2YgZGF0ZSAobXMpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgY29udmVydElTT1N0cmluZ1RvRGF0ZVZhbHVlKGlzb1N0cmluZzogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgY29uc3QgcmVZZWFyID0gLyhcXGR7NH18Wy0rXVxcZHs2fSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZU1vbnRoID0gLyhcXGR7Mn0pLztcclxuICAgICAgICAgICAgY29uc3QgcmVEYXkgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZURhdGUgPSBuZXcgUmVnRXhwKGAke3JlWWVhci5zb3VyY2V9KD86LSR7cmVNb250aC5zb3VyY2V9KD86LSR7cmVEYXkuc291cmNlfSkqKSpgKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlSG91cnMgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZU1pbnV0ZXMgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZVNlY29uZHMgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZU1zID0gLyhcXGR7M30pLztcclxuICAgICAgICAgICAgY29uc3QgcmVUaW1lID0gbmV3IFJlZ0V4cChgVCR7cmVIb3Vycy5zb3VyY2V9OiR7cmVNaW51dGVzLnNvdXJjZX0oPzo6JHtyZVNlY29uZHMuc291cmNlfSg/OlxcLiR7cmVNcy5zb3VyY2V9KSopKmApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVUeiAgPSAvKFp8Wy0rXVxcZHsyfTpcXGR7Mn0pLztcclxuICAgICAgICAgICAgY29uc3QgcmVJU09TdHJpbmcgPSBuZXcgUmVnRXhwKGBeJHtyZURhdGUuc291cmNlfSg/OiR7cmVUaW1lLnNvdXJjZX0oPzoke3JlVHouc291cmNlfSkqKSokYCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSByZUlTT1N0cmluZy5leGVjKGlzb1N0cmluZyk7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgLy8gaW52YWxpZCBJU08gc3RyaW5nXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTmFOO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB5ZWFyID0gcGFyc2VJbnQocmVzdWx0WzFdLCAxMCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gcGFyc2VJbnQocmVzdWx0WzJdLCAxMCkgLSAxIHx8IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBwYXJzZUludChyZXN1bHRbM10sIDEwKSB8fCAxO1xyXG4gICAgICAgICAgICBsZXQgaG91cnMgPSBwYXJzZUludChyZXN1bHRbNF0sIDEwKSB8fCAwO1xyXG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IHBhcnNlSW50KHJlc3VsdFs1XSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZHMgPSBwYXJzZUludChyZXN1bHRbNl0sIDEwKSB8fCAwO1xyXG4gICAgICAgICAgICBjb25zdCBtcyA9IHBhcnNlSW50KHJlc3VsdFs3XSwgMTApIHx8IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzdWx0WzhdKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aW1lem9uZSBvZmZzZXRcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAocmVzdWx0WzhdWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlpcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIi1cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gLUhIOm1tXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXJzICs9IHBhcnNlSW50KHJlc3VsdFs4XS5zdWJzdHIoMSwgMiksIDEwKSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW51dGVzICs9IHBhcnNlSW50KHJlc3VsdFs4XS5zdWJzdHIoNCwgMiksIDEwKSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiK1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyArSEg6bW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaG91cnMgLT0gcGFyc2VJbnQocmVzdWx0WzhdLnN1YnN0cigxLCAyKSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbnV0ZXMgLT0gcGFyc2VJbnQocmVzdWx0WzhdLnN1YnN0cig0LCAyKSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImludmFsaWQgdGltZXpvbmUgaW4gSVNPIHN0cmluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIERhdGUuVVRDKHllYXIsIG1vbnRoLCBkYXRlLCBob3VycywgbWludXRlcywgc2Vjb25kcywgbXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIHN0cmluZyB0byB0byB2YWx1ZSBvZiBkYXRlIChtaWxsaXNlY29uZHMpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGF0ZVN0cmluZyB7U3RyaW5nfSBbaW5dIGRhdGUgc3RyaW5nIChZWVlZX01NX0REVEhIX21tX3NzX3NzcylcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IGNvbnZlcnRlZCBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBjb252ZXJ0RmlsZVN5c3RlbVN0cmluZ1RvRGF0ZVZhbHVlKGRhdGVTdHJpbmc6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlWWVhciA9IC8oXFxkezR9fFstK11cXGR7Nn0pLztcclxuICAgICAgICAgICAgY29uc3QgcmVNb250aCA9IC8oXFxkezJ9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlRGF5ID0gLyhcXGR7Mn0pLztcclxuICAgICAgICAgICAgY29uc3QgcmVEYXRlID0gbmV3IFJlZ0V4cChgJHtyZVllYXIuc291cmNlfSg/Ol8ke3JlTW9udGguc291cmNlfSg/Ol8ke3JlRGF5LnNvdXJjZX0pPyk/YCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZUhvdXJzID0gLyhcXGR7Mn0pLztcclxuICAgICAgICAgICAgY29uc3QgcmVNaW51dGVzID0gLyhcXGR7Mn0pLztcclxuICAgICAgICAgICAgY29uc3QgcmVTZWNvbmRzID0gLyhcXGR7Mn0pLztcclxuICAgICAgICAgICAgY29uc3QgcmVNcyA9IC8oXFxkezN9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlVGltZSA9IG5ldyBSZWdFeHAoYFQke3JlSG91cnMuc291cmNlfV8ke3JlTWludXRlcy5zb3VyY2V9KD86XyR7cmVTZWNvbmRzLnNvdXJjZX0oPzpfJHtyZU1zLnNvdXJjZX0pPyk/YCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZUZpbGVTeXN0ZW1TdHJpbmcgPSBuZXcgUmVnRXhwKGBeJHtyZURhdGUuc291cmNlfSg/OiR7cmVUaW1lLnNvdXJjZX0pKiRgKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlRmlsZVN5c3RlbVN0cmluZy5leGVjKGRhdGVTdHJpbmcpO1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGludmFsaWQgZmlsZSBzeXN0ZW0gc3RyaW5nXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTmFOO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB5ZWFyID0gcGFyc2VJbnQocmVzdWx0WzFdLCAxMCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gcGFyc2VJbnQocmVzdWx0WzJdLCAxMCkgLSAxIHx8IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBwYXJzZUludChyZXN1bHRbM10sIDEwKSB8fCAxO1xyXG4gICAgICAgICAgICBjb25zdCBob3VycyA9IHBhcnNlSW50KHJlc3VsdFs0XSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBwYXJzZUludChyZXN1bHRbNV0sIDEwKSB8fCAwO1xyXG4gICAgICAgICAgICBjb25zdCBzZWNvbmRzID0gcGFyc2VJbnQocmVzdWx0WzZdLCAxMCkgfHwgMDtcclxuICAgICAgICAgICAgY29uc3QgbXMgPSBwYXJzZUludChyZXN1bHRbN10sIDEwKSB8fCAwO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIERhdGUuVVRDKHllYXIsIG1vbnRoLCBkYXRlLCBob3VycywgbWludXRlcywgc2Vjb25kcywgbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cImpxdWVyeVwiIC8+XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuVGVtcGxhdGVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBKU1RcclxuICAgICAqIEBicmllZiDjgrPjg7Pjg5HjgqTjg6vmuIjjgb8g44OG44Oz44OX44Os44O844OI5qC857SN44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSlNUIHtcclxuICAgICAgICAoZGF0YT86IGFueSk6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFRlbXBsYXRlXHJcbiAgICAgKiBAYnJpZWYgdGVtcGxhdGUgc2NyaXB0IOOCkueuoeeQhuOBmeOCi+ODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgVGVtcGxhdGUge1xyXG5cclxuICAgICAgICBzdGF0aWMgX21hcEVsZW1lbnQ6IGFueTsgICAgLy8hPCDjgq3jg7zjgaggSlF1ZXJ5IEVsZW1lbnQg44GuIE1hcCDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICBzdGF0aWMgX21hcFNvdXJjZTogYW55OyAgICAgLy8hPCBVUkwg44GoIOOCveODvOOCueODleOCoeOCpOODqyhIVE1MKSDjga4gTWFwIOOCquODluOCuOOCp+OCr+ODiFxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIOWFrOmWi+ODoeOCveODg+ODiVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmjIflrprjgZfjgZ8gaWQsIGNsYXNzIOWQjSwgVGFnIOWQjeOCkuOCreODvOOBq+ODhuODs+ODl+ODrOODvOODiOOBriBKUXVlcnkgRWxlbWVudCDjgpLlj5blvpfjgZnjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAga2V5ICAgICBbaW5dIGlkLCBjbGFzcywgdGFnIOOCkuihqOOBmeaWh+Wtl+WIl1xyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NyY10gICBbaW5dIOWklumDqCBodG1sIOOCkuaMh+WumuOBmeOCi+WgtOWQiOOBryB1cmwg44KS6Kit5a6aXHJcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBbY2FjaGVdIFtpbl0gc3JjIGh0bWwg44KS44Kt44Oj44OD44K344Ol44GZ44KL5aC05ZCI44GvIHRydWUuIHNyYyDjgYzmjIflrprjgZXjgozjgabjgYTjgovjgajjgY3jga7jgb/mnInlirlcclxuICAgICAgICAgKiBAcmV0dXJuIHRlbXBsYXRlIOOBjOagvOe0jeOBleOCjOOBpuOBhOOCiyBKUXVlcnkgRWxlbWVudFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBnZXRUZW1wbGF0ZUVsZW1lbnQoa2V5OiBzdHJpbmcsIHNyYzogc3RyaW5nID0gbnVsbCwgY2FjaGU6IGJvb2xlYW4gPSB0cnVlKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgY29uc3QgbWFwRWxlbWVudCA9IFRlbXBsYXRlLmdldEVsZW1lbnRNYXAoKTtcclxuICAgICAgICAgICAgbGV0ICRlbGVtZW50ID0gbWFwRWxlbWVudFtrZXldO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmICghJGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3JjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBUZW1wbGF0ZS5maW5kSHRtbEZyb21Tb3VyY2Uoc3JjKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQgPSAkKGh0bWwpLmZpbmQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudCA9ICQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6KaB57Sg44Gu5qSc6Ki8XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRlbGVtZW50IDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgKFwiaW52YWxpZCBba2V5LCBzcmNdID0gW1wiICsga2V5ICsgXCIsIFwiICsgc3JjICsgXCJdXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3JjICYmIGNhY2hlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcEVsZW1lbnRba2V5XSA9ICRlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIGV4Y2VwdGlvbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRlbGVtZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWFwIOOCquODluOCuOOCp+OCr+ODiOOBruWJiumZpFxyXG4gICAgICAgICAqIOaYjuekuueahOOBq+OCreODo+ODg+OCt+ODpeOCkumWi+aUvuOBmeOCi+WgtOWQiOOBr+acrOODoeOCveODg+ODieOCkuOCs+ODvOODq+OBmeOCi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBlbXB0eSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgVGVtcGxhdGUuX21hcEVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICBUZW1wbGF0ZS5fbWFwU291cmNlID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBnyBpZCwgY2xhc3Mg5ZCNLCBUYWcg5ZCN44KS44Kt44O844GrIEpTVCDjgpLlj5blvpfjgZnjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nIHwgalF1ZXJ5fSBrZXkgICAgIFtpbl0gaWQsIGNsYXNzLCB0YWcg44KS6KGo44GZ5paH5a2X5YiXIOOBvuOBn+OBryDjg4bjg7Pjg5fjg6zjg7zjg4jmloflrZfliJcsIOOBvuOBn+OBryBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgIFtzcmNdICAgW2luXSDlpJbpg6ggaHRtbCDjgpLmjIflrprjgZnjgovloLTlkIjjga8gdXJsIOOCkuioreWumlxyXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gICAgICAgICBbY2FjaGVdIFtpbl0gc3JjIGh0bWwg44KS44Kt44Oj44OD44K344Ol44GZ44KL5aC05ZCI44GvIHRydWUuIHNyYyDjgYzmjIflrprjgZXjgozjgabjgYTjgovjgajjgY3jga7jgb/mnInlirlcclxuICAgICAgICAgKiBAcmV0dXJuIOOCs+ODs+ODkeOCpOODq+OBleOCjOOBnyBKU1Qg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGdldEpTVChrZXk6IEpRdWVyeSk6IEpTVDtcclxuICAgICAgICBzdGF0aWMgZ2V0SlNUKGtleTogc3RyaW5nLCBzcmM/OiBzdHJpbmcsIGNhY2hlPzogYm9vbGVhbik6IEpTVDtcclxuICAgICAgICBzdGF0aWMgZ2V0SlNUKGtleTogYW55LCBzcmM/OiBzdHJpbmcsIGNhY2hlPzogYm9vbGVhbik6IEpTVCB7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZTogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGpzdDogSlNUO1xyXG4gICAgICAgICAgICBsZXQgJGVsZW1lbnQ6IEpRdWVyeTtcclxuICAgICAgICAgICAgaWYgKGtleSBpbnN0YW5jZW9mIGpRdWVyeSkge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQgPSBrZXk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbWVudCA9IFRlbXBsYXRlLmdldFRlbXBsYXRlRWxlbWVudChrZXksIHNyYywgY2FjaGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IGdsb2JhbC5Ib2dhbikge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBIb2dhbi5jb21waWxlKCRlbGVtZW50LnRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICBqc3QgPSBmdW5jdGlvbiAoZGF0YT86IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlLnJlbmRlcihkYXRhKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobnVsbCAhPSBnbG9iYWwuXykge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBfLnRlbXBsYXRlKCRlbGVtZW50Lmh0bWwoKSk7XHJcbiAgICAgICAgICAgICAgICBqc3QgPSBmdW5jdGlvbiAoZGF0YT86IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5pS56KGM44Go44K/44OW44Gv5YmK6Zmk44GZ44KLXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlKGRhdGEpLnJlcGxhY2UoL1xcbnxcXHQvZywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiY2Fubm90IGZpbmQgdGVtcGxhdGUgZW5naW5lIG1vZHVsZS5cIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCIgICAgJ2hvZ2FuJyBvciAndW5kZXJzY29yZScgaXMgcmVxdWlyZWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBqc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIOWGhemDqOODoeOCveODg+ODiVxyXG5cclxuICAgICAgICAvLyEgRWxlbWVudCBNYXAg44Kq44OW44K444Kn44Kv44OI44Gu5Y+W5b6XXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZ2V0RWxlbWVudE1hcCgpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIVRlbXBsYXRlLl9tYXBFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBUZW1wbGF0ZS5fbWFwRWxlbWVudCA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBUZW1wbGF0ZS5fbWFwRWxlbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBVUkwgTWFwIOOCquODluOCuOOCp+OCr+ODiOOBruWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGdldFNvdXJjZU1hcCgpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIVRlbXBsYXRlLl9tYXBTb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIFRlbXBsYXRlLl9tYXBTb3VyY2UgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVGVtcGxhdGUuX21hcFNvdXJjZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBVUkwgTWFwIOOBi+OCiSBIVE1MIOOCkuaknOe0oi4g5aSx5pWX44GX44Gf5aC05ZCI44GvIHVuZGVmaW5lZCDjgYzov5TjgotcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBmaW5kSHRtbEZyb21Tb3VyY2Uoc3JjOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBtYXBTb3VyY2UgPSBUZW1wbGF0ZS5nZXRTb3VyY2VNYXAoKTtcclxuICAgICAgICAgICAgbGV0IGh0bWwgPSBtYXBTb3VyY2Vbc3JjXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IChkYXRhOiBhbnksIHN0YXR1czogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IChcImFqYXggcmVxdWVzdCBmYWlsZWQuIHN0YXR1czogXCIgKyBzdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8g44Kt44Oj44OD44K344Ol44Gr5qC857SNXHJcbiAgICAgICAgICAgICAgICBtYXBTb3VyY2Vbc3JjXSA9IGh0bWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5Qcm9ncmVzc0NvdW50ZXJdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQcm9ncmVzc0NvdW50ZXJPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUHJvZ3Jlc3NDb3VudGVyIOOBq+aMh+WumuOBmeOCi+OCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFByb2dyZXNzQ291bnRlck9wdGlvbnMge1xyXG4gICAgICAgIG1heD86IG51bWJlcjsgICAgICAgICAgICAgICAgICAgICAgIC8vIOmAsuaNl+WApOOBruacgOWkp+WApCDml6Llrpo6IDEwMFxyXG4gICAgICAgIGFsbG93SW5jcmVtZW50UmVtYWluPzogYm9vbGVhbjsgICAgIC8vIOaui+OCiuaOqOWumuaZgumWk+OBjOWil+OBiOOBpuOCiOOBhOWgtOWQiOOBq+OBryB0cnVlIOaXouWumjogZmFsc2VcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUHJvZ3Jlc3NDb3VudGVyUmVzdWx0XHJcbiAgICAgKiBAYnJpZWYg6YCy5o2X44Gu5pmC6ZaT44KS5oyB44Gk44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKiAgICAgICAg5Y2Y5L2N44GvIFttc2VjXVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFByb2dyZXNzQ291bnRlclJlc3VsdCB7XHJcbiAgICAgICAgcGFzc1RpbWU6IG51bWJlcjsgICAgICAgLy8g57WM6YGO5pmC6ZaTXHJcbiAgICAgICAgcmVtYWluVGltZTogbnVtYmVyOyAgICAgLy8g5q6L44KK5o6o5a6a5pmC6ZaTXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgUHJvZ3Jlc3NDb3VudGVyXHJcbiAgICAgKiBAYnJpZWYg6YCy5o2X44Gu5pmC6ZaT44KS5omx44GG44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQcm9ncmVzc0NvdW50ZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9zZXR0aW5nczoge1xyXG4gICAgICAgICAgICBtYXg6IG51bWJlcjtcclxuICAgICAgICAgICAgYmVnaW5UaW1lOiBudW1iZXI7XHJcbiAgICAgICAgICAgIGFsbG93SW5jcmVtZW50UmVtYWluOiBib29sZWFuO1xyXG4gICAgICAgICAgICBsYXN0UmVtYWluVGltZTogbnVtYmVyO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gW29wdGlvbnNdIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBQcm9ncmVzc0NvdW50ZXJPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXQob3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDplovlp4vmmYLplpPjgpLliJ3mnJ/ljJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgcmVzZXQob3B0aW9ucz86IFByb2dyZXNzQ291bnRlck9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4OiAxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgYmVnaW5UaW1lOiBEYXRlLm5vdygpLFxyXG4gICAgICAgICAgICAgICAgICAgIGFsbG93SW5jcmVtZW50UmVtYWluOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBsYXN0UmVtYWluVGltZTogSW5maW5pdHksXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAsIC4uLjxhbnk+b3B0aW9uc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog57WM6YGO5pmC6ZaT44Go5o6o5a6a5q6L44KK5pmC6ZaT44KS5Y+W5b6X44GZ44KLXHJcbiAgICAgICAgICog6YCy5o2X5YCk44GMIDAg44Gu5aC05ZCI44Gv44CB5o6o5a6a5q6L44KK5pmC6ZaT44GrIEluZmluaXR5IOOCkui/lOOBmVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICAgcHJvZ3Jlc3MgW2luXSDpgLLmjZflgKRcclxuICAgICAgICAgKiBAcmV0dXJucyDntYzpgY7mmYLplpPjgajmjqjlrprmrovjgormmYLplpMgW21zZWNdXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNvbXB1dGUocHJvZ3Jlc3M6IG51bWJlcik6IFByb2dyZXNzQ291bnRlclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhc3NUaW1lID0gRGF0ZS5ub3coKSAtIHRoaXMuX3NldHRpbmdzLmJlZ2luVGltZTtcclxuICAgICAgICAgICAgbGV0IHJlbWFpblRpbWUgPSBJbmZpbml0eTtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gcHJvZ3Jlc3MgJiYgMCAhPT0gcHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgICAgIHJlbWFpblRpbWUgPSBwYXNzVGltZSAqIHRoaXMuX3NldHRpbmdzLm1heCAvIHByb2dyZXNzIC0gcGFzc1RpbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmFsbG93SW5jcmVtZW50UmVtYWluIHx8IChyZW1haW5UaW1lIDwgdGhpcy5fc2V0dGluZ3MubGFzdFJlbWFpblRpbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy5sYXN0UmVtYWluVGltZSA9IHJlbWFpblRpbWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZW1haW5UaW1lID0gdGhpcy5fc2V0dGluZ3MubGFzdFJlbWFpblRpbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7IHBhc3NUaW1lLCByZW1haW5UaW1lIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImRlY2xhcmUgbW9kdWxlIFwiY2RwLnRvb2xzXCIge1xyXG4gICAgY29uc3QgVG9vbHM6IHR5cGVvZiBDRFAuVG9vbHM7XHJcbiAgICBleHBvcnQgPSBUb29scztcclxufVxyXG4iXX0=