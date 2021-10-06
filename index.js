const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const fs      = require('fs')

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

var client = new Discord.Client()
var config_token = process.env.TOKEN
var config_prefix = process.env.PREFIX
var config_status = process.env.STATUS
var config_statustype = process.env.STATUSTYPE
var config_owner = process.env.OWNER
var config_bcchannel = process.env.BCCHANNEL
var config_bcserver = process.env.BCSERVER
if(fs.existsSync("ids") == false) {fs.mkdirSync("./ids/")}
if(fs.existsSync("ids/times.json") == false) {fs.writeFileSync("ids/times.json", "")}
if(fs.existsSync("ids/victim.json") == false) {fs.writeFileSync("ids/victim.json", "")}
if(fs.existsSync("ids/msg.json") == false) {fs.writeFileSync("ids/msg.json", "")}

client.on('ready', () => {
    activity()
    setInterval(activity, 60000)
    console.log(`Online`)
})

function activity() {
    client.user.setActivity(config_status, {type: config_statustype})
}



var cmdmap = {
    spam : cmd_spam,
    help : cmd_help,
    setvictim : cmd_setvictim,
    setmsg : cmd_setmsg,
    settimes : cmd_settimes
}

function cmd_spam (msg, args) {
    console.log("spamm started")
    client.guilds.fetch(config_bcserver)
    var countraw = fs.readFileSync('ids/times.json', 'utf8')
    var count = countraw.toString()
    var victim = fs.readFileSync('ids/victim.json', 'utf8')
    var user = client.users.cache.get(victim)
    var mssg = fs.readFileSync('ids/msg.json', 'utf8')
    client.channels.cache.get(config_bcchannel).send("Spammer started")
    while (count != 0) {
        user.send(mssg)
        console.log(count)
        count = count-1 
    }
    client.channels.cache.get(config_bcchannel).send("Spammer finished")
}

function cmd_help (msg, args) {
    console.log("Help started")
    var emb = new MessageEmbed()
        .setTitle('Help')
        .setColor('faa61a')
        .setDescription("(Required) [Optional] \n \n !Spam : Starts Spamming \n !Help : Shows this Message \n !SetVictim (ID) : Set the ID of the Victim \n !SetMsg (MSG) : Sets the message \n !SetTimes (Times) : Set the number of msg")
        .setFooter(msg.author.tag, msg.author.avatarURL)
        .setTimestamp()
    client.channels.cache.get(config_bcchannel).send(emb)
}

function cmd_setvictim (msg, args) {
    console.log("Set Victim started")
    client.guilds.fetch(config_bcserver)
    fs.writeFileSync('ids/victim.json', args.toString(), 'UTF8')
    console.log("Set Victim worked")
    client.channels.cache.get(config_bcchannel).send("Server ID set")
            }

function cmd_setmsg (msg, args) {
    console.log("Set msg started")
    try {
        client.guilds.fetch(config_bcserver)
        fs.writeFileSync('ids/msg.json', args.toString(), 'UTF8')
        console.log("Set msg worked")
        client.channels.cache.get(config_bcchannel).send("msg set")
    }
    catch(err) {
        client.channels.cache.get(config_bcchannel).send("Error")
    }
}

function cmd_settimes (msg, args) {
    console.log("Set Times started")
    try {
        client.guilds.fetch(config_bcserver)
        fs.writeFileSync('ids/times.json', args.toString(), 'UTF8')
        console.log("Set Times worked")
        client.channels.cache.get(config_bcchannel).send("Times set")
    }
    catch(err) {
        client.channels.cache.get(config_bcchannel).send("Error")
    }
}

client.on('message', (msg) => {
    console.log(msg)


    var cont   = msg.content,
        member = msg.member,
        chan   = msg.channel,
        guild  = msg.guild,
        author = msg.author

        if (msg.author.id == !config_owner) {return}
        if (msg.guild.id == !config_bcserver) {return}
        if (msg.channel.id == !config_bcchannel) {return}


        if (author.id != client.user.id && cont.startsWith(config_prefix)) {

            
            // 
            var invoke = cont.split(' ')[0].substr(config_prefix.length),
                args   = cont.split(' ').slice(1)
            
            
            if (invoke in cmdmap) {
                cmdmap[invoke](msg, args)
            }
        }

})


client.login(config_token)