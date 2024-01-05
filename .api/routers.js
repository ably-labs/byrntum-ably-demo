
// Imports
import * as _0_0 from "//Users/tomcamp/Documents/GitHub/bryntum-ably-scheduler/byrntum-ably-demo/src/api/ably/token.js";
import * as _0_1 from "//Users/tomcamp/Documents/GitHub/bryntum-ably-scheduler/byrntum-ably-demo/src/api/state.js";
import * as configure from "@api/configure";

export const routeBase = "/api";

const internal  = [
  _0_0.default && {
        source     : "src/api/ably/token.js?fn=default",
        method     : "use",
        route      : "/ably/token",
        path       : "/api/ably/token",
        url        : "/api/ably/token",
        cb         : _0_0.default,
      },
  _0_0.GET && {
        source     : "src/api/ably/token.js?fn=GET",
        method     : "get",
        route      : "/ably/token",
        path       : "/api/ably/token",
        url        : "/api/ably/token",
        cb         : _0_0.GET,
      },
  _0_0.PUT && {
        source     : "src/api/ably/token.js?fn=PUT",
        method     : "put",
        route      : "/ably/token",
        path       : "/api/ably/token",
        url        : "/api/ably/token",
        cb         : _0_0.PUT,
      },
  _0_0.POST && {
        source     : "src/api/ably/token.js?fn=POST",
        method     : "post",
        route      : "/ably/token",
        path       : "/api/ably/token",
        url        : "/api/ably/token",
        cb         : _0_0.POST,
      },
  _0_0.PATCH && {
        source     : "src/api/ably/token.js?fn=PATCH",
        method     : "patch",
        route      : "/ably/token",
        path       : "/api/ably/token",
        url        : "/api/ably/token",
        cb         : _0_0.PATCH,
      },
  _0_0.DELETE && {
        source     : "src/api/ably/token.js?fn=DELETE",
        method     : "delete",
        route      : "/ably/token",
        path       : "/api/ably/token",
        url        : "/api/ably/token",
        cb         : _0_0.DELETE,
      },
  _0_1.default && {
        source     : "src/api/state.js?fn=default",
        method     : "use",
        route      : "/state",
        path       : "/api/state",
        url        : "/api/state",
        cb         : _0_1.default,
      },
  _0_1.GET && {
        source     : "src/api/state.js?fn=GET",
        method     : "get",
        route      : "/state",
        path       : "/api/state",
        url        : "/api/state",
        cb         : _0_1.GET,
      },
  _0_1.PUT && {
        source     : "src/api/state.js?fn=PUT",
        method     : "put",
        route      : "/state",
        path       : "/api/state",
        url        : "/api/state",
        cb         : _0_1.PUT,
      },
  _0_1.POST && {
        source     : "src/api/state.js?fn=POST",
        method     : "post",
        route      : "/state",
        path       : "/api/state",
        url        : "/api/state",
        cb         : _0_1.POST,
      },
  _0_1.PATCH && {
        source     : "src/api/state.js?fn=PATCH",
        method     : "patch",
        route      : "/state",
        path       : "/api/state",
        url        : "/api/state",
        cb         : _0_1.PATCH,
      },
  _0_1.DELETE && {
        source     : "src/api/state.js?fn=DELETE",
        method     : "delete",
        route      : "/state",
        path       : "/api/state",
        url        : "/api/state",
        cb         : _0_1.DELETE,
      }
].filter(it => it);

export const routers = internal.map((it) => {
  const { method, path, route, url, source } = it;
  return { method, url, path, route, source };
});

export const endpoints = internal.map(
  (it) => it.method?.toUpperCase() + "\t" + it.url
);

export const applyRouters = (applyRouter) => {
  internal.forEach((it) => {
    it.cb = configure.callbackBefore?.(it.cb, it) || it.cb;
    applyRouter(it);
  });
};

