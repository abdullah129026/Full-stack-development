// // // var , let , const

// // var x = "hello World!";
// // var x = "world"; //true
// // x = "Wow" //true
// // //var used inside a loop can be accesssed outside the loop  // golbal scope
// // console.log(x);

// // let x = "hi";
// // // let x = "hello" //false
// // x = "wow" //true //block scope
// // //let used inside a loop can't be accesssed outside the loop
// // console.log(x);

// // //const a = 123;
// // // const a = 456; //false
// // a = 456 //false
// // //const can't be accessed outside the block
// // console.log(a);


// // //template string

// // //before ES6
// // var user = "A B";
// // var greet = "Hello" + user;
// // document.write(greet);
// // //after ES6
// // let user = "A B";
// // let greet = `hello ${user}  world`;
// // let see = `world ${greet} is running`;
// // doucment.write(see);

// // function name(user, greet) {
// //     console.log(`${user} ${greet} `);
// // }
// // name();

// // //arrow functions

// // //before
// // function name(user) {
// //     return `hello ${user}`;
// // }
// // name();
// // let hi = function () {
// //     console.log("hello");
// // }
// // hi();

// // //after
// // var his = () => console.log("hello");
// // his();

// // //rest operator

// // //before
// // function sum() {
// //     let sum = 0;
// //     for (var i = 0; i < argu.length; i++) {
// //         sum += argu[i];
// //     }
// //     doucment.write(sum);
// // }
// // sum(10, 20, 30, 40, 50);

// // //what when person inputs a string at first

// // //then we use rest operators

// // function sume(name, ...argu) {
// //     let sum = "0";
// //     for (var i = 1; i < argu.length; i++) {
// //         sum += argu[i];
// //     }
// //     console.log(`${name} is running`); //if it is not done the whole optput will be in strings
// //     console.log(sum);
// // }
// // sume("A B", 10, 20, 30, 40, 50);
// // let arr = [10, 20, 30, 40, 50]
// // sume("A B", ...arr); //spread operator


// // //concatenation using spread operator
// // let arr1 = [10, 20, 30]
// // let arr2 = [40, 50, 60]

// // let arr3 = [...arr1, ...arr2]
// // console.log(arr3);

// // //cloning an array using spread operator
// // let arr4 = [...arr1]
// // console.log(arr4);

// // //concatenating objects
// // let obj1 = { name: "A B", age: 20 }
// // let obj2 = { city: "Islamabad", country: "Pakistan" }

// // let obj3 = { ...obj1, ...obj2 }
// // console.log(obj3);

// // //cloning an object using spread operator
// // let obj4 = { ...obj1 }
// // console.log(obj4);

// // //objects in objects
// // let obj5 = { name: "A B", age: 20, address: { city: "Islamabad", country: "Pakistan" } }
// // console.log(obj5.address.city);

// // //object literals

// // //old method

// // // let pname="A B"
// // // let age=20

// // // let person={pname:pname,age:age}
// // // console.log(person);

// // //new method

// // // let person1={
// // //     pname,
// // //     age
// // //     }
// // // console.log(person1);



// // let n = "student";

// // var obj = {
// //     [n + "name"]: "AbB",
// //     course: "IT",

// // }
// // console.log(obj);


// // // object
// // // before ES6
// // var a = "name";

// // var obj = {
// //     [a]: "AbB",
// //     course: "IT",
// // }
// // console.log(obj);


// // var b = "age";
// // var c = "city";

// // var obj1a = {
// //     [b]: 20,
// //     [c]: "Islamabad"
// // }
// // console.log(obj1a);


// // // after ES6
// // let name = "AbB";
// // let age = 20;
// // let city = "Islamabad"

// // let person = {
// //     name,
// //     age,
// //     city
// // }
// // console.log(person);


// // // after ES6 with dynamic values
// // let a = "name";
// // let b = "age";
// // let c = "city";

// // let obj = {
// //     [a]: "AbB",
// //     [b]: 20,
// //     [c]: "Islamabad"
// // }
// // console.log(obj);


// // let obj12 = {
// //     name: "A B",
// //     age: 20,
// //     city: "Islamabad",
// //     show() {
// //         console.log(this.name + " " + this.age + " " + this.city);
// //     }
// // }

