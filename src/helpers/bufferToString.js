import DataUri from 'datauri';
import path from 'path';

const dUri = new DataUri();
export default (req) => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
