
// Delete, Mark Complete, Mark Incomplete
const deleteTask = document.querySelectorAll('.fa-trash')
const completedTask = document.querySelectorAll('.fa-check-square')
const toggleCompletedTask = document.querySelectorAll('.fa-check-square')

// Event Listeners
Array.from(deleteTask).forEach((element) =>{
    element.addEventListener('click', removeTask)
})

// Array.from(completedTask).forEach((element) =>{
//     element.addEventListener('click', markComplete)
// })

Array.from(toggleCompletedTask).forEach((element) =>{
    element.addEventListener('click', toggleComplete)
})
// Functions
// Delete
async function removeTask(){
    const tName = this.parentNode.childNodes[1].innerText

    try{
        const response = await fetch('removeTask', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'nameOfTask': tName
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

// Update Completed Task
// async function markComplete(){
//     const tName = this.parentNode.childNodes[1].innerText
//     try{
//         const response = await fetch('markComplete', {
//             method: 'put',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({
//                 'nameOfTask': tName
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     }catch(err){
//         console.log(err)
//     }
// }

async function toggleComplete(){
    const tName = this.parentNode.childNodes[1].innerText
    this.parentNode.childNodes[1].classList.toggle('completed')
    try{
        
        const response = await fetch('toggleComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'nameOfTask': tName,
                completed: this.parentNode.childNodes[1].classList.contains('completed')
            })
        })
        const data = await response.json()
        console.log(data)
       location.reload()
    }catch(err){
        console.log(err)
    }
}