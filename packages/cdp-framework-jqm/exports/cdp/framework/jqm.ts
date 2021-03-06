﻿import * as Backbone from "backbone";
import _framework = require("cdp.framework.jqm");

// @module Platform
export const Platform = _framework.Platform;

// Framework methods
export const getOrientation                 = _framework.getOrientation;
export const toUrl                          = _framework.toUrl;
export const setBeforeRouteChangeHandler    = _framework.setBeforeRouteChangeHandler;

// @class Router
export type  Router = CDP.Framework.Router;
export const Router = _framework.Router;

// Framework Core APIs
export const initialize                             = _framework.initialize;
export const isInitialized                          = _framework.isInitialized;
export const waitForInitialize                      = _framework.waitForInitialize;
export const registerOrientationChangedListener     = _framework.registerOrientationChangedListener;
export const unregisterOrientationChangedListener   = _framework.unregisterOrientationChangedListener;
export const getDefaultClickEvent                   = _framework.getDefaultClickEvent;
export const registerPage                           = _framework.registerPage;
export const constructPages                         = _framework.constructPages;
export const disposePages                           = _framework.disposePages;
export const setBackButtonHandler                   = CDP.setBackButtonHandler;

// @class Page
export type  Page = CDP.Framework.Page;
export const Page = _framework.Page;

// interfaces
export type  Model                                      = Backbone.Model;
export const Model                                      = _framework.Model;
export type  Collection<TModel extends Model>           = Backbone.Collection<TModel>;
export const Collection                                 = _framework.Collection;
export type  View<TModel extends Model = Model>         = Backbone.View<TModel>;
export const View                                       = _framework.View;
export type  Events                                     = Backbone.Events;
export const Events                                     = _framework.Events;
export type  ModelSetOptions                            = CDP.Framework.ModelSetOptions;
export type  ModelFetchOptions                          = CDP.Framework.ModelFetchOptions;
export type  ModelSaveOptions                           = CDP.Framework.ModelSaveOptions;
export type  ModelDestroyOptions                        = CDP.Framework.ModelDestroyOptions;
export type  ViewOptions<TModel extends Model = Model>  = CDP.Framework.ViewOptions<TModel>;
export type  Orientation                                = CDP.Framework.Orientation;
export const Orientation                                = _framework.Orientation;
export type  PageTransitionDirection                    = CDP.Framework.PageTransitionDirection;
export type  Intent                                     = CDP.Framework.Intent;
export type  PageStack                                  = CDP.Framework.PageStack;
export type  SubFlowParam                               = CDP.Framework.SubFlowParam;
export type  RouterOptions                              = CDP.Framework.RouterOptions;
export type  NavigateOptions                            = CDP.Framework.NavigateOptions;
export type  IOrientationChangedListener                = CDP.Framework.IOrientationChangedListener;
export type  IBackButtonEventListener                   = CDP.Framework.IBackButtonEventListener;
export type  ICommandListener                           = CDP.Framework.ICommandListener;
export type  PageConstructOptions                       = CDP.Framework.PageConstructOptions;
export type  IPage                                      = CDP.Framework.IPage;
export type  ShowEventData                              = CDP.Framework.ShowEventData;
export type  HideEventData                              = CDP.Framework.HideEventData;
export type  FrameworkOptions                           = CDP.Framework.FrameworkOptions;
