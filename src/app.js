const storageName = 'myStorage';
const myStorage = window.localStorage;
const taskAddInput = document.querySelector('#new_task_input');
const taskAddButton = document.querySelector('#new_task_button');
const tasksList = document.querySelector('#tasksList');
taskAddButton.addEventListener('click', addNewTask);

function storageOperation (storName, operation) {
    if (!(myStorage.getItem(storName))) myStorage.setItem(storName, JSON.stringify([]));
    return function (data, value) {
        const stor = JSON.parse(myStorage.getItem(storName));
        if (operation === 'add') stor.push({text: data, done:false});
		if (operation === 'remove') stor.splice(data , 1);
		if (operation === 'change') stor[data].done = (stor[data].done)?false:true;
		if (operation === 'edit') stor[data].text = value;
        return myStorage.setItem(storName, JSON.stringify(stor));
    }
}
const addTaskToStor = storageOperation(storageName, 'add');
const removeTaskFromStore = storageOperation(storageName, 'remove');
const changeStatusTask = storageOperation(storageName, 'change');
const taskEditor = storageOperation(storageName, 'edit');

function render () {
    const stor = JSON.parse(myStorage.getItem(storageName));
    let stor2 = stor.reduce((acc, task, index) => {acc.push(`<li class="task" ${task.done}>
        <form>
            <input id=${index} class="task-text" type="text" value="${task.text}" disabled>        
            <button class="editButton" onclick="editTask(event)"></button>
            <button class="doneButton" onclick="doneTask(event)"></button>
            <button class="removeButton" onclick="removeTask(event)"></button>
        </form>
        </li>`); return acc},[]).join(' ');
    tasksList.innerHTML = stor2;
}

function addNewTask (e) {
    e.preventDefault();
    if (!(taskAddInput.value)) return 0;
    addTaskToStor(taskAddInput.value);
    taskAddInput.value = '';
    render();
    return 0;
}
function editTask (e) {
    e.preventDefault();
	const elem = e.target.form[0];
    if (elem.disabled) {
        elem.disabled = false;
        elem.focus();
        return 0;
    } else {
        if (elem.value === '') return 0
        taskEditor(elem.id, elem.value);
        render();
    }
    return 0;
}
function doneTask (e) {
    e.preventDefault();
	const elem = e.target.form[0];
    if (!elem.disabled) return 0;
    changeStatusTask(elem.id);
    render();
    return 0;
}
function removeTask (e) {
    e.preventDefault();
	const elem = e.target.form[0];
    if (!elem.disabled) return 0;
    removeTaskFromStore(elem.id);
    render();
    return 0;
}
render();
