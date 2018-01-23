const api = 'https://eu.api.battle.net/wow/auction/data/argent%20dawn?locale=en_GB&apikey=';
const botSettings = require('../botsettings.json');

const snekfetch = require("snekfetch");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(message.channel.name != botSettings.channel) return message.channel.send(`Deze command kan alleen in ${message.guild.channels.find("name", botSettings.channel)} worden uitgevoerd.`);

    snekfetch.get(api + botSettings.blizzard_api_key).then(r => {
        return message.channel.send(`De auction house data is voor het laatst geüpdate op: ${r.headers['last-modified']}.`);
    }).catch(err => {
        return message.channel.send('Er is iets fout gegaan met het ophalen van de status, probeer het opnieuw.');
    });
}

module.exports.help = {
    name: "status"
}