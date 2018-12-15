const mysql = require("mysql");
const inquirer = require('inquirer');
const cTable = require('console.table');
const clear = require('clear');
const chalk = require('chalk');
let items;
const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon_db"
});
const connectToDB = () => {
    connection.connect(err => {
        if (err) throw err;
        console.log('Connection to DB established Successfully');
    });
}
const updateLocalCopy = () => {
    let sql = 'select * from items';
    connection.query(sql, (err, resultSet) => {
        if (err) throw err;
        items = resultSet.map(r => r.productname);
    });
}
const displayItems = () => {
    let sql = 'select * from items ';
    // if (param) {
    //     let whereClause = (artistFlag) ? `where artist = "${param}"` : `where genre = "${param}"`;
    //     sql += whereClause;
    // };
    console.log(sql);
    connection.query(sql, (err, resultSet) => {
        if (err) throw err;
        console.table(resultSet);
        setTimeout(displayMenu, 100);
    });
};
const startApp = () => {
    clear();
    connectToDB();
    updateLocalCopy();
    setTimeout(displayMenu, 100);
}
const displayMenu = () => {
    console.log(chalk.red("You can exit the game at any time by pressing Ctrl + C on your keyboard."));
    inquirer.prompt([{
        "type": "list",
        "name": "choice",
        "message": "Select an action:",
        "choices": ["Display all Items", "Add Item", "Update Item", "Buy Item"]
    }]).then(response => {
        switch (response.choice) {
            case "Display all Items":
                displayItems('', false);
                break;
            case "Add Item":
                addItem();
                break;
            case "Update Item":
                updateItem();
                break;
            // case "Delete Item":
            //     deleteItem();
            //     break;
            case "Buy Item":
                BidItem();
                break;
        }
    });
}
const addItem = () => {
    inquirer.prompt([{
        "type": "input",
        "name": "itemName",
        "message": "Enter Item Name:",
        "validate": value => (value !== "")
    },
    {
        "type": "input",
        "name": "initialBid",
        "message": "Enter Initial price:",
        "validate": value => (value !== "")
    },
    {
        "type": "input",
        "name": "department",
        "message": "Enter Item department:",
        "validate": value => (value !== "")
    },
    {
        "type": "input",
        "name": "stock",
        "message": "Enter Item stock:",
        "validate": value => (value !== "")
        ,
    },
    {
        "type": "confirm",
        "name": "continue",
        "message": "Add another Item?",
        "default": true
    }
    ]).then(response => {
        const sql = `INSERT INTO Items (productname, startingbid, department, stock) VALUES ("${response.itemName}", "${response.initialBid}", "${response.department}")`;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            console.log(chalk.green("\Item Added!\n"));
            if (response.continue) {
                console.log();
                addItem();
            } else {
                setTimeout(displayMenu, 100);
            }
        });
    });
}
const updateItem = () => {
    inquirer.prompt([{
        "type": "list",
        "name": "item",
        "message": "Select item that you want to update:",
        "choices": items
    },
    {
        "type": "input",
        "name": "title_new",
        "message": "Update the Item Name:",
        "validate": value => (value !== "")
    },
    {
        "type": "input",
        "name": "initbid_new",
        "message": "Update the Starting Bid:",
        "validate": value => (value !== "")
    },
    {
        "type": "confirm",
        "name": "continue",
        "message": "Update another Item?",
        "default": true
    }
    ]).then(response => {
        const sql = `UPDATE items SET productname = "${response.title_new}", startingbid = "${response.initbid_new}" WHERE productname = "${response.item}"`;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            console.log(chalk.green("\Item successfully updated!\n"));
            // Update the local copy
            updateLocalCopy();
            if (response.continue) {
                console.log();
                updateItem();
            } else {
                setTimeout(displayMenu, 100);
            }
        });
    });
}
// const deleteSong = () => {
//     inquirer.prompt([{
//             "type": "list",
//             "name": "title",
//             "message": "Select the song that you want to delete:",
//             "choices": songs
//         },
//         {
//             "type": "confirm",
//             "name": "continue",
//             "message": "Delete another Song?",
//             "default": true
//         }
//     ]).then(response => {
//         const sql = `delete from songs where title = "${response.title}"`;
//         connection.query(sql, (error, result) => {
//             if (error) throw error;
//             console.log(chalk.green("\Song successfully deleted!\n"));
//             // Update the local copy
//             updateLocalCopy();
//             if (response.continue) {
//                 console.log();
//                 deleteSong();
//             } else {
//                 setTimeout(displayMenu, 100);
//             }
//         });
//     });
// };
const BidItem = () => {
    inquirer.prompt([{
        "type": "list",
        "name": "choice",
        "message": "Bid on :",
        "choices": items
    }]).then(response => {
        // if (response.choice == 'Artist') {
        //     searchBy('Artist')
        // } else {
        //     searchBy('Genre')
        // }
        BidOn(response.choice)
    });
}
// const BidOn = item => {
//     inquirer.prompt([{
//         "type": "input",
//         "name": "value",
//         "message": "Enter Bid value ",
//         "validate": value => (value !== "")
//     }]).then(response => {
//         const sql = `SELECT productprice FROM Items  WHERE productname = "${item}"`;
//         connection.query(sql, (error, result) => {
//             if (error) throw error;
//             console.log(chalk.green("\Item successfully updated!\n"));
//             // Update the local copy
//             updateLocalCopy();
//             if (response.continue) {
//                 console.log();
//                 updateItem();
//             } else {
//                 setTimeout(displayMenu, 100);
//             }
//     });
// }
function BidOn(item) {
    inquirer.prompt([{
        "type": "input",
        "name": "value",
        "message": "Enter Bid value ",
        "validate": value => (value !== "")
    }]).then(response => {
        const sql = `SELECT productprice FROM Items  WHERE productname = "${item}"`;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            console.log(chalk.green(result));

        })
    })
}
startApp();