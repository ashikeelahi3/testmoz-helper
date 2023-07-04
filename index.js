let questionList = [];
let questionTemplate = {};

// Retrieve the JSON string from local storage
const storedFormDataString = localStorage.getItem("questions");

// Convert the JSON string back to an array
const storedFormData = JSON.parse(storedFormDataString);

if (storedFormData != null) {
  questionList = [...Object.values(storedFormData)];
}
console.table(questionList);

let questionHtml = `
<div class="questionBox">
  <h3>Question <span id="questionCounter"></span></h3>
  <label>Question:</label>
  <input type="text" name="question[]" required>
  <br>
  <label>Option 1:</label>
  <input type="text" name="option1[]" required>
  <label>Option 2:</label>
  <input type="text" name="option2[]" required>
  <label>Option 3:</label>
  <input type="text" name="option3[]" required>
  <label>Option 4:</label>
  <input type="text" name="option4[]" required>
  <label>Answer (a, b, c, d):</label>
  <input type="text" name="answer[]" required>
</div>
`;

let singleQuestion = `
<div id="singleQuestion">
  <p class="question">Question: x^2 + y^2 = ?</p>
  <ol class="options" type="a">
    <li>r</li>
    <li>r^2</li>
    <li>sqrt r</li>
    <li>2pi</li>
  </ol>
  <p>Correct Ans: b</p>
</div>
`;

document.getElementById("questionsContainer").innerHTML = questionHtml;
document.getElementById("questionCounter").innerText = questionList.length + 1;
document.getElementById("questionForm").addEventListener("submit", questionSubmit);


function questionSubmit(event) {
  event.preventDefault();

  // Get all the input fields for questions, options, and answers
  const questionInputs = document.getElementsByName("question[]");
  const option1Inputs = document.getElementsByName("option1[]");
  const option2Inputs = document.getElementsByName("option2[]");
  const option3Inputs = document.getElementsByName("option3[]");
  const option4Inputs = document.getElementsByName("option4[]");
  const answerInputs = document.getElementsByName("answer[]");

  for (let i = 0; i < questionInputs.length; i++) {
    const id = questionList.length + 1;
    const question = questionInputs[i].value;
    const option1 = option1Inputs[i].value;
    const option2 = option2Inputs[i].value;
    const option3 = option3Inputs[i].value;
    const option4 = option4Inputs[i].value;
    const answer = answerInputs[i].value;

    // Create an object to represent each question and push it to the array
    const questionTemplate = {
      id,
      question : converter(question),
      option1:converter(option1) ,
      option2:converter(option2) ,
      option3:converter(option3) ,
      option4:converter(option4) ,
      answer
    };
    questionList.push(questionTemplate);
  }
  console.table(questionList);

  document.getElementById("questionsContainer").innerHTML = questionHtml;
  localStorage.setItem("questions", JSON.stringify(questionList));
  document.getElementById("questionCounter").innerText =
    questionList.length + 1;
  //last value
  addingQuestionOnList(questionList[questionList.length - 1]);
}

questionList.forEach((qs) => {
  addingQuestionOnList(qs);
  // console.log(qs)
});

function addingQuestionOnList(question) {

  let singleQuestion = `
        <div id="singleQuestion">
          <p class="question">${question.id}. ${question.question}</p>
          <ol class="options" type="a">
            <li>${question.option1}</li>
            <li>${question.option2}</li>
            <li>${question.option3}</li>
            <li>${question.option4}</li>
          </ol>
          <p>Correct Ans: ${question.answer}</p>
        </div>
      `;
  const node = document.createElement("div");
  node.innerHTML = singleQuestion;
  document.getElementById("allQuestions").appendChild(node);
}

document.getElementById('resetButton').addEventListener("click", () => {
  localStorage.removeItem('questions');
  document.getElementById('allQuestions').innerHTML = ""
})



document.getElementById('downloadExcel').addEventListener('click', () => {
  let jsonData = localStorage.getItem("questions")
    var blob = new Blob([jsonData], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "questions.json";
    link.click();
})

















const converter = data => {
  let isFirst = false;
    data = data.trim();
    const dataArr = data.split('')
    dataArr.forEach((character, index) => {
        if(character == '#') {
            isFirst = !isFirst;
            if(isFirst) {
                dataArr[index] = '<span class="mathy">'
            } else {
                dataArr[index] = '</span>'
            }
        }
    });
    if(isFirst) {
        dataArr.push('</span>')
    }
    dataArr.unshift('<p>')
    dataArr.push('</p>')
    data = dataArr.join('')
    return data;
}