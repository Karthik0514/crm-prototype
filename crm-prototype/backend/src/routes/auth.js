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


    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

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

        // -----------------------------------------
        // CHECK IF USER EXISTS
        // -----------------------------------------

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

                    // -----------------------------------------
                    // HASH PASSWORD
                    // -----------------------------------------

                    const hashedPassword =
                        await bcrypt.hash(
                            password,
                            10
                        );


                    // -----------------------------------------
                    // CREATE USER
                    // -----------------------------------------

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

                            name,
                            email,
                            phone || null,
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

                                    name,

                                    email,

                                    phone:
                                        phone || null

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

        [email],

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

                // -----------------------------------------
                // CHECK PASSWORD
                // -----------------------------------------

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


                // -----------------------------------------
                // CREATE TOKEN
                // -----------------------------------------

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


                // -----------------------------------------
                // SEND RESPONSE
                // -----------------------------------------

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


export default router;