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
//function is in the name
const connectToDB = () => {
    connection.connect(err => {
        if (err) throw err;
        console.log('Connection to DB established Successfully');
    });
}
//function is in the anme
const updateLocalCopy = () => {
    let sql = 'select * from items';
    connection.query(sql, (err, resultSet) => {
        if (err) throw err;
        items = resultSet.map(r => r.productname);
    });
}
//pulls items available
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
//starts the app
const startApp = () => {
    clear();
    connectToDB();
    updateLocalCopy();
    setTimeout(displayMenu, 100);
}
//starts the process
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
                BuyItem();
                break;
        }
    });
}
//adds item to database for sale
const addItem = () => {
    inquirer.prompt([{
        "type": "input",
        "name": "productname",
        "message": "Enter Item Name:",
        "validate": value => (value !== "")
    },
    {
        "type": "input",
        "name": "productprice",
        "message": "Enter Item Price:",
        "validate": value => (value !== "")
    },
    {
        "type": "input",
        "name": "department",
        "message": "Enter Item Department:",
        "validate": value => (value !== "")
    },
    {
        "type": "input",
        "name": "stock",
        "message": "Enter Item Stock:",
        "validate": value => (value !== "")
    },
    {
        "type": "confirm",
        "name": "continue",
        "message": "Add another Item?",
        "default": true
    }
    ]).then(response => {
        const sql = `INSERT INTO Items (productname, productprice, department, stock) VALUES ("${response.productname}", "${response.productprice}", "${response.department}", "${response.stock}")`;
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
//can update the various aspects of the item
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
        "name": "prodprice_new",
        "message": "Update Product Price:",
        "validate": value => (value !== "")
    },
    {
        "type": "input",
        "name": "dept_new",
        "message": "Update Product Department:",
        "validate": value => (value !== "")
    },
    {
        "type": "input",
        "name": "stock_new",
        "message": "Update Product Stock (total number):",
        "validate": value => (value !== "")
    },
    {
        "type": "confirm",
        "name": "continue",
        "message": "Update another Item?",
        "default": true
    }
    ]).then(response => {
        const sql = `UPDATE items SET productname = "${response.title_new}", productprice = "${response.prodprice_new}", department = "${response.dept_new}", stock = "${response.stock_new}" WHERE productname = "${response.item}"`;
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
const BuyItem = () => {
    inquirer.prompt([{
        "type": "list",
        "name": "choice",
        "message": "Buy an Item:",
        "choices": items
    }]).then(response => {
        console.log()
        Buy(response.choice)
    });
}
// }
function Buy(item) {    
    inquirer.prompt([{
        "type": "confirm",
        "name": "continue",
        "message": "Confirm Purchase?",
        "default": true
    }]).then(response => {
        if (response === true) {
            const sql = `UPDATE items SET stock = stock - 1 WHERE productname = "${item}"`
            console.log(chalk.green("\Item Purchased!\n"));
        }
        else {
            console.log("Would you l?")
            setTimeout(displayMenu, 100)
        }

    })


}
startApp();

