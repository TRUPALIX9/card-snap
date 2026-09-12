import express from "express";
import {
  getApiStatus,
  getSystemInfo,
  getDatabaseInfo,
} from "../../controllers/playgroundController";

const router = express.Router();

// Development-only diagnostics. The API has no authentication, so these
// return 404 when NODE_ENV=production. Checked per request because .env is
// loaded after the route modules are imported.
const devOnly: express.RequestHandler = (_req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    res.status(404).json({ message: "Not found" });
    return;
  }
  next();
};

router.get("/status", getApiStatus); // GET /api/playground/status
router.get("/system", devOnly, getSystemInfo); // GET /api/playground/system
router.get("/db", devOnly, getDatabaseInfo); // GET /api/playground/db

export default router;
