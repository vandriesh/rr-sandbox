import {type RouteConfig, index, route, layout} from "@react-router/dev/routes";

export default [
    layout("routes/home.tsx", [
        route("dashboard", "routes/dashboard.tsx"),
        route("team", "routes/team.tsx"),
    ]),
] satisfies RouteConfig;
