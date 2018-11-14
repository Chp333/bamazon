var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  promptUser();

});


function promptUser() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function (answer) {
      console.log("You got this far");
      switch (answer.action) {
        case "View Products for Sale":
          productList();
          break;

        case "View Low Inventory":
          viewInv();
          break;

        case "Add to Inventory":
          addInv();
          break;

        case "Add New Product":
          AddProduct();
          break;
      }
    });
}

function productList() {

  // if (answer.action === "Current Products for Sale") {
  console.table("Item#" + " | " + "Product" + " | " + "Department" + " | " + "Price" + " | " + "Quantity");
  console.log("--------------------------------------------------");
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {

      console.table(res[i].item_id + "     | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + "\n--------------------------------------------------");
    }

    promptUser();
  });

}


function viewInv() {
  console.table("Item#" + " | " + "Product" + " | " + "Department" + " | " + "Price" + " | " + "Quantity");
  console.log("--------------------------------------------------");
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.table(res[i].item_id + "     | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + "\n--------------------------------------------------");
    }


    promptUser();

  });
}


function addInv() {
  inquirer.prompt([
    {
      type: "input",
      name: "item",
      message: "Enter the item ID, you would like to add inventory too:",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      type: "input",
      name: "qty",
      message: "How many units would you like to add:",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ]).then(function (answer) {

    console.log("Updating Inventory...\n");
    var query = "SELECT stock_quantity FROM products WHERE ?";
    connection.query(query, { item_id: answer.item }, function (err, res) {
      console.log(res);
      var qtyReturn = res[0].stock_quantity;
      if (answer.qty < qtyReturn) {
        var query = connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: qtyReturn + parseInt(answer.qty)
            },
            {
              item_id: answer.item
            }
          ],
          function (err, res) {
            console.log(res.affectedRows + " Invenotry updated!\n");

          }
        );

        // logs the actual query being run
        console.log(query.sql);
      }
      promptUser();
    })
  });


  function AddProduct() {
    // prompt for info about the item to add
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "What is the name of the product you would like to add?"
        },
        {
          name: "dept",
          type: "input",
          message: "What department would you like to place the product in?"
        },
        {
          name: "price",
          type: "input",
          message: "What is the price?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "qty",
          type: "input",
          message: "What is the quantity?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function (answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.item,
            department_name: answer.dept,
            price: answer.price,
            stock_quantity: answer.qty
          },
          function (err) {
            if (err) throw err;
            console.log("Your product was added successfully!");
            // re-prompt the user for a selection
            promptUser();
          }
        );
      });
  }
}


        //   .then(function(answer) {
        //     connection.query(
        //       "UPDATE stock_quantity WHERE item =  ?",
        //       [
        //         {
        //         product_name: answer.action
        //         },
        //         {
        //         stock_quantity: answer.action
        //         }
        //       ],
        //       function(err, res) {
        //         console.log(res.affectedRows + " Invenotry updated!\n");

        //       }
        //     );

        //     // logs the actual query being run
        //     console.log(query.sql);
        //   }
