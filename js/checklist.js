// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbe15VXxGOK-Cyn8R7LhCdBca02scIClk",
  authDomain: "checklist-aaa78.firebaseapp.com",
  databaseURL:
    "https://checklist-aaa78-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "checklist-aaa78",
  storageBucket: "checklist-aaa78.firebasestorage.app",
  messagingSenderId: "811744103873",
  appId: "1:811744103873:web:46da1c5bbcedaca5e1b340",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  syncCollection("movies", "moviesList", "newMovieInput", "addMovieButton");
  syncCollection(
    "activities",
    "activitiesList",
    "newActivityInput",
    "addActivityButton"
  );
});

function syncCollection(collectionName, listId, inputId, buttonId) {
  const listContainer = document.getElementById(listId);
  const inputField = document.getElementById(inputId);
  const addButton = document.getElementById(buttonId);

  // 1. Listen for Real-time Updates (Collaboration)
  db.collection(collectionName)
    .orderBy("createdAt", "asc")
    .onSnapshot((snapshot) => {
      listContainer.innerHTML = ""; // Clear current UI
      snapshot.forEach((doc) => {
        renderItem(collectionName, doc.id, doc.data(), listContainer);
      });
    });

  // 2. Add New Item to Cloud
  const addItem = () => {
    const text = inputField.value.trim();
    if (text) {
      db.collection(collectionName).add({
        text: text,
        completed: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      inputField.value = "";
    }
  };

  addButton.onclick = addItem;
  inputField.onkeypress = (e) => {
    if (e.key === "Enter") addItem();
  };
}

function renderItem(collectionName, id, data, container) {
  const div = document.createElement("div");
  div.className = `checklist-item ${data.completed ? "completed" : ""}`;
  div.innerHTML = `
      <label style="display:flex; align-items:center; gap:10px;">
          <input type="checkbox" ${data.completed ? "checked" : ""}>
          <span>${data.text}</span>
      </label>
      <button class="delete-btn">✕</button>
  `;

  // Toggle Complete
  div.querySelector("input").onclick = () => {
    db.collection(collectionName)
      .doc(id)
      .update({ completed: !data.completed });
  };

  // Delete Item
  div.querySelector(".delete-btn").onclick = () => {
    db.collection(collectionName).doc(id).delete();
  };

  container.appendChild(div);
}
