const nextRoutes = require("next-routes");
const routes = (module.exports = nextRoutes());

routes.add("index", "/");
routes.add("items", "/items");
routes.add("account", "/user/:id");
routes.add("signin", "/signin");
routes.add("signup", "/signup");
