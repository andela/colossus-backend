import models from '../models';

const { sequelize } = models;

export default async (req, res, next) => {
  const rawQueryString = `SELECT COUNT(*) FROM "Rooms"
                          INNER JOIN "Accommodation" ON "Accommodation"."id"
                          = "Rooms"."accommodationId"
                          GROUP BY "Accommodation"."id";`;
  const data = await sequelize.query(rawQueryString);
  const roomCount = data[0][0].count;
  if (roomCount >= req.accommodation.totalNumberOfRooms) {
    return res.status(403).json({
      status: 'error',
      error: 'Exceeded max rooms specified for this accommodation'
    });
  }
  next();
};
