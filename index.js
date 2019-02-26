const fs = require("fs");
const Jimp = require("jimp")
const snekfetch = require('snekfetch');
const booru = require('booru');
const superagent = require('superagent');
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const ms = require("ms")
const weather = require("weather-js");
const moment = require('moment')
const math = require('mathjs');
var randomPuppy = require("random-puppy")

client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.find((ch) => ch.name === "bem-vindo");
    if (!channel) return;
    let embed = new Discord.RichEmbed()
    embed.setColor("#ff0040")
    embed.setTitle(`✅ ${member.user.tag} Entrou no servidor`)
    embed.setImage("https://pa1.narvii.com/6600/071a97b99d04ef5de9839b27adcbd010f2263035_hq.gif");
    embed.setFooter("Seja bem vindo!")
    channel.send(embed)
});

client.on("guildMemberRemove", member => {
    let channel = member.guild.channels.find(chnl => chnl.name === 'bem-vindo', 'welcome-exit', 'entrada-saída', 'entrada-saida', 'welcome');
    if (!channel) return;
    let embed = new Discord.RichEmbed()
    embed.setColor("#ff0040")
    embed.setTitle('Atualização de membros')
    embed.setDescription(`:no_entry: ${member.user.tag} Saiu do servidor.`)
    embed.setThumbnail(member.user.displayAvatarURL)
    channel.send(embed)
})
client.on("ready", () => {
    console.log(`Logado.`);
    let s = [
        { name: `Precisa de ajuda? | digite y!help`, type: 'STREAMING', url: 'https://www.twitch.tv/asdasd' },
        { name:  `Fui criada por: Krowley#1694`, type: 'STREAMING', url: 'https://www.twitch.tv/asdasd' },
        { name: `Kakegurui`, type: 'STREAMING', url: 'https://www.twitch.tv/asdasd' }
    ];
    
    function st() {
        let rs = s[Math.floor(Math.random() * s.length)];
        client.user.setPresence({ game: rs });
    }
  
    st();
    setInterval(() => st(), 60000);  //10000 = 10Ms = 10 segundos
  
});
client.on('guildCreate', guild => {
    console.log(`Entrou em: ${guild.name} (id: ${guild.id}). População de ${guild.memberCount} pessoas.`);
    client.user.setActivity(`em ${client.guilds.size} servidores`);
});

