// Стартовый список задач (если в localStorage пусто)
let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

// Основные DOM-элементы
const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const itemTemplate = document.querySelector("#to-do__item-template");

// Ключ для localStorage
const TASKS_STORAGE_KEY = "tasks";

/**
 * Загружает задачи из localStorage
 * Если данных нет — возвращает стартовый список
 */
function loadTasks() {
  const tasksFromStorage = localStorage.getItem(TASKS_STORAGE_KEY);

  if (!tasksFromStorage) {
    return items;
  }

  const parsedTasks = JSON.parse(tasksFromStorage);

  if (parsedTasks.length === 0) {
    return items;
  }

  return parsedTasks;
}

/**
 * Сохраняет массив задач в localStorage
 */
function saveTasks(tasks) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Собирает все текущие задачи из DOM
 * Возвращает массив строк
 */
function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll(".to-do__item-text");
  const tasks = [];

  itemsNamesElements.forEach((taskElement) => {
    tasks.push(taskElement.textContent);
  });

  return tasks;
}

/**
 * Обновляет localStorage актуальными данными из DOM
 */
function updateStorage() {
  const tasks = getTasksFromDOM();
  saveTasks(tasks);
}

/**
 * Создаёт элемент задачи на основе template
 * Навешивает обработчики: удалить, копировать, редактировать
 */
function createItem(item) {
  const clone = itemTemplate.content
    .querySelector(".to-do__item")
    .cloneNode(true);

  const textElement = clone.querySelector(".to-do__item-text");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");

  // Устанавливаем текст задачи
  textElement.textContent = item;

  // Удаление задачи
  deleteButton.addEventListener("click", () => {
    clone.remove();
    updateStorage();
  });

  // Копирование задачи
  duplicateButton.addEventListener("click", () => {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);

    listElement.prepend(newItem);
    updateStorage();
  });

  // Редактирование задачи
  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });

  // Сохранение после редактирования
  textElement.addEventListener("blur", () => {
    textElement.setAttribute("contenteditable", "false");
    updateStorage();
  });

  return clone;
}

/**
 * Отрисовывает список задач на странице
 */
function renderTasks(taskList) {
  taskList.forEach((task) => {
    const taskElement = createItem(task);
    listElement.append(taskElement);
  });
}

// Инициализация приложения
items = loadTasks();
renderTasks(items);

/**
 * Обработчик отправки формы
 * Добавляет новую задачу в начало списка
 */
formElement.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const newTaskText = inputElement.value.trim();

  // Проверка на пустую строку
  if (newTaskText === "") {
    return;
  }

  const newTaskElement = createItem(newTaskText);
  listElement.prepend(newTaskElement);

  updateStorage();
  formElement.reset();
});
