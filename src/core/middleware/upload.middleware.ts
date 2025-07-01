import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors';

/**
 * Multer configuration for file uploads
 */
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new BadRequestError('Only image files are allowed'));
    }
};

const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file
};

/**
 * Multer instance for single file upload
 */
const multerUpload = multer({
    storage,
    fileFilter,
    limits
}).single('logo');

/**
 * Wrapper for multer that handles errors
 */
export const uploadSingle = (req: Request, res: Response, next: NextFunction): void => {
    multerUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'File size too large. Maximum size is 5MB'
                });
                return;
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'Too many files. Only one file is allowed'
                });
                return;
            }
            res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'File upload error'
            });
            return;
        }

        if (err instanceof BadRequestError) {
            res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: err.message
            });
            return;
        }

        if (err) {
            res.status(500).json({
                status: 'error',
                statusCode: 500,
                message: 'Internal server error during file upload'
            });
            return;
        }

        next();
    });
};

/**
 * Middleware to validate that a file was uploaded
 */
export const validateFileUpload = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.file) {
        const error = new BadRequestError('No file uploaded. Please provide a logo image');
        next(error);
        return;
    }
    next();
}; 