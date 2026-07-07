const request = require('supertest');
const app = require('../../src/app');
const postService = require('../../src/services/postService');

jest.mock('../../src/services/postService');

describe('Rotas /posts - Testes de Integração', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────
  // GET /posts
  // ─────────────────────────────────────────────────────────
  describe('GET /posts', () => {
    it('deve retornar status 200 com lista de posts', async () => {
      const mockPosts = [
        { _id: '1', titulo: 'Post A', conteudo: 'Conteudo A', autor: 'Autor A' },
      ];
      postService.getAllPosts.mockResolvedValue(mockPosts);

      const res = await request(app).get('/posts');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockPosts);
    });

    it('deve retornar status 500 em caso de erro interno', async () => {
      postService.getAllPosts.mockRejectedValue(new Error('DB Error'));

      const res = await request(app).get('/posts');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────
  // GET /posts/search
  // ─────────────────────────────────────────────────────────
  describe('GET /posts/search', () => {
    it('deve retornar status 200 com posts correspondentes à query', async () => {
      const mockPosts = [{ _id: '1', titulo: 'Node.js', conteudo: 'Express', autor: 'Prof' }];
      postService.searchPosts.mockResolvedValue(mockPosts);

      const res = await request(app).get('/posts/search?q=Node');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockPosts);
      expect(postService.searchPosts).toHaveBeenCalledWith('Node');
    });

    it('deve retornar status 400 quando query "q" está ausente', async () => {
      const error = new Error('O parâmetro de busca "q" é obrigatório');
      error.statusCode = 400;
      postService.searchPosts.mockRejectedValue(error);

      const res = await request(app).get('/posts/search');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────
  // GET /posts/:id
  // ─────────────────────────────────────────────────────────
  describe('GET /posts/:id', () => {
    it('deve retornar status 200 com o post encontrado', async () => {
      const mockPost = { _id: 'abc123', titulo: 'Post X', conteudo: 'Texto', autor: 'Autor' };
      postService.getPostById.mockResolvedValue(mockPost);

      const res = await request(app).get('/posts/abc123');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockPost);
    });

    it('deve retornar status 404 quando o post não existe', async () => {
      const error = new Error('Post não encontrado');
      error.statusCode = 404;
      postService.getPostById.mockRejectedValue(error);

      const res = await request(app).get('/posts/inexistente');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────
  // POST /posts
  // ─────────────────────────────────────────────────────────
  describe('POST /posts', () => {
    it('deve retornar status 201 com o post criado', async () => {
      const postData = { titulo: 'Novo Post', conteudo: 'Conteudo', autor: 'Professor' };
      const mockCreated = { _id: 'newId', ...postData };
      postService.createPost.mockResolvedValue(mockCreated);

      const res = await request(app).post('/posts').send(postData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockCreated);
    });

    it('deve retornar status 400 quando campos obrigatórios estão ausentes', async () => {
      const error = new Error('Os campos titulo, conteudo e autor são obrigatórios');
      error.statusCode = 400;
      postService.createPost.mockRejectedValue(error);

      const res = await request(app).post('/posts').send({ titulo: 'Só o título' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────
  // PUT /posts/:id
  // ─────────────────────────────────────────────────────────
  describe('PUT /posts/:id', () => {
    it('deve retornar status 200 com o post atualizado', async () => {
      const mockUpdated = { _id: '1', titulo: 'Atualizado', conteudo: 'Texto', autor: 'Autor' };
      postService.updatePost.mockResolvedValue(mockUpdated);

      const res = await request(app).put('/posts/1').send({ titulo: 'Atualizado' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockUpdated);
    });

    it('deve retornar status 404 quando o post a atualizar não existe', async () => {
      const error = new Error('Post não encontrado');
      error.statusCode = 404;
      postService.updatePost.mockRejectedValue(error);

      const res = await request(app).put('/posts/inexistente').send({ titulo: 'X' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────
  // DELETE /posts/:id
  // ─────────────────────────────────────────────────────────
  describe('DELETE /posts/:id', () => {
    it('deve retornar status 200 com mensagem de sucesso', async () => {
      postService.deletePost.mockResolvedValue({});

      const res = await request(app).delete('/posts/1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Post removido com sucesso');
    });

    it('deve retornar status 404 quando o post a deletar não existe', async () => {
      const error = new Error('Post não encontrado');
      error.statusCode = 404;
      postService.deletePost.mockRejectedValue(error);

      const res = await request(app).delete('/posts/inexistente');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────
  // Rota inexistente
  // ─────────────────────────────────────────────────────────
  describe('Rotas inexistentes', () => {
    it('deve retornar status 404 para rota não mapeada', async () => {
      const res = await request(app).get('/rota-que-nao-existe');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
