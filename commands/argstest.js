module.exports.run = async (bot, message, args) => {
    let arg = args.join(" ");
    console.log("Lorem Ipsum " + arg + " Dolor Sit");
}

module.exports.help = {
    name: "argstest"
}