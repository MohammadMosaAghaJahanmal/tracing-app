import app from "./app.js";
import { initDb } from "./models/index.js";

const port = process.env.PORT || 5000;

(async () => {
  await initDb(); // ✅ creates tables automatically
  app.listen(port, () => console.log(`Server running on port ${port}`));
})();
