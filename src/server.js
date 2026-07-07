require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] Rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('[Server] Falha ao conectar ao banco de dados:', err.message);
    process.exit(1);
  });
