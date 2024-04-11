// Отримуємо всі кнопки з класом "toggleGalleryButton"
var toggleGalleryButtons = document.querySelectorAll(".toggleGalleryButton");

// Отримуємо всі контейнери з фотографіями
var imgContainers = document.querySelectorAll(".img-container");

// Попереднє фото та фото з data-secondsrc для підгрузки в фоновому режимі
var preloadedImages = [];
var currentSrc = "";

// Функція для попередньої підгрузки фото в фоновому режимі
function preloadImages() {
  imgContainers.forEach(function (container) {
    var img = container.querySelector(".myImg");
    var secondSrc = img.dataset.secondsrc;

    var preloadImg = new Image();
    preloadImg.src = secondSrc;
    preloadedImages.push(preloadImg);
  });
}


////// LIGHTBOX ///// 

// Отримуємо лайтбокс
// Отримуємо доступ до DOM елементів
var modal = document.getElementById("myModal");  // Елемент лайтбоксу
var modalOverlay = document.querySelector(".modal-overlay");  // Перекриття лайтбоксу

// Елементи лайтбоксу для зображення та підпису
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

var currentGallery = "";  // Поточна галерея
var currentPhotoIndex = 0;  // Поточний індекс фото в межах галереї

function switchToNextPhoto() {
  // Переключення на наступне фото
  currentPhotoIndex++;
  showPhotoByIndex(currentPhotoIndex);
}

function switchToPreviousPhoto() {
  // Переключення на попереднє фото
  currentPhotoIndex--;
  showPhotoByIndex(currentPhotoIndex);
}

function showPhotoByIndex(index) {
  // Показати фото за вказаним індексом у поточній галереї
  var photo = document.querySelector('[data-index="' + currentGallery + '-' + index + '"]');
  if (photo) {
    openLightbox(photo);
  }
}

// Функція для відкриття лайтбоксу та встановлення вмісту
function openLightbox(img) {
  // Опускаємо поточну галерею та індекс фото при відкритті нової фотографії
  var index = img.getAttribute("data-index");
  var galleryName = index.split("-")[0];
  var photoIndex = parseInt(index.split("-")[1], 10);

  if (currentGallery !== galleryName) {
    currentGallery = galleryName;
  }
  
  currentPhotoIndex = photoIndex;  // Оновлення поточного індексу фото

  // Показуємо лайтбокс
  modal.style.display = "flex";

  // Отримуємо текст альтернативного опису зображення та встановлюємо його як текст copyright
  var altText = img.alt;
  var copyrightText = document.getElementById("copyright-text");
  copyrightText.textContent = altText;

  // Встановлюємо зображення та його альтернативний текст
  modalImg.src = img.src;
  captionText.innerHTML = img.alt;

  // Оригінальний та альтернативний шляхи до зображення
  var originalSrc = img.src;
  var secondSrc = img.dataset.secondsrc || img.src; // Використовуємо data-secondsrc, якщо воно існує, в іншому випадку використовуємо src

  currentSrc = originalSrc;

  // Обробка кліків на зображенні
  img.onclick = function () {
    openLightbox(img);
  };

  // Обробка кліку на зображенні в лайтбоксі для зміни зображення
  modalImg.onclick = function () {
    currentSrc = (currentSrc === originalSrc) ? secondSrc : originalSrc;
    modalImg.src = currentSrc;
  };

  // Додавання тексту до captionText
  captionText.innerHTML = "click on image to see before / after";
}


// Закриття лайтбокса при кліку на хрестик або на фон
var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  modal.style.display = "none";
};

modalOverlay.onclick = function () {
  modal.style.display = "none";
};

// закриття лайтбокса по клавіші "Esc"
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    event.preventDefault(); // Запобігає стандартній обробці клавіші "Esc"
    modal.style.display = "none";
  }
});




// Обробник події "keydown" для перемикання фото вліво/вправо
document.addEventListener("keydown", function(event) {
  if (modal.style.display === "flex") {
    if (event.keyCode === 37) {
      // Натиснута клавіша "вліво"
      switchToPreviousPhoto();
    } else if (event.keyCode === 39) {
      // Натиснута клавіша "вправо"
      switchToNextPhoto();
    }
  }
});

// Додавання обробників свайпів
var hammer = new Hammer(modal);

hammer.on("swipeleft", function () {
  switchToNextPhoto();
});

hammer.on("swiperight", function () {
  switchToPreviousPhoto();
});

