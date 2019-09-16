import models from '../models';

const { sequelize } = models;

export default async (req, res, next) => {
  const { accommodationId } = req.params;
  let roomCount;
  const rawQueryString = `SELECT COUNT(*) FROM "Rooms"
                          INNER JOIN "Accommodation" ON "Accommodation"."id"
                          = "Rooms"."accommodationId"
                          WHERE "Accommodation"."id" = ${accommodationId}
                          GROUP BY "Accommodation"."id";`;
  const data = await sequelize.query(rawQueryString);
  if (data[0] === undefined || data[0].length <= 0) roomCount = data[1].rowCount
  else roomCount = data[0][0].count;
  if (roomCount >= req.accommodation.totalNumberOfRooms) {
    return res.status(403).json({
      status: 'error',
      error: 'Cannot exceed maximum number of rooms specified for this accommodation'
    });
  }
  next();
};