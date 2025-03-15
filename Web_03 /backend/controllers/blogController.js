const Post = require('../models/Post');
const Category = require('../models/Category');
const Comment = require('../models/Comment');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('category')
      .populate('author')
      .sort({ createdAt: -1 });

    console.log('Bulunan post sayısı:', posts.length); // Debug için

    res.json({
      success: true,
      posts: posts,
      totalPages: 1
    });
  } catch (error) {
    console.error('Blog posts getirme hatası:', error); // Debug için
    res.status(500).json({
      success: false,
      message: 'Blog yazıları getirilirken bir hata oluştu'
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('author')
      .populate('comments');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı'
      });
    }

    res.json({
      success: true,
      post: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Blog yazısı getirilirken bir hata oluştu'
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      categories: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kategoriler getirilirken bir hata oluştu'
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id // Bu kısım auth sistemi kurulunca güncellenecek
    });

    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    res.json({
      success: true,
      comment: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorum eklenirken bir hata oluştu'
    });
  }
}; 