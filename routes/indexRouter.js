import { Router } from "express";
const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.send("OK");
});

export default indexRouter;
