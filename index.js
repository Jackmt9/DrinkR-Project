
const container = document.querySelector('.container')

const URLmain = `http://localhost:3000`

makeLogin()

function makeLogin(){
    emailForm = document.createElement('form')

    input = document.createElement('input')
    input.type = 'text'
    input.name = 'email'
    input.value = ''
    input.placeholder = 'email'

    submit = document.createElement('button')
    submit.innerText = 'submit'

    emailForm.addEventListener('submit', (evt) => {
        evt.preventDefault()
        helloUser(evt.target.email.value)
        evt.target.reset()
    })

    emailForm.append(input, submit)

    container.innerText = ''
    container.append(emailForm)
}

function helloUser(email) {
    fetch(URLmain + '/users', {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            email: email
        })
    })
    .then(r => r.json())
    .then(user => {
        console.log(user)
        fetchDrinks()
    })
}

function fetchDrinks() {
    fetch(URLmain + '/drinks')
    .then(r => r.json())
    .then(drinks => {
        container.innerText = ''

        createButton = document.createElement('button')
        createButton.innerText = 'Create Drink'
        createButton.addEventListener('click', () => {
            makeForm("new")
        })
        container.append(createButton)

        drinkUl = document.createElement('ul')
        drinks.forEach(drink => makeDrinkIndex(drink, drinkUl))
    })
}

function makeDrinkIndex(drink, ul) {
    li = document.createElement('li')

    drinkName = document.createElement('h2')
    drinkName.innerText = drink.name

    image = document.createElement('img')
    image.setAttribute("class", "image")
    image.src = drink.image
    image.alt = `Photo of ${drinkName}`

    li.append(image, drinkName)
    ul.append(li)
    container.append(ul)

    li.addEventListener('click', () => showDrinkCard(drink))
}

function showDrinkCard(drink) {
    drinkName = document.createElement('h2')
    drinkName.innerText = drink.name
    
    image = document.createElement('img')
    image.src = drink.image
    image.alt = `Photo of ${drink.name}`

    ingredients = document.createElement('p')
    ingredients.innerText = drink.ingredients

    steps = document.createElement('p')
    steps.innerText = drink.steps

    deleteButton = document.createElement('button')
    deleteButton.innerText = '❌'
    deleteButton.addEventListener('click', () => {
        deleteDrink(drink)
    })

    backButton = document.createElement('button')
    backButton.innerText = '←'
    backButton.addEventListener('click', () => {
        fetchDrinks()
    })

    updateButton = document.createElement('button')
    updateButton.innerText = "Update Drink"
    updateButton.addEventListener('click', () => {
        makeForm("update", drink)
    })

    likeButton = document.createElement('button')
    likeButton.innerText = `${drink.likes.length} ❤`
    likeButton.addEventListener('click', () => {
        addLike(drink, likeButton)
    })

    container.innerText = ''
    container.append(drinkName, image, ingredients, steps, deleteButton, backButton, updateButton, likeButton)

}

function deleteDrink(drink){
    fetch(URLmain + `/drinks/${drink.id}`, {
        method: "DELETE"
    })
    .then(r => r.json())
    .then(obj => {
        console.log(obj)
        container.innerText = ''
        fetchDrinks()
        // needs to delete likes too- server error
    })
}

function makeForm(action, drink={name: "", ingredients: "", steps: "", image: ""}){
    container.innerText = ''

    form = document.createElement('form')

    nameInput = document.createElement("input")
    nameInput.type = 'text'
    nameInput.name = 'name'
    nameInput.value = drink.name
    nameInput.placeholder = 'Name'

    ingredientsInput = document.createElement("input")
    ingredientsInput.type = 'text'
    ingredientsInput.name = 'ingredients'
    ingredientsInput.value = drink.ingredients
    ingredientsInput.placeholder = 'Ingredients'

    stepsInput = document.createElement("input")
    stepsInput.type = 'text'
    stepsInput.name = 'steps'
    stepsInput.value = drink.steps
    stepsInput.placeholder = 'Steps'

    imageInput = document.createElement("input")
    imageInput.type = 'text'
    imageInput.name = 'image'
    imageInput.value = drink.image
    imageInput.placeholder = 'Image'

    submit = document.createElement('button')
    submit.innerText = "submit"
    
    form.addEventListener('submit', (evt) => {
        evt.preventDefault()

        if (action == "update"){
            makeUpdate(drink, form)
        }else {
            createNew(drink, form)
        }
    })

    form.append(nameInput, imageInput, ingredientsInput, stepsInput, submit)
    container.append(form)
}

function makeUpdate(drink, form) {
    let name = form.name.value
    let image = form.image.value
    let ingredients = form.ingredients.value
    let steps = form.steps.value

    fetch(URLmain + `/drinks/${drink.id}`, {
        method: "PATCH",
        headers: {
            'content-type': 'application/json',
            "Accept": "Application/json"
        },
        body: JSON.stringify({
            name: name,
            image: image,
            ingredients: ingredients,
            steps: steps
        })
    })
    .then(r => r.json())
    .then(drink => {
        console.log(drink)
        fetchDrinks()
    })
}

function addLike(drink, likeButton) {
    fetch(URLmain + '/likes', {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            user_id: 1,
            // need to use current user ID
            drink_id: drink.id
        })
    })
    .then(r => r.json())
    .then(obj => {
        console.log(obj)
        likeButton.innerText = `${drink.likes.length + 1} ❤`
        // doesnt increment after 1 click
    })
}

function createNew(drink, form) {
    let name = form.name.value
    let image = form.image.value
    let ingredients = form.ingredients.value
    let steps = form.steps.value

    fetch(URLmain + `/drinks`, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
            "Accept": "Application/json"
        },
        body: JSON.stringify({
            name: name,
            image: image,
            ingredients: ingredients,
            steps: steps
        })
    })
    .then(r => r.json())
    .then(drink => {
        console.log(drink)
        fetchDrinks()
    })
}