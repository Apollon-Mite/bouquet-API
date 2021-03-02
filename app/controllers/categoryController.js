const Category = require('../models/category');

const categoryController = {
    getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        //à faire
        include: {
          association: 'cards',
          include: 'tags',
        },
        order: [
          ['position', 'ASC'],
          ['cards', 'position', 'ASC'],
        ],
      });
      res.json(categories);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },
};

module.exports = categoryController;
