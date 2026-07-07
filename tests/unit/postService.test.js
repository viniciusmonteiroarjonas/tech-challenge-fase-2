const postService = require('../../src/services/postService');
const Post = require('../../src/models/Post');

jest.mock('../../src/models/Post');

describe('PostService - Testes Unitários', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────
  // getAllPosts
  // ─────────────────────────────────────────────────────────
  describe('getAllPosts()', () => {
    it('deve retornar todos os posts ordenados por createdAt desc', async () => {
      const mockPosts = [
        { _id: '1', titulo: 'Post A', conteudo: 'Conteudo A', autor: 'Autor A' },
        { _id: '2', titulo: 'Post B', conteudo: 'Conteudo B', autor: 'Autor B' },
      ];
      Post.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockPosts) });

      const result = await postService.getAllPosts();

      expect(Post.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPosts);
    });

    it('deve retornar array vazio quando não há posts', async () => {
      Post.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

      const result = await postService.getAllPosts();

      expect(result).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────
  // getPostById
  // ─────────────────────────────────────────────────────────
  describe('getPostById()', () => {
    it('deve retornar o post quando o ID é válido', async () => {
      const mockPost = { _id: 'abc123', titulo: 'Post X', conteudo: 'Texto', autor: 'Prof' };
      Post.findById.mockResolvedValue(mockPost);

      const result = await postService.getPostById('abc123');

      expect(Post.findById).toHaveBeenCalledWith('abc123');
      expect(result).toEqual(mockPost);
    });

    it('deve lançar erro 404 quando o post não é encontrado', async () => {
      Post.findById.mockResolvedValue(null);

      await expect(postService.getPostById('inexistente')).rejects.toMatchObject({
        message: 'Post não encontrado',
        statusCode: 404,
      });
    });
  });

  // ─────────────────────────────────────────────────────────
  // createPost
  // ─────────────────────────────────────────────────────────
  describe('createPost()', () => {
    it('deve criar e retornar o novo post com todos os campos', async () => {
      const postData = { titulo: 'Novo Post', conteudo: 'Conteudo completo', autor: 'Professor A' };
      const mockSaved = { _id: 'newId', ...postData, createdAt: new Date() };

      const saveMock = jest.fn().mockResolvedValue(mockSaved);
      Post.mockImplementation(() => ({ save: saveMock }));

      const result = await postService.createPost(postData);

      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSaved);
    });

    it('deve lançar erro 400 quando o titulo está ausente', async () => {
      await expect(
        postService.createPost({ conteudo: 'Conteudo', autor: 'Autor' })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('deve lançar erro 400 quando o conteudo está ausente', async () => {
      await expect(
        postService.createPost({ titulo: 'Titulo', autor: 'Autor' })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('deve lançar erro 400 quando o autor está ausente', async () => {
      await expect(
        postService.createPost({ titulo: 'Titulo', conteudo: 'Conteudo' })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('deve lançar erro 400 quando o body está vazio', async () => {
      await expect(postService.createPost({})).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  // ─────────────────────────────────────────────────────────
  // updatePost
  // ─────────────────────────────────────────────────────────
  describe('updatePost()', () => {
    it('deve atualizar e retornar o post modificado', async () => {
      const updatedData = { titulo: 'Titulo Atualizado' };
      const mockUpdated = { _id: '1', titulo: 'Titulo Atualizado', conteudo: 'Texto', autor: 'Autor' };

      Post.findByIdAndUpdate.mockResolvedValue(mockUpdated);

      const result = await postService.updatePost('1', updatedData);

      expect(Post.findByIdAndUpdate).toHaveBeenCalledWith('1', updatedData, {
        new: true,
        runValidators: true,
      });
      expect(result).toEqual(mockUpdated);
    });

    it('deve lançar erro 404 quando o post a atualizar não existe', async () => {
      Post.findByIdAndUpdate.mockResolvedValue(null);

      await expect(postService.updatePost('inexistente', {})).rejects.toMatchObject({
        message: 'Post não encontrado',
        statusCode: 404,
      });
    });
  });

  // ─────────────────────────────────────────────────────────
  // deletePost
  // ─────────────────────────────────────────────────────────
  describe('deletePost()', () => {
    it('deve remover e retornar o post deletado', async () => {
      const mockPost = { _id: '1', titulo: 'Post', conteudo: 'Texto', autor: 'Autor' };
      Post.findByIdAndDelete.mockResolvedValue(mockPost);

      const result = await postService.deletePost('1');

      expect(Post.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockPost);
    });

    it('deve lançar erro 404 quando o post a deletar não existe', async () => {
      Post.findByIdAndDelete.mockResolvedValue(null);

      await expect(postService.deletePost('inexistente')).rejects.toMatchObject({
        message: 'Post não encontrado',
        statusCode: 404,
      });
    });
  });

  // ─────────────────────────────────────────────────────────
  // searchPosts
  // ─────────────────────────────────────────────────────────
  describe('searchPosts()', () => {
    it('deve retornar posts que correspondem à query', async () => {
      const mockPosts = [
        { _id: '1', titulo: 'Node.js para Iniciantes', conteudo: 'Aprenda Node', autor: 'Prof' },
      ];
      Post.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockPosts) });

      const result = await postService.searchPosts('Node');

      expect(Post.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPosts);
    });

    it('deve retornar array vazio quando nenhum post corresponde', async () => {
      Post.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

      const result = await postService.searchPosts('termoinexistente');

      expect(result).toEqual([]);
    });

    it('deve lançar erro 400 quando a query é uma string vazia', async () => {
      await expect(postService.searchPosts('')).rejects.toMatchObject({
        message: 'O parâmetro de busca "q" é obrigatório',
        statusCode: 400,
      });
    });

    it('deve lançar erro 400 quando a query é apenas espaços em branco', async () => {
      await expect(postService.searchPosts('   ')).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it('deve lançar erro 400 quando a query é undefined', async () => {
      await expect(postService.searchPosts(undefined)).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });
});
