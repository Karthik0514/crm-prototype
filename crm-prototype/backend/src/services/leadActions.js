import db from "../database/db.js";


// ============================================================
// UPDATE LEAD
// ============================================================

export function updateLead(id, data) {

    return new Promise((resolve, reject) => {

        // --------------------------------------------------------
        // First get the existing lead so we know the old status
        // --------------------------------------------------------

        db.get(
            `
            SELECT *
            FROM leads
            WHERE id = ?
            `,
            [id],
            (getError, existingLead) => {

                if (getError) {

                    console.error(
                        "❌ Error getting lead before update:",
                        getError.message
                    );

                    reject(getError);
                    return;
                }


                if (!existingLead) {

                    reject(
                        new Error("Lead not found")
                    );

                    return;
                }


                const oldStatus =
                    existingLead.status;


                // ------------------------------------------------
                // UPDATE LEAD
                // ------------------------------------------------

                db.run(
                    `
                    UPDATE leads
                    SET
                        name = ?,
                        company = ?,
                        phone = ?,
                        email = ?,
                        source = ?,
                        status = ?,
                        notes = ?
                    WHERE id = ?
                    `,
                    [
                        data.name,
                        data.company,
                        data.phone,
                        data.email,
                        data.source,
                        data.status,
                        data.notes,
                        id
                    ],
                    function (updateError) {

                        if (updateError) {

                            console.error(
                                "❌ Error updating lead:",
                                updateError.message
                            );

                            reject(updateError);
                            return;
                        }


                        // ------------------------------------------------
                        // CHECK WHETHER STATUS ACTUALLY CHANGED
                        // ------------------------------------------------

                        const statusChanged =
                            oldStatus !== data.status;


                        if (!statusChanged) {

                            resolve({
                                updated: true,
                                statusChanged: false
                            });

                            return;
                        }


                        // ------------------------------------------------
                        // CREATE STATUS CHANGE NOTIFICATION
                        // ------------------------------------------------

                        db.run(
                            `
                            INSERT INTO notifications
                            (
                                title,
                                message,
                                type,
                                related_id
                            )
                            VALUES (?, ?, ?, ?)
                            `,
                            [
                                "Lead Status Updated",

                                `${data.name || existingLead.name}'s status changed from ${oldStatus} to ${data.status}.`,

                                "status_change",

                                Number(id)
                            ],
                            (notificationError) => {

                                if (notificationError) {

                                    console.error(
                                        "❌ Failed to create status notification:",
                                        notificationError.message
                                    );

                                    // The lead update succeeded,
                                    // so don't reject the whole operation.
                                } else {

                                    console.log(
                                        `🔔 Status notification created for lead ${id}`
                                    );
                                }


                                resolve({
                                    updated: true,
                                    statusChanged: true,
                                    oldStatus,
                                    newStatus: data.status
                                });

                            }
                        );

                    }
                );

            }
        );

    });

}



// ============================================================
// DELETE LEAD
// ============================================================

export function deleteLead(id) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            DELETE FROM leads
            WHERE id = ?
            `,

            [id],

            function (err) {

                if (err) {

                    console.error(
                        "❌ Error deleting lead:",
                        err.message
                    );

                    reject(err);

                } else {

                    resolve({
                        deleted: true
                    });

                }

            }

        );

    });

}



// ============================================================
// CONVERT LEAD
// ============================================================

export function convertLead(id) {

    return new Promise((resolve, reject) => {

        // --------------------------------------------------------
        // Get lead first
        // --------------------------------------------------------

        db.get(
            `
            SELECT *
            FROM leads
            WHERE id = ?
            `,
            [id],
            (getError, lead) => {

                if (getError) {

                    console.error(
                        "❌ Error getting lead before conversion:",
                        getError.message
                    );

                    reject(getError);
                    return;
                }


                if (!lead) {

                    reject(
                        new Error("Lead not found")
                    );

                    return;
                }


                // ------------------------------------------------
                // Already converted?
                // ------------------------------------------------

                if (lead.status === "Converted") {

                    reject(
                        new Error(
                            "Lead is already converted"
                        )
                    );

                    return;
                }


                // ------------------------------------------------
                // CONVERT
                // ------------------------------------------------

                db.run(
                    `
                    UPDATE leads
                    SET status = 'Converted'
                    WHERE id = ?
                    `,
                    [id],
                    function (updateError) {

                        if (updateError) {

                            console.error(
                                "❌ Error converting lead:",
                                updateError.message
                            );

                            reject(updateError);
                            return;
                        }


                        // ------------------------------------------------
                        // CREATE CONVERSION NOTIFICATION
                        // ------------------------------------------------

                        db.run(
                            `
                            INSERT INTO notifications
                            (
                                title,
                                message,
                                type,
                                related_id
                            )
                            VALUES (?, ?, ?, ?)
                            `,
                            [
                                "Lead Converted 🎉",

                                `${lead.name} has been converted.`,

                                "converted",

                                Number(id)
                            ],
                            (notificationError) => {

                                if (notificationError) {

                                    console.error(
                                        "❌ Failed to create conversion notification:",
                                        notificationError.message
                                    );

                                } else {

                                    console.log(
                                        `🔔 Conversion notification created for lead ${id}`
                                    );
                                }


                                resolve({
                                    converted: true
                                });

                            }
                        );

                    }
                );

            }
        );

    });

}