import app from "./app";
import config from "./config";

app.listen(config.port, () => {
  console.log(`🚀 RentNest server running on port ${config.port}`);
});