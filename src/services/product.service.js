const Category = require("../models/category.model");
const Product = require("../models/product.model");

async function createProduct(reqData) {
  // 🔍 Debug incoming data
  console.log("Incoming data to createProduct:", reqData);

  // 🛡️ Validate required fields
  if (
    !reqData.title ||
    typeof reqData.price === "undefined" ||
    typeof reqData.quantity === "undefined" ||
    !reqData.description ||
    !reqData.topLevelCategory ||
    !reqData.secondLevelCategory ||
    !reqData.thirdLevelCategory
  ) {
    throw new Error("Missing required fields in request data.");
  }

  // 🔹 Create or get top-level category
  let topLevel = await Category.findOne({ name: reqData.topLevelCategory });
  if (!topLevel) {
    topLevel = new Category({ name: reqData.topLevelCategory, level: 1 });
    await topLevel.save();
  }

  // 🔹 Create or get second-level category
  let secondLevel = await Category.findOne({
    name: reqData.secondLevelCategory,
    parentCategory: topLevel._id,
  });
  if (!secondLevel) {
    secondLevel = new Category({
      name: reqData.secondLevelCategory,
      parentCategory: topLevel._id,
      level: 2,
    });
    await secondLevel.save();
  }

  // 🔹 Create or get third-level category
  let thirdLevel = await Category.findOne({
    name: reqData.thirdLevelCategory,
    parentCategory: secondLevel._id,
  });
  if (!thirdLevel) {
    thirdLevel = new Category({
      name: reqData.thirdLevelCategory,
      parentCategory: secondLevel._id,
      level: 3,
    });
    await thirdLevel.save();
  }

  // ✅ Create the product
  const product = new Product({
    title: reqData.title,
    color: reqData.color,
    description: reqData.description,
    discountedPrice: reqData.discountedPrice,
    discountPersent: reqData.discountPersent,
    imageUrl: reqData.imageUrl,
    brand: reqData.brand,
    price: reqData.price,
    sizes: reqData.sizes,
    quantity: reqData.quantity,
    category: thirdLevel._id,
  });

  return await product.save();
}

async function deleteProduct(productId) {
  await Product.findByIdAndDelete(productId);
  return "Product deleted Successfully";
}

async function updateProduct(productId, reqData) {
  return await Product.findByIdAndUpdate(productId, reqData, { new: true });
}

async function findProductById(id) {
  const product = await Product.findById(id).populate("category").exec();
  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}

async function getAllProducts(reqQuery) {
  let {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber = 1,
    pageSize = 10,
  } = reqQuery;

  let query = Product.find().populate("category");

  // Filter by category
  if (category) {
    const existCategory = await Category.findOne({ name: category });
    if (existCategory) {
      query = query.where("category").equals(existCategory._id);
    } else {
      return { content: [], currentPage: 1, totalPages: 0 };
    }
  }

  // Filter by color
  if (color) {
    const colorSet = new Set(color.split(",").map((c) => c.trim().toLowerCase()));
    const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    if (colorRegex) {
      query = query.where("color").regex(colorRegex);
    }
  }

  // Filter by sizes
  if (sizes) {
    const sizesSet = new Set(sizes.split(",").map((s) => s.trim()));
    query = query.where("sizes.name").in([...sizesSet]);
  }

  // Filter by price range
  if (minPrice && maxPrice) {
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  // Filter by discount
  if (minDiscount) {
    query = query.where("discountPersent").gt(minDiscount);
  }

  // Filter by stock
  if (stock) {
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }
  }

  // Sorting
  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  // Pagination
  const totalProducts = await Product.countDocuments(query.getQuery());
  const skip = (pageNumber - 1) * pageSize;

  query = query.skip(skip).limit(pageSize);
  const products = await query.exec();
  const totalPages = Math.ceil(totalProducts / pageSize);

  return { content: products, currentPage: pageNumber, totalPages };
}

async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
};
