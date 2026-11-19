/**
 * Health check controller
 * Provides system status, application info, and environment diagnostic.
 */
exports.getHealth = (req, res) => {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');

  res.status(200).json({
    status: 'healthy',
    message: 'MDSPS Question Paper Generator API is running',
    school: {
      name: 'Maharshi Dayanand Saraswati Public School',
      shortName: 'MDSPS'
    },
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    services: {
      api: 'online',
      geminiVision: geminiConfigured ? 'configured' : 'pending_api_key'
    }
  });
};
