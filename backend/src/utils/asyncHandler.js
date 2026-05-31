// Wrapper for standardizing error handling across all route handlers.
// In addition to forwarding ApiError instances, this also intercepts raw
// MongoDB/Mongoose errors and converts them into clean, user-friendly messages.

/**
 * Maps a MongoDB duplicate-key error (code 11000) to a readable field name.
 */
const getDuplicateKeyMessage = (err) => {
    // err.keyValue contains the field/value pair that caused the conflict, e.g. { email: "x@y.com" }
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "field";

    const fieldLabels = {
        email: "Email address",
        phoneNumber: "Phone number",
        username: "Username",
        name: "Name",
    };

    const label = fieldLabels[field] || field.charAt(0).toUpperCase() + field.slice(1);
    return `${label} is already registered. Please use a different one.`;
};

/**
 * Maps Mongoose ValidationError to a concise message listing what's wrong.
 */
const getValidationMessage = (err) => {
    const messages = Object.values(err.errors).map((e) => e.message);
    return messages.join(". ");
};

const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            // ── MongoDB Duplicate Key Error (unique constraint) ──
            if (err.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: getDuplicateKeyMessage(err),
                });
            }

            // ── Mongoose Validation Error ──
            if (err.name === "ValidationError") {
                return res.status(400).json({
                    success: false,
                    message: getValidationMessage(err),
                });
            }

            // ── Mongoose CastError (bad ObjectId, wrong type, etc.) ──
            if (err.name === "CastError") {
                return res.status(400).json({
                    success: false,
                    message: `Invalid value for field "${err.path}". Please check the data you entered.`,
                });
            }

            // ── JWT Errors ──
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({
                    success: false,
                    message: "Your session is invalid. Please log in again.",
                });
            }

            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Your session has expired. Please log in again.",
                });
            }

            // ── Default / ApiError ──
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "An unexpected error occurred. Please try again.",
            });
        }
    };
};

export default asyncHandler;