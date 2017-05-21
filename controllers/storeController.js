const homePage = (req, res) => {
  res.render('index', {
    name: req.name,
  });
};

const addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add store',
  });
};

const createStore = (req, res) => {
  const data = req.body;
  res.json(data);
};

module.exports = {
  homePage,
  addStore,
  createStore,
};
