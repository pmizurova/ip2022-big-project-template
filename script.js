// Column Buttons
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const columnsList = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updateOnLoad = false;

// Initialize Arrays - Storing data for each column
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  //If we added our items to the list get them 
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } // Set default values
    else {
    backlogListArray = ['Love yourself 💕', 'Attend InfPals Sessions 💻'];
    progressListArray = ['Work on loving yourself ❤️', 'Work on your programming skills  💻'];
    completeListArray = ['Being cool 😎', 'Be cute 🥺'];
    onHoldListArray = ['Being uncool 😠'];
  }
}

// Set localStorage Arrays - Updates Local Storage Items with Items assigned to Col Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// Filter Arrays to remove empty items
function filterArray(array){
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  //Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updateOnLoad){
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updateOnLoad = true;
  updateSavedColumns();
  
}

// Update Item - Delete if necessary, or update Array with new value
function updateItem(id, column){
  const selectedArray = listArrays[column];
  const selectedColumnEl = columnsList[column].children;
  if(!dragging){
    if(!selectedColumnEl[id].textContent){
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

// Add to Column List, Reset TextBox
function addToColumn(column){
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// Show Add Item Input Box
function showInputBox(column){
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Item Input Box
function hideInputBox(column){
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allow arrays to reflect Dragged and Dropped Items
function rebuildArrays() {
  // Backlog Array
  // Resetting Array preventing from doubling
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++){
    backlogListArray.push(backlogList.children[i].textContent);
  }
  // Progress Array
  // Resetting Array preventing from doubling
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++){
    progressListArray.push(progressList.children[i].textContent);
  }
  // Complete Array
  // Resetting Array preventing from doubling
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++){
    completeListArray.push(completeList.children[i].textContent);
  }
  // On Hold Array
  // Resetting Array preventing from doubling
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++){
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  updateDOM();
}

// Function which indicates start of dragging
function drag(e){
  draggedItem = e.target;
  dragging = true;
}

// Function which allows functions to be droppped into columns
function allowDrop(e){
  e.preventDefault();
}

// Function which detects when dragged items enters col area
function dragEnter(column){
  columnsList[column].classList.add('over');
  currentColumn = column;
}

// Dropping Item in a Column
function drop(e){
  e.preventDefault();
  // Remove Extra padding/color change
  columnsList.forEach((column) => {
    column.classList.remove('over');
  });
  // Add item to dragged column
  const parent = columnsList[currentColumn];
  parent.appendChild(draggedItem);
  rebuildArrays();
  dragging = false;
}

// On Load
updateDOM();