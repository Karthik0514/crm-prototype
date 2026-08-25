import jwt from "jsonwebtoken";

export default function authenticateToken(
    req,
    res,
    next
) {

    // Get Authorization header
    const authHeader =
        req.headers.authorization;

    // Expected format:
    // Bearer YOUR_JWT_TOKEN

    if (!authHeader) {

        return res.status(401).json({

            message:
                "Authentication required"

        });

    }


    const token =
        authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;


    if (!token) {

        return res.status(401).json({

            message:
                "Invalid authentication token"

        });

    }


    try {

        const decoded =
            jwt.verify(

                token,

                process.env.JWT_SECRET

            );


        // Make logged-in user available
        // to protected routes

        req.user = decoded;


        next();

    }

    catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );


        return res.status(401).json({

            message:
                "Invalid or expired token"

        });

    }

}