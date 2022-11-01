let input = document.querySelector(".input");
let add = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let form = document.querySelector(".form");
//Empty arry of task
let arrayTasks = [];

//check if there is tasks in local storage
if(localStorage.getItem("tasks")){
    arrayTasks = JSON.parse(localStorage.getItem("tasks"));
    //Trigger getDataFromLocal
    getDataFromLocal()
}



// add task to array when the form is submitted
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputText = input.value;
    if(inputText !== ""){    //add task if in input is not empty 
        addTaskToArray(inputText.slice(0, 1).toUpperCase()+inputText.slice(1));
        input.value = "";
    
    }
})

//Click on task element (delete and commpleted task fonctionality)
tasksDiv.addEventListener("click", (e) => {
    //Delete  button
    if(e.target.classList.contains("delete")){
        //Remove task from local storage
        deleteTask(e.target.parentElement.getAttribute("data-id"));
        //Remove element from page
        e.target.parentElement.remove();
    } else if(e.target.parentElement.classList.contains("delete")) {
         //Remove task from local storage
         deleteTask(e.target.parentElement.parentElement.getAttribute("data-id"));
         //Remove element from page
         e.target.parentElement.parentElement.remove();
    }

    //Task element
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
        span.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        span.className = "delete";
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




/* let localTasks = [];

let id = 0;


//check if there are tasks stored in the local stiorage 
if(JSON.parse(window.localStorage.getItem("localStorageTasks"))){
    localTasks = JSON.parse(window.localStorage.getItem("localStorageTasks")); 
    let end = localTasks.length ;
    for(let i = 0; i < end; i++){  //show the tasks already registred in local storage
        let task =  createTask(localTasks[i]["text"])
        task.setAttribute("data-id", localTasks[i]["id"]);
        tasks.appendChild(task);
   }
   id = localTasks.length;
   console.log(id)
}


// to add task created by the createTask() function to the tasks div 
add.addEventListener("click", () => {
    if(input.value !== ""){    //add task if in input is not empty
        let task = createTask(input.value);
        task.setAttribute("data-id", id);
        tasks.appendChild(task);
    
        input.value = "";
        let storeTask = {
        id : id,
        text: task.firstChild.textContent,
        done : false 
        }
         localTasks.push(storeTask);
        id++
        window.localStorage.setItem("localStorageTasks" , JSON.stringify(localTasks))
        console.log(JSON.parse(window.localStorage.getItem("localStorageTasks")));
    }
   
})



// To delete task when the delete button clicked
document.addEventListener('click', (e) => {
    if(e.target.classList.contains("delete")){
        let idTask = e.target.parentElement.dataset["id"]; //get the id of the task to remove from the [data-id]
        let indexTaskToRemove ;
        for (let i = 0; i<  localTasks.length; i++) { //get the index of task in localTask array
            if(localTasks[i].id === idTask){
                indexTaskToRemove = i;
            }
        }
        localTasks.splice(indexTaskToRemove,1); //remove the task from the array
        
        window.localStorage.setItem("localStorageTasks" , JSON.stringify(localTasks)) //update the values in local storage
        e.target.parentElement.style.opacity = "0";
        setTimeout(() => {
            e.target.parentElement.remove(); 
        }, 300) 
        
    }

})

// return a task object whihle taking the input of the task in parameter
function createTask (inputText) {
   
   let task = document.createElement("div");
   task.classList.add("task");
   let dBtn = document.createElement("button");
   dBtn.textContent = "Delete";
   dBtn.classList.add("delete");
   let taskText = document.createElement("div");
   taskText.classList.add("text");
   taskText.textContent = inputText; 
   task.appendChild(taskText);
   task.appendChild(dBtn);
   return task;
}


//Adding the done fonctionallity

tasks.addEventListener("click", (e) => {

    if(e.target.classList.contains("task")){
        e.target.classList.toggle("done");
        
        
    }
    
})


function getObject(wantedId, arr){
    arr.forEach((item) => {
        if(item.id === wantedId){
            return item;
        }
    })
} */