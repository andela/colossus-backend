import errorResponse from '../utils/index';

export const checkLineManagerId = (req, res, next) => {
  const { lineManagerId } = req.user;

  if (!lineManagerId || lineManagerId === null) {
    return errorResponse(new Error('Line manager not found, edit your profile and try again'), res, 400);
  }

  return next();
};
