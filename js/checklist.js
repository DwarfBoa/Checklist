// Movies Checklist
const moviesForm = document.getElementById("moviesChecklistForm");
const addMovieButton = document.getElementById("addMovieButton");
const newMovieInput = document.getElementById("newMovieInput");

// Activities Checklist
const activitiesForm = document.getElementById("activitiesChecklistForm");
const addActivityButton = document.getElementById("addActivityButton");
const newActivityInput = document.getElementById("newActivityInput");

// Load saved items from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  loadChecklist("moviesChecklistItems", moviesForm);
  loadChecklist("activitiesChecklistItems", activitiesForm);
});

// Add event listeners for adding items
addMovieButton.addEventListener("click", (event) => {
  event.preventDefault();
  addItem(newMovieInput, moviesForm, "moviesChecklistItems");
});

addActivityButton.addEventListener("click", (event) => {
  event.preventDefault();
  addItem(newActivityInput, activitiesForm, "activitiesChecklistItems");
});

// Function to load a checklist from localStorage
function loadChecklist(storageKey, form) {
  const savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
  savedItems.forEach((item) => {
    addItemToForm(item.text, item.checked, form, storageKey);
  });
}

// Function to add an item
function addItem(input, form, storageKey) {
  const newItemText = input.value.trim();
  if (newItemText) {
    addItemToForm(newItemText, false, form, storageKey);
    saveItemToLocalStorage(newItemText, false, storageKey);
    input.value = "";
  }
}

// Function to add an item to the form
function addItemToForm(text, checked, form, storageKey) {
  const itemContainer = document.createElement("div");
  itemContainer.className = "checklist-item";

  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  const removeButton = document.createElement("button");

  checkbox.type = "checkbox";
  checkbox.id = text.toLowerCase().replace(/\s+/g, "-");
  checkbox.name = "dynamic";
  checkbox.value = text;
  checkbox.checked = checked;

  label.htmlFor = checkbox.id;
  label.textContent = text;

  removeButton.textContent = "Remove";
  removeButton.className = "remove-button";
  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    removeItemFromForm(text, itemContainer, storageKey);
  });

  itemContainer.appendChild(checkbox);
  itemContainer.appendChild(label);
  itemContainer.appendChild(removeButton);
  form.appendChild(itemContainer);

  checkbox.addEventListener("change", () => {
    updateItemInLocalStorage(text, checkbox.checked, storageKey);
  });
}

// Function to save an item to localStorage
function saveItemToLocalStorage(text, checked, storageKey) {
  const savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
  savedItems.push({ text, checked });
  localStorage.setItem(storageKey, JSON.stringify(savedItems));
}

// Function to update an item's checked state in localStorage
function updateItemInLocalStorage(text, checked, storageKey) {
  const savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
  const itemIndex = savedItems.findIndex((item) => item.text === text);
  if (itemIndex !== -1) {
    savedItems[itemIndex].checked = checked;
    localStorage.setItem(storageKey, JSON.stringify(savedItems));
  }
}

// Function to remove an item from the form and localStorage
function removeItemFromForm(text, itemContainer, storageKey) {
  itemContainer.remove();
  const savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
  const updatedItems = savedItems.filter((item) => item.text !== text);
  localStorage.setItem(storageKey, JSON.stringify(updatedItems));
}