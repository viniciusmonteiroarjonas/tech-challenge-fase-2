const Post = require('../models/Post');

/**
 * Retorna todos os posts ordenados por data de criação (mais recentes primeiro).
 */
const getAllPosts = async () => {
  return await Post.find().sort({ createdAt: -1 });
};

/**
 * Retorna um post pelo ID. Lança 404 se não encontrado.
 */
const getPostById = async (id) => {
  const post = await Post.findById(id);
  if (!post) {
    const error = new Error('Post não encontrado');
    error.statusCode = 404;
    throw error;
  }
  return post;
};

/**
 * Cria um novo post. Lança 400 se campos obrigatórios estiverem ausentes.
 */
const createPost = async ({ titulo, conteudo, autor } = {}) => {
  if (!titulo || !conteudo || !autor) {
    const error = new Error('Os campos titulo, conteudo e autor são obrigatórios');
    error.statusCode = 400;
    throw error;
  }

  const post = new Post({ titulo, conteudo, autor });
  return await post.save();
};

/**
 * Atualiza um post pelo ID. Lança 404 se não encontrado.
 */
const updatePost = async (id, data) => {
  const post = await Post.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    const error = new Error('Post não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return post;
};

/**
 * Remove um post pelo ID. Lança 404 se não encontrado.
 */
const deletePost = async (id) => {
  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    const error = new Error('Post não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return post;
};

/**
 * Busca posts por palavra-chave no titulo ou conteudo.
 * Lança 400 se o parâmetro de busca estiver ausente.
 */
const searchPosts = async (query) => {
  if (!query || query.trim() === '') {
    const error = new Error('O parâmetro de busca "q" é obrigatório');
    error.statusCode = 400;
    throw error;
  }

  const regex = new RegExp(query.trim(), 'i');
  return await Post.find({
    $or: [{ titulo: { $regex: regex } }, { conteudo: { $regex: regex } }],
  }).sort({ createdAt: -1 });
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
};
