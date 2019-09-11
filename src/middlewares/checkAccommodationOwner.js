export default (req, res, next) => {
  if (req.accommodation.owner !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      error: 'This property belongs to another user'
    });
  }
  next();
};