// // let name1 = obj12.name;
// // let age1 = obj12.age;
// // let city1 = obj12.city;
// // console.log(name1, age1, city1);


// // //destructuring objects

// // let user = { name: "A B", age: 20, city: "Islamabad" }
// // let { name, age3, citya } = user
// // console.log(name, age3, citya);


// // //destructuring arrays

// // let arry = [10, 20, 30, 40, 50]
// // let [a, b, c, d, e] = arr
// // console.log(a, b, c, d, e);

// // //destructuring arrays with rest operator

// // let arr11 = [10, 20, 30, 40, 50]
// // let [a1, b1, ...rest] = arr11
// // console.log(a1, b1, rest);


// // class car {
// //     constructor() {
// //         console.log("A B car")
// //     }
// //     show() {
// //         console.log("A B car");
// //     }
// //     static messege() {
// //         console.log("Hello this is static method");
// //     }
// // }

// // let c = new car();
// // c.show();
// // car.messege();


// // //object oriented programming in js
// // // inheritance
// // class person4 {
// //     constructor(name, age, city) {
// //         this.name = name;
// //         this.age = age;
// //         this.city = city;
// //     }
// //     show() {
// //         console.log(this.name + " " + this.age + " " + this.city);
// //     }
// // }

// // class student extends person {
// //     constructor(name, age, city, course) {
// //         super(name, age, city);//if we do not call super() then it will give error
// //         this.course = course;
// //     }
// //     show() {
// //         console.log(this.name + " " + this.age + " " + this.city + " " + this.course);
// //     }
// // }


// // //tic tac toe
// // class game {
// //     constructor() {
// //         this.gameboard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
// //     }
// //     show() {
// //         console.log(this.gameboard);
// //     }

// //     player1() {

// //     }
// //     player2() {

// //     }




// // class TicTacToe {
// //     constructor() {
// //         this.board = Array(9).fill(null);
// //         this.currentPlayer = 'X';
// //         this.winner = null;
// //     }

// //     playMove(index) {
// //         if (this.winner || this.board[index]) {
// //             return false;
// //         }

// //         this.board[index] = this.currentPlayer;
// //         if (this.checkWin()) {
// //             this.winner = this.currentPlayer;
// //         } else {
// //             this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
// //         }
// //         return true;
// //     }

// //     checkWin() {
// //         const winConditions = [
// //             [0, 1, 2], [3, 4, 5], [6, 7, 8],
// //             [0, 3, 6], [1, 4, 7], [2, 5, 8],
// //             [0, 4, 8], [2, 4, 6]
// //         ];

// //         for (let condition of winConditions) {
// //             const [a, b, c] = condition;
// //             if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
// //                 return true;
// //             }
// //         }
// //         return false;
// //     }

// //     reset() {
// //         this.board = Array(9).fill(null);
// //         this.currentPlayer = 'X';
// //         this.winner = null;
// //     }

// //     isDraw() {
// //         return !this.winner && !this.board.includes(null);
// //     }
// // }


// //promises

// // function prom() {
// //     return new Promise((resolve, reject) => {
// //         console.log("fetching data, please wait");
// //         setTimeout(() => {
// //             $.get("https://jsonplaceholder.typicode.com/posts", function (data) {
// //                 resolve(data);
// //             }).fail(err => {
// //                 reject("data is not getting from the server");
// //             });

// //         }, 2000)
// //     });
// // }

// // prom()
// //     .then((res) => {
// //         console.log(res);
// //     })
// //     .catch((err) => {
// //         console.log(err);
// //     });

// //Ajax methods

// //get
// // $.get("https://jsonplaceholder.typicode.com/posts", function (data) {
// //     console.log(data);
// // });//it is for geting data from the server

// //post
// // $.post("https://jsonplaceholder.typicode.com/posts", function (data) {
// //     console.log(data);
// // });//it is for inserting values in the server



// //delete
// // $.ajax({
// //     url: "https://jsonplaceholder.typicode.com/posts/1",
// //     type: "DELETE",
// //     success: function (data) {
// //         console.log(data);
// //     }
// // });

// var xhttp = new XMLHttpRequest();

// xhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//         console.log(this.responseText);
//     }
// };
// xhttp.open("GET", "https://jsonplaceholder.typicode.com/posts", true);
// xhttp.send();


