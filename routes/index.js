const nextRoutes = require("next-routes");
const routes = (module.exports = nextRoutes());

routes.add("index", "/");
routes.add("about", "/about");
routes.add("account", "/user/:id");
routes.add("sign_in", "/signin");
