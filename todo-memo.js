const todoContentInput = document.getElementById('todo-content');
const addButton = document.getElementById('add-button');
const todoListDivision = document.getElementById('todo-list');

addButton.addEventListener(
  'click',
  () => {
    const content = todoContentInput.value;
    if (content.length === 0) {
      return;
    }

    // ToDoリストにToDoを追加
    const contentDivision = document.createElement('div');
    const randomId = `${crypto.randomUUID()}`;
    contentDivision.id = randomId;
    todoListDivision.appendChild(contentDivision);

    const paragraph = document.createElement('p');
    paragraph.innerText = todoContentInput.value;
    contentDivision.appendChild(paragraph);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = '×';
    contentDivision.appendChild(deleteButton),

    deleteButton.addEventListener(
      `click`,
      () => {
        const target = document.getElementById(randomId);
        if (target) {
          target.remove();
        }
      }
    )
    contentDivision.classList.add('content-set');
    paragraph.classList.add('sentence');
    deleteButton.classList.add('del-button')
  },
  localStorage.setItem('savedText', todoContentInput.value)
)

window.addEventListener(
  'DOMContentLoaded',
  () => {
  const saved = localStorage.getItem('savedText');
  if (saved !== null) {
    todoContentInput.value = saved;
  }
});