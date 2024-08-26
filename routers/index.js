const routers = require("express").Router();
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const publicController = require("../controllers/publicController");
const { isLoggedIn, isNotLoggedIn, isAdmin } = require("../middlewares/auth");

// Public routes
routers.get("/", publicController.landingPage);
routers.get("/home", publicController.homePage);

// Registration and login
routers.get("/register", isNotLoggedIn, userController.registerForm);
routers.post("/register", isNotLoggedIn, userController.handleRegister);
routers.get("/login", isNotLoggedIn, userController.loginForm);
routers.post("/login", isNotLoggedIn, userController.handleLogin);

// Admin routes
routers.get("/admin/user", isAdmin, adminController.adminDashboardUser);
routers.get("/admin/post", isAdmin, adminController.adminDashboardPost);
routers.get("/admin/suspend/:userId", isAdmin, adminController.suspend);
routers.delete("/delete/:postId", adminController.handleDelete);

routers.use(isLoggedIn);

// User routes
routers.get("/suspended", userController.handleSuspend);
routers.get("/user/:userId/profile", userController.userProfile);
routers.get("/user/:userId/profile/setup", userController.profileSetup);
routers.post("/user/:userId/profile/setup", userController.handleSetup);

routers.get("/user/:userId/profile/edit", userController.profileEdit);
routers.put("/user/:userId/profile/edit", userController.handleEdit);

routers.get("/post/:profileId", userController.postContent);
routers.post("/post/:profileId", userController.handlePost);
routers.get("/post/:postId/detail", userController.postDetail);
routers.get("/like/:PostId", userController.handleLike);
routers.get("/logout", userController.logout);
routers.get("/post/:postId/delete", userController.deletePost);

module.exports = routers;
