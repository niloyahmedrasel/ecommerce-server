import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';


const generateRefreshToken = async (userId) => {

    try {
        if (!userId) throw new Error('Invalid user ID');

        // 1. Generate refresh token
    const token = jwt.sign(
        { id: userId },
        process.env.SECRET_KEY_REFRESH_TOKEN,
        { expiresIn: '7d' }
    );

        // 2. Hash the refresh token before storing
    const salt = await bcryptjs.genSalt(10);
    const hashedToken = await bcryptjs.hash(token, salt);

        // 3. Update user document
    const updateRefreshTokenUser = await UserModel.updateOne(
        { _id: userId },
        { refresh_token: hashedToken }
    );

    if (updateRefreshTokenUser.matchedCount === 0) {
        throw new Error('User not found');
    }

    
    return token;
    } catch (error) {
        console.error('Refresh Token Error:', error.message);
        throw new Error('Failed to generate refresh token');
    }
}

export default generateRefreshToken;