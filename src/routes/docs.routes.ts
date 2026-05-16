import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const router = Router();

// Load YAML spec relative to project root
const specPath = path.join(process.cwd(), "openapi.yaml");
const swaggerDocument = YAML.load(specPath);

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
