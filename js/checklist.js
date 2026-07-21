// Import the Firebase SDK modules you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, update, remove } from "firebase/database";

// Firebase configuration (replace with your Firebase config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const moviesForm = document.getElementById("moviesChecklistForm");
const addMovieButton = document.getElementById("addMovieButton");
const newMovieInput = document.getElementById("newMovieInput");

const activitiesForm = document.getElementById("activitiesChecklistForm");
const addActivityButton = document.getElementById("addActivityButton");
const newActivityInput = document.getElementById("newActivityInput");

// Load checklists from Firebase on page load
document.addEventListener("DOMContentLoaded", () => {
  loadChecklist("moviesChecklistItems", moviesForm);
  loadChecklist("activitiesChecklistItems", activitiesForm);
});

// Add event listeners for adding items
addMovieButton.addEventListener("click", (event) => {
  event.preventDefault();
  addItem(newMovieInput, "moviesChecklistItems", moviesForm);
});

addActivityButton.addEventListener("click", (event) => {
  event.preventDefault();
  addItem(newActivityInput, "activitiesChecklistItems", activitiesForm);
});

// Function to load a checklist from Firebase
function loadChecklist(storageKey, form) {
  const storageRef = ref(db, storageKey);
  onValue(storageRef, (snapshot) => {
    form.innerHTML = ""; // Clear the form
    const items = snapshot.val();
    if (items) {
      Object.keys(items).forEach((key) => {
        const item = items[key];
        addItemToForm(item.text, item.checked, form, storageKey, key);
      });
    }
  });
}

// Function to add an item to Firebase
function addItem(input, storageKey, form) {
  const newItemText = input.value.trim();
  if (newItemText) {
    const storageRef = ref(db, storageKey);
    const newItemRef = push(storageRef);
    set(newItemRef, {
      text: newItemText,
      checked: false,
    });
    input.value = ""; // Clear the input field
  }
}

// Function to add an item to the form
function addItemToForm(text, checked, form, storageKey, key) {
  const itemContainer = document.createElement("div");
  itemContainer.className = "checklist-item";

  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  const removeButton = document.createElement("button");

  checkbox.type = "checkbox";
  checkbox.checked = checked;
  checkbox.addEventListener("change", () => {
    updateItemInFirebase(storageKey, key, { checked: checkbox.checked });
  });

  label.textContent = text;

  removeButton.textContent = "Remove";
  removeButton.className = "remove-button";
  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    removeItemFromFirebase(storageKey, key);
  });

  itemContainer.appendChild(checkbox);
  itemContainer.appendChild(label);
  itemContainer.appendChild(removeButton);
  form.appendChild(itemContainer);
}

// Function to update an item in Firebase
function updateItemInFirebase(storageKey, key, updates) {
  const itemRef = ref(db, `${storageKey}/${key}`);
  update(itemRef, updates);
}

// Function to remove an item from Firebase
function removeItemFromFirebase(storageKey, key) {
  const itemRef = ref(db, `${storageKey}/${key}`);
  remove(itemRef);
}