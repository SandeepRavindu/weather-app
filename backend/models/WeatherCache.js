import mongoose from "mongoose";

const weatherCacheSchema = new mongoose.Schema({
  cityId: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  cachedAt: { type: Date, default: Date.now }
});

export default mongoose.model("WeatherCache", weatherCacheSchema);
