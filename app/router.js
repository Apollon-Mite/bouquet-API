const express = require('express');

// Middleware to verify tokens
const authorization = require ('./middlewares/auth')

// importer les controllers
const productController = require('./controllers/productController');
const customerController = require('./controllers/customerController');
const orderController = require('./controllers/orderController');
const categoryController = require('./controllers/categoryController');
const sellerController = require('./controllers/sellerController');
const imageController = require('./controllers/imageController')


const router = express.Router();

router.get('/', (req, res) => {
  res.send('HomePage');
});

/** Products */
router.get('/products', productController.getAllProducts);
router.get('/product/:id', productController.getOneProduct);
router.get('/seller/:id/products', productController.getProductsFromSeller);
router.post('/seller/:id/products', authorization, productController.addNewProduct)
router.patch('/product/:id', productController.editOneProduct) // crée juste pour nous

// router.patch('/seller/:Sid/product/:Pid', productController.editOneProduct) // faudra ajouter la vérification par token ici

router.patch('/image/:id', imageController.editOneImage)


/* Orders */
router.get('/order/:id', orderController.getOneOrder);
router.get('/seller/:id/orders', orderController.getSellerOrders); // TODO ajouter autorization
router.get('/customer/:id/orders', orderController.getCustomerOrders); // TODO ajouter autorization
router.post('/customer/:id/order', orderController.addNewOrder); // NEW ORDER




/* Categories */
router.get('/categories', categoryController.getAllCategories);



/* Customers */
router.get('/customers', customerController.getAllCustomers);
router.get('/customer/:id', customerController.getOneCustomer);
router.patch('/customer/:id', authorization, customerController.editCustomerProfile);
router.post('/customer/login', customerController.customerHandleLoginForm); // LOGIN
router.post('/customer/signup', customerController.customerHandleSignupForm); // SIGNUP


/* Sellers */
router.get('/sellers', sellerController.getAllSellers);
router.get('/seller/:id', sellerController.getOneSeller);
router.patch('/seller/:id', /*authorization,*/ sellerController.editSellerProfile); // TODO remettre autorisation quand images changées
router.post('/seller/login', sellerController.sellerHandleLoginForm); // LOGIN
router.post('/seller/signup', sellerController.sellerHandleSignupForm); // SIGNUP



router.use((req, res) => {
  res.status(404).send('Page 404');
});

module.exports = router;