const $display = document.querySelector('.display')
const $buttons = document.querySelector('.buttons')

const operations = ['-','*', '/', '+'];

let currentDisplay = "";
let operation = null;
let reset = false;


$buttons.addEventListener('click', async (e) => {
    const nextAction = e.target.name

    if (nextAction === "=") {
        const [firstArg, secondArg] = currentDisplay.split(operation)

        let result;
        switch(operation){
            case "-":
                result = await calculateSub(firstArg, secondArg)
                break
            case "*":
                result = await calculateMul(firstArg, secondArg)
                break
            case "/":
                result = await calculateDiv(firstArg, secondArg)
                break
            case "+":
                result = await calculateSum(firstArg, secondArg)
        }

        reset = true;
        return renderDisplay(result);
    }

    if (operations.includes(nextAction)) {
        operation = nextAction;
    }

    if(nextAction === "c"){
        operation = false
        renderDisplay("")
        return
    }

    if (reset) {
        reset = false;
        operation = null;
        renderDisplay(nextAction);
    } else {
        renderDisplay(currentDisplay + nextAction);
    }
})

async function calculateSum(firstArg, secondArg) {
    const resp = await fetch(`/api/v1/add/${firstArg}/${secondArg}`)
    const { result } = await resp.json();

    return result;
}

async function calculateSub(firstArg, secondArg) {
    const resp = await fetch(`/api/v1/sub/${firstArg}/${secondArg}`)
    const { result } = await resp.json();

    return result;
}

async function calculateMul(firstArg, secondArg) {
    const resp = await fetch(`/api/v1/mul/${firstArg}/${secondArg}`)
    const { result } = await resp.json();

    return result;
}

async function calculateDiv(firstArg, secondArg){
    const rta = await fetch(`/api/v1/div/${firstArg}/${secondArg}`)
    if(rta.status === 400){
        return "Error"
    }
    const { result } = await rta.json();
    return result    
}

function renderDisplay(chars) {
    currentDisplay = chars;
    $display.value = chars;
}

