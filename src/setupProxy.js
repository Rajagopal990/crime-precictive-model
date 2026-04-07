const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    ['/api', '/health'],
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      ws: false
    })
  );
};
