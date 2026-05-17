const express = require('express');
const cors = require('cors');

const stockRoutes = require('./routes/stock');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

app.use('/api', stockRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'StockAnalytics API en ligne' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});