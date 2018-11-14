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

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
  
});

function afterConnection() {
    console.table("Item#" + " | " + "Product" + " | " + "Department" + " | " + "Price" + " | " + "Quantity");
    console.log("--------------------------------------------------");
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            
            console.table(res[i].item_id + "     | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + "\n--------------------------------------------------");
          }
          
        
    promptUser();
    });

}

var promptUser = function() {
    inquirer.prompt([

    {
      type: "input",
      name: "item",
      message: "Enter the # of the item you would like to buy: ",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
  
    {
      type: "input",
      name: "qty",
      message: "How many would you like?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },

]).then(function(answer) {
    console.log(answer);
      var query = "SELECT stock_quantity FROM products WHERE ?";
      connection.query(query, {item_id:answer.item}, function(err, res) {
      console.log(res); 
      var qtyReturn = res[0].stock_quantity;
        if (answer.qty < qtyReturn) {
            var query = connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: qtyReturn - answer.qty
                },
                {
                  item_id: answer.item
                }
              ],
              function(err, res) {
                console.log(res.affectedRows + " products updated!\n");

        }) 
      } else {
          console.log("Insufficient quantity!");
        }
        afterConnection() 
        
        });
   

});
}
