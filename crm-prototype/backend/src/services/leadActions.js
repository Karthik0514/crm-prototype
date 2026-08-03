import db from "../database/db.js";

// UPDATE LEAD
export function updateLead(id, data) {

    return new Promise((resolve, reject) => {

        db.run(
            `
            UPDATE leads
            SET
                name=?,
                company=?,
                phone=?,
                email=?,
                source=?,
                status=?,
                notes=?
            WHERE id=?
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
            function (err) {

                if (err)
                    reject(err);
                else
                    resolve();

            }
        );

    });

}


// DELETE LEAD
export function deleteLead(id) {

    return new Promise((resolve, reject) => {

        db.run(

            "DELETE FROM leads WHERE id=?",

            [id],

            function (err) {

                if (err)
                    reject(err);

                else
                    resolve();

            }

        );

    });

}


// CONVERT LEAD
export function convertLead(id) {

    return new Promise((resolve, reject) => {

        db.run(

            "UPDATE leads SET status='Converted' WHERE id=?",

            [id],

            function (err) {

                if (err)
                    reject(err);

                else
                    resolve();

            }

        );

    });

}