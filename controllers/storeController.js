const myMiddleware = (req, res, next) => {
  req.name = 'Dan';
  next();
};

const homePage = (req, res) => {
  res.render('index', {
    name: req.name,
  });
};

module.exports = {
  homePage,
  myMiddleware,
};
