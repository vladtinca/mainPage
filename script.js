const RANDOM_IMG_ENDPOINT = "https://dog.ceo/api/breeds/image/random";

const BREEDS = ["affenpinscher", "african", "airedale", "akita", "appenzeller", "shepherd australian", "basenji", "beagle", "bluetick", "borzoi", "bouvier", "boxer", "brabancon", "briard", "norwegian buhund", "boston bulldog", "english bulldog", "french bulldog", "staffordshire bullterrier", "australian cattledog", "chihuahua", "chow", "clumber", "cockapoo", "border collie", "coonhound", "cardigan corgi", "cotondetulear", "dachshund", "dalmatian", "great dane", "scottish deerhound", "dhole", "dingo", "doberman", "norwegian elkhound", "entlebucher", "eskimo", "lapphund finnish", "bichon frise", "germanshepherd", "italian greyhound", "groenendael", "havanese", "afghan hound", "basset hound", "blood hound", "english hound", "ibizan hound", "plott hound", "walker hound", "husky", "keeshond", "kelpie", "komondor", "kuvasz", "labradoodle", "labrador", "leonberg", "lhasa", "malamute", "malinois", "maltese", "bull mastiff", "english mastiff", "tibetan mastiff", "mexicanhairless", "mix", "bernese mountain", "swiss mountain", "newfoundland", "otterhound", "caucasian ovcharka", "papillon", "pekinese", "pembroke", "miniature pinscher", "pitbull", "german pointer", "germanlonghair pointer", "pomeranian", "medium poodle", "miniature poodle", "standard poodle", "toy poodle", "pug", "puggle", "pyrenees", "redbone", "chesapeake retriever", "curly retriever", "flatcoated retriever", "golden retriever", "rhodesian ridgeback", "rottweiler", "saluki", "samoyed", "schipperke", "giant schnauzer", "miniature schnauzer", "english setter", "gordon setter", "irish setter", "sharpei", "english sheepdog", "shetland sheepdog", "shiba", "shihtzu", "blenheim spaniel", "brittany spaniel", "cocker spaniel", "irish spaniel", "japanese spaniel", "sussex spaniel", "welsh spaniel", "english springer", "stbernard", "american terrier", "australian terrier", "bedlington terrier", "border terrier", "cairn terrier", "dandie terrier", "fox terrier", "irish terrier", "kerryblue terrier", "lakeland terrier", "norfolk terrier", "norwich terrier", "patterdale terrier", "russell terrier", "scottish terrier", "sealyham terrier", "silky terrier", "tibetan terrier", "toy terrier", "welsh terrier", "westhighland terrier", "wheaten terrier", "yorkshire terrier", "tervuren", "vizsla", "spanish waterdog", "weimaraner", "whippet", "irish wolfhound"];
let doggoImgUrl, correctBreed, breedChoices;
let score = 0, answere = 0;
const disable = (element) => {
    element.setAttribute("disabled", "");
}

const enable = (element) => {
    element.removeAttribute("disabled");
}

function getRandomElement(array) {
    let i = Math.floor(Math.random() * array.length);
    return array[i];
}

function shuffleArray(array) {
    return array.sort((a, b) => Math.random() - 0.5);
}

function getMultipleChoices(n, correctAnswer, array) {
    const choices = [];
    //build
    choices.push(correctAnswer);
    while (choices.length < n) {
        let candidate = getRandomElement(array);
        if (!choices.includes(candidate)) {
            choices.push(candidate);
        }
    }

    return shuffleArray(choices);
}

function capitalizeFirstLetter(words) {
    let wordsArray = words.split(" ");
    for (let i = 0; i < wordsArray.length; i++) {
        wordsArray[i] = wordsArray[i][0].toUpperCase() + wordsArray[i].substr(1);
    }
    return wordsArray.join(" ").trim();
}

function getBreedFromURL(url) {
    let breedSplit = url.split("/")[4];
    let [breed, subbreed] = breedSplit.split("-");
    return [subbreed, breed].join(" ").trim();
}

async function fetchMessage(url) {
    let response = await fetch(url);
    let { message } = await response.json();
    return message;
}
function clearButtons() {
    const options = document.getElementById("options");
    options.textContent = '';
}
function scoreUpdate() {
    document.getElementById("scoreGood").textContent = score;
    document.getElementById("scoreAnswere").textContent = answere;
}

function renderButtons(choicesArray, correctAnswer) {
    //button event creation
    async function buttonHandler(e) {
        if (e.target.value === correctAnswer) {
            e.target.classList.add("correct");
            score++;

        } else {
            e.target.classList.add("incorrect");
            document.querySelector(`button[value="${correctAnswer}"]`).classList.add("correct");
        }
        const optionButtons = document.querySelectorAll(".option");
        for (let element of optionButtons) {
            disable(element);
        }
        answere++;
        scoreUpdate();
        [doggoImgUrl, correctBreed, breedChoices] = await loadQuizData();
        setTimeout(next, 1500);
    }

    const options = document.getElementById("options");
    //button creation
    for (let coice of choicesArray) {
        const button = document.createElement("button");
        button.textContent = capitalizeFirstLetter(coice);
        button.value = coice;
        button.name = coice;
        button.classList = "option";
        button.addEventListener("click", buttonHandler);
        options.appendChild(button);
    }
}


function renderQuiz(imgUrl, correctAnswer, choices) {
    const image = document.createElement("img");
    image.setAttribute("src", imgUrl);
    image.setAttribute("class", "dogImg");
    const frame = document.getElementById("image-frame");

    image.addEventListener("load", () => {
        frame.replaceChildren(image);
        clearButtons();
        renderButtons(choices, correctAnswer);
    })

}

async function loadQuizData() {
    let doggoImgUrl = await fetchMessage(RANDOM_IMG_ENDPOINT);
    let correctBreed = getBreedFromURL(doggoImgUrl);
    let breedChoices = getMultipleChoices(3, correctBreed, BREEDS);

    return [doggoImgUrl, correctBreed, breedChoices];
}

document.getElementById("image-frame").textContent = "Fetching doggo...";
[doggoImgUrl, correctBreed, breedChoices] = await loadQuizData();

async function next() {
    renderQuiz(doggoImgUrl, correctBreed, breedChoices);
}
next();
// module.exports.loadQuizData = loadQuizData;