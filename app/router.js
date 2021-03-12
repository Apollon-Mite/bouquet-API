const express = require('express');

// Middleware to verify tokens
const authorization = require('./middlewares/auth');

// importer les controllers
const productController = require('./controllers/productController');
const customerController = require('./controllers/customerController');
const orderController = require('./controllers/orderController');
const categoryController = require('./controllers/categoryController');
const sellerController = require('./controllers/sellerController');
const imageController = require('./controllers/imageController');
const sellerController = require('./controllers/sellerController');

// import joi service
const { validateBody } = require('./services/validator');
// import schemas used by Joi
const productSchema = require('./schemas/product');
const imageSchema = require('./schemas/image');
const customerSchema = require('./schemas/customer');
const loginSchema = require('./schemas/login');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('HomePage');
});

/** Products */
router.get('/products', productController.getAllProducts);
router.get('/product/:id(\\d+)', productController.getOneProduct);
router.get(
  '/seller/:id(\\d+)/products',
  productController.getProductsFromSeller
);
router.post(
  '/seller/:id(\\d+)/products',
  authorization,
  validateBody(productSchema),
  productController.addNewProduct
);
// router.patch('/seller/:Sid/product/:Pid', productController.editOneProduct)

router.patch(
  '/image/:id(\\d+)',
  validateBody(imageSchema),
  imageController.editOneImage
);

/* Orders */
router.get('/order/:id(\\d+)', orderController.getOneOrder);
router.get('/seller/:id(\\d+)/orders', orderController.getSellerOrders);
router.get('/customer/:id(\\d+)/orders', orderController.getCustomerOrders);

/* Categories */
router.get('/categories', categoryController.getAllCategories);

/* Customers */
router.get('/customers', customerController.getAllCustomers);
router.get('/customer/:id(\\d+)', customerController.getOneCustomer);
router.patch(
  '/customer/:id(\\d+)',
  authorization,
  validateBody(customerSchema),
  customerController.editCustomerProfile
);
router.post(
  '/customer/login',
  validateBody(loginSchema),
  customerController.customerHandleLoginForm
); // LOGIN
router.post(
  '/customer/signup',
  validateBody(customerSchema),
  customerController.customerHandleSignupForm
); // SIGNUP

/* Sellers */
router.get('/sellers', sellerController.getAllSellers);
router.get('/seller/:id(\\d+)', sellerController.getOneSeller);
router.patch(
  '/seller/:id(\\d+)',
  authorization,
  validateBody(sellerSchema),
  sellerController.editSellerProfile
);
router.post('/seller/login', validateBody(loginSchema),sellerController.sellerHandleLoginForm); // LOGIN
router.post('/seller/signup',validateBody(sellerSchema), sellerController.sellerHandleSignupForm); // SIGNUP

router.use((req, res) => {
  res.status(404).send('Page 404');
});

module.exports = router;
