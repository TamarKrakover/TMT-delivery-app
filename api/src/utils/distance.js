/**
 * Calculates the distance between two coordinates in kilometers using the Haversine formula.
 * 
 * @param {Object} loc1 - The first location { lat, lng }
 * @param {Object} loc2 - The second location { lat, lng }
 * @returns {number|null} The distance in kilometers, or null if coordinates are invalid
 */
const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2 || loc1.lat === undefined || loc1.lng === undefined || loc2.lat === undefined || loc2.lng === undefined) {
        return null;
    }

    const R = 6371; // Radius of the earth in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
};

module.exports = { calculateDistance };
