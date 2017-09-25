﻿/*!
 * cdp.core.d.ts
 * This file is generated by the CDP package build process.
 *
 * Date: 2017-09-25T02:40:24.604Z
 */
declare namespace CDP {
    /**
     * @en Accessor for system global object.<br>
     *     It'll be usually a `window` object.
     * @ja システムの global オブジェクトへのアクセス<br>
     *     通常は `window` オブジェクトとなる
     */
    const global: any;
    /**
     * @en Accsessor for Web root location <br>
     *     Only the browser environment will be an allocating place in index.html, and becomes effective.
     * @ja Web root location へのアクセス <br>
     *     index.html の配置場所となり、ブラウザ環境のみ有効となる.
     */
    const webRoot: string;
    /**
     * @en Converter from relative path to absolute url string. <br>
     *     If you want to access to Assets and in spite of the script location, the function is available.
     * @ja 相対 path を絶対 URL に変換 <br>
     *     js の配置に依存することなく `assets` アクセスしたいときに使用する.
     *
     * @see https://stackoverflow.com/questions/2188218/relative-paths-in-javascript-in-an-external-file
     *
     * @example <br>
     *
     * ```ts
     *  console.log(toUrl("/res/data/collection.json"));
     *  // "http://localhost:8080/app/res/data/collection.json"
     * ```
     *
     * @param path
     *  - `en` set relative path from [[webRoot]].
     *  - `ja` [[webRoot]] からの相対パスを指定
     * @returns url string
     *  - `en` set relative path from [[webRoot]].
     *  - `ja` [[webRoot]] からの相対パスを指定
     */
    function toUrl(path: string): string;
    /**
     * @en Accessor for global Config object.
     * @ja Config オブジェクトへのアクセス
     */
    const Config: any;
    /**
     * @en Options interface for this module initialize.
     * @ja 初期化オプションインターフェイス
     */
    interface CoreInitOptions {
        success?: () => void;
        fail?: (error?: any) => void;
        [key: string]: any;
    }
    /**
     * @en Initialize function for `cdp-core`. <br>
     *     This function applies patch to the run time environment.
     * @ja `cdp-core` の初期化関数<br>
     *     環境の差分を吸収する patch を適用する.
     */
    function initialize(options?: CoreInitOptions): void;
}
declare module "cdp.core" {
    export = CDP;
}
declare namespace CDP {
    /**
     * @en Utility class for appling the patch to the run time environment.
     * @ja 実行環境用 Patch 適用ユーティリティクラス
     *
     * @internal
     */
    class Patch {
        /**
         * @en Apply the patch
         * @ja パッチの適用
         *
         * @internal
         */
        static apply(): void;
        private static consolePatch();
        private static nodePatch();
    }
}
declare namespace CDP {
    /**
     * @en Common error code for the application.
     * @ja アプリケーション全体で使用する共通エラーコード定義
     */
    enum RESULT_CODE {
        /** `en` general success code <br> `ja` 汎用成功コード        */
        SUCCEEDED = 0,
        /** `en` general cancel code  <br> `ja` 汎用キャンセルコード  */
        CANCELED = 1,
        /** `en` general error code   <br> `ja` 汎用エラーコード      */
        FAILED = -1,
    }
    /**
     * @en Error communication object.
     * @ja エラー伝達オブジェクト
     */
    interface ErrorInfo extends Error {
        /**
         * @en The numerical value that is defined the application / internal libraries.
         * @ja アプリケーション/ライブラリで定義する数値型コードを格納
         */
        code: RESULT_CODE;
        /**
         * @en Stock low-level error information.
         * @ja 下位のエラー情報を格納
         */
        cause?: Error;
    }
    /**
     * @en The assignable range for the client's local result cord by which expansion is possible.
     * @ja クライアントが拡張可能なローカルリザルトコードのアサイン可能領域
     */
    const MODULE_RESULT_CODE_RANGE = 1000;
    /**
     * @en Generate the [[ErrorInfo]] object.
     * @ja [[ErrorInfo]] オブジェクトを生成
     *
     * @example <br>
     *
     * ```ts
     *  someAsyncFunc()
     *      .then((result) => {
     *          outputMessage(result);
     *      })
     *      .catch((reason: Error) => {
     *          throw makeErrorInfo(
     *              RESULT_CODE.FAILED,
     *              TAG,
     *              "error occur.",
     *              reason  // set received error info.
     *          );
     *      });
     * ```
     *
     * @param resultCode
     *  - `en` set [[RESULT_CODE]] defined.
     *  - `ja` 定義した [[RESULT_CODE]] を指定
     * @param tag
     *  - `en` Log tag information
     *  - `ja` 識別情報
     * @param message
     *  - `en` Human readable message
     *  - `ja` メッセージを指定
     * @param cause
     *  - `en` low-level Error object
     *  - `ja` 下位のエラーを指定
     * @returns
     */
    function makeErrorInfo(resultCode: number, tag?: string, message?: string, cause?: Error): ErrorInfo;
    /**
     * @en Generate canceled error information. <br>
     *     The [[ErrorInfo]] object generated by this function has [[RESULT_CODE.CANCELED]] code.
     * @ja キャンセルエラー情報生成 <br>
     *     この関数で生成された [[ErrorInfo]] は [[RESULT_CODE.CANCELED]] を格納する
     *
     * @param tag
     *  - `en` Log tag information
     *  - `ja` 識別情報
     * @param cause
     *  - `en` low-level Error object
     *  - `ja` 下位のエラーを指定
     * @returns
     */
    function makeCanceledErrorInfo(tag?: string, cause?: Error): ErrorInfo;
    /**
     * @es Judge the error is canceled.
     * @ja エラー情報がキャンセルされたものか判定
     *
     * @example <br>
     *
     * ```ts
     *  :
     *  .catch((reason: ErrorInfo) => {
     *      if (!isCanceledError(reason)) {
     *          handleErrorInfo(reason);
     *      }
     *   });
     *  :
     * ```
     *
     * @param error
     * @returns
     *  - `en` true: canceled error / false: others
     *  - `ja` true: キャンセル / false: その他エラー
     */
    function isCanceledError(error: Error | string): boolean;
    /**
     * @es Convert from any type error information to [[ErrorInfo]] object.
     * @jp あらゆるエラー入力を [[ErrorInfo]] に変換
     */
    function ensureErrorInfo(cause?: any): ErrorInfo;
    /**
     * @internal for CDP modules assignable range.
     */
    const _MODULE_RESULT_CODE_RANGE_CDP = 100;
    /**
     * @en Offset value enumeration for [[RESULT_CODE]]. <br>
     *     The client can expand a definition in other module.
     * @ja [[RESULT_CODE]] のオフセット値 <br>
     *     エラーコード対応するモジュール内で 定義を拡張する.
     *
     * @example <br>
     *
     * ```ts
     *  export enum RESULT_CODE {
     *      ERROR_SOMEMODULE_UNEXPECTED  = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.COMMON + 1, "error unexpected."),
     *      ERROR_SOMEMODULE_INVALID_ARG = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.COMMON + 2, "invalid arguments."),
     *  }
     *  ASSIGN_RESULT_CODE(RESULT_CODE);
     * ```
     */
    enum RESULT_CODE_BASE {
        CDP_DECLARERATION = 0,
        CDP,
    }
    /**
     * @en Generate success code.
     * @ja 成功コードを生成
     *
     * @param base
     * @param localCode
     * @param message
     */
    function DECLARE_SUCCESS_CODE(base: number | string, localCode: number, message?: string): number;
    /**
     * @en Generate error code.
     * @ja エラーコード生成
     *
     * @param base
     * @param localCode
     * @param message
     */
    function DECLARE_ERROR_CODE(base: number | string, localCode: number, message?: string): number;
    /**
     * @en Judge success or not.
     * @ja 成功判定
     *
     * @param code
     */
    function SUCCEEDED(code: number): boolean;
    /**
     * @en Judge error or not.
     * @ja 失敗判定
     *
     * @param code
     */
    function FAILED(code: number): boolean;
    /**
     * @en Assign declared [[RESULT_CODE_BASE]] to root enumeration.<br>
     *     (It's necessary also to merge enum in the module system environment.)
     * @ja 拡張した [[RESULT_CODE_BASE]] を ルート enum にアサイン<br>
     *     モジュールシステム環境においても、enum をマージするために必要
     */
    function ASSIGN_RESULT_CODE_BASE(resultCodeBase: object): void;
    /**
     * @en Assign declared [[ASSIGN_RESULT_CODE]] to root enumeration.
     *     (It's necessary also to merge enum in the module system environment.)
     * @ja 拡張した [[ASSIGN_RESULT_CODE]] を ルート enum にアサイン
     *     モジュールシステム環境においても、enum をマージするために必要
     */
    function ASSIGN_RESULT_CODE(resultCode: object): void;
    enum RESULT_CODE {
        ERROR_CDP_DECLARATION_CDP = 0,
        /** `en` [[CDP.initialize]]() failer code. <br> `ja` [[CDP.initialize]]() のエラーコード */
        ERROR_CDP_INITIALIZE_FAILED,
    }
}