// Функція для зміни розміру тексту copyright
function resizeCopyrightText() {
  var modalContentWidth = modalContent.offsetWidth; // Отримати ширину modal-content
  var desiredFontSize = Math.min(modalContentWidth * 0.03, 16) + "px"; // Встановити бажаний розмір шрифту з обмеженням

  copyrightText.style.fontSize = desiredFontSize; // Встановити розмір шрифту
}

// Викликати функцію при завантаженні сторінки та зміні розміру вікна
window.addEventListener("load", resizeCopyrightText);
window.addEventListener("resize", resizeCopyrightText);



//// ------- BUTTONS AND GALLERIES PHOTOS ////


// Функція для обробки фото в кнопці
async function processGalleryButton(galleryButton, photoUrlE) {
  try {
    const galleryId = galleryButton.getAttribute('data-gallery');
    const galleryPath = galleryButton.getAttribute('csv-url');

    const img = galleryButton.querySelector('img');
    if (img) {
      const buttonPhoto = galleryButton.getAttribute('button-photo');
      const cleanedUrl = buttonPhoto.trim().replace(/"/g, '');  // Видаляємо пробіли та лапки
      img.src = cleanedUrl;
    }
  } catch (error) {
    console.error(`Помилка при обробці галереї ${galleryId}:`, error);
  }
}


// Вимкнення галереї по кліку на кнопку "scrollback"
var scrollbackButton = document.querySelector('.scrollback-button');
scrollbackButton.addEventListener('click', function () {
  if (lastOpenedButton) {
    const galleryId = lastOpenedButton.getAttribute('data-gallery');
    const gallery = document.getElementById(galleryId);
    
    if (gallery.style.display === 'flex') {
      // Якщо галерея відкрита, закрийте її
      gallery.style.display = 'none';
      lastOpenedButton.classList.remove('active');
    }

  }
});

// Scroll back та приховування кнопки по кліку на кнопку "scrollback"
var scrollbackButton = document.querySelector('.scrollback-button');
scrollbackButton.addEventListener('click', function () {
  if (lastOpenedButton) {
    lastOpenedButton.scrollIntoView({ behavior: 'smooth' });

    // Приховуємо кнопку "scrollbackButton"
    scrollbackButton.style.display = 'none';

    // Відображаємо кнопку "scrollbackMenu"
    scrollbackMenu.style.display = 'none';

  }
});




var lastOpenedButton = null;  // Змінна для зберігання останньої відкритої кнопки

// Оновлений обробник кліку на кнопки галерей
document.addEventListener('click', function (event) {
  const button = event.target.closest('.gallery-button');
  const scrollbackMenu = document.querySelector('.scrollback-menu');  
  if (button) {
    const galleryId = button.getAttribute('data-gallery');
    const gallery = document.getElementById(galleryId);

    if (gallery.style.display === 'flex') {
      gallery.style.display = 'none';
      button.classList.remove('active');
      lastOpenedButton = null;
      scrollbackButton.style.display = 'none'; // Приховуємо кнопку "scrollbackButton" при закритті галереї
      scrollbackMenu.style.display = 'none'; // Показуємо кнопку "scrollbackButton" при відкритті галереї
    } else {
      closeOtherGalleries(galleryId);
      gallery.style.display = 'flex';
      button.classList.add('active');
      gallery.scrollIntoView({ behavior: 'smooth' });
      lastOpenedButton = button;
      scrollbackButton.style.display = 'block'; // Показуємо кнопку "scrollbackButton" при відкритті галереї
      scrollbackMenu.style.display = 'block'; // Показуємо кнопку "scrollbackButton" при відкритті галереї
    }

    if (!gallery.querySelector('.img-container')) {
      createGallery(galleryId);
      preloadImages();
    }
  }
});




// Функція для закриття інших галерей
function closeOtherGalleries(targetGalleryId) {
  const galleries = document.querySelectorAll('.gallery');
  galleries.forEach(function (gallery) {
    if (gallery.id !== targetGalleryId) {
      gallery.style.display = 'none';
    }
  });

  const buttons = document.querySelectorAll('.gallery-button');
  buttons.forEach(function (button) {
    if (button.getAttribute('data-gallery') !== targetGalleryId) {
      button.classList.remove('active');
    }
  });
}


//---- КНОПКИ -  Оновлення коду для створення кнопок з CSV-даних та додавання їх до контейнера
async function createButtonsFromCsvData(csvUrl, containerId) {
  fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
      const rows = data.split('\n');

      const buttonContainer = document.getElementById(containerId);

    // Перевірити, чи контейнер вже містить кнопки
    const existingButtons = buttonContainer.querySelectorAll('.toggleGalleryButton');
    if (existingButtons.length > 0) {
      console.log('Buttons already exist in the container. Skipping creation.');
      return;
    }      
      
            // Очистимо контейнер перед додаванням нових кнопок
      buttonContainer.innerHTML = '';

      rows.forEach(row => {
        const [gallery, csvUrl, amount, alt, photoUrlE] = row.split(','); // Додаємо photoUrlE для значення з рядка E

        const galleryButton = document.createElement('gallery-button');
        galleryButton.className = 'gallery-button'; 
        galleryButton.setAttribute('data-gallery', gallery.trim());
        galleryButton.setAttribute('data-amount', amount.trim());
        galleryButton.setAttribute('csv-url', csvUrl.trim().replace(/&amp;/g, '&'));
        galleryButton.setAttribute('data-alt', alt.trim());
        galleryButton.setAttribute('button-photo', photoUrlE.trim());

        buttonContainer.appendChild(galleryButton);
        
        processGalleryButton(photoUrlE);
        processGalleryButton(galleryButton);

        // Додайте обробник кліку на кожну кнопку
        galleryButton.addEventListener('click', () => {
          handleButtonClick(galleryButton);
        });
      });
    })
    .catch(error => console.error('Error fetching CSV data:', error));
}

