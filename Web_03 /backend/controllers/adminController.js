const Post = require('../models/Post');
const Category = require('../models/Category');
const Comment = require('../models/Comment');

// Dashboard İstatistikleri
exports.getStats = async (req, res) => {
  try {
    const stats = {
      posts: await Post.countDocuments(),
      categories: await Category.countDocuments(),
      comments: await Comment.countDocuments(),
      recentPosts: await Post.find().sort({ createdAt: -1 }).limit(5),
      recentComments: await Comment.find().sort({ createdAt: -1 }).limit(5)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'İstatistikler alınırken hata oluştu' });
  }
};

// Blog Yazıları
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('category')
      .populate('author')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Blog yazıları alınırken hata oluştu' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      author: req.user._id // Auth middleware'den gelecek
    });
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Blog yazısı oluşturulurken hata oluştu' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Blog yazısı güncellenirken hata oluştu' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog yazısı başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Blog yazısı silinirken hata oluştu' });
  }
};

// Kategoriler
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Kategoriler alınırken hata oluştu' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Kategori oluşturulurken hata oluştu' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Kategori güncellenirken hata oluştu' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kategori başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Kategori silinirken hata oluştu' });
  }
};

// Yorumlar
exports.getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    const comments = await Comment.find(query)
      .populate('post', 'title')
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments(query);
    
    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Yorumlar alınırken hata oluştu' });
  }
};

exports.approveComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Yorum onaylanırken hata oluştu' });
  }
};

exports.rejectComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Yorum reddedilirken hata oluştu' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Yorum başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Yorum silinirken hata oluştu' });
  }
}; 