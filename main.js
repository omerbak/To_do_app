let input = document.querySelector(".input");
let add = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let addForm = document.querySelector(".add-form");
let editForm = document.querySelector(".edit-form");
let editPage = document.querySelector(".edit-page")
let cancelEditForm = document.querySelector(".cancel-btn")
//Empty arry of task
let arrayTasks = [];
//task id for the task to edit
let taskId;
let taskToEdit;


//check if there is tasks in local storage
if(localStorage.getItem("tasks")){
    arrayTasks = JSON.parse(localStorage.getItem("tasks"));
    //Trigger getDataFromLocal
    getDataFromLocal()
}

// add task to array when the form is submitted
addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputText = input.value;
    if(inputText !== ""){    //add task if in input is not empty 
        addTaskToArray(inputText.slice(0, 1).toUpperCase()+inputText.slice(1));
        input.value = "";
    }
})
// edit task when the edit form is submitted
editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let editFormText = editForm.text.value;
    if(editFormText !== ""){
        editTasksArray(taskId, editFormText)
        editPage.classList.remove("active")
        console.log(editForm.text.value)
        console.log(taskId)
    }
})
// close edit form
cancelEditForm.addEventListener("click", () => {
    editPage.classList.remove("active")
})

//Click on task element (delete, edit and commpleted task fonctionality)
tasksDiv.addEventListener("click", (e) => {
    //Delete  task fonctionality
    if(e.target.classList.contains("delete-option")){
        //Remove task from local storage
        deleteTask(e.target.parentElement.parentElement.getAttribute("data-id"));
        //Remove element from page
        e.target.parentElement.parentElement.remove();
    } else if(e.target.parentElement.classList.contains("delete-option")) {
         //Remove task from local storage
         deleteTask(e.target.parentElement.parentElement.parentElement.getAttribute("data-id"));
         //Remove element from page
         e.target.parentElement.parentElement.parentElement.remove();
    }

    // edit fonctionality
    if(e.target.classList.contains("edit-option")){
        editPage.classList.add("active")
        //Remove task from local storage
        taskId = e.target.parentElement.parentElement.getAttribute("data-id");
        taskToEdit = arrayTasks.find((task) =>  taskId == task.id)
        /* console.log("task id",taskId)
        console.log("tasks array",arrayTasks)
        console.log("task to edit", taskToEdit) */
        editForm.text.value = taskToEdit.title
    } else if(e.target.parentElement.classList.contains("edit-option")) {
        editPage.classList.add("active")
         //Remove task from local storage
        taskId = e.target.parentElement.parentElement.parentElement.getAttribute("data-id");
        taskToEdit = arrayTasks.find((task) =>  taskId == task.id)
        /* console.log("task id",taskId)
        console.log("tasks array",arrayTasks)
        console.log("task to edit", taskToEdit) */
        editForm.text.value = taskToEdit.title;
    }

    //check Task element
    if(e.target.classList.contains("task") ){
        //toggle completed for the task
        toggleStatusTask(e.target.getAttribute("data-id"));
        //toggle done class
        e.target.classList.toggle("done");
    } else if (e.target.classList.contains("text-div")){
         //toggle completed for the task
         toggleStatusTask(e.target.parentElement.getAttribute("data-id"));
         //toggle done class
         e.target.parentElement.classList.toggle("done");
    }
})

function addTaskToArray(taskText){
    //Task Data
    const task ={
        id: Date.now(),
        title: taskText,
        isCompleted: false
    }
    //Push task to arrayTasks
    arrayTasks.unshift(task);

    //get the filter form the filter-menu
    const currentFilter = document.querySelector(".filter-item.selected").dataset.filter;
    console.log(currentFilter);
    //Add tasks to page
    filterTasks(currentFilter)

    //Add tasks to local storage
    addTolacalStorage(arrayTasks);
}

function editTasksArray(taskId, taskText){
    console.log("editTasksArray function")
    arrayTasks = arrayTasks.map((item) => {
        if(item.id == taskId){
            return {...item, title: taskText}
        } else {
            return item;
        }
    })
    addTolacalStorage(arrayTasks);
    addElementsToPageFrom(arrayTasks)
}

function addElementsToPageFrom(arrayTasks){
    //Empty tasksDiv
    tasksDiv.innerHTML = "";

    arrayTasks.forEach((task) => {
        //create main div
        let div = document.createElement("div");

        div.setAttribute("class", "task");
        div.setAttribute("data-id", task.id);
        //check if task is done
        if(task.isCompleted){
            div.setAttribute("class", "task done")
        }
        // creat and append the text div of the task
        let textDiv = document.createElement("div");
        textDiv.setAttribute("class", "text-div")
        let texNode = document.createTextNode(task.title);
        textDiv.appendChild(texNode);
        div.appendChild(textDiv);

        //Create and append Delete button 
        let span = document.createElement("div");
        let editOption = document.createElement("div");
        editOption.classList.add("edit-option")
        let deleteOption = document.createElement("div");
        deleteOption.classList.add("delete-option");
        deleteOption.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        editOption.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        span.className = "options-box";
        span.appendChild(editOption);
        span.appendChild(deleteOption);
        div.appendChild(span);

        //Add task to taskDiv(page)
        tasksDiv.appendChild(div);

    })
}


function addTolacalStorage(arrayTasks){
    window.localStorage.setItem("tasks", JSON.stringify(arrayTasks))
}

function getDataFromLocal(){
    let data = window.localStorage.getItem("tasks");
    if(data){
        let tasks = JSON.parse(data);
        addElementsToPageFrom(tasks);
    }
}

function deleteTask(id){
    arrayTasks = arrayTasks.filter((task) => {
        return task.id != id;
    })
    addTolacalStorage(arrayTasks);
}

function  toggleStatusTask(id){
    arrayTasks.forEach((task) => {
        if(task.id == id){
            task.isCompleted = task.isCompleted == false? true: false;
        }
    })
    addTolacalStorage(arrayTasks);
}

// the filter fonctionality

const filterItems = document.querySelectorAll(".filter-item");

filterItems.forEach(filterItem => {

    filterItem.addEventListener("click", (e) => {
        filterItems.forEach(item => {
            item.classList.remove("selected");
        })
        filterItem.classList.add("selected");

        /* console.log(filterItem.dataset.filter); */
        filterTasks(filterItem.dataset.filter);
    })
})

function filterTasks(filter){

    let filteredArr;
    if(filter === "completed"){
        filteredArr = arrayTasks.filter(item => item.isCompleted === true)

    } else if(filter === "active"){
        filteredArr = arrayTasks.filter(item => item.isCompleted === false)

    } else {
        filteredArr = [...arrayTasks];
    }
    addElementsToPageFrom(filteredArr);
   /*  console.log(filteredArr);
    console.log(arrayTasks); */
}




