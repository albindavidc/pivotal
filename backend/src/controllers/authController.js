import jwt from 'jsonwebtoken';
import httpStatusCodes from 'http-status-codes';
import sendResponse from '../utils/sendResponse.js';

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// GitHub Callback
const githubCallback = (req, res) => {
    // `req.user` will be populated by Passport after successful GitHub authentication
    if (!req.user) {
        return sendResponse({
            res,
            statusCode: httpStatusCodes.UNAUTHORIZED,
            success: false,
            message: 'Authentication failed.',
        });
    }

    // Generate JWT for authenticated user
    const token = generateToken(req.user);

    // Send token to frontend
    return sendResponse({
        res,
        statusCode: httpStatusCodes.OK,
        success: true,
        message: 'Authentication successful.',
        data: { token, user: req.user },
    });
};

// Example Home Controller
const getHome = (req, res) => {
    const locals = { title: 'Home | Pivotal' };

    return sendResponse({
        res,
        statusCode: httpStatusCodes.OK,
        success: true,
        message: 'Welcome to Pivotal home.',
        data: locals,
    });
};

export default {
    githubCallback,
    getHome,
};
