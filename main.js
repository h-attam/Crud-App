//! gerekli html elementlerini seç
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

//* düzenleme seçenekleri
let editElement;
let editFlag = false; //* düzenleme modunda olup olmadığını belirtir
let editID = ""; //* düzenleme yapılan ögenin benzersiz kimliği

//! fonksiyonlar

const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
};

const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};

// tıkladığımız article etiketini ekrandan kaldıracak fonksiyondur.
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; //article etiketine eriştik.
  const id = element.dataset.id;
  list.removeChild(element); // list etiketi içerisinden article etiketini kaldırdık.
  displayAlert("Öge Kaldırıldı", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
};

const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; // article etiketine parent element sayesinde eriştik.
  editElement = e.currentTarget.parentElement.previousElementSibling; // butonun kapsayıcısına eriştikten sonra kapsayıcının kardeş etiketine eriştik.
  console.log(editElement.innerText);
  //tıkladığım article etiketi içerisindeki p  etiketinin textini imputun içerisine gönderme.
  grocery.value = editElement.innerText;

  editFlag = true;
  editID = element.dataset.id; //düzenlenen ögenin kimliğine erişme.
  submitBtn.textContent = "Düzenle"; // düzenleme işleminde submitBtn'nin içerik kısmını güncelledik.
};

const addItem = (e) => {
  e.preventDefault(); //* formun otomatik gönderilmesini engeller
  const value = grocery.value; //form içerisinde bulunan imputun değerini aldık
  const id = new Date().getTime().toString(); //* benzersiz bir id oluşturduk

  //* eğer input boş değilse ve düzenleme modunbda değilse çalışacak blok yapısı
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); //* yeni bir article etiketi oluşturduk
    let attr = document.createAttribute("data-id"); // Yeni bir veri kimliği oluşturur.
    attr.value = id;
    element.setAttributeNode(attr); //oluşturduğumuz id'yi article etiketine ekledik.
    element.classList.add("grocery-item"); //oluşturduğumuz article etiketine class ekledik.
    setBackToDefault();
    element.innerHTML = `
       <p class="title">${value}</p>
       <div class="btn-container">
         <button type="button" class="edit-btn">
           <i class="fa-solid fa-pen-to-square"></i>
         </button>
         <button type="button" class="delete-btn">
           <i class="fa-solid fa-trash"></i>
         </button>
       </div>
       `;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // kapsayıcıya oluşturduğumuz article etiketini ekledik.
    list.appendChild(element);
    displayAlert("Başarıyla Eklenildi", "success");
    container.classList.add("show-container");
    // localStorage a ekleme yapma
    addToLocalStorage(id, value);
    // değerleri varsayılana çevirir
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    // değitireceğimiz p etiketinin içerik kısmına kullanıcının imputa girdiği değeri gönderdik
    editElement.innerText = value;
    //ekrana alert yapısını bastırdık
    displayAlert("Değer Değiştirildi", "success");
    editLocalStorage(editID,value);
    setBackToDefault();
  }
};

const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  // listede öge varsa çalışır.
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  // container yapısını gizle
  container.classList.remove("show-container");
  displayAlert("Liste Boş", "danger");
  setBackToDefault();
};

const createListItem = (id, value) => {
  const element = document.createElement("article"); //* yeni bir article etiketi oluşturduk
  let attr = document.createAttribute("data-id"); // Yeni bir veri kimliği oluşturur.
  attr.value = id;
  element.setAttributeNode(attr); //oluşturduğumuz id'yi article etiketine ekledik.
  element.classList.add("grocery-item"); //oluşturduğumuz article etiketine class ekledik.

  element.innerHTML = `
       <p class="title">${value}</p>
       <div class="btn-container">
         <button type="button" class="edit-btn">
           <i class="fa-solid fa-pen-to-square"></i>
         </button>
         <button type="button" class="delete-btn">
           <i class="fa-solid fa-trash"></i>
         </button>
       </div>
       `;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // kapsayıcıya oluşturduğumuz article etiketini ekledik.
  list.appendChild(element); 
  container.classList.add("show-container");
};
const setupItems = () => {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
  }
};

//! olay izleyicileri
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

/* local storage */
//yerel depoya öğe ekleme işlemi
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};
//yerel depodan ögeleri alma işlemi
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};
// localStoragedan veriyi silme
const removeFromLocalStorage = (id) => {
    //localStorageda bulunan verileri getir.
  let items = getLocalStorage();
    // tıkladığım etiketin id si  ile localstorageda ki id eşit değilse bunu diziden çıkart ve yeni bir elemana aktar 
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
};
//yerel depoda update işlemi
const editLocalStorage = (id, value) => {
    let items =  getLocalStorage();
    //yerel depodaki verilerin id ile güncellenecek olan verinin id si birbirine eşit ise inputa girilen value değişkenini al
    //localStoragede bulunan verinin valuesuna aktar
    items = items.map((item) => {
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list",JSON.stringify(items));
};
