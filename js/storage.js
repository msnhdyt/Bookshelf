const completedListKey = "COMPLETED_LIST";
const uncompletedListKey = "UNCOMPLETED_LIST";

window.addEventListener("load", (event)=>{
    if(typeof(Storage) !== undefined){
        let obj = [];
        if(localStorage.getItem(completedListKey) === null){
            localStorage.setItem(completedListKey, JSON.stringify(obj));
        }
        if(localStorage.getItem(uncompletedListKey) === null){
            localStorage.setItem(uncompletedListKey, JSON.stringify(obj));
        }
    } else{
        alert("Browser yang Anda gunakan tidak mendukung Web Storage");
    }
})

function addToStorage(data){
    let storageData = null;
    
    if(data['isComplete']){
        storageData = JSON.parse(localStorage.getItem(completedListKey));
        storageData.push(data);
        localStorage.setItem(completedListKey, JSON.stringify(storageData));
    } else{
        storageData = JSON.parse(localStorage.getItem(uncompletedListKey));
        storageData.push(data);
        localStorage.setItem(uncompletedListKey, JSON.stringify(storageData));
    }
}

function showStorage(key){
    return JSON.parse(localStorage.getItem(key));
}