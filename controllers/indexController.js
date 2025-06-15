export default function indexController(req, res, next) {
  try {
    res.render("index");
  } catch (err) {
    next(err);
  }
}
