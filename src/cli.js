import { createInterface } from "node:readline/promises";
import core from "./core.js"

const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const AVAILABLE_FNS = [...Object.keys(core), 'exit'].join(', ')

async function loop() {
    const fnName = await readline.question(`Ingrese función (${AVAILABLE_FNS}): `)

    if(AVAILABLE_FNS.includes(fnName)){
        if (fnName === "exit") {
            console.log("👋👋👋");
            return readline.close();
        }

        const fn = core[fnName]; 
        if(fnName !=='pow'){
            const firstNum = await readline.question("Ingrese el primer número: ");
            const secondNum =  await readline.question("Ingrese el segundo número: ")
         
            const result =  fn(Number(firstNum), Number(secondNum))

            console.log(result);
        }else{
            const num = await readline.question("Ingrese el número: ");
            const resultpow = fn(Number(num))
            console.log(resultpow);
        }

    }else{
        console.log(`❌ Ingrese un nombre de funcion valido ❌(${AVAILABLE_FNS})`);
    }
    loop();
}

loop();