client.on('guildDelete', guild => {
    console.log(`O  foi removido de ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`em ${client.guilds.size} servidores`);
});

client.on("message", async message => {
    const args = message.content.slice(config.prefix.lenght).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    if (comando === 'y!mute') {
        if(!message.member.hasPermission("MANAGE_MEMBERS"))
        return message.channel.send(`${message.author} Apenas membros da staff podem usar esse comando.`);
        let tomute = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!tomute) return message.messge.channel.send("Mencione um membro presente neste servidor.")
        if (tomute.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Can't mute them!")
        let muterole = message.guild.roles.find(r => r.name === "muted");
        let mutetime = args[1];
        if (!mutetime) return message.channel.send("You didn't specify a time!");
        await (tomute.addRole(muterole.id));
        message.channel.send(`<@${tomute.id}> foi mutado por ${ms(ms(mutetime))}`);
        setTimeout(function() {
            tomute.removeRole(muterole.id);
            message.channel.send(`<@${tomute.id}> foi desmutado!`);
        }, ms(mutetime));
    }
    if (comando === "y!temperatura") {
    if (args.length < 1) {
        message.channel.send("Você não falou nenhum local!");
        return 0;
    }
    weather.find({search: args.join(' '), degreeType: 'C', lang: 'pt-BR'}, (err, result) => {
        if (err) throw err;
        result = result[0]; 
        if (!result) {
            message.channel.send("Fale um local que exista, ou coloque o nome corretamente!");
            return;
        }
        var current = result.current;
        var location = result.location;
        const embed = new Discord.RichEmbed()
        .setAuthor(`Tempo para: ${location.name}`)
        .setDescription(`${current.skytext}`)
        .addField("Fuso horário:",`UTC${location.timezone >= 0 ? "+" : ""}${location.timezone}`, true)
        .addField("Tipo de grau:", location.degreetype, true)
        .addField('Temperatura:',`${current.temperature}° C`, true)
        .addField('Sensação térmica:', `${current.feelslike}° C`, true)
        .addField('Ventos:', current.winddisplay, true)
        .addField('Umidade:', `${current.humidity}%`, true)
        .setFooter('Fonte: https://weather.com')
        .setColor(0xff6e00)
        .setTimestamp();
        message.channel.send({embed});
    });
}
if (comando === "y!calcular") {
let input = args.join(" ");
if (!input) {
    message.reply('**Você deve fornecer uma equação a ser resolvida na calculadora!**');
    return;
}

const question = args.join(" ");

let answer;
try {
    answer = math.eval(question);
} catch (err) {
    return message.reply(`**Questão invalida** ${err}`);
}

let embed = new Discord.RichEmbed()
    .setThumbnail("https://cdn.discordapp.com/attachments/513130436780752896/539028206548942869/Calculator_5122x.png")
    .setColor("#7A1B17")
    .addField("**Questão:**", question, true)
    .addField("**Resposta:**", answer);
    message.channel.send(embed)
}
    if (comando == "y!avatar") {
        let usuario = message.mentions.members.first() || message.member;
        let embed = new Discord.RichEmbed()
        embed.setColor("#ff0040")
        embed.setDescription(`Avatar do usuário ${usuario.user}`)
        embed.setImage(usuario.user.displayAvatarURL)
        embed.setFooter(message.author.tag, message.author.displayAvatarURL)
        embed.setTimestamp()
        return message.channel.send(embed)
    }
    if (comando === "y!say") {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o => {});
        message.channel.send(sayMessage);
    }
    if (comando === "y!clear") {
        let me = message.mentions.users.first() || client.users.get(args[0]);

if(!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.channel.send(`**${message.author}** Apenas membros da staff podem usar esse comando.`)

if(me) {
message.channel.fetchMessages({ limit: 100 }).then(messages => message.channel.bulkDelete(messages.filter(m => m.author.id === me.id)))
message.channel.send(`As mensagens de ${message.mentions.users.first()} foram apagadas.`).then(msg => msg.delete(10500));
} else {
 message.channel.bulkDelete(100)
message.channel.send(`**${message.author.tag}** limpou o chat.`).then(msg => msg.delete(10500));
}}
if(message.content.startsWith('<@546447145809477642>')) {
    message.channel.send('Me chamou?')
}
    if (comando === "y!kick") {
        if(!message.member.hasPermission("KICK_MEMBERS"))
        return message.channel.send(`${message.author} Apenas membros da staff podem usar esse comando.`);
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.reply("Mencione um usuário presente neste servidor.");
        if (!member.kickable)
            return message.channel.send(`${message.author} Eu não posso expulsar este usuário!`);

        let reason = args.slice(1).join(' ');
        if (!reason) reason = "Não especificado.";
        let usuario = message.mentions.members.first() || message.member;
        await member.kick(reason)
            .catch(error => message.reply(`Desculpe ${message.author} não consegui expulsar o membro devido o: ${error}`));
            let embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .addField("Usuário expulso", `${member.user.tag} foi expulso do servidor.`)
            .setThumbnail(usuario.user.displayAvatarURL)
            .setFooter(`Motivo: ${reason}` + ' | ' + `Staff responsável: ${message.author.tag}`)
        message.channel.send(embed)

    }
    var member = message.member;
    let bbUser = message.mentions.members.first();
    if(bbUser) {
        let guilda = await message.guild.fetchMembers();
        member = guilda.members.get(bbUser.id);
    } else {
        bbUser = message.member;
    }
    if(comando === "y!userinfo") {
    let status;
  if(bbUser.presence.status === "online") status = `ID DO EMOJI`
  if(bbUser.presence.status === "dnd") status = `ID DO EMOJI`
  if(bbUser.presence.status === "idle") status = `ID DO EMOJI`
  if(bbUser.presence.status === "stream") status = `<:streambr:508808483601383425>`
  if(bbUser.presence.status === "offline") status = `ID DO EMOJI`

    let embed = new Discord.RichEmbed()
    .addField(`Nome: **${bbUser.user.tag}**\n` +
    `ID: **${bbUser.id}**\n` +
    `Apelido: ${bbUser.nickname ? `${bbUser.nickname}` : "**Nenhum**"} \n` +
    `Jogando: ${bbUser.presence.game ? `**${bbUser.presence.game.name}**` : "**Nada**"} **${status}**\n` +
    `Conta criada à: **\`${moment().diff(bbUser.user.createdAt, "days")} dias\`**\n` +
    `Está à: **\`${moment().diff(member.joinedAt, "days")} dias no servidor\`**\n` +
    'Cargos:' , `${member.roles.map(r => r).join(", ").replace("@everyone, ", "")}`)
    .setThumbnail(bbUser.user.displayAvatarURL)
    .setColor(0xff6e00)

    message.channel.send(embed);
    }
    if (comando === "y!ban") {
        if(!message.member.hasPermission("BAN_MEMBERS"))
        return message.channel.send(`${message.author} Apenas membros da staff podem usar esse comando.`);
        let member = message.mentions.members.first();
        if (!member)
            return message.channel.send(`${message.author} Mencione um usuário presente no servidor.`);
        if (!member.bannable)
            return message.reply("Eu não posso banir esse usuário.");
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "Não especificado.";
        await member.ban(reason)
            .catch(error => message.reply(`Desculpe ${message.author} não consegui banir o membro devido o : ${error}`));
        let usuario = message.mentions.members.first() || message.member;
        let embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .addField("Usuário banido", `${member.user.tag} foi banido do servidor`)
            .setThumbnail(usuario.user.displayAvatarURL)
            .setFooter(`Motivo: ${reason}` + ' | ' + `Banido pelo Staff: ${message.author.tag}`)
        message.channel.send(embed)
    }
    if (message.content.startsWith('!yumekomeow')) {
        message.delete().catch(O_o => {});
        message.channel.send('https://images-ext-1.discordapp.net/external/IaMOdObdkdMhl7mWSjHtRSK197BfOgAxtkMI1B7cCsw/https/pa1.narvii.com/6600/071a97b99d04ef5de9839b27adcbd010f2263035_hq.gif?width=400&height=225');
    };
    if (message.content.startsWith("y!serverinfo")) {
        const createServer = moment(message.guild.createdAt).format('ll')
        const joinedAt = moment(message.member.joinedAt).format('ll')
        let embed = new Discord.RichEmbed()
            .setDescription('<a:pepodancin:547940315781267464> Algumas informações sobre o servidor:')
            .addField(':pencil: Nome:', message.guild.name, true)
            .addField(':crown: Criador:', `${message.guild.owner}`, true)
            .addField(':busts_in_silhouette: Membros:', message.guild.memberCount, true)
            .addField('<a:engrenagemBR:508808309139177473> Cargos:', message.guild.roles.size, true)
            .addField(':speech_balloon: Canais de texto:', message.guild.channels.size, true)
            .addField(':arrow_right: Data de sua entrada: ', joinedAt, true)
            .addField(':earth_americas: Região', message.guild.region, true)
            .addField(':link: ID:', message.guild.id, true)
            .addField(':date:  Data de criação: ', createServer, true)
            .setThumbnail(message.guild.iconURL)
            .setColor('#2EFEC8')
            .setFooter(message.author.tag + ' Solicitou o comando ', message.author.displayAvatarURL)
            .setTimestamp()
            message.channel.send(embed)
    }
    if (comando === "y!booru") {
         if (message.content.toUpperCase().includes('LOLI') || message.content.toUpperCase().includes('GORE')) return message.channel.send('That kind of stuff is not allowed! Not even in NSFW channels!');
         if (message.channel.nsfw === true) {
            if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')
            var query = message.content.split(/\s+/g).slice(1).join(" ");
         booru.search('gelbooru', [query], {nsfw: true, limit: 1, random: true })
             .then(booru.commonfy)
             .then(images => {
                 for (let image of images) {
                     const embed = new Discord.RichEmbed()
                     .setTitle("Link da imagem")
                     .setImage(image.common.file_url)
                     .setColor('#000000')
                     .setFooter(`Tags: ${query}`)
                     .setURL(image.common.file_url);
                     return message.channel.send({embed});
                 }
             }).catch(err => {
                 if (err.name === 'booruError') {
                     return message.channel.send(`No results found for **${query}**`);
                 } else {
                     return message.channel.send(`No results found for **${query}**`);
                 }
 })
       
 }}
 

    const NUM_KISS = 10;
    // Kiss Gifs
    var kiss = [{
            link: 'https://66.media.tumblr.com/4737e3217b7a1f78cd88d592d7334c00/tumblr_inline_p6q1lr6vkm1vu90sx_500.gif'
        },
        {
            link: 'https://i.pinimg.com/originals/b6/58/93/b65893e0a0aec5b35fd5f7a6cfc423a5.gif'
        },
        {
            link: 'https://66.media.tumblr.com/1cb8d5bacc123aa4d1f4a6a875432cb0/tumblr_p25f7h3TVn1vptudso3_400.gif'
        },
        {
            link: 'https://i.pinimg.com/originals/47/c9/3b/47c93b54bc25aa3c67cb8f6576d3a15c.gif'
        },
        {
            link: 'https://gifimage.net/wp-content/uploads/2018/06/yuri-kiss-gif-1.gif'
        },
        {
            link: 'http://66.media.tumblr.com/dc0496ce48c1c33182f24b1535521af2/tumblr_mqrl3ynedk1scihu7o1_500.gif'
        },
        {
            link: 'https://media1.tenor.com/images/9fac3eab2f619789b88fdf9aa5ca7b8f/tenor.gif'
        },
        {
            link: 'https://pa1.narvii.com/6380/c6869beba0e8c68a328040791d64314a2fd159a4_hq.gif'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547631086146945026/kiss-ryEvhTOwW.gif?width=400&height=225'
        },
        {
            link: 'https://img1.ak.crunchyroll.com/i/spire4/d309fcb80820b7ab8c9edf97e525ed041462061386_full.gif'
        },
        {
            link: 'https://images-ext-2.discordapp.net/external/Rgju6qyFVEt51Ait_Uiw_tkBxn4W2eoKh-wgf3MWhHo/https/imgur.com/H1GbaL6.gif?width=400&height=225'
        }
    ];

    const NUM_HUG = 7;
    // Hug Gif's
    var hug = [{
            link: 'https://66.media.tumblr.com/5d324e0edd282d05d9af9856612f3781/tumblr_inline_ph2cf1Y02A1ucmb6h_540.gif'
        },
        {
            link: 'https://gifimage.net/wp-content/uploads/2018/10/anime-hug-gif-cute-4.gif'
        },
        {
            link: 'http://1.bp.blogspot.com/-OpJBN3VvNVw/T7lmAw0HxFI/AAAAAAAAAfo/bGJks9CqbK8/s1600/HUG_K-On!+-+Kawaii.AMO.gif'
        },
        {
            link: 'https://data.whicdn.com/images/270929601/original.gif'
        },
        {
            link: 'https://66.media.tumblr.com/241f1e79b31161765cd11c1ded380705/tumblr_inline_mzqkeyNKZM1qc7mf8.gif'
        },
        {
            link: 'https://66.media.tumblr.com/fade7ff0a367c113091ca2695d00f257/tumblr_o0j65kTpgV1sawtkmo1_540.gif'
        },
        {
            link: 'https://media1.giphy.com/media/X4pI9XchDNsu4/giphy.gif'
        }
    ];

    const NUM_SLAP = 14;
    // Hug Gif's
    var slap = [{
            link: 'https://i.imgur.com/4MD8e78.gif'
        },
        {
            link: 'https://i.pinimg.com/originals/b6/e3/9e/b6e39e693be3968d212b0fe5754f85db.gif'
        },
        {
            link: 'https://pa1.narvii.com/5609/73312031bc4f5879b88ccd0892c22cead0f3a95f_hq.gif'
        },
        {
            link: 'http://www.lovethisgif.com/uploaded_images/8272-Ryuuji-Takasu-X-Taiga-Aisaka-Toradora-Anime-Series-Slap-Haruhichan.gif'
        },
        {
            link: 'https://orig00.deviantart.net/45a9/f/2014/023/2/4/senza_titolo_1_by_lightning441-d73dgey.gif'
        },
        {
            link: 'https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif'
        },
        {
            link: 'https://media1.tenor.com/images/b6d8a83eb652a30b95e87cf96a21e007/tenor.gif?itemid=10426943'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547631709026385921/slap-B1-nQyFDb.gif?width=400&height=228'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547633139522994176/slap-Hy09QJFDZ.gif?width=400&height=293'
        },
        {
            link: 'https://i.imgur.com/o2SJYUS.gif'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547632019677380619/slap-HkskD56OG.gif?width=400&height=226'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547632905648603180/slap-SJ-CQytvW.gif?width=400&height=225'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547632318014291988/slap-SkSCyl5yz.gif?width=400&height=200'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547632492983877632/slap-ryv3myFDZ.gif?width=400&height=225'
        }
    ];
    const NUM_LICK = 15;
    // Hug Gif's
    var lick = [{
            link: 'https://i.pinimg.com/originals/b3/76/47/b37647141288a8f67f56d2a4a0b33062.gif'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653854674681856/lick-Syg8gx0OP-.gif'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653848508923904/lick-rykRHmB6W.gif?width=400&height=225'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653690706755590/lick-H13HS7S6-.gif?width=400&height=225'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653670406324244/lick-Bkxge0uPW.gif?width=400&height=225'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653668162502679/lick-rJ6hrQr6-.gif?width=400&height=226'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653666459353108/lick-H1zlgRuvZ.gif?width=400&height=226'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653647543304192/lick-Sk15iVlOf.gif?width=400&height=226'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653625233670144/lick-rktygCOD-.gif?width=400&height=226'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653638080692236/lick-H1EJxR_vZ.gif?width=400&height=225'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653618795413504/lick-HJRRyAuP-.gif?width=400&height=225'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653873201053706/lick-S1Ill0_vW.gif?width=400&height=231'
        },
        {
            link: 'https://media.discordapp.net/attachments/547188809729572891/547653874593300521/lick-Hkknfs2Ab.gif?width=400&height=225'
        },
        {
            link: 'https://66.media.tumblr.com/0fc51db3ee68263bfac91dcfa9c3ebb6/tumblr_nwsmfzIbio1sfyp69o1_500.gif'
        },
        {
            link: 'http://optimal.inven.co.kr/upload/2017/06/03/bbs/i16118643024.gif'
        }
    ];

    if (comando === "y!lick") {
        var rand = Math.floor(Math.random() * NUM_LICK)
        let lelol = message.mentions.members.first()
        if (!lelol)
            return message.channel.send("Huur.. mencione a quem você deseja dar uma lambidinha! ");
        let embed = new Discord.RichEmbed()
        embed.setColor("#03b3dd")
        embed.setTitle(`${lelol.user.tag} levou uma lambidinha sagaz de ${message.author.tag}`)
        embed.setImage(lick[rand].link)
        return message.channel.send(embed)
    }
    if (comando === "y!kiss") {
      var rand = Math.floor(Math.random() * NUM_KISS)
      let lelel = message.mentions.members.first()
      if (!lelel)
          return message.channel.send("Heee? você deve mencionar a quem você deseja dar um web-beijinho! ( ͡° ͜ʖ ͡°)");
      let embed = new Discord.RichEmbed()
      embed.setColor("#03b3dd")
      embed.setTitle(`${lelel.user.tag} recebeu um beijo de ${message.author.tag}`)
      embed.setImage(kiss[rand].link)
      return message.channel.send(embed)
  } 
  if (comando === "y!idcargo")
  message.channel.send(message.guild.roles.find(cargo => cargo.name == "SADBOY LIXO").id);
  if (comando === "y!slap") {
    var rand = Math.floor(Math.random() * NUM_SLAP)
    let lelil = message.mentions.members.first()
    if (!lelil)
        return message.channel.send("Huur.. mencione a quem você deseja meter um tapão! ");
    let embed = new Discord.RichEmbed()
    embed.setColor("#03b3dd")
    embed.setTitle(`${lelil.user.tag} levou uma tapão de ${message.author.tag}!`)
    embed.setImage(slap[rand].link)
    return message.channel.send(embed)
  }

  if (comando === "y!hug") {
    var rand = Math.floor(Math.random() * NUM_HUG)
    let leleu = message.mentions.members.first()
    if (!leleu)
        return message.channel.send("Heeeee? mencione a quem você deseja dar um web-abracinho! ( ͡° ͜ʖ ͡°)");
    let embed = new Discord.RichEmbed()
    embed.setColor("#03b3dd")
    embed.setTitle(`${leleu.user.tag} Foi abraçado(a) por ${message.author.tag}`)
    embed.setImage(hug[rand].link)
    return message.channel.send(embed)
  }
  if (comando === "y!react") {
  let msg = await message.channel.fetchMessage(args[0]); // aí vc envia o id da mensagem q vc quer fazer o reaction role... ex: !cmd 543638943720144906

  let emoji_one = client.emojis.get("549406305660698637"), // id do primeiro emoji q o bot vai reagir na mensagem
  emoji_two = client.emojis.get("549460782056734750"), // id do segundo emoji q o bot vai reagir na mensagem
  emoji_three = client.emojis.get("549410121055469569"); // id do terceiro emoji q o bot vai reagir na mensagem
  // pra pegar o id de um emote vc usa: message.channel.send(message.guild.emojis.find(emote => emote.name == "nome do emote q vc quer saber o id").id);

  let role_one = "549461165709721600", // id do role q o user vai ganhar quando reagir com o emoji um
  role_two = "549462152847556623", // id do role q o user vai ganhar quando reagir com o emoji dois
  role_three = "549462672526278667"; // id do role q o user vai ganhar quando reagir com o emoji três
  // pra pegar o id de um cargo vc usa: message.channel.send(message.guild.roles.find(cargo => cargo.name == "nome do cargo q vc quer saber o id").id);

  let emojis_array = [emoji_one, emoji_two, emoji_three];
  
  await msg.react(emoji_one);
  await msg.react(emoji_two);
  await msg.react(emoji_three);

  let collector = msg.createReactionCollector((r, u) => emojis_array.includes(r.emoji), { time: 1000 * 60 * 10 });
  
  collector.on('collect', r => {
    let user = message.guild.member(r.users.last());
    
    switch(r.emoji.id){
      case emoji_one.id:
        user.addRole(role_one)
      break;
      case emoji_two.id:
        user.addRole(role_two)
      break;
      case emoji_three.id:
        user.addRole(role_three)
      break;
    }})
 }
  if (comando == "y!ship") {
    var porcentagem = 0
    var aleatorio = Math.round(Math.random() * 100)
    porcentagem = aleatorio
    let user1 = message.mentions.users.first() || message.author
    let user2 = message.mentions.users.array()[1]
    let mensagem;
    if(!user2) return message.reply("N mencionou ninguem")
      let richard_lindu = await Jimp.read(user1.avatarURL)
      let richard_dmais = await Jimp.read(user2.avatarURL)
      await richard_lindu.resize(115, 115)
      await richard_dmais.resize(115, 115)
      let eu_amo_o_richard = await Jimp.read("https://cdn.discordapp.com/attachments/486016051851689994/509883077707694100/ships.png")
      await eu_amo_o_richard.composite(richard_lindu, 1, 1)
      await eu_amo_o_richard.composite(richard_dmais, 229, 1)
      .write(`./img/${user1.id}${user2.id}.png`)
    let aido = new Array ()
     aido[1] = "Msg 1"
     aido[2] = "Msg 2"
    var i = Math.floor(2*Math.random())
    if (porcentagem <= 50) {
        mensagem = `${porcentagem}% [██------] Um dia talvez! 🤔`
    } else if (porcentagem > 50 && porcentagem <= 70) {
        mensagem = `${porcentagem}% [███████-----] Eles se amam mas não assumem.. Poxa, aí fica difícil! 🤐 `
    } else if (porcentagem > 71 && porcentagem <= 90) {
        mensagem = `${porcentagem}% [█████████--] Já deveriam estar casados! 💍 `
    } else {
        mensagem = `${porcentagem}% [██████████] Casal perfeito, Ninguem os separa! 💍`
    }
    message.channel.send({
        embed: {
        "fields": [
          {
            "name": `Sera que temos um novo casal?`,
            "value": `${user1} + ${user2} = ${mensagem}`
          }],
            "color": 111119,
        image: {
             url: 'attachment://file.jpg'
          }
       },
       files: [{
          attachment: "./img/" + user1.id + user2.id + ".png",
          name: 'file.jpg'
       }]
    })
    //settimeout
    setTimeout(() => {      
        fs.unlinkSync(`./img/${user1.id}${user2.id}.png`)
      }, 100)
    }
    if (comando == "y!laranjo") {

Jimp.read("https://cdn.glitch.com/b94d084b-e5f6-4bf9-bc57-563c25d6c68e%2Fimagem%20(1).png?1538783939685", function (err, image) {
    if (err) throw err;
    Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(function (font) {
    
let gs = args.join(" ")
if (!gs) return message.channel.send("Escreva alguma coisa")
    image.resize(719, 519)
        image.print(font, 10, 20, gs, 750)
        image.write("maikaimg/laranjo.jpg")

  message.channel.send({
  files: [{
    attachment: 'maikaimg/laranjo.jpg',
    name: 'laranjo.jpg'
  }]
})

          setTimeout(function () {
                fs.unlinkSync("maikaimg/laranjo.jpg");
        }, 5000);
      })
})

}
 module.exports.help = {
  name: "laranjo"
 }
  if(comando === "y!help") {
    message.channel.send({embed: {
        color: 0xc0c0c0,
        author: {
        name: client.user.username,
        icon_url: client.user.avatarURL 
        },
        
    title: "",
    description: "Meu nome é Yumeko, estou aqui pra te ajudar.",
    fields: [{
            name: "Comandos Fun",
            value: "``y!kiss, y!slap, y!lick, y!hug, y!ship @User 1 @User 2``"
        },
		    {
            name: "Comandos NSFW",
            value: "``y!hentai <tag> - Para mais informações sobre as tags visite https://nekos.life/api/v2/endpoints |    y!booru <tag> busca uma imagem NSFW a partir do site gelbooru.``"
        }, 
        {       
            name: "Comandos administrativos:",
            value: "``y!mute @usuário <tempo> | y!ban | y!kick | y!clear <número de mensagens>``"    
        } 
	    ],
    timestamp: new Date(),

            }
        });
        }
        if(comando === "y!nsfwhelp") {
            message.channel.send({embed: {
                color: 0xc0c0c0,
                author: {
                name: client.user.username,
                icon_url: client.user.avatarURL 
                },
                
            title: "",
            description: "Então você quer putaria? Ok.",
            fields: [{
                    name: "NSFW:",
                    value: "TAGs: '``femdom', 'classic', 'ngif', 'erofeet', 'erok', 'les', 'lewdk', 'keta', 'feetg', 'nsfw_neko_gif', 'eroyuri', 'kuni', 'tits', 'pussy_jpg', 'cum_jpg', 'pussy', 'lewd', 'cum', 'spank', 'Random_hentai_gif', 'boobs', feet', 'solog', 'holo', 'wallpaper', 'bj', yuri', 'trap', 'anal', 'blowjob', 'hentai', 'futanari', 'ero', 'solo', 'erokemo'`` | ",
                    
            }
                ],
            timestamp: new Date(),
                    }
                });
            };
  if (comando == "y!hentai") {
    if (message.channel.nsfw === true) {
        if (!message.channel.nsfw) return message.channel.send('You can use this command in an NSFW Channel!')
            var query = message.content.split(/\s+/g).slice(1).join(" ")
        try {
            superagent.get('https://nekos.life/api/v2/img/'+[query]).then((response) => {
                if(response.body.msg === "404") return message.channel.send(`Nenhum resultado encontrado para a tag "**${query}**"`);
                const lewdembed = new Discord.RichEmbed()
                .setTitle("Link da imagem")
                .setImage(response.body.url)
                .setColor(`#ff0040`)
                .setFooter(`Tag: ${query}`)
                .setURL(response.body.url);
                message.channel.send(lewdembed);
            }).catch((err) => {
            
                if (err) return message.channel.send(`Nenhum resultado encontrado para a tag "**${query}**"`);
            })
        } catch(err) { 
    }
}
  }})
    client.on("message", function (message) {
    var boolean = true;
    if (!!!!Boolean(boolean) !== false && Boolean(boolean) === true) {
      {
        {
          {
            {
              {
                {
                  {
                    {
                      {
                        {
                          if (!!!!Boolean(message.content.includes("discord.gg/")) === true && Boolean(message.content.includes("discord.gg/")) !== false) {
                            message.delete();
                            message.channel.send(`${message.author} Não envie convites de outros servidores aqui.`)
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
});
client.login(config.token)