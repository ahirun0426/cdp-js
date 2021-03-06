﻿import { Router } from "cdp/framework";
import {
    PageView,
    Toast,
    registerPage,
} from "cdp/ui";

const TAG = "[view.link-sample.StackManageView] ";

/**
 * @class StackManageView
 * @brief ページスタック管理の確認クラス
 */
class StackManageView extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/link-sample/link-stack-manage.html",
            "link-stack-manage",
            {
                route: "link-stack-manage(/:query)"
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    /**
     * イベントハンドラのマッピング。
     * CSS セレクタにマッチした要素にイベントハンドラを自動でセットされる。
     */
    events(): any {
        return {
            "vclick .command-stack-manage": this.onCommandStartStackManage,
        };
    }

    // 描画
    render(): PageView {
        return this;
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    private onCommandStartStackManage(event: JQuery.Event): void {
        Toast.show("onCommandStartStackManage");
        const test = [
            { route: "#views/backbone",      transition: "turn",         },
            { route: "#views/page",          transition: "slide",        },
            { route: "#views/page-owner",    transition: "slidefade",    },
            { route: "#views/page-view",     transition: "floatup",      },
            { route: "#gallery",             transition: "flow",         },
        ];
        Router.registerPageStack(test, true);
    }
}

registerPage(StackManageView);
