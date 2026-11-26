'use stirict'

// タスクデータを読み込む
let tasks = [];

try {
  tasks = JSON.parse(
    localStorage.getItem("myTasks")
  ) || [];
} catch (error) {
  tasks = [];
}

// 現在の絞り込み条件
let currentFilter = 'all';

// HTML要素の取得
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDate = document.getElementById('task-date');
const taskPriority = document.getElementById('task-priority');
const taskLIst = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');

// データを保存する関数
function saveTasks() {
  localStorage.getItem(
    "myTasks",
    JSON.stringify(tasks)
  )
}

// タスクを追加する関数
taskForm.addEventListener(
  'submit',
  function (event) {
    event.preventDefault();

    const title = taskTitle.value.trim();

    if (title === '') {
      return;
    }

    const newTask = {
      id: Date.now().toString() + Math.random(),
      title: title,
      date: taskDate.value,
      priority: taskPriority.value,
      completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskForm.reset();
    taskPriority.value = 'medium';
  }
)

// タスクの表示名を取得
function getPriorityName(priority) {
  const names = {
    high: '高',
    medium: '中',
    low: '低'
  };

  return names[priority] || '中';
}

// 日付を表示する関数
function formatDate(date) {
  if (!date) {
    return '期限なし';
  }

  const parts = date.split('-');

  return Number(parts[0]) + '/' +
    Number(parts[1]) + '/' +
    Number(parts[2]);
}

// タスクを画面に表示する関数
function renderTasks() {
  taskLIst.innerHTML = '';

  // 絞り込み
  let filteredTasks = tasks.filter(function (task) {
    if (currentFilter === 'active') {
      return !task.completed;
    }

    if (currentFilter === 'completed') {
      return task.completed;
    }

    return true;
  });

  // 件数表示
  document.getElementById('list-count').textContent =
    filteredTasks.length + '件';

  // タスクがない場合
  emptyMessage.style.display =
    filteredTasks.length === 0 ? 'block' : 'none'

  // タスクを順番に表示
  filteredTasks.forEach(function (task) {
    const item = document.createElement('div');
    item.className = 'task-item';

    if (task.completed) {
      item.classList.add('completed');
    }

    // チェックボックス
    const checkbox = document.createElement('input');
    checkbox.type = 'checkBox';
    checkbox.className = 'task-check';
    checkbox.checked = task.completed;

    checkbox.addEventListener(
      'change',
      function () {
        toggleTask(task.id);
      });

    // タスク内容
    const content = document.createElement('div');
    content.className = 'task-content';

    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.title;

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const date = document.createElement('span');
    date.textContent = '期限:' + formatDate(task.date);

    meta.appendChild(date);

    content.appendChild(title);
    content.appendChild(meta);

    // 優先度
    const priority = document.createElement('span');
    priority.className = 'priority' + task.priority;
    priority.textContent = getPriorityName(task.priority);

    // 削除ボタン
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', 'タスクを削除');

    deleteButton.addEventListener(
      'click',
      function () {
        deleteTask(task.id);
      });

    // 画面に追加
    item.appendChild(checkbox);
    item.appendChild(content);
    item.appendChild(priority);
    item.appendChild(deleteButton);

    taskLIst.appendChild(item);
  });

  // 統計情報を更新
  updateStats();
};

// タスクの完了・未完了を切り替える
function toggleTask(id) {
  tasks = tasks.map(function (task) {

    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

// タスクを削除する
function deleteTask(id) {
  if (!confirm('このタスクを削除しますか？')) {
    return;
  }

  tasks = tasks.filter(function (task) {
    return task.id !== id;
  })

  saveTasks();
  renderTasks();
}

// 統計情報を更新
function updateStats() {
  const total = tasks.length;

  const completed = tasks.filter(function (task) {
    return task.completed;
  }).length;

  const active = total - completed;

  document.getElementById('total-count').textContent = total;
  document.getElementById('active-count').textContent = active;
  document.getElementById('completed-count').textContent = completed;
}

// 絞り込みボタン
document.querySelectorAll('.filter').forEach(function (button) {
  button.addEventListener(
    'click',
    function () {
      currentFilter = button.dataset.filter;

      // ボタンの選択状況を変更
      document.querySelectorAll('.filter').forEach(function (btn) {
        btn.classList.remove('active');
      });

      button.classList.add('active');

      renderTasks();
    });
})

// 初期状態
renderTasks();