var express = require('express');
const { addProduct, addCategory, addBlogs, addHeader, addSubCategory, deleteProduct, updateProduct, deleteCategory, updateCategory, deleteHeader, deleteBlog, updateBlogs, addBrand, deleteBrand, addVoucher, addTestimonials, updateTestimonials, deleteTestimonial } = require('../Controllers/adminController');
const upload = require('../Middleware/upload');
var router = express.Router();

router.post('/addProduct', upload.array('images', 5), addProduct)
router.post('/addCategory', upload.array('images', 1),  addCategory)
router.post('/addBlog', upload.array('image', 1),  addBlogs)
router.post('/addHeader', upload.array('image', 1),  addHeader)
router.post('/addSubCategory',  addSubCategory)
router.post('/deleteProduct', deleteProduct)
router.put("/product/:id", upload.array("images", 5), updateProduct);
router.delete('/deleteCategory', deleteCategory)
router.put("/updateCategory/:id", upload.array("image", 1), updateCategory);
router.delete('/deleteHeader', deleteHeader);
router.delete('/deleteBlog', deleteBlog);
router.put("/updateblog/:id", upload.array("image", 1), updateBlogs);
router.post('/addBrand', upload.array('image', 1),  addBrand)
router.delete('/deleteBrand', deleteBrand)
router.post('/addVoucher', addVoucher)
router.post('/addTestimonial', upload.array('image', 1),  addTestimonials)
router.put("/updateTestimonial/:id", upload.array("image", 1), updateTestimonials);
router.delete('/deleteTestimonial', deleteTestimonial);

module.exports = router;