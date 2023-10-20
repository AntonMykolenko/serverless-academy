export default class inputTransformer{
    transform(input){
        const words = [];
        const digits = [];

        const inputArr = input.trim().split(/\s+/);

        inputArr.forEach(item => {
            if (isNaN(item)) {
                words.push(item);
            } else {
                digits.push(parseInt(item));
            }
        });
        return { words, digits };
    }
}