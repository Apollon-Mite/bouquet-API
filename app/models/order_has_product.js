const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class OrderHasProduct extends Model {};

OrderHasProduct = sequelize.define('order_has_product',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
},
  quantity: DataTypes.INTEGER,
  price_per_unit: DataTypes.TEXT
}, {
  sequelize,
  timestamps: false,
  tableName: "order_has_product"
});

module.exports = OrderHasProduct;








// ----------------------------------

// const { DataTypes, Model } = require('sequelize');
// const connection = require('../database');
// class ArticleHasSize extends Model { };
// // CE N'EST PAS UN INIT QU'ON FAIT MAIS UN DEFINE !!!
// // ArticleHasSize sera utilisé comme 'through' dans le fichier index.js des models, exemple plus bas
// ArticleHasSize = connection.define('article_has_size', {
//   // pour récupèrer l'id, sinon il n'envoi pas l'id
//   // de là...
//   id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false
//   },
// // ...jusqu'ici pour récupérer juste l'id de cette table
// stock: DataTypes.INTEGER,
// }, {
//   sequelize: connection,
//   tableName: "article_has_size"
// })
// module.exports = ArticleHasSize;