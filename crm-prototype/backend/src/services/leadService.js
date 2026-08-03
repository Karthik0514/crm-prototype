import db from "../database/db.js";

export function searchLead(searchText) {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT *
            FROM leads
            WHERE
                name LIKE ?
                OR company LIKE ?
            `,

            [
                `%${searchText}%`,
                `%${searchText}%`
            ],

            (err, rows) => {

                if (err)
                    reject(err);

                else
                    resolve(rows);

            }

        );

    });

}

export function getAllLeads() {

    return new Promise((resolve, reject) => {

        db.all(

            "SELECT * FROM leads",

            [],

            (err, rows) => {

                if (err)
                    reject(err);

                else
                    resolve(rows);

            }

        );

    });

}