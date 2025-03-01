const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy API requests to eCFR
app.use('/api', createProxyMiddleware({
  target: 'https://www.ecfr.gov',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  },
  logLevel: 'debug'
}));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any other request, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 