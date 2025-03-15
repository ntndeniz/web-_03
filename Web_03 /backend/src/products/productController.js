const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    
    const products = await Product.find()
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments();
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: 'Ürünler getirilirken bir hata oluştu.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı.' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Ürün getirilirken bir hata oluştu.' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Ürün oluşturulurken bir hata oluştu.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı.' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Ürün güncellenirken bir hata oluştu.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı.' });
    }
    res.json({ message: 'Ürün başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ error: 'Ürün silinirken bir hata oluştu.' });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Arama yapılırken bir hata oluştu.' });
  }
}; 