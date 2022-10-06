let items = [];
let user;


let wipeStorage;
let formRegister;
let registerContainer;
let userContainer;
let userName;


let form;
let inputId; 
let inputName;
let inputCost;
let inputPrice;
let inputAmount;
let itemContainer;
let modalAddItem
let btnAddItem
let btnsCloseModalAddItem
let modal

class Item {
  constructor(id, name, cost, price, amount) {
    this.id = id;
    this.name = name.toUpperCase();
    this.cost = cost;
    this.price = price;
    this.amount = amount;
  }
}

function StartUp() {
  formRegister = document.getElementById(
    "formRegister"
  );
  inputUser = document.getElementById("inputUser");
  registerContainer = document.getElementById(
    "registerContainer"
  );
  userContainer = document.getElementById("userContainer");
  userName = document.getElementById("userName");

  
  wipeStorage = document.getElementById("wipeStorage");

  form = document.getElementById("formAddItem");
  inputId = document.getElementById("inputId");
  inputName = document.getElementById("inputItemName");
  inputCost = document.getElementById("inputCost");
  inputPrice = document.getElementById("inputPrice");
  inputAmount = document.getElementById("inputAmount");
  itemContainer = document.getElementById("itemContainer");

  btnsCloseModalAddItem = document.getElementsByClassName ("btnCloseModalAddItem");

  modalAddItem = document.getElementById("modalAddItem");
  addItemBtn = document.getElementById("addItemBtn");
  modal = new bootstrap.Modal(modalAddItem);
}

function StartEv() {
  form.onsubmit = (event) => checkForm(event);
  formRegister.onsubmit = (event) => registerUser(event);
  wipeStorage.onclick = clearStorage;
  addItemBtn.onclick = displayModalAddItem
  for (const button of btnsCloseModalAddItem) {
    button.onclick = closeModalAddItem;
  }
}

function displayModalAddItem() {
  if (user) {
    modal.show();
  } else {
    alert("Please register before adding items to the cart");
  }
}

function closeModalAddItem() {
  form.reset();
  modal.hide();
}

function clearStorage() {
  localStorage.clear();
  user = "";
  items = [];
  displayRegisterForm();
  showItems();
}

function registerUser(event) {
  event.preventDefault();
  user = inputUser.value;
  formRegister.reset();
  updateUserStorage();
  displayUserText();
}

function displayUserText() {
  registerContainer.hidden = true;
  userContainer.hidden = false;
  userName.innerHTML += ` ${user}`;
}

function displayRegisterForm() {
    registerContainer.hidden = false;
    userContainer.hidden = true;
    userName.innerHTML = ``;
}

function checkForm(event) {
  event.preventDefault();
  if (user) {
    let itemID = inputId.value;
    let name = inputName.value;
    let cost = parseFloat(inputCost.value);
    let price = parseFloat(inputPrice.value);
    let amount = parseInt(inputAmount.value);

    const ValidID = items.some((item) => item.id === itemID);
    if (!ValidID) {
      let item = new Item(
        itemID,
        name,
        cost    ,
        price,
        amount
      );

      items.push(item);
      form.reset();
      updateItemStorage();
      showItems();
      displayConfirmationMsg(
        `You've succesfully added a ${name} to your shopping cart`,
        "info"
      )
    } else {
      alert("ID is already in use");
    }
  } 
}

function confirmDlt(itemID) {
  Swal.fire({
    icon: "question",
    title: "Do you really want to delete this item?",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteItem(itemID);
    }
  })
}
function deleteItem(itemID) {
  let deleteCol = document.getElementById(`columna-${itemID}`);
  let deleteIndx = items.findIndex(
    (item) => Number(item.id) === Number(itemID)
  );

  let deletedItemName = items[deleteIndx].name;
  items.splice(deleteIndx, 1);
  deleteCol.remove();
  updateItemStorage();
  displayConfirmationMsg(
    `The item ${deletedItemName} was succesfully deleted `,
    "danger"
  );
}

function showItems() {
    itemContainer.innerHTML = "";
  items.forEach((item) => {
    let column = document.createElement("div");
    column.className = "col-md-4 mt-3";
    column.id = `columna-${item.id}`;
    column.innerHTML = `
            <div class="card">
                <div class="card-body">
                <p class="card-text">ID:
                    <b>${item.id}</b>
                </p>
                <p class="card-text">Name:
                    <b>${item.name}</b>
                </p>
                <p class="card-text">Cost:
                    <b>${item.cost}</b>
                </p>
                <p class="card-text">Price:
                    <b>${item.price}</b>
                </p>
                <p class="card-text">Amount:
                    <b>${item.amount}</b>
                </p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-danger" id="deleteBtn-${item.id}" >Delete</button>
                </div>
            </div>`;

            itemContainer.append(column);

    let deleteBtn = document.getElementById(`deleteBtn-${item.id}`);
    deleteBtn.onclick = () => confirmDlt(item.id);
  });
}

function updateItemStorage() {
  let itemsJSON = JSON.stringify(items);
  localStorage.setItem("items", itemsJSON);
}

function updateUserStorage() {
  localStorage.setItem("user", user);
}

function getStorageItems() {
  let itemsJSON = localStorage.getItem("items");
  if (itemsJSON) {
    items = JSON.parse(itemsJSON);
    showItems();
  }
}

function getStorageUser() {
  let storageUser = localStorage.getItem("user");
  if (storageUser) {
    user = storageUser;
    displayUserText();
  }
}

function displayConfirmationMsg(msg, type) {
  Toastify({
    text: msg,
    duration: 30000,
    close: true,
    gravity: "top",
    position: "right",
    className: type
  }).showToast();
}

function main() {
  StartUp();
  StartEv();
  getStorageItems();
  getStorageUser();
}

main();