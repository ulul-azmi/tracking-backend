module.exports = {
  post(req, res) {
    res.status(201).json({
      path: req.file.filename,
    });
  },
};
