const readline = require('readline');

const line = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(title) {
    return new Promise((rs, rj) => {
        line.question(title, data => {
            rs(data)
        })
    })
}

async function input(title) {
    return new Promise(async resolve => {
        const secret = await question(title);
        resolve(secret);

    })
}

function closeInput() {
    line.close()
}

module.exports = {
    input, closeInput
};
