const { Order, Product, Customer, OrderHasProduct } = require('../models');
const { Op } = require("sequelize");

//const Product = require('../models/product');

const orderController = {
  getOneOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json('Cant find list with id ' + orderId);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  
  getSellerOrders: async (req, res) => {
    try {
        const sellerId = req.params.id;
        const orders = await Order.findAll({ 
            include: [{
                model : Product,
                as: 'products',
                where : {
                    'seller_id' : sellerId
                }
            }]
        })
        if (orders) {
            res.status(200).json(orders)
        }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

    getCustomerOrders: async (req, res) => {
        try {
            const customerId = req.params.id;
            const orders = await Order.findAll({
                where : {
                    'customer_id' : customerId
                },
                include: [{  
                    model : Product,
                    as: 'products',
                    
                }]
            })
            if (orders) {
                res.status(200).json(orders)
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    addNewOrder: async (req, res) => {
      try {
          const {cart} = req.body;

          if (cart.length<1) {
            return res.status(200).json("Panier vide");
          }

          const customerId = req.params.id;

          const now = new Date();
          const annee   = now.getFullYear();
          const mois    = now.getMonth() + 1;
          const jour    = now.getDate();
          const heure   = now.getHours();
          const minute  = now.getMinutes();
          const seconde = now.getSeconds();
          const reference = "" + customerId + annee + mois + jour + heure + minute + seconde; // "" at the beginning to force it to be a string, otherwise it will make an addition


          let productIDS = [];
          cart.forEach(element => {
            productIDS.push(element.id)
          });

          const productPrice = await Product.findAll({
            where : {
              id : {
                [Op.or]: productIDS
              }
            }
          })

          let totalPrice = 0;

          cart.forEach((cartP) => {
            const found = productPrice.find(product => product.id == cartP.id)
            cartP.price = found.price;

            totalPrice+= found.price * cartP.quantity

          })

          totalPrice = (totalPrice).toFixed(2)

        for (const product of cart) {
          //On vérifie d'abord les stocks avant de passer la commande          
          const DDBProduct = await Product.findByPk(product.id)
          if (DDBProduct.stock < product.quantity) {
            return res.status(200).json("ACHAT ANNULÉ:pas assez de stock pour: "+ DDBProduct.name )
          }
        }

        // On peut passer la commande
        const order = await Order.create({
            reference,
            total_amount : totalPrice,
            status : "En préparation avant livraison",
            customer_id: customerId,
        });
        console.log('nouveau order',order.id)
        
        for (const product of cart) {
            // tous les stocks sont bons, on peut passer la vente
            OrderHasProduct.create ({
              order_id: order.id,
              product_id: product.id,
              quantity: product.quantity,
              price_per_unit: product.price
            })

          // il faut diminuer le stock de chaque produit acheté
          const DDBProduct = await Product.findByPk(product.id)
          console.log("AVANT productID : ", product.id, "stock dispo: ", DDBProduct.stock, "quantité: ", product.quantity)
          
          DDBProduct.stock -= product.quantity;
          await DDBProduct.save();
          
          console.log("APRÈS productID : ", product.id, "stock dispo: ", DDBProduct.stock, "quantité: ", product.quantity)
        }

          res.status(200).json(order)
          
      } catch (error) {
          console.trace(error);
          res.status(500).json(error.toString());
      }
  }
};

module.exports = orderController;