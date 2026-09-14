// Turns the flat property fields sent by the Add/Edit Property form into the stored shape.
// Only fields present in the request are returned, so partial updates don't wipe data.
const ALLOWED_STATUSES = ['ACTIVE', 'PENDING', 'SOLD', 'RENTED', 'INACTIVE'];
const LOCATION_KEYS = ['country', 'state', 'city', 'lga', 'address', 'latitude', 'longitude'];

const toCoordinate = value => (
    value === '' || value === undefined || value === null || isNaN(Number(value)) ? undefined : Number(value)
);

function buildPropertyFields(body = {}) {
    const fields = {};

    if (body.listingType !== undefined) {
        fields.listingType = body.listingType || '';
    }

    if (typeof body.status === 'string' && ALLOWED_STATUSES.includes(body.status.toUpperCase())) {
        fields.status = body.status.toUpperCase();
    }

    if (LOCATION_KEYS.some(key => body[key] !== undefined)) {
        fields.location = {
            country: body.country || '',
            state: body.state || '',
            city: body.city || '',
            lga: body.lga || '',
            address: body.address || '',
            latitude: toCoordinate(body.latitude),
            longitude: toCoordinate(body.longitude)
        };
    }

    if (body.propertyDetails && typeof body.propertyDetails === 'object' && !Array.isArray(body.propertyDetails)) {
        fields.propertyDetails = body.propertyDetails;
    }

    return fields;
}

module.exports = { buildPropertyFields, LOCATION_KEYS };
