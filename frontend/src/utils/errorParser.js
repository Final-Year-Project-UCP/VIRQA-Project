/**
 * errorParser.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized utility to extract a clean, user-friendly error message from
 * any type of error thrown in the application (Axios, network, generic JS).
 *
 * Usage:
 *   import { getErrorMessage } from '../utils/errorParser';
 *   toast.error(getErrorMessage(err));
 *
 * Or use the pre-built map for known HTTP status codes:
 *   import { HTTP_MESSAGES } from '../utils/errorParser';
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Friendly copy for common HTTP status codes */
export const HTTP_MESSAGES = {
    400: "The information you submitted is incomplete or incorrect. Please review and try again.",
    401: "You are not authorised. Please log in and try again.",
    403: "You don't have permission to perform this action.",
    404: "The requested resource could not be found.",
    409: "This record already exists. Please use a different value.",
    422: "The data you entered couldn't be processed. Please check all fields.",
    429: "Too many requests. Please wait a moment before trying again.",
    500: "Something went wrong on our end. Please try again shortly.",
    502: "The AI service is temporarily unavailable. Please try again.",
    503: "The service is currently unavailable. Please try again later.",
};

/**
 * Extracts the best available human-readable error message from an error.
 *
 * Priority order:
 *  1. Server-sent `message` field in the JSON response body (most specific)
 *  2. Known HTTP status code copy (generic fallback)
 *  3. Network error string (e.g. "Network Error")
 *  4. The raw error message
 *  5. The `fallback` string you supply (defaults to a generic message)
 *
 * @param {unknown} error - The error caught in a catch/onError handler
 * @param {string}  [fallback] - Fallback message if nothing else is available
 * @returns {string} A user-friendly message string
 */
export const getErrorMessage = (
    error,
    fallback = "An unexpected error occurred. Please try again."
) => {
    if (!error) return fallback;

    // ── Axios / API error ──
    if (error.response) {
        const serverMsg = error.response.data?.message;
        if (serverMsg && typeof serverMsg === "string" && serverMsg.trim()) {
            return serverMsg.trim();
        }

        // Fall back to our copy for the HTTP status code
        const statusMsg = HTTP_MESSAGES[error.response.status];
        if (statusMsg) return statusMsg;

        return fallback;
    }

    // ── Network / connection error (no response from server) ──
    if (error.request || error.message === "Network Error") {
        return "Unable to reach the server. Please check your internet connection and try again.";
    }

    // ── Timeout ──
    if (error.code === "ECONNABORTED") {
        return "The request took too long. Please try again.";
    }

    // ── Plain JS Error ──
    if (error.message && typeof error.message === "string" && error.message.trim()) {
        return error.message.trim();
    }

    return fallback;
};

export default getErrorMessage;
