let drinkList = document.querySelector('ul')
let container = document.querySelector('.container')
let createButton = document.querySelector('.create-button')
const URL = `http://localhost:3000/drinks`


createButton.addEventListener("click", () => {
    createNew()
})

makeFetch()

function makeFetch(){
    fetch("http://localhost:3000/drinks")
    .then(r => r.json())
    .then(obj => {
        obj.forEach(displayDrink)
    })
}

function displayDrink(drinkInfo) {
    drinkLi = document.createElement('li')
    drinkLi.class = "display"

    drinkName = document.createElement('h2')
    drinkName.class = 'name'
    drinkName.innerText = drinkInfo.name

    image = document.createElement('img')
    image.setAttribute("class", "image")
    image.src = drinkInfo.image
    image.alt = `Photo of ${drinkInfo.name}`

    drinkLi.append(image, drinkName)
    drinkList.append(drinkLi)

    liClick(drinkLi, drinkInfo)
}

function liClick(drinkLi, drinkInfo) {
    drinkLi.addEventListener("click", () => {
        drinkList.innerText = ''
        makeCard(drinkInfo)
    })
}

function makeCard(drinkInfo) {
    drinkName = document.createElement('h2')
    drinkName.class = 'name'
    drinkName.innerText = drinkInfo.name
    
    drinkImage = document.createElement('img')
    drinkImage.setAttribute("class", "image")
    drinkImage.src = drinkInfo.image
    drinkImage.alt = `Photo of ${drinkInfo.name}`

    drinkIngredients = document.createElement('p')
    drinkIngredients.class = "ingredients"
    drinkIngredients.innerText = drinkInfo.ingredients

    drinkSteps = document.createElement('p')
    drinkSteps.class = "steps"
    drinkSteps.innerText = drinkInfo.steps

    deleteButton = document.createElement('button')
    deleteButton.class = "delete-button"
    deleteButton.innerText = '❌'
    deleteClick(deleteButton, drinkInfo)

    backButton = document.createElement('button')
    backButton.class = "back-button"
    backButton.innerText = '←'
    backClick(backButton)

    updateButton = document.createElement('button')
    updateButton.setAttribute("class", "update-button")
    updateButton.innerText = "Update Drink"
    updateClick(updateButton, drinkInfo)

    container.append(drinkName, drinkImage, drinkIngredients, drinkSteps, deleteButton, backButton, updateButton)
}

function deleteClick(button, drinkInfo){
    button.addEventListener("click", () => {
        fetch(`http://localhost:3000/drinks/${drinkInfo.id}`, {
            method: "DELETE"
        })
        .then(r => r.json())
        .then(obj => {
            console.log(obj)
            container.innerText = ''
            makeFetch()
        })
    })
}

function backClick(backButton){
    backButton.addEventListener("click", () => {
        container.innerText = ''
        makeFetch()
    })
}

function createNew() {
    container.innerText = ''
    drinkList.innerText = ''

    newForm = document.createElement('form')
    newForm.setAttribute("class", "drink-form")
    
    form = document.createElement('form')
    form.setAttribute("class", "new-form")

    titleInput = document.createElement("input")
    titleInput.type = 'text'
    titleInput.name = 'title'
    titleInput.value = ''
    titleInput.placeholder = 'title'
    
    ingredientsInput = document.createElement("input")
    ingredientsInput.type = 'text'
    ingredientsInput.name = 'ingredients'
    ingredientsInput.value = ''
    ingredientsInput.placeholder = 'ingredients'

    stepsInput = document.createElement("input")
    stepsInput.type = 'text'
    stepsInput.name = 'steps'
    stepsInput.value = ''
    stepsInput.placeholder = 'steps'

    imageInput = document.createElement("input")
    imageInput.type = 'text'
    imageInput.name = 'image'
    imageInput.value = ''
    imageInput.placeholder = 'image'

    submit = document.createElement('button')
    submit.innerText = "submit"

    form.append(titleInput, imageInput, ingredientsInput, stepsInput, submit)
    container.append(form)

    submitClick(form)

}

function createUpdate(info) {
        container.innerText = ''
        drinkList.innerText = ''
    
        newForm = document.createElement('form')
        newForm.setAttribute("class", "drink-form")
        
        form = document.createElement('form')
        form.setAttribute("class", "new-form")
    
        titleInput = document.createElement("input")
        titleInput.type = 'text'
        titleInput.name = 'title'
        titleInput.value = info.name
        
        ingredientsInput = document.createElement("input")
        ingredientsInput.type = 'text'
        ingredientsInput.name = 'ingredients'
        ingredientsInput.value = info.ingredients
    
        stepsInput = document.createElement("input")
        stepsInput.type = 'text'
        stepsInput.name = 'steps'
        stepsInput.value = info.steps
    
        imageInput = document.createElement("input")
        imageInput.type = 'text'
        imageInput.name = 'image'
        imageInput.value = info.image
    
        submit = document.createElement('button')
        submit.innerText = "submit"
    
        form.append(titleInput, imageInput, ingredientsInput, stepsInput, submit)
        container.append(form)
    
        listenForSubmit(form, info)
    
}

function listenForSubmit(form, info) {
    form.addEventListener("submit", (evt) => {
        evt.preventDefault()
        let title = form.title.value
        let image = form.image.value
        let ingredients = form.ingredients.value
        let steps = form.steps.value

        fetch(`http://localhost:3000/drinks/${info.id}`, {
            method: "PATCH",
            headers: {
                'content-type': 'application/json',
                "Accept": "Application/json"
            },
            body: JSON.stringify({
                name: title,
                image: image,
                ingredients: ingredients,
                steps: steps
            })
        })
        .then(r => r.json())
        .then(obj => {
            console.log(obj)
            container.innerText = ''
            makeFetch()
        })
    })
}

function updateClick(button, info) {
    button.addEventListener("click", () => {
        createUpdate(info)
    })
}

function submitClick(form) {
    form.addEventListener("submit", (evt) => {
        evt.preventDefault()

        let title = evt.target.title.value
        let image = evt.target.image.value
        let ingredients = evt.target.ingredients.value
        let steps = evt.target.steps.value

        sendToDb(title, image, ingredients, steps)
        evt.target.reset()
    })
}

function sendToDb(title, image, ingredients, steps) {
    fetch(URL, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            name: title,
            image: image,
            ingredients: ingredients,
            steps: steps
        })
    })
    .then(r => r.json())
    .then(obj => {
        console.log(obj)
        container.innerText = ''
        makeFetch()
    })
}