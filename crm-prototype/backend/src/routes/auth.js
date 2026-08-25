import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database/db.js";

const router = express.Router();


// ==================================================
// REGISTER USER
// ==================================================

router.post("/register", async (req, res) => {

    const {

        name,
        email,
        phone,
        password

    } = req.body;


    // VALIDATION

    if (

        !name ||
        !email ||
        !password

    ) {

        return res.status(400).json({

            message:
                "Name, email and password are required"

        });

    }


    try {

        // CHECK IF USER EXISTS

        db.get(

            `
            SELECT id
            FROM users
            WHERE email = ?
            `,

            [email],

            async (err, existingUser) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({

                        message:
                            "Database error"

                    });

                }


                if (existingUser) {

                    return res.status(400).json({

                        message:
                            "Email is already registered"

                    });

                }


                try {

                    // HASH PASSWORD

                    const hashedPassword =
                        await bcrypt.hash(
                            password,
                            10
                        );


                    // CREATE USER

                    db.run(

                        `
                        INSERT INTO users
                        (
                            name,
                            email,
                            phone,
                            password
                        )

                        VALUES (?, ?, ?, ?)
                        `,

                        [

                            name.trim(),
                            email.trim(),
                            phone?.trim() || null,
                            hashedPassword

                        ],

                        function (err) {

                            if (err) {

                                console.error(err);

                                return res.status(500).json({

                                    message:
                                        "Failed to create user"

                                });

                            }


                            res.status(201).json({

                                message:
                                    "User registered successfully",

                                user: {

                                    id:
                                        this.lastID,

                                    name:
                                        name.trim(),

                                    email:
                                        email.trim(),

                                    phone:
                                        phone?.trim() || null

                                }

                            });

                        }

                    );

                } catch (error) {

                    console.error(error);

                    return res.status(500).json({

                        message:
                            "Password processing failed"

                    });

                }

            }

        );

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Registration failed"

        });

    }

});


// ==================================================
// LOGIN USER
// ==================================================

router.post("/login", async (req, res) => {

    const {

        email,
        password

    } = req.body;


    if (

        !email ||
        !password

    ) {

        return res.status(400).json({

            message:
                "Email and password are required"

        });

    }


    db.get(

        `
        SELECT *
        FROM users
        WHERE email = ?
        `,

        [email.trim()],

        async (err, user) => {

            if (err) {

                console.error(err);

                return res.status(500).json({

                    message:
                        "Database error"

                });

            }


            if (!user) {

                return res.status(401).json({

                    message:
                        "Invalid email or password"

                });

            }


            try {

                // CHECK PASSWORD

                const passwordMatches =
                    await bcrypt.compare(

                        password,

                        user.password

                    );


                if (!passwordMatches) {

                    return res.status(401).json({

                        message:
                            "Invalid email or password"

                    });

                }


                // CREATE TOKEN

                const token =
                    jwt.sign(

                        {

                            id:
                                user.id,

                            email:
                                user.email

                        },

                        process.env.JWT_SECRET,

                        {

                            expiresIn:
                                "7d"

                        }

                    );


                // SEND RESPONSE

                res.json({

                    message:
                        "Login successful",

                    token,

                    user: {

                        id:
                            user.id,

                        name:
                            user.name,

                        email:
                            user.email,

                        phone:
                            user.phone

                    }

                });

            } catch (error) {

                console.error(error);

                res.status(500).json({

                    message:
                        "Login failed"

                });

            }

        }

    );

});


// ==================================================
// UPDATE PROFILE
// ==================================================

router.put("/profile", (req, res) => {

    const {

        name,
        phone

    } = req.body;


    const authHeader =
        req.headers.authorization;


    // CHECK TOKEN

    if (

        !authHeader ||
        !authHeader.startsWith("Bearer ")

    ) {

        return res.status(401).json({

            message:
                "Authentication token required"

        });

    }


    const token =
        authHeader.split(" ")[1];


    try {

        const decoded =
            jwt.verify(

                token,

                process.env.JWT_SECRET

            );


        // VALIDATE NAME

        if (

            !name ||
            !name.trim()

        ) {

            return res.status(400).json({

                message:
                    "Name is required"

            });

        }


        // UPDATE USER

        db.run(

            `
            UPDATE users

            SET

                name = ?,

                phone = ?

            WHERE id = ?
            `,

            [

                name.trim(),

                phone?.trim() || null,

                decoded.id

            ],

            function (err) {

                if (err) {

                    console.error(err);

                    return res.status(500).json({

                        message:
                            "Failed to update profile"

                    });

                }


                if (this.changes === 0) {

                    return res.status(404).json({

                        message:
                            "User not found"

                    });

                }


                // FETCH UPDATED USER

                db.get(

                    `
                    SELECT

                        id,

                        name,

                        email,

                        phone

                    FROM users

                    WHERE id = ?
                    `,

                    [decoded.id],

                    (err, user) => {

                        if (err) {

                            console.error(err);

                            return res.status(500).json({

                                message:
                                    "Failed to fetch updated profile"

                            });

                        }


                        res.json({

                            message:
                                "Profile updated successfully",

                            user

                        });

                    }

                );

            }

        );

    } catch (error) {

        console.error(error);

        return res.status(401).json({

            message:
                "Invalid or expired token"

        });

    }

});


// ==================================================
// CHANGE PASSWORD
// ==================================================

router.put("/change-password", (req, res) => {

    const {

        currentPassword,
        newPassword

    } = req.body;


    const authHeader =
        req.headers.authorization;


    // CHECK TOKEN

    if (

        !authHeader ||
        !authHeader.startsWith("Bearer ")

    ) {

        return res.status(401).json({

            message:
                "Authentication token required"

        });

    }


    // VALIDATE INPUT

    if (

        !currentPassword ||
        !newPassword

    ) {

        return res.status(400).json({

            message:
                "Current password and new password are required"

        });

    }


    if (

        newPassword.length < 6

    ) {

        return res.status(400).json({

            message:
                "New password must be at least 6 characters"

        });

    }


    const token =
        authHeader.split(" ")[1];


    try {

        const decoded =
            jwt.verify(

                token,

                process.env.JWT_SECRET

            );


        // GET USER

        db.get(

            `
            SELECT *
            FROM users
            WHERE id = ?
            `,

            [decoded.id],

            async (err, user) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({

                        message:
                            "Database error"

                    });

                }


                if (!user) {

                    return res.status(404).json({

                        message:
                            "User not found"

                    });

                }


                try {

                    // VERIFY CURRENT PASSWORD

                    const passwordMatches =
                        await bcrypt.compare(

                            currentPassword,

                            user.password

                        );


                    if (!passwordMatches) {

                        return res.status(401).json({

                            message:
                                "Current password is incorrect"

                        });

                    }


                    // HASH NEW PASSWORD

                    const hashedPassword =
                        await bcrypt.hash(

                            newPassword,

                            10

                        );


                    // UPDATE PASSWORD

                    db.run(

                        `
                        UPDATE users

                        SET password = ?

                        WHERE id = ?
                        `,

                        [

                            hashedPassword,

                            decoded.id

                        ],

                        function (err) {

                            if (err) {

                                console.error(err);

                                return res.status(500).json({

                                    message:
                                        "Failed to change password"

                                });

                            }


                            res.json({

                                message:
                                    "Password changed successfully"

                            });

                        }

                    );

                } catch (error) {

                    console.error(error);

                    return res.status(500).json({

                        message:
                            "Password processing failed"

                    });

                }

            }

        );

    } catch (error) {

        console.error(error);

        return res.status(401).json({

            message:
                "Invalid or expired token"

        });

    }

});


export default router;