const wowhead_api = "http://www.wowhead.com/search?q=";
const wowhead_api_rest = "&opensearch";
const tsm_api = "http://api.tradeskillmaster.com/v1/item/EU/argent-dawn/";
const tsm_api_rest = "?format=json&apiKey=";
const botSettings = require('../botsettings.json');

const snekfetch = require("snekfetch");
const Discord = require("discord.js");
const _ = require("lodash");

module.exports.run = async (bot, message, args) => {
    if(message.channel.name != botSettings.channel) return message.channel.send(`Deze command kan alleen in ${message.guild.channels.find("name", botSettings.channel)} worden uitgevoerd.`);

    let arg = _.startCase(args.join(" "));

    snekfetch.get(wowhead_api + arg + wowhead_api_rest).then(r => {
        let index = null;
        let id = null;

        let results = JSON.parse(r.text);
        if(results[7] === undefined) return message.channel.send(`Geen item met de naam '${arg}' gevonden.`);

        results[1].forEach(result => {
            if(result == `${arg} (Item)`)
            {
                index = _.findIndex(results[1], item => item == result);
                id = results[7][index][1];
            }
        })

        snekfetch.get(tsm_api + id + tsm_api_rest + botSettings.tsm_api_key).then(r => {
            let minbuyout = r.body.MinBuyout;
            var gold = parseInt(minbuyout/10000).toLocaleString();
            gold = gold.toLocaleString(undefined, { minimumFractionDigits: 2 });
            var rest = minbuyout%10000;
            var silver = parseInt(rest/100);
            var copper = parseInt(rest%100);

            minbuyout = `**MinBuyout:** ${gold}g ${silver}s ${copper}c`;

            let marketvalue = r.body.MarketValue;
            var gold = parseInt(marketvalue/10000).toLocaleString();
            gold = gold.toLocaleString(undefined, { minimumFractionDigits: 2 });
            var rest = marketvalue%10000;
            var silver = parseInt(rest/100);
            var copper = parseInt(rest%100);

            marketvalue = `**MarketValue:** ${gold}g ${silver}s ${copper}c`;

            let quantity = `**Quantity:** ${r.body.Quantity}`;

            return message.channel.send(`${minbuyout}, ${marketvalue}, ${quantity}\n${r.body.URL}`);

        }).catch(err => {
            return message.channel.send(`Geen item met de naam '${arg}' gevonden.`);
        });
    }).catch(err => {
        return message.channel.send(`Geen item met de naam '${arg}' gevonden.`);
    });
}

module.exports.help = {
    name: "price"
}