function handleButtonClick(button) {
  console.log('Button clicked. Gallery:', button.getAttribute('data-gallery'));

  // Реалізуйте логіку, яка має відбуватися при кліку на кнопку

  // Видаляємо обробник події, щоб він спрацьовував лише один раз
  button.removeEventListener('click', handleButtonClick);
}

function activateCategory(category) {
  let csvUrl = '';
  let containerId = '';

  // Визначення відповідного URL та ID контейнера на основі категорії
if (category === 'lifestyle') {
  csvUrl = 'https://docs.google.com/spreadsheets/d/1bB3jXwpXBAK4mxLVMHGceFb2hvMUCXT_wIWBUroLpY8/export?format=csv&gid=815935544';
  containerId = 'lifestyle-buttons-container';
} else if (category === 'sport') {
  csvUrl = 'https://docs.google.com/spreadsheets/d/1bB3jXwpXBAK4mxLVMHGceFb2hvMUCXT_wIWBUroLpY8/export?format=csv&gid=1331204404';
  containerId = 'sport-buttons-container';
} else if (category === 'business') {
  csvUrl = 'https://docs.google.com/spreadsheets/d/1bB3jXwpXBAK4mxLVMHGceFb2hvMUCXT_wIWBUroLpY8/export?format=csv&gid=729258307';
  containerId = 'business-buttons-container';
} else if (category === 'still_life') {
  csvUrl = 'https://docs.google.com/spreadsheets/d/1bB3jXwpXBAK4mxLVMHGceFb2hvMUCXT_wIWBUroLpY8/export?format=csv&gid=1060238046';
  containerId = 'still_life-buttons-container';
} else if (category === 'misc') {
  csvUrl = 'https://docs.google.com/spreadsheets/d/1bB3jXwpXBAK4mxLVMHGceFb2hvMUCXT_wIWBUroLpY8/export?format=csv&gid=2124139059';
  containerId = 'misc-buttons-container';
}


  // Викликати функцію створення кнопок з відповідними параметрами
  createButtonsFromCsvData(csvUrl, containerId);
}

document.addEventListener('DOMContentLoaded', function() {
  // Автоматично активуємо категорію "sport" при завантаженні сторінки
  activateCategory('lifestyle');
  activateCategory('sport');  
  activateCategory('business');
  activateCategory('still_life');
  activateCategory('misc');  
});


// --------- ГАЛЕРЕЇ 


// Функція для обробки кліку на кнопку та завантаження даних з CSV
function handleButtonClick(button) {
  const galleryId = button.getAttribute('data-gallery');
  const csvUrl = button.getAttribute('csv-url');

  fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
      const lines = data.split('\n');

      const imgContainers = document.getElementById(galleryId).querySelectorAll('.img-container');

      let rawCount = 0;
      let finalCount = 0;

      lines.forEach(line => {
        const [fileName, fileUrl] = line.split(',');

        if (fileName.includes('_raw')) {
          const imgContainer = imgContainers[rawCount];
          const img = imgContainer.querySelector('img');
          img.dataset.secondsrc = fileUrl;
          rawCount++;
        } else if (fileName.includes('_final')) {
          const imgContainer = imgContainers[finalCount];
          const img = imgContainer.querySelector('img');
          img.src = fileUrl;
          finalCount++;
        }
      });

      // Прокручуємо до галереї з плавною анімацією
      const gallery = document.getElementById(galleryId);
      gallery.scrollIntoView({ behavior: 'smooth' });

      // Скидаємо лічильники до нуля для наступного кліку
      rawCount = 0;
      finalCount = 0;
    })
    .catch(error => console.error('Error fetching CSV:', error));
}




