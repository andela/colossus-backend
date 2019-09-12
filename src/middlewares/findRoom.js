import model from '../models';

const { Room } = model;

export default async (req, res, next) => {
  try {
    const { roomId, accommodationId } = req.params;
    const room = await Room.findOne({
      where: { id: roomId, accommodationId }
    });
    if (!room) {
      return res.status(404).json({
        status: 'error',
        error: 'Room does not exist'
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
