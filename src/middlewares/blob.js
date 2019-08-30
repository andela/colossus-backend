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
      extension: path.extname(req.file.originalName),
      data: Buffer.from(
        fs.readFileSync(
          req.file.path
        )
      )
        .toString('base64')
    };
    fs.unlink(req.file.path);
    req.file = file;
    next();
  } else {
    next();
  }
};
