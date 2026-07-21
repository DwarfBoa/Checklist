import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  update,
  remove,
} from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function setupChecklist(formId, buttonId, inputId, storageKey) {
  const form = document.getElementById(formId);
  const button = document.getElementById(buttonId);
  const input = document.getElementById(inputId);

  loadChecklist(storageKey, form);

  button.addEventListener("click", (event) => {
    event.preventDefault();
    addItem(input, storageKey, form);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupChecklist(
    "moviesChecklistForm",
    "addMovieButton",
    "newMovieInput",
    "moviesChecklistItems"
  );
  setupChecklist(
    "activitiesChecklistForm",
    "addActivityButton",
    "newActivityInput",
    "activitiesChecklistItems"
  );
});

function loadChecklist(storageKey, form) {
  const storageRef = ref(db, storageKey);
  onValue(storageRef, (snapshot) => {
    form.innerHTML = "";
    const items = snapshot.val();
    if (items) {
      Object.keys(items).forEach((key) => {
        const item = items[key];
        addItemToForm(item.text, item.checked, form, storageKey, key);
      });
    } else {
      form.innerHTML = "<p>No items found.</p>";
    }
  });
}

function addItem(input, storageKey, form) {
  const newItemText = input.value.trim();
  if (!newItemText) {
    alert("Item cannot be empty.");
    return;
  }

  const existingItems = Array.from(form.querySelectorAll("label")).map(
    (label) => label.textContent
  );
  if (existingItems.includes(newItemText)) {
    alert("Item already exists.");
    return;
  }

  const storageRef = ref(db, storageKey);
  const newItemRef = push(storageRef);
  set(newItemRef, {
    text: newItemText,
    checked: false,
  });
  input.value = "";
}

function addItemToForm(text, checked, form, storageKey, key) {
  const itemContainer = document.createElement("div");
  itemContainer.className = "checklist-item";

  const checkbox = document.createElement("input");
  const uniqueId = `checkbox-${storageKey}-${key}`;
  checkbox.type = "checkbox";
  checkbox.id = uniqueId;
  checkbox.checked = checked;
  checkbox.setAttribute("aria-label", `Mark ${text} as completed`);
  checkbox.addEventListener("change", () => {
    updateItemInFirebase(storageKey, key, { checked: checkbox.checked });
  });

  const label = document.createElement("label");
  label.htmlFor = uniqueId;
  label.textContent = text;

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.className = "remove-button";
  removeButton.setAttribute("aria-label", `Remove ${text}`);
  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    removeItemFromFirebase(storageKey, key);
  });

  itemContainer.appendChild(checkbox);
  itemContainer.appendChild(label);
  itemContainer.appendChild(removeButton);
  form.appendChild(itemContainer);
}

async function updateItemInFirebase(storageKey, key, updates) {
  try {
    const itemRef = ref(db, `${storageKey}/${key}`);
    await update(itemRef, updates);
  } catch (error) {
    console.error("Error updating item:", error);
    alert("Failed to update the item. Please try again.");
  }
}

async function removeItemFromFirebase(storageKey, key) {
  try {
    const itemRef = ref(db, `${storageKey}/${key}`);
    await remove(itemRef);
  } catch (error) {
    console.error("Error removing item:", error);
    alert("Failed to remove the item. Please try again.");
  }
}
