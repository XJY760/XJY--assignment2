class TaskManager {
  constructor() {
    this.tasks = this.loadTasks();
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
    this.updateStats();
  }

  bindEvents() {
    // 添加任务事件
    document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });

    // 筛选事件
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
    });
  }

  addTask() {
    const input = document.getElementById('taskInput');
    const category = document.getElementById('taskCategory').value;
    const text = input.value.trim();

    if (text === '') {
      alert('请输入任务内容！');
      return;
    }

    const task = {
      id: Date.now(),
      text: text,
      category: category,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.tasks.push(task);
    this.saveTasks();
    this.render();
    this.updateStats();

    input.value = '';
    input.focus();
  }

  deleteTask(taskId) {
    if (confirm('确定要删除这个任务吗？')) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.saveTasks();
      this.render();
      this.updateStats();
    }
  }

  toggleTask(taskId) {
    this.tasks = this.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    this.saveTasks();
    this.render();
    this.updateStats();
  }

  setFilter(filter) {
    this.currentFilter = filter;

    // 更新活跃的筛选按钮
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    this.render();
  }

  getFilteredTasks() {
    if (this.currentFilter === 'all') {
      return this.tasks;
    }
    return this.tasks.filter(task => task.category === this.currentFilter);
  }

  render() {
    const taskList = document.getElementById('taskList');
    const filteredTasks = this.getFilteredTasks();

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>${this.currentFilter === 'all' ? '还没有任务，添加一个开始吧！' : '该分类下没有任务'}</p >
                </div>
            `;
      return;
    }

    taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="taskManager.toggleTask(${task.id})"
                >
                <div class="task-content">
                    <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
                    <span class="task-category category-${task.category}">
                        ${this.getCategoryLabel(task.category)}
                    </span>
                </div>
                <div class="task-actions">
                    <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `).join('');
  }

  getCategoryLabel(category) {
    const labels = {
      personal: '个人',
      work: '工作',
      study: '学习',
      shopping: '购物'
    };
    return labels[category] || category;
  }

  updateStats() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
  }

  saveTasks() {
    localStorage.setItem('taskManager_tasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const saved = localStorage.getItem('taskManager_tasks');
    return saved ? JSON.parse(saved) : [];
  }
}

// 初始化任务管理器
const taskManager = new TaskManager();