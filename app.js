const Manager = require("./Libs/Manager");
const Engineer = require("./Libs/Engineer");
const Intern = require("./Libs/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./Libs/htmlRenderer");

let teamArray = [];
let teamCount = 0;

const questions = [
    {
        type: 'input',
        message: 'Enter your name',
        name: 'name'
    },
    {
        type: 'input',
        message: 'Enter your id',
        name: 'id'
    },
    {
        type: 'input',
        message: 'Enter your email',
        name: 'email',
        validate: validateEmail
    },
    {
        type: 'input',
        message: 'Enter your role',
        name: 'role'
    }
];

//this function will get all the info about the team
async function getTeam() {
    const prompt1 = await inquirer.prompt(questions)
    .then(async function (responses) {
        if(responses.role === "Manager" || responses.role === "manager") {
            const managerPrompt = await inquirer.prompt([
                {
                    type: 'number',
                    message: 'Enter your office number',
                    name: 'office'
                },
                {
                    type: 'number',
                    message: 'Enter the # of members on your team',
                    name: "members"
                }
            ]) .then(async function(obj) {
                const newManager= new Manager(responses.name,responses.id,responses.email,obj.office);
                teamArray.push(newManager);
                while(teamCount < obj.members) {
                    const prompt2 = await inquirer.prompt(questions)
                    .then(async function(res) {
                        if(res.role === "Engineer" || res.role === "engineer") {
                            await inquirer.prompt(
                                {
                                    type: 'input',
                                    message: 'Enter your github username',
                                    name: 'github'
                                }
                            ) .then(function(resp) {
                                const newEngineer = new Engineer(res.name, res.id, res.email, resp.github);
                                teamArray.push(newEngineer);
                                teamCount++;
                            })
                        }
                        else if(res.role === "Intern" || res.role === "intern") {
                            const prompt3 = await inquirer.prompt(
                                {
                                    type: 'input',
                                    message: 'Enter your school',
                                    name: 'school'
                                }
                            ).then(function(r) {
                                const newIntern = new Intern(res.name, res.id, res.email, r.school);
                                teamArray.push(newIntern);
                                teamCount++;
                            })
                        }
                        else {
                            console.log ("Invalid entry");
                        }
                    })
                }
            })
        }
        else {
            console.log("Must first enter manager info");
        }
        generatePage();
    })
}

function validateEmail(email){
    let characters = "[a-zA-Z0-9]"+ "@"+"[a-zA-Z0-9]"+"."+"[a-zA-Z]";
    if (!email.match(characters)){
        return console.log("Invalid email. Please enter again");
    }
    else{
        return true;
    }
}

//creates team.html page
function generatePage() {
    if(!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    };
    fs.writeFileSync(outputPath, render(teamArray));
};

getTeam();

