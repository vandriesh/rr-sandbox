import {type RouteConfig, index, route, layout} from "@react-router/dev/routes";

export default [
    layout("routes/home.tsx", [
        route("apps-discovery", "routes/apps-discovery.tsx"),
        route("apps-inventory", "routes/apps-inventory.tsx"),
        route("settings", "routes/settings.tsx"),
    ]),
] satisfies RouteConfig;
