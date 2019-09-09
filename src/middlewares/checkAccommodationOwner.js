import model from '../models';

const { Accommodation } = model;

export default async (req, res, next) => {
  try {
    const { accommodationId } = req.params;
    const accommodation = await Accommodation.findOne({
      where: { id: accommodationId }
    });
    if (!accommodation || req.user.id !== accommodation.dataValues.owner) {
      return res.status(401).json({
        status: 'error',
        error: 'This property belongs to another user or does not exist'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
};
