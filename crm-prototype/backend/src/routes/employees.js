import express from "express";
import db from "../database/db.js";

const router = express.Router();


// ==========================================
// GET ALL EMPLOYEES
// ==========================================

router.get("/", (req, res) => {

    db.all(

        `
        SELECT *
        FROM employees
        ORDER BY id DESC
        `,

        [],

        (err, employees) => {

            if (err) {

                console.error(
                    "❌ Error getting employees:",
                    err.message
                );

                return res.status(500).json({

                    message:
                        "Failed to get employees"

                });

            }


            res.json(employees);

        }

    );

});


// ==========================================
// GET ONE EMPLOYEE
// ==========================================

router.get("/:id", (req, res) => {

    db.get(

        `
        SELECT *
        FROM employees
        WHERE id = ?
        `,

        [req.params.id],

        (err, employee) => {

            if (err) {

                console.error(
                    "❌ Error getting employee:",
                    err.message
                );

                return res.status(500).json({

                    message:
                        "Failed to get employee"

                });

            }


            if (!employee) {

                return res.status(404).json({

                    message:
                        "Employee not found"

                });

            }


            res.json(employee);

        }

    );

});


// ==========================================
// CREATE EMPLOYEE
// ==========================================

router.post("/", (req, res) => {

    const {

        name,
        email,
        phone,
        role,
        department,
        status

    } = req.body;


    // VALIDATION

    if (

        !name ||
        !email ||
        !role

    ) {

        return res.status(400).json({

            message:
                "Name, email and role are required"

        });

    }


    db.run(

        `
        INSERT INTO employees
        (

            name,
            email,
            phone,
            role,
            department,
            status

        )

        VALUES (?, ?, ?, ?, ?, ?)
        `,

        [

            name,
            email,
            phone || null,
            role,
            department || null,
            status || "Active"

        ],

        function (err) {

            if (err) {

                console.error(
                    "❌ Error creating employee:",
                    err.message
                );


                // UNIQUE EMAIL ERROR

                if (

                    err.message.includes(
                        "UNIQUE constraint failed"
                    )

                ) {

                    return res.status(400).json({

                        message:
                            "An employee with this email already exists"

                    });

                }


                return res.status(500).json({

                    message:
                        "Failed to create employee"

                });

            }


            // RETURN NEW EMPLOYEE

            db.get(

                `
                SELECT *
                FROM employees
                WHERE id = ?
                `,

                [this.lastID],

                (err, employee) => {

                    if (err) {

                        return res.status(500).json({

                            message:
                                "Employee created but failed to retrieve it"

                        });

                    }


                    res.status(201).json({

                        message:
                            "Employee added successfully",

                        employee

                    });

                }

            );

        }

    );

});


// ==========================================
// UPDATE EMPLOYEE
// ==========================================

router.put("/:id", (req, res) => {

    const {

        name,
        email,
        phone,
        role,
        department,
        status

    } = req.body;


    if (

        !name ||
        !email ||
        !role

    ) {

        return res.status(400).json({

            message:
                "Name, email and role are required"

        });

    }


    db.run(

        `
        UPDATE employees

        SET

            name = ?,
            email = ?,
            phone = ?,
            role = ?,
            department = ?,
            status = ?

        WHERE id = ?
        `,

        [

            name,
            email,
            phone || null,
            role,
            department || null,
            status || "Active",
            req.params.id

        ],

        function (err) {

            if (err) {

                console.error(
                    "❌ Error updating employee:",
                    err.message
                );


                if (

                    err.message.includes(
                        "UNIQUE constraint failed"
                    )

                ) {

                    return res.status(400).json({

                        message:
                            "Another employee already uses this email"

                    });

                }


                return res.status(500).json({

                    message:
                        "Failed to update employee"

                });

            }


            if (this.changes === 0) {

                return res.status(404).json({

                    message:
                        "Employee not found"

                });

            }


            res.json({

                message:
                    "Employee updated successfully"

            });

        }

    );

});


// ==========================================
// DELETE EMPLOYEE
// ==========================================

router.delete("/:id", (req, res) => {

    db.run(

        `
        DELETE FROM employees
        WHERE id = ?
        `,

        [req.params.id],

        function (err) {

            if (err) {

                console.error(
                    "❌ Error deleting employee:",
                    err.message
                );

                return res.status(500).json({

                    message:
                        "Failed to delete employee"

                });

            }


            if (this.changes === 0) {

                return res.status(404).json({

                    message:
                        "Employee not found"

                });

            }


            res.json({

                message:
                    "Employee deleted successfully"

            });

        }

    );

});


export default router;