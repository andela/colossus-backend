import model from '../models';

const { Accommodation } = model;

export default async (req, res, next) => {
  try {
    const { accommodationId } = req.params;
    const accommodation = await Accommodation.findOne({
      where: { id: accommodationId }
    });
    if (!accommodation) {
      return res.status(404).json({
        status: 'error',
        error: 'Accommodation does not exist'
      });
    }
    req.accommodation = accommodation.dataValues;
    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
};
