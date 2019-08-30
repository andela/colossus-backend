import fs from 'fs';
import path from 'path';

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 * @returns {Promise<void>} appends picture to request
 */
export const blob = async (req, res, next) => {
  if (req.file) {
    const file = {
      mimetype: req.file.mimetype,
      extension: path.extname(req.file.originalname),
      data: Buffer.from(
        fs.readFileSync(
          req.file.path
        )
      )
        .toString('base64')
    };
    fs.unlinkSync(req.file.path);
    req.file = file;
    next();
  } else {
    next();
  }
};
