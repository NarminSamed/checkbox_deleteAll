removeFromStorage = (storage, event) => {
  if (event.target.classList.contains("delete")) {
    if (confirm("Are you sure?") === false) {
      return;
    }

    const key = event.target.dataset.local;
    storage.removeItem(key);
    getLocalStorageItems();
  }
};

function handleFromStorage(event) {
  removeFromStorage(
    event.target.classList.contains("localList")
      ? localStorage
      : sessionStorage,
    event
  );
}

setStorage = (storage, list) => {
  for (let i = 0; i < storage.length; i++) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const spanKey = document.createElement("b");
    spanKey.textContent = `${storage.key(i)}`;

    const spanValue = document.createElement("span");
    spanValue.innerHTML = storage.getItem(storage.key(i));

    const deleteButton = document.createElement("button");
    deleteButton.classList.add(
      "btn",
      "btn-danger",
      "btn-sm",
      "float-end",
      "delete",
      `${list.id}`
    );
    deleteButton.innerHTML = "Delete";
    deleteButton.dataset.local = storage.key(i);

    const div = document.createElement("div");
    div.classList.add("form-check");

    const checkInput = document.createElement("input");
    checkInput.classList.add("form-check-input", `${list.id}Check`);
    checkInput.type = "checkbox";
    checkInput.value = storage.key(i);
    checkInput.id = `${list.id}Check`;

    div.appendChild(checkInput);
    div.appendChild(spanKey);
    div.appendChild(document.createTextNode(" : "));
    div.appendChild(spanValue);
    div.appendChild(document.createTextNode(" "));
    div.appendChild(deleteButton);

    li.appendChild(div);
    list.appendChild(li);

    checkInput.addEventListener("change", function () {
      updateDeleteButtonVisibility(checkInput, deleteButton);
      updateSelectAllStatus(list);
    });
  }

  const deleteAllButton = document.createElement("button");
  deleteAllButton.classList.add("btn", "btn-danger", "mt-3", "delete-all");
  deleteAllButton.innerHTML = "Delete All";
  deleteAllButton.style.display = "none";
  deleteAllButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all selected items?")) {
      const checkboxes = list.querySelectorAll(".form-check-input:checked");
      checkboxes.forEach((checkbox) => {
        const key = checkbox.value;
        storage.removeItem(key);
      });
      getLocalStorageItems();
    }
  });

  list.appendChild(deleteAllButton);
};

getLocalStorageItems = () => {
  const list = document.getElementById("localList");
  const sessionList = document.getElementById("sessionList");

  document.querySelectorAll("ul").forEach((ul) => {
    ul.innerHTML = "";
    ul.classList.add("list-group", "list-group-flush");
  });

  setStorage(localStorage, list);
  setStorage(sessionStorage, sessionList);
};

document.addEventListener("DOMContentLoaded", function () {
  getLocalStorageItems();

  const keyInput = document.getElementById("key");
  const valueInput = document.getElementById("value");
  const saveButton = document.getElementById("btn-save");
  const list = document.getElementById("localList");
  const sessionList = document.getElementById("sessionList");

  list.addEventListener("click", handleFromStorage);
  sessionList.addEventListener("click", handleFromStorage);

  saveButton.addEventListener("click", function () {
    const value = valueInput.value;
    const key = keyInput.value;

    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);

    getLocalStorageItems();
    document.querySelectorAll("input").forEach((input) => (input.value = ""));
  });

  function toggleCheckboxes(masterCheckboxId, checkboxClass) {
    const masterCheckbox = document.getElementById(masterCheckboxId);
    masterCheckbox.addEventListener("change", function () {
      const checkboxes = document.querySelectorAll(`.${checkboxClass}`);
      checkboxes.forEach((input) => (input.checked = masterCheckbox.checked));
      updateSelectAllStatus(
        masterCheckbox.closest(".card").querySelector("ul")
      );
    });
  }

  function updateDeleteButtonVisibility(checkbox, deleteButton) {
    deleteButton.style.display = checkbox.checked ? "none" : "inline-block";
  }

  function updateSelectAllStatus(list) {
    const checkboxes = list.querySelectorAll(".form-check-input");
    const masterCheckbox = list
      .closest(".card")
      .querySelector('.form-check-input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(
      (checkbox) => checkbox.checked
    );
    const anyChecked = Array.from(checkboxes).some(
      (checkbox) => checkbox.checked
    );

    masterCheckbox.checked = allChecked;
    masterCheckbox.indeterminate = !allChecked && anyChecked;

    const deleteButtons = list.querySelectorAll(".delete");
    deleteButtons.forEach((button) => {
      const checkbox = button
        .closest(".form-check")
        .querySelector(".form-check-input");
      button.style.display = checkbox.checked ? "none" : "inline-block";
    });

    const deleteAllButton = list.querySelector(".delete-all");
    deleteAllButton.style.display = anyChecked ? "block" : "none";
  }

  toggleCheckboxes("localCheck", "localListCheck");
  toggleCheckboxes("sessionCheck", "sessionListCheck");

  document.querySelectorAll(".form-check-input").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      updateSelectAllStatus(checkbox.closest("ul"));
    });
  });
});
