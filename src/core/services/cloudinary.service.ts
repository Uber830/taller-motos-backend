import { v2 as cloudinary } from 'cloudinary';
import { InternalServerError, BadRequestError } from '../errors';

/**
 * Cloudinary service for image upload and management
 * @module core/services/cloudinary
 * @category Services
 */
export class CloudinaryService {
    constructor() {
        // Validate Cloudinary configuration
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            throw new Error('Cloudinary configuration is incomplete. Please check your environment variables.');
        }

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

    }

    /**
     * Upload an image to Cloudinary
     * @param {Buffer} fileBuffer - The image file buffer
     * @param {string} folder - The folder to upload to (optional)
     * @param {string} publicId - Custom public ID for the image (optional)
     * @returns {Promise<{url: string, publicId: string}>} The uploaded image URL and public ID
     */
    async uploadImage(
        fileBuffer: Buffer,
        folder: string = 'workshop-logos',
        publicId?: string
    ): Promise<{ url: string; publicId: string }> {
        try {
            if (!fileBuffer || fileBuffer.length === 0) {
                throw new BadRequestError('File buffer is empty or invalid');
            }

            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder,
                        public_id: publicId,
                        resource_type: 'image',
                        transformation: [
                            { width: 400, height: 400, crop: 'fill', gravity: 'center' },
                            { quality: 'auto', fetch_format: 'auto' }
                        ],
                        access_mode: 'public',
                        // Add some additional options for better compatibility
                        eager: [
                            { width: 400, height: 400, crop: 'fill', gravity: 'center' }
                        ],
                        eager_async: true
                    },
                    (error, result) => {
                        if (error) {
                            reject(new InternalServerError(`Failed to upload image to Cloudinary: ${error.message}`));
                        } else if (result) {
                            // Validate the URL
                            if (!result.secure_url || !result.secure_url.startsWith('https://')) {
                                reject(new InternalServerError('Invalid URL returned from Cloudinary'));
                                return;
                            }

                            resolve({
                                url: result.secure_url,
                                publicId: result.public_id
                            });
                        } else {
                            reject(new InternalServerError('No result from Cloudinary upload'));
                        }
                    }
                );

                uploadStream.end(fileBuffer);
            });
        } catch (error) {
            if (error instanceof BadRequestError || error instanceof InternalServerError) {
                throw error;
            }
            throw new InternalServerError('Failed to upload image');
        }
    }

    /**
     * Delete an image from Cloudinary
     * @param {string} publicId - The public ID of the image to delete
     * @returns {Promise<void>}
     */
    async deleteImage(publicId: string): Promise<void> {
        try {
            if (!publicId) {
                console.warn('Attempted to delete image with empty publicId');
                return;
            }

            const result = await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            // Log error but don't throw - image deletion failure shouldn't break the app
        }
    }

    /**
     * Update an image (delete old and upload new)
     * @param {Buffer} newFileBuffer - The new image file buffer
     * @param {string} oldPublicId - The public ID of the old image to delete
     * @param {string} folder - The folder to upload to (optional)
     * @returns {Promise<{url: string, publicId: string}>} The new uploaded image URL and public ID
     */
    async updateImage(
        newFileBuffer: Buffer,
        oldPublicId: string,
        folder: string = 'workshop-logos'
    ): Promise<{ url: string; publicId: string }> {
        try {
            // Delete old image first
            if (oldPublicId) {
                await this.deleteImage(oldPublicId);
            }

            // Upload new image
            return await this.uploadImage(newFileBuffer, folder);
        } catch (error) {
            throw new InternalServerError('Failed to update image');
        }
    }

    /**
     * Test Cloudinary connection
     * @returns {Promise<boolean>} True if connection is successful
     */
    async testConnection(): Promise<boolean> {
        try {
            const result = await cloudinary.api.ping();
            return true;
        } catch (error) {
            console.error('Cloudinary connection test failed:', error);
            return false;
        }
    }
}

export const cloudinaryService = new CloudinaryService(); 