const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;