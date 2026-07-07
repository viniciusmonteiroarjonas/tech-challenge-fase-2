const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
      maxlength: [200, 'O título não pode ter mais de 200 caracteres'],
    },
    conteudo: {
      type: String,
      required: [true, 'O conteúdo é obrigatório'],
      trim: true,
    },
    autor: {
      type: String,
      required: [true, 'O autor é obrigatório'],
      trim: true,
      maxlength: [100, 'O nome do autor não pode ter mais de 100 caracteres'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índice de texto para busca por palavras-chave
postSchema.index({ titulo: 'text', conteudo: 'text' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
