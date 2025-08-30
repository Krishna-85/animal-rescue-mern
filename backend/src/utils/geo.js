export const toPoint = (lat, lng) => ({
  type: "Point",
  coordinates: [parseFloat(lng), parseFloat(lat)]
});
// 23.205930572929503, 77.42229724717545