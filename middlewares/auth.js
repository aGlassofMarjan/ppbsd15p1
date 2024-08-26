const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    const err = "Please login";
    return res.redirect(`/login?error=${err}`);
  }
};

const isNotLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return res.redirect(req.session.isAdmin ? "/admin/user" : "/home");
  } else {
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.redirect("/user/home");
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  isNotLoggedIn,
  isAdmin,
};
