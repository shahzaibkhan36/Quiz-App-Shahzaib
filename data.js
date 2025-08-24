// Each question: { q, options: [a,b,c,d], answer: index0to3 }
window.QUIZ_DATA = {
  HTML: [
    { q: "What does HTML stand for?", options: ["Hyperlinks and Text Markup Language","Hyper Text Markup Language","Home Tool Markup Language","Hyperlinking Text Management Language"], answer: 1 },
    { q: "Which tag creates the largest heading?", options: ["<h6>","<h4>","<h1>","<header>"], answer: 2 },
    { q: "Which tag inserts a line break?", options: ["<break>","<br>","<lb>","<newline>"], answer: 1 },
    { q: "Which attribute provides alternative text for images?", options: ["title","name","alt","desc"], answer: 2 },
    { q: "Which tag is used for creating a hyperlink?", options: ["<link>","<a>","<href>","<url>"], answer: 1 },
    { q: "Which element contains metadata?", options: ["<body>","<meta>","<head>","<footer>"], answer: 2 },
    { q: "Choose the correct HTML for a checkbox.", options: ["<checkbox>","<input type='checkbox'>","<check>","<input checkbox>"], answer: 1 },
    { q: "Which tag forms a table row?", options: ["<td>","<tr>","<th>","<row>"], answer: 1 },
    { q: "Which input type is used for email?", options: ["<input type='mail'>","<input type='email'>","<input email>","<input type='text'>"], answer: 1 },
    { q: "Which tag defines a list item?", options: ["<li>","<ul>","<ol>","<item>"], answer: 0 }
  ],
  CSS: [
    { q: "What does CSS stand for?", options: ["Creative Style Sheets","Computer Style Sheets","Cascading Style Sheets","Colorful Style Sheets"], answer: 2 },
    { q: "Which property changes text color?", options: ["font-color","text-color","color","foreground"], answer: 2 },
    { q: "How do you select an element with id='box'?", options: [".box","#box","box","*box"], answer: 1 },
    { q: "Which property sets the background color?", options: ["bgcolor","background","background-color","color"], answer: 2 },
    { q: "Which is the correct comment syntax in CSS?", options: ["// comment","<!-- comment -->","/* comment */","# comment"], answer: 2 },
    { q: "Flexbox main axis is controlled by:", options: ["justify-content","align-items","align-content","place-items"], answer: 0 },
    { q: "Make text bold:", options: ["font-weight: bold;","text-weight: bold;","style: bold;","font-style: bold;"], answer: 0 },
    { q: "Which unit is relative to root font size?", options: ["em","rem","px","vh"], answer: 1 },
    { q: "Rounded corners are made with:", options: ["corner-radius","border-round","border-radius","radius"], answer: 2 },
    { q: "Media queries start with:", options: ["@media","@query","@screen","@device"], answer: 0 }
  ],
  JavaScript: [
    { q: "Which keyword declares a block-scoped variable?", options: ["var","static","let","const"], answer: 2 },
    { q: "typeof null returns:", options: ["'null'","'object'","'undefined'","'none'"], answer: 1 },
    { q: "Which method converts JSON string to object?", options: ["JSON.parse()","JSON.stringify()","Object.parse()","toJSON()"], answer: 0 },
    { q: "Strict equality operator is:", options: ["==","===","=:=","!=="], answer: 1 },
    { q: "Arrow function syntax is:", options: ["function => () {}","() -> {}","() => {}","=> function() {}"], answer: 2 },
    { q: "Which array method adds to the end?", options: ["shift","unshift","push","concat"], answer: 2 },
    { q: "NaN stands for:", options: ["Not a Null","Not a Number","No assigned Number","Negative and Null"], answer: 1 },
    { q: "Which executes a function after delay?", options: ["setInterval","setTimeout","sleep","wait"], answer: 1 },
    { q: "How to create a Promise?", options: ["new Promise((res,rej)=>{})","Promise()","create Promise","promise.new()"], answer: 0 },
    { q: "Which keyword prevents reassignment?", options: ["let","const","var","final"], answer: 1 }
  ]
};