import errorResponse from '../../utils/index';

const validateEmail = (req, res, next) => {
  const { email } = req.body;

  const regexForEmail = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;

  if (!email) return errorResponse(new Error('Your email is required'), res, 400);

  if (!regexForEmail.test(email)) return errorResponse(new Error('Invalid email supplied'), res, 400);
  return next();
};

export default validateEmail;
