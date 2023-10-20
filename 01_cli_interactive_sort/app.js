import arraySorting from "./utils/arraySorting.js";
import inputTransformer from "./utils/inputTransform.js";
import rl from "readline";

const rlInstance = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function restart() {
    rlInstance.question(
        "Input 10 digits or words with spaces between each of them: ",
        (userInput) => {
            if (userInput === 'exit' || userInput === 'Exit') {
                process.exit(0);
            }
            const inputTransformerInstance = new inputTransformer;
            const arraySortingInstance = new arraySorting;
            const { words, digits } = inputTransformerInstance.transform(userInput);
            rlInstance.question(
                "What do you want to do: \n1. Sort words by name (from A-Z)" +
                "\n2. Sort numbers from smallest to biggest" +
                "\n3. Sort numbers from biggest to smallest" +
                "\n4. Sort words by quantity of letters" +
                "\n5. Show only unique words" +
                "\n6. Show only unique elements (words and digits)" +
                "\n Type exit to and all operations" +
                "\n\n Select from 1 to 6 and press Enter: ",
                (selection) => {
                    switch (selection) {
                        case 'exit':
                            process.exit(0);
                        case 'Exit':
                            process.exit(0);
                        case '1':
                            console.log(arraySortingInstance.alphabeticSort(words));
                            break;
                        case '2':
                            console.log(arraySortingInstance.smallestToBiggest(digits));
                            break;
                        case '3':
                            console.log(arraySortingInstance.biggestToSmallest(digits));
                            break;
                        case '4':
                            console.log(arraySortingInstance.quantitySort(words));
                            break;
                        case '5':
                            console.log(arraySortingInstance.uniqueWordsSort(words));
                            break;
                        case '6':
                            console.log(arraySortingInstance.uniqueAllSort(words, digits));
                            break;
                        default:
                            console.log("Invalid selection, please try again. ");
                            break;
                    }
                    restart();
                }
            );
        }
    );
}

restart();