function createGallery(containerId) {
  let galleryContainer = document.getElementById(containerId);

  // Перевіряємо, чи існує контейнер. Якщо не існує, створюємо його.
  if (!galleryContainer) {
    galleryContainer = document.createElement('div');
    galleryContainer.id = containerId;
    document.body.appendChild(galleryContainer);
  } else {
    // Якщо контейнер вже існує, видаляємо попередні зображення
    galleryContainer.innerHTML = '';
  }

  const altText = galleryContainer.getAttribute("data-alt");
  const amount = parseInt(galleryContainer.getAttribute("data-amount"));
  const galleryId = galleryContainer.id;

  for (let i = 1; i <= amount; i++) {
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
        // Додаємо клас "myImg"
    img.classList.add('myImg');

    const imageName = `${galleryId}-${i}.jpg`;

    // Отримуємо номер зображення у форматі "flawless_day_01", "flawless_day_02", і т.д.
    const dataIndexValue = `${galleryId}-${i}`; 
    img.setAttribute("data-src", imageName);
    img.alt = altText;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.setAttribute("data-index", dataIndexValue); 


    img.addEventListener('click', () => {
      openLightbox(img);
    });

    imgContainer.appendChild(img);
    galleryContainer.appendChild(imgContainer);
  }
}

// Викликати функцію createGallery з передачею ідентифікатора галереї
createGallery("");



//----ПЕРЕХОПЛЕННЯ data-gallery для createGallery;  


function handleAdditionalFunctionality(button) {
  const galleryId = button.getAttribute('data-gallery');
  createGallery(galleryId);
  // Додайте сюди свій додатковий функціонал для кнопок
}





//----  // ГАЛЕРЕЇ з CSV Функція для зчитування даних з CSV та створення елементів галереї
  async function createGalleryFromCSV(csvUrl, containerId) {
    try {
      const response = await fetch(csvUrl);
      const csvData = await response.text();
      const rows = csvData.split('\n');

      const container = document.getElementById(containerId);

      for (const row of rows) {
        if (row.trim() === '') continue;

        const [id, url, amount, alt] = row.split(',');

        const galleryElement = document.createElement('div');
        galleryElement.classList.add('gallery');
        galleryElement.id = id.trim();
        galleryElement.dataset.amount = amount.trim();
        galleryElement.dataset.alt = `All rights reserved \u00A9 ${alt.trim()}`;

        container.appendChild(galleryElement);
      }
    } catch (error) {
      console.error('Error processing CSV:', error);
    }
  }

  createGalleryFromCSV("https://docs.google.com/spreadsheets/d/1bB3jXwpXBAK4mxLVMHGceFb2hvMUCXT_wIWBUroLpY8/export?format=csv&gid=815935544", "lifestyle-gallery-container");
  createGalleryFromCSV("https://docs.google.com/spreadsheets/d/1bB3jXwpXBAK4mxLVMHGceFb2hvMUCXT_wIWBUroLpY8/export?format=csv&gid=1331204404", "sport-gallery-container");
  createGalleryFromCSV("https://docs.google.com/spreadsheets/d/1bB3jXwpXBAK4mxLVMHGceFb2hvMUCXT_wIWBUroLpY8/export?format=csv&gid=729258307", "business-gallery-container");
  createGalleryFromCSV("https://docs.google.com/spreadsheets/d/1bB3jXwpXBAK4mxLVMHGceFb2hvMUCXT_wIWBUroLpY8/export?format=csv&gid=1060238046", "still_life-gallery-container");
  createGalleryFromCSV("https://docs.google.com/spreadsheets/d/1bB3jXwpXBAK4mxLVMHGceFb2hvMUCXT_wIWBUroLpY8/export?format=csv&gid=2124139059", "misc-gallery-container");
  




// ----- Prevents ---- // 


//---правий клік
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

// заборона правого кліка мишкою    
    document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

window.addEventListener('contextmenu', function (e) {
    e.preventDefault(); // Заборонити контекстне меню
});

    // Заборонити перетягування фотографій
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});