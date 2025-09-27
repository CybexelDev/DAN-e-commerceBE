const { response } = require('express');
const ObjectId = require('mongoose').Types.ObjectId
const USER = require('../Models/userModel')
const PRODUCT = require('../Models/productModel');
const CATEGORY = require('../Models/categoryModel');
const BLOG = require('../Models/blogModel');
const VOUCHER = require('../Models/voucher')
const TESTIMONIAL = require('../Models/testimonialModels')
const HEADER = require('../Models/headerModels')
const BRAND = require('../Models/brandModels')
// const addUserData =async(req,res)=>{

//   try {
//     const user = new USER({
//       name: req.body.name,
//       email: req.body.email,
//       age: req.body.age,
//     });

//     await user.save();
//     res.send("User saved successfully!");
//   } catch (err) {
//     res.status(500).send(err);
//   }
// }

const getUsers = async (req, res) => {
  try {
    const users = await USER.find();
    res.json(users)
  } catch (error) {
    res.status(500).send(error)
  }
}

const getProduct = async (req, res) => {
  try {
    const product = await PRODUCT.find();
    res.json(product)
  } catch (error) {
    res.status(500).send(error)
  }
}

const getSingleProduct = async (req, res) => {
  try {
    const id = req.query.productId;   // ✅ use query instead of body
    console.log(req.query, "req.query in getSingleProduct >>>>>");

    const product = await PRODUCT.findById(id);
    res.json(product);
  } catch (error) {
    res.status(500).send(error);
  }
};



const getcategory = async (req, res) => {
  try {
    const product = await CATEGORY.find();
    res.json(product)
  } catch (error) {
    res.status(500).send(error)
  }
}

const getPopularProduct = async (req, res) => {
  try {
    const popular = await PRODUCT.aggregate([
      {
        $match: { starRating: { $gte: 3.9 } }
      },
      {
        $sort: { starRating: -1 }
      },
      {
        $project: {
          _id: 1,
          images: 1,
          productName: 1,
          rate: 1,
          category: 1,
          discount: 1,
        }
      }
    ]);

    res.status(200).json({
      message: "Popular products fetched successfully",
      data: popular
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blog = await BLOG.find()
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

const getCategoryProduct = async (req, res) => {
  console.log(req.query.id);
  try {
    const id = req.query.id
    const product = await PRODUCT.find({ categoryId: id })
    res.status(200).json({ message: "category product fetch successfully", data: product })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}


const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await PRODUCT.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const user = await USER.findById(userId);
    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ productId, quantity: quantity || 1 });
    }
    await user.save();

    res.json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const updatedUser = await USER.findByIdAndUpdate(
      userId,
      {
        $pull: { cart: { productId: productId } }
      },
      { new: true }
    ).populate("cart.productId");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart: updatedUser.cart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const updatedUser = await USER.findOneAndUpdate(
      { _id: userId, "cart.productId": productId },
      { $set: { "cart.$.quantity": quantity } },  // update only matched item
      { new: true }
    ).populate("cart.productId");

    if (!updatedUser) {
      return res.status(404).json({ message: "User or product not found in cart" });
    }

    res.status(200).json({
      message: "Cart quantity updated successfully",
      cart: updatedUser.cart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Get user cart
const getCart = async (req, res) => {
  try {

    console.log(req.query.userId, "yyyyyyyyyy");

    const userId = req.query.userId;

    const user = await USER.findById(userId).populate("cart.productId", "productName rate images brandName");

    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const addAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;

    if (!userId || !address) {
      return res.status(400).json({ error: "userId and address are required" });
    }

    const user = await USER.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.addresses.push(address);
    await user.save();

    res.status(200).json({ message: "Address added successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAddresses = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await USER.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getRelatedProduct = async (req, res) => {
  console.log(req.params, "tttttttttttttt");

  try {
    // const categoryId = req.body.categoryId
    const categoryId = req.query.id;
    const data = await PRODUCT.find({ categoryId: categoryId })
    res.status(200).json({ message: "Related product fetched Successfully", data: data })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}


const getSearch = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const datas = await PRODUCT.find({
      $or: [
        { productName: { $regex: query, $options: "i" } },
        { brandName: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    });

    res.status(200).json({ results: datas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFilter = async (req, res) => {
  try {
    const filterData = req.body.sortBy
    if (filterData == 'popularity') {
      const fiter = await PRODUCT.aggregate([
        {
          $match: { starRating: { $gte: 3.9 } }
        },
        {
          $sort: { starRating: -1 }
        },
        {
          $project: {
            _id: 1,
            images: 1,
            productName: 1,
            rate: 1,
            category: 1,
            starRating: 1
          }
        },

      ])
      res.status(200).json({
        message: "popularity products fetched successfully",
        data: fiter
      });

    }else if(filterData == 'latest'){
      const fiter = await PRODUCT.find().sort({date: -1})

         res.status(200).json({
        message: "latest products fetched successfully",
        data: fiter
      });
    }else if(filterData == 'priceLowToHigh'){
        const fiter = await PRODUCT.find().sort({rate: 1})

         res.status(200).json({
        message: "Low To High rate products fetched successfully",
        data: fiter
      });
    }else if(filterData == 'priceHighToLow'){
        const fiter = await PRODUCT.find().sort({rate: -1})

         res.status(200).json({
        message: "High to Low  rate products fetched successfully",
        data: fiter
      });
    }else{
      res.status(400).json({message:"your senting emty data"})
    }

  } catch (error) {
    res.status(500)
  }
}


const applyVoucher = async (req, res) => {
  try {
    const { code, cartTotal } = req.body; // cart total comes from frontend

    const voucher = await VOUCHER.findOne({ code, isActive: true });
    if (!voucher) {
      return res.status(400).json({ error: "Invalid voucher code" });
    }

    if (voucher.expiryDate < Date.now()) {
      return res.status(400).json({ error: "Voucher expired" });
    }

    if (cartTotal < voucher.minAmount) {
      return res.status(400).json({ error: `Minimum cart value should be ${voucher.minAmount}` });
    }

    let discountAmount = 0;
    if (voucher.discountType === "percentage") {
      discountAmount = (cartTotal * voucher.discountValue) / 100;
    } else {
      discountAmount = voucher.discountValue;
    }

    const finalAmount = Math.max(0, cartTotal - discountAmount);

    res.status(200).json({
      message: "Voucher applied successfully",
      discount: discountAmount,
      finalAmount
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTestimonials = async (req, res) => {
  try {
    const testimonials = await TESTIMONIAL.find();
    res.status(200).json({ message: "Testimonials fetched successfully", data: testimonials });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getHeader = async (req, res) => {
  try {
    const header = await HEADER.find();
    res.status(200).json({ message: "Header fetched successfully", data: header });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getBrand = async (req, res) => {
  try {
    const brand = await BRAND.find();
    res.status(200).json({ message: "brand fetched successfully", data: brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getProduct,
  getcategory,
  getSingleProduct,
  getPopularProduct,
  getBlogs,
  getCategoryProduct,
  getUsers,
  addToCart,
  getCart,
  addAddress,
  getAddresses,
  getRelatedProduct,
  getSearch,
  getFilter,
  removeFromCart,
  updateCartQuantity,
  applyVoucher,
  getTestimonials,
  getHeader ,
   getBrand,
}