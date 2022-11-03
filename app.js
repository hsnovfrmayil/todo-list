let Form = document.getElementById("form");
let List = document.getElementById("list");
let Input = document.getElementById("todo_input");
let cardFooter = document.querySelector(".card-footer");
let clearInputBtn = document.querySelector("i");
eventListeners();

function eventListeners() {
  Form.addEventListener("submit", handleInput);
  document.addEventListener("DOMContentLoaded", loadedElement);
  List.addEventListener("click", deleteElementFromList);
  cardFooter.addEventListener("click", deleteAndClearElements);
  clearInputBtn.addEventListener("click", clearInputByBtn);
}

function handleInput(e) {
  let inputValue = Input.value.trim();
  if (inputValue === "") {
    alertMessage("pls insert value !", true);
  } else {
    addElementToList({ value: inputValue, decoration: false });
    clearInput(Input);
    addElementToStorage({ value: inputValue, decoration: false });
    checkList();
  }

  e.preventDefault();
}

function clearInputByBtn() {
  Input.value !== "" ? (Input.value = "") : null;
}

function alertMessage(errMessage, isTrue) {
  let li = document.createElement("li");
  li.classList = "list-group-item bg-danger text-white";
  li.textContent = errMessage;

  List.appendChild(li);
  if (isTrue) {
    setInterval(() => {
      li.remove();
    }, 1000);
  }
}

function clearInput(paramsInput) {
  paramsInput.value !== "" ? (paramsInput.value = "") : null;
}

function addElementToList(paramsValue) {
  let allElement = getElementFromStorage();
  if (allElement.length == 0 && List.children.length == 1) {
    List.removeChild(List.firstElementChild);
  }

  List.innerHTML +=
    paramsValue.decoration == false
      ? `<li class="list-group-item d-flex justify-content-between align-items-center">
      ${paramsValue.value}
      <i class="bi bi-x-circle"></i>
      </li>
      `
      : `<li class="list-group-item d-flex justify-content-between align-items-center text-decoration-line-through bg-secondary">
      ${paramsValue.value}
      <i class="bi bi-x-circle"></i>
      </li>
      `;
}

function loadedElement() {
  let allElement = getElementFromStorage();
  while (List.firstElementChild !== null) {
    List.removeChild(List.firstElementChild);
  }
  allElement.forEach((element) => {
    addElementToList(element);
  });

  checkList();
}

function checkList() {
  let allElement = getElementFromStorage();
  if (allElement.length == 0) {
    alertMessage("localStorage is empty!");
    cardFooter.children[0].setAttribute("disabled", "disabled");
    cardFooter.children[1].setAttribute("disabled", "disabled");
    cardFooter.children[2].setAttribute("style", "display:none");
    console.log(cardFooter.children[2].getAttribute("disabled"));
  } else {
    cardFooter.children[1].removeAttribute("disabled");
    if (allElement.length >= 2) {
      cardFooter.children[2].removeAttribute("style");
    }
    checkButton(allElement);
  }
}

function checkButton(paramsElements) {
  let arr = paramsElements.map((x) => {
    if (x.decoration == true) {
      return null;
    } else {
      return 1;
    }
  });

  arr.indexOf(null) !== -1
    ? cardFooter.children[0].removeAttribute("disabled")
    : cardFooter.children[0].setAttribute("disabled", "disabled");
}

function deleteElementFromList(e) {
  let targetSpace = e.target;
  if (targetSpace.className === "bi bi-x-circle") {
    targetSpace.parentElement.remove();
    removeElementFromStorage(targetSpace.parentElement.textContent.trim());
  } else if (targetSpace.tagName === "LI") {
    decorationTextLine(targetSpace);
  }
  loadedElement();
}

function removeElementFromStorage(paramsText) {
  let allElement = getElementFromStorage();

  allElement.forEach((item, index) => {
    if (item.value === paramsText) {
      allElement.splice(index, 1);
    }
  });

  localStorage.setItem("key", JSON.stringify(allElement));
}

function decorationTextLine(paramsValue) {
  let allElement = getElementFromStorage();
  let textList = paramsValue.textContent.trim();
  allElement.forEach((item) => {
    if (item.value == textList) {
      if (item.decoration == false) {
        paramsValue.style.textDecoration = "line-through";
        paramsValue.style.background = "#6c757d";
        item.decoration = true;
      } else {
        paramsValue.style.textDecoration = "none";
        paramsValue.style.background = "#fff";
        item.decoration = false;
      }
    }
  });

  localStorage.setItem("key", JSON.stringify(allElement));
  loadedElement();
}

function deleteAndClearElements(e) {
  let targetSpace = e.target;
  if (targetSpace.className.indexOf("btn-warning") !== -1) {
    deleteElementByButton();
  } else if (targetSpace.className.indexOf("btn-danger") !== -1) {
    clearAllElements();
  } else if (targetSpace.className.indexOf("bi") !== -1) {
    if (targetSpace.className.indexOf("bi-sort-alpha-down") !== -1) {
      sortingAlphabetDown();
      targetSpace.classList.remove("bi-sort-alpha-down");
      targetSpace.classList.add("bi-sort-alpha-up-alt");
    } else if (targetSpace.className.indexOf("bi-sort-alpha-up-alt") !== -1) {
      sortingAlphabetUp();
      targetSpace.classList.remove("bi-sort-alpha-up-alt");
      targetSpace.classList.add("bi-sort-alpha-down");
    }
  }
}

function sortingAlphabetDown() {
  let allElement = getElementFromStorage();
  function compare(a, b) {
    const bandA = a.value.toUpperCase();
    const bandB = b.value.toUpperCase();
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  allElement.sort(compare);
  localStorage.setItem("key", JSON.stringify(allElement));
  loadedElement();
}

function deleteElementByButton() {
  let allElement = getElementFromStorage();
  allElement.forEach((item) => {
    item.decoration == true ? removeElementFromStorage(item.value) : null;
  });
  loadedElement();
}

function clearAllElements() {
  if (confirm("are you sure ?")) {
    localStorage.clear();
    alert(`${List.children.length} elements delete !`);
  }
  loadedElement();
}

function sortingAlphabetUp() {
  let allElement = getElementFromStorage();
  function compare(a, b) {
    const bandA = a.value.toUpperCase();
    const bandB = b.value.toUpperCase();
    let comparison = 0;
    if (bandA < bandB) {
      comparison = 1;
    } else if (bandA > bandB) {
      comparison = -1;
    }
    return comparison;
  }

  allElement.sort(compare);
  localStorage.setItem("key", JSON.stringify(allElement));
  loadedElement();
}

/**!--Local Storage--**/
function getElementFromStorage() {
  let todos;
  if (localStorage.getItem("key") == null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("key"));
  }

  return todos;
}

function addElementToStorage(paramsValue) {
  let allElement = getElementFromStorage();
  allElement.push(paramsValue);
  localStorage.setItem("key", JSON.stringify(allElement));
}
