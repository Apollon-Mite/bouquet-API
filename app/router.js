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
router.get('/product/:id(\\d+)', productController.getOneProduct); /* (\\d+) est du regex, il signifie que le ID doit être un entier positif */
router.get('/seller/:id(\\d+)/products', productController.getProductsFromSeller);
router.post('/seller/:id(\\d+)/products', authorization, productController.addNewProduct)
// router.patch('/product/:id(\\d+)', productController.editOneProduct) // TODO ajouter autorization
// router.patch('/seller/:Sid/product/:Pid', productController.editOneProduct) // TODO ajouter autorization

// router.patch('/image/:id(\\d+)', imageController.editOneImage) // TODO ajouter autorization


/* Orders */
router.get('/order/:id(\\d+)', orderController.getOneOrder);
router.get('/seller/:id(\\d+)/orders', orderController.getSellerOrders); // TODO ajouter autorization
router.get('/customer/:id(\\d+)/orders', orderController.getCustomerOrders); // TODO ajouter autorization
router.post('/customer/:id(\\d+)/order', orderController.addNewOrder); // NEW ORDER // TODO ajouter autorization


/* Categories */
router.get('/categories', categoryController.getAllCategories);


/* Customers */
router.get('/customers', customerController.getAllCustomers);
router.get('/customer/:id(\\d+)', customerController.getOneCustomer);
router.patch('/customer/:id(\\d+)', authorization, customerController.editCustomerProfile);
router.post('/customer/login', customerController.customerHandleLoginForm); // LOGIN
router.post('/customer/signup', customerController.customerHandleSignupForm); // SIGNUP


/* Sellers */
router.get('/sellers', sellerController.getAllSellers);
router.get('/seller/:id(\\d+)', sellerController.getOneSeller);
router.patch('/seller/:id(\\d+)', /*authorization,*/ sellerController.editSellerProfile); // TODO remettre autorisation quand images changées
router.post('/seller/login', sellerController.sellerHandleLoginForm); // LOGIN
router.post('/seller/signup', sellerController.sellerHandleSignupForm); // SIGNUP


router.use((req, res) => {
  res.status(404).send('Page 404');
});

module.exports = router;