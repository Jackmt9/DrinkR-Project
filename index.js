
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

    img = document.createElement('img')
    img.src = "https://makemeacocktail.com/blog/wp-content/uploads/2019/02/a1.jpg"
    img.alt = "Photo of Cocktails"
    img.setAttribute("class", "welcome-img")

    container.innerText = ''
    container.append(emailForm, img)
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
        localStorage.setItem("user_id", user.id)
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
        createButton.setAttribute("class", "create-button")
        createButton.addEventListener('click', () => {
            makeForm("new")
        })
    
        container.append(createButton)

        drinkUl = document.createElement('ul')
        drinkUl.setAttribute("class", "drink-list")

        drinks.forEach(drink => makeDrinkIndex(drink, drinkUl))
    })
}

function makeDrinkIndex(drink, ul) {
    li = document.createElement('li')

    drinkName = document.createElement('h2')
    drinkName.innerText = drink.name

    image = document.createElement('img')
    image.setAttribute("class", "index-img")
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
    image.setAttribute("class", "card-img")

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
    likeButton.setAttribute("class", "like-button")

    likes = drink.likes.filter(like => like.user_id == localStorage.user_id)

    if (likes.length !== 0) {
        likeButton.style = "color: red;"
    }
    likeButton.addEventListener('click', () => {
        if (likeButton.style.color === "red"){
            removeLike(drink)
        }else {
        addLike(drink, likeButton)
        likeButton.style = "color: red;"
        }
    })

    container.innerText = ''
    container.append(drinkName, image, ingredients, steps, deleteButton, backButton, updateButton, likeButton)

}

// fix VVVVV
function removeLike(drink) {
    fetch(URLmain + `/drinks/${drink.id}/likes/${localStorage.user_id}`, {
        method: "DELETE"
    })
    .then(r => r.json())
    .then(obj => {
        console.log(obj)

    })
}

function deleteDrink(drink) {
    fetch(URLmain + `/drinks/${drink.id}`, {
        method: "DELETE"
    })
    .then(r => r.json())
    .then(obj => {
        console.log(obj)
        fetchDrinks()
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
            createNew(form)
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
            user_id: localStorage.user_id,
            drink_id: drink.id
        })
    })
    .then(r => r.json())
    .then(obj => {
        console.log(obj)
        updateLikes(likeButton, drink)
    })
}

function updateLikes(likeButton, drink) {
    fetch(URLmain + `/drinks/${drink.id}`)
    .then(r => r.json())
    .then(obj => {
        likeButton.innerText = `${obj.likes.length} ❤`
    })
}

function createNew(form) {
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
