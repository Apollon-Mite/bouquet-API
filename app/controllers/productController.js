const {Product, Image, Seller } = require('../models');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.findAll({ 
        order: [
          ['id', 'ASC'],
          ['images', 'id', 'ASC']
        ],       
        include : ['category', 'images',
        {
          model: Seller,
          as: 'seller',
          attributes: { exclude: ['password'] }
        }]
        });
      res.json(products);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  getOneProduct: async (req, res) => {
     try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId, { 
          order: [
            ['images', 'id', 'ASC']
          ],        
          include : ['category', 'images', {
            model: Seller,
            as: 'seller',
            attributes: { exclude: ['password'] }
          }]
          });
         if (product) {
         res.json(product);
     } else {
       res.status(404).json('Cant find product with id ' + productId);
     }
    } catch (error) {
     console.trace(error);
     res.status(500).json(error.toString());
    }
  },

  getProductsFromSeller: async (req, res) => {
    try {
      sellerId = req.params.id;
      const products = await Product.findAll({
        where : {
          seller_id : sellerId
        },
        include : ['category', 'images'],
        order: [
          ['id', 'ASC'],
          ['images', 'id', 'ASC']
        ], 
        })

      const seller = await Seller.findByPk(sellerId, {
        attributes: { exclude: ['password'] }
      })
      const result = [seller, products]
  
      if (products) {
        res.status(200).json(result)
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  addNewProduct: async (request, response) => {
    try {
      sellerId = request.params.id;
      
      if (sellerId != request.user.userId || request.user.role !== 'seller') {
        return response.status(401).json('You have no right to make this action');
      }

      const { name , description , stock , price , category_id , image} = request.body;
      
      const now = new Date();
      const annee   = now.getFullYear();
      const mois    = now.getMonth() + 1;
      const jour    = now.getDate();
      const heure   = now.getHours();
      const minute  = now.getMinutes();
      const seconde = now.getSeconds();
      const reference = "" + sellerId + mois + annee + jour + heure + minute + seconde;

      
      if(reference && name && description && stock && price && sellerId && category_id && image) {
        const newProduct = await Product.create({
          reference: reference,
          name: name,
          description: description,
          stock: stock,
          price: price,
          seller_id: sellerId,
          category_id: category_id
        });

        //if one image is uploaded
        await Image.create({
          url: image,
          product_id: newProduct.id
        })  
        

        // If several images are uploaded, images must be an array ["image1", "image2", ...]
        // for (const image of images) {
        //   await Image.create({
        //     url: image,
        //     product_id: newProduct.id
        //   })         
        // }
        
        response.status(200).json('success');
      } else {
        response.status(400).json('Données manquantes')
      }
      
    } catch (error) {
      console.trace(error);
      response.status(500).json(error.toString());
    }
  },

  editOneProduct : async (request, response) => {
    try {
      // const sellerId = request.params.Sid;
      const productId = request.params.id;

      const product = await Product.findOne({
        where : {
          id: productId
        }
      })

      const { name, description, stock, price} = request.body
      

      if (name) {
          product.name = name;
      }

      if (description) {
        product.description = description;
    }

      if (stock) {
          product.stock = stock;
      }

      if (price) {
        product.price = price;
    }


      await product.save();



    } catch (error) {
      console.error(error)
    }
  }
};

module.exports = productController;
