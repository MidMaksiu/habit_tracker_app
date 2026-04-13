
const dateEl = document.getElementById('current-date');
const today = new Date();
//Fetch date-time from system
dateEl.textContent = today.toLocaleDateString('pl-PL', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Load habits from local storage or create empty array
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
let wins = JSON.parse(localStorage.getItem('wins')) || {};
//Date cursor used to move between days
let activeDate = new Date().toISOString().split('T')[0];
//Adding task/habit buttons and modal
const addHabitBtn = document.getElementById('add-habit-btn');
const delHabitBtn = document.getElementById('del-habit-btn');
const addModal = new bootstrap.Modal(document.getElementById('AddModal'));

const addTaskBtn = document.getElementById('add-task-btn');
const delTaskBtn = document.getElementById('del-task-btn');
const addWinBtn = document.getElementById('add-win-btn');
const prevDayBtn = document.getElementById('prev-day-btn');
const nextDayBtn = document.getElementById('next-day-btn');

// Add event listener to addhabit button
addHabitBtn.addEventListener('click', () => {
  document.getElementById('modal-type').value = 'habit';
  addModal.show();
});

addTaskBtn.addEventListener('click', () => {
  document.getElementById('modal-type').value = 'task';
  addModal.show();
});

addWinBtn.addEventListener('click', () => {
  if (!wins[activeDate]) wins[activeDate] = [];
  wins[activeDate].push(document.getElementById('win-input').value);
  document.getElementById('win-input').value = '';
  saveItems();
  renderItems();
});
prevDayBtn.addEventListener('click', () => {
  const date = new Date(activeDate);
  date.setDate(date.getDate() - 1);
  activeDate = date.toISOString().split('T')[0];
  updateDateDisplay();
  renderItems();
  updateProgress();
});

nextDayBtn.addEventListener('click', () => {
  const date = new Date(activeDate);
  date.setDate(date.getDate() + 1);
  activeDate = date.toISOString().split('T')[0];
  updateDateDisplay();
  renderItems();
  updateProgress();
});

function updateDateDisplay() {
  const date = new Date(activeDate + 'T12:00:00');
  dateEl.textContent = date.toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
// Add habits
document.getElementById('save-habit-btn').addEventListener('click', () => {
  const name = document.getElementById('habit-name-input').value.trim();
  const color = document.getElementById('habit-color-input').value;

  if (name === '') {
    alert('Wpisz nazwę nawyku!');
    return;
  }
  const newItem = {
    id: Date.now(),
    name: name,
    color: color,
    completedDates: []
  };

  const type = document.getElementById('modal-type').value;

  if (type === 'habit') {habits.push(newItem);} 

  else 
    {
      if (!tasks[activeDate]) tasks[activeDate] = [];
        tasks[activeDate].push(newItem);
    }
 
  saveItems();
  addModal.hide();

  // Clear modal
  document.getElementById('habit-name-input').value = '';

  renderItems();

  updateProgress();
});
//Delete habits
delHabitBtn.addEventListener('click', () => {
  habits.pop();
  saveItems();
  renderItems();
  updateProgress();
});

//Delete Tasks
delTaskBtn.addEventListener('click', () => {
  tasks[activeDate].pop()
  saveItems();
  renderItems();
  updateProgress();
});

//Save item to localstorage
function saveItems() {
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('wins',JSON.stringify(wins))
}

function renderItems()
{
  document.getElementById('habits-list').innerHTML = ''; // Clear current habit list
  document.getElementById('task-list').innerHTML = '';
  document.getElementById('win-input').innerHTML ='';
  const todayTasks = tasks[activeDate] || [];

  habits.forEach(habit =>
  {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';  
    const name = document.createElement('span')
    const checkb = document.createElement('input');
    checkb.type = 'checkbox' 
    name.innerHTML = habit.name;

    row.appendChild(name);
    row.appendChild(checkb);
    document.getElementById('habits-list').appendChild(row);

    checkb.checked = habit.completedDates.includes(activeDate);

    checkb.addEventListener('change', () => {
    
      if (checkb.checked) {
        // dodaj datę do completedDates
        habit.completedDates.push(activeDate);
      } else {
        // usuń datę z completedDates używając filter()
        habit.completedDates = habit.completedDates.filter(date => date !== activeDate);
      }    
      saveItems();
      updateProgress();
    });
  });

  todayTasks.forEach(task =>
  {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';  
    const name = document.createElement('span')
    const checkb = document.createElement('input');
    checkb.type = 'checkbox' 
    name.innerHTML = task.name;

    row.appendChild(name);
    row.appendChild(checkb);
    document.getElementById('task-list').appendChild(row);

    checkb.checked = task.completedDates.includes(activeDate);

    checkb.addEventListener('change', () => {

      if (checkb.checked) {
        // dodaj datę do completedDates
        task.completedDates.push(activeDate);
      } else {
        // usuń datę z completedDates używając filter()
        task.completedDates = task.completedDates.filter(date => date !== activeDate);
      }    
      saveItems();
      updateProgress();
    });
  });

    const todayWins = wins[activeDate] || [];
    const winsList = document.getElementById('wins-list');
    winsList.innerHTML = '';

    todayWins.forEach(win => {
    const el = document.createElement('p');
    el.innerHTML = "● "+win;
    winsList.appendChild(el);
    saveItems();
    updateProgress();
    });
}

function updateProgress() {
  const todayTasks = tasks[activeDate] || [];
  const total = habits.length + todayTasks.length;
  
  if (total === 0) {
    document.getElementById('habit-progress').style.width = '0%';
    return;
  }
  const completedHabits = habits.filter(habit => habit.completedDates.includes(activeDate)).length;
  const completedTasks = todayTasks.filter(task => task.completedDates.includes(activeDate)).length;
  
  const percent = (completedHabits+completedTasks)/total*100
  
  document.getElementById('habit-progress').style.width = percent + '%';
  console.log('total:', total, 'percent:', percent);
}



renderItems();
updateProgress();
