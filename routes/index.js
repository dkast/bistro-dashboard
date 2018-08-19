const nextRoutes = require("next-routes");
const routes = (module.exports = nextRoutes());

routes.add("index", "/");
routes.add("items", "/items/library");
routes.add("item-detail", "/items/library/:id", "itemDetail");
routes.add("categories", "items/categories");
routes.add("account", "/user/:id");
routes.add("sign-in", "/signin", "signin");
routes.add("sign-up", "/signup", "signup");
