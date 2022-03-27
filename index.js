const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Bot Is Working Well!'));
app.listen(port, () => console.log(`[+] Deathly Hallows Machine Is Working`));
const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
  ],
  allowedMentions: false,
});
const moment = require("moment")
const config = require('./config.json')
const emoji = require('./emoji.json')
const channels = require('./channels.json')
const roles = require('./roles.json');
const prefix = ("h!")
client.setMaxListeners(0)
client.on('ready', () => {
  let hamiltonserver = client.guilds.cache.get(config.server);
  console.log(`[+] ${client.user.tag} Ready`)
  joinVoiceChannel({
    channelId: channels.displayvoice,
    guildId: hamiltonserver.id,
    adapterCreator: hamiltonserver.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false
  });
  setInterval(function () {
    let hamiltonserver = client.guilds.cache.get(config.server);
    let rainbowrole = hamiltonserver.roles.cache.get(roles.colorrgb);
    let memberrole = hamiltonserver.roles.cache.get(roles.member);
    rainbowrole.setColor(`RANDOM`).catch(console.log(`[x] Error : Discord API`))
    memberrole.setPermissions(['ADD_REACTIONS', 'ATTACH_FILES', 'CHANGE_NICKNAME', 'CHANGE_NICKNAME', 'CONNECT', 'CREATE_INSTANT_INVITE', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'SPEAK', 'STREAM', 'USE_VAD', 'USE_EXTERNAL_EMOJIS', 'USE_EXTERNAL_STICKERS']).catch(console.log(`[x] Error : Discord API`))
    hamiltonserver.roles.everyone.setPermissions(['ADD_REACTIONS', 'ATTACH_FILES', 'CHANGE_NICKNAME', 'CHANGE_NICKNAME', 'CONNECT', 'CREATE_INSTANT_INVITE', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'SPEAK', 'STREAM', 'USE_VAD', 'VIEW_CHANNEL', 'USE_EXTERNAL_EMOJIS', 'USE_EXTERNAL_STICKERS']).catch(console.log(`[x] Error : Discord API`))
  }, 300000)
});
client.on('guildMemberAdd', async (member) => {
  const user = await member.guild.members.fetch({ user: member.id, cache: false }).catch(console.log(`[x] Error : Discord API`));
  const joindate = moment().format("MM/DD/YYYY HH:mm");
  const cdate = moment.utc(user.user.createdAt).format("MM/DD/YYYY");
  const welcomerchannel = member.guild.channels.cache.get(channels.welcomechannel);
  const welcomerembed = new MessageEmbed()
    .setTitle(`Welcome to Hamilton Community`)
    .setDescription(`**<@${user.id}> به سرور ما خوش آمدید.\nلحظات خوشی را در سرور برای شما آرزومندیم.**`)
    .addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Total Users <:RightArrow:948183388580368425> ${user.guild.memberCount}\n<:DownRightArrow:948183385745023026> Account Age <:RightArrow:948183388580368425> ${cdate}\n<:DownRightArrow:948183385745023026> Join Date <:RightArrow:948183388580368425> ${joindate}`)
    .setColor(config.embedcolor)
    .setThumbnail(member.displayAvatarURL({
      dynamic: true
    }));
  if (user.user.bot) {
    return console.log(`[x] Error : User Is Bot`);
  }
  else {
    welcomerchannel.send({
      embeds: [welcomerembed]
    }).catch(console.log(`[x] Error : Discord API`)).then(
      member.send({
        embeds: [new MessageEmbed().setTitle(`Welcome to our Server`).setColor(config.embedcolor).setThumbnail(member.displayAvatarURL({ dynamic: true, format: 'png' })).setDescription('**به کامیونیتی همیلتون خوش آمدید.**').addField(`\u200b`, `>>> <:Button:948183385304621107> رعایت قوانین و داشتن جو آرام و دوستانه اولین اولویت ما میباشد در رعایت این مسئله کوشا باشید\n<:Button:948183385304621107> جهت عضویت در سرور قوانین را مطالعه و روی دکمه زیر آن کلیک نمایید`).setFooter({ text: `لحظات خوشی را برای شما آرزومندیم` })],
      })
    )
  }
});
client.on("guildUpdate", async (guild) => {
  const user = await guild.fetchAuditLogs({
    type: "GUILD_UPDATE"
  }).catch(console.log(`[x] Error : Discord API`)).then(audit => audit.entries.first())
  const entry = user.executor
  let permissions =
    (await guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.developer) ||
    (await guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.owner) ||
    (await guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.bot) ||
    entry.id === client.user.id;
  if (permissions) {
    return console.log(`[x] Error : Whitelisted User`)
  }
  else {
    try {
      (await guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then(
        punishuser => punishuser.roles.remove(punishuser.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
          punishuser.roles.add(roles.serverban).catch(console.log(`[x] Error : Discord API`)).then(
            guild.setName('𝗛 𝗔 𝗠 𝗜 𝗟 𝗧 𝗢 𝗡').catch(console.log(`[x] Error : Discord API`)).then(
              guild.setIcon('./Hamilton.gif').catch(console.log(`[x] Error : Discord API`))
            )
          )
        }, 2500))
      ))
    } catch {
      return console.log(`[x] Error : Discord API`)
    }
  }
});
client.on("channelCreate", async (channel) => {
  const user = await channel.guild.fetchAuditLogs({
    type: "CHANNEL_CREATE"
  }).catch(console.log(`[x] Error : Discord API`)).then(audit => audit.entries.first())
  const entry = user.executor
  let permissions =
    (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.developer) ||
    (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.owner) ||
    (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.bot) ||
    entry.id === client.user.id;
  if (permissions) {
    return console.log(`[x] Error : Whitelisted User`);
  }
  else {
    try {
      (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then(
        punishuser => punishuser.roles.remove(punishuser.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
          punishuser.roles.add(roles.serverban).catch(console.log(`[x] Error : Discord API`))
        }, 2500))
      ))
    } catch {
      return console.log(`[x] Error : Discord API`)
    }
  }
});
client.on("channelDelete", async (channel) => {
  const user = await channel.guild.fetchAuditLogs({
    type: "CHANNEL_DELETE"
  }).catch(console.log(`[x] Error : Discord API`)).then(audit => audit.entries.first())
  const entry = user.executor
  let permissions =
    (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.developer) ||
    (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.owner) ||
    (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.bot) ||
    entry.id === client.user.id;
  if (permissions) {
    return console.log(`[x] Error : Whitelisted User`)
  }
  else {
    try {
      (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then(
        punishuser => punishuser.roles.remove(punishuser.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
          punishuser.roles.add(roles.serverban).catch(console.log(`[x] Error : Discord API`))
        }, 2500))
      ))
    } catch {
      return console.log(`[x] Error : Discord API`)
    }
  }
});
client.on("channelUpdate", async (channel) => {
  const user = await channel.guild.fetchAuditLogs({
    type: "CHANNEL_UPDATE"
  }).catch(console.log(`[x] Error : Discord API`)).then(audit => audit.entries.first())
  const entry = user.executor
  let permissions =
    (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.developer) ||
    (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.owner) ||
    (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.bot) ||
    entry.id === client.user.id;
  if (permissions) {
    return console.log(`[x] Error : Whitelisted User`)
  }
  else {
    try {
      (await channel.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then(
        punishuser => punishuser.roles.remove(punishuser.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
          punishuser.roles.add(roles.serverban).catch(console.log(`[x] Error : Discord API`))
        }, 2500))
      ))
    } catch {
      return console.log(`[x] Error : Discord API`)
    }
  }
});
client.on("roleCreate", async (role) => {
  const user = await role.guild.fetchAuditLogs({
    type: "ROLE_CREATE"
  }).catch(console.log(`[x] Error : Discord API`)).then(audit => audit.entries.first())
  const entry = user.executor
  let permissions =
    (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.developer) ||
    (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.owner) ||
    (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.bot) ||
    entry.id === client.user.id;
  if (permissions) {
    return console.log(`[x] Error : Whitelisted User`)
  }
  else {
    try {
      (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then(
        punishuser => punishuser.roles.remove(punishuser.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
          punishuser.roles.add(roles.serverban).catch(console.log(`[x] Error : Discord API`))
        }, 2500))
      ))
    } catch {
      return console.log(`[x] Error : Discord API`)
    }
  }
});
client.on("roleUpdate", async (role) => {
  const user = await role.guild.fetchAuditLogs({
    type: "ROLE_UPDATE"
  }).catch(console.log(`[x] Error : Discord API`)).then(audit => audit.entries.first())
  const entry = user.executor
  let permissions =
    (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.developer) ||
    (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.owner) ||
    (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.bot) ||
    entry.id === client.user.id;
  if (permissions) {
    return console.log(`[x] Error : Whitelisted User`)
  }
  else {
    try {
      (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then(
        punishuser => punishuser.roles.remove(punishuser.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
          punishuser.roles.add(roles.serverban).catch(console.log(`[x] Error : Discord API`))
        }, 2500))
      ))
    } catch {
      return console.log(`[x] Error : Discord API`)
    }
  }
});
client.on("roleDelete", async (role) => {
  const user = await role.guild.fetchAuditLogs({
    type: "ROLE_DELETE"
  }).catch(console.log(`[x] Error : Discord API`)).then(audit => audit.entries.first())
  const entry = user.executor
  let permissions =
    (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.developer) ||
    (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.owner) ||
    (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.bot) ||
    entry.id === client.user.id;
  if (permissions) {
    return console.log(`[x] Error : Whitelisted User`)
  }
  else {
    try {
      (await role.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then(
        punishuser => punishuser.roles.remove(punishuser.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
          punishuser.roles.add(roles.serverban).catch(console.log(`[x] Error : Discord API`))
        }, 2500))
      ))
    } catch {
      return console.log(`[x] Error : Discord API`)
    }
  }
});
client.on("guildBanAdd", async (ban) => {
  const user = await ban.guild.fetchAuditLogs({
    type: "MEMBER_BAN_ADD"
  }).catch(console.log(`[x] Error : Discord API`)).then(audit => audit.entries.first())
  const entry = user.executor
  let permissions =
    (await ban.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.developer) ||
    (await ban.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.owner) ||
    (await ban.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.bot) ||
    entry.id === client.user.id;
  if (permissions) {
    return console.log(`[x] Error : Whitelisted User`)
  }
  else {
    try {
      (await ban.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then(
        punishuser => punishuser.roles.remove(punishuser.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
          punishuser.roles.add(roles.serverban).catch(console.log(`[x] Error : Discord API`))
        }, 2500))
      ))
    } catch {
      return console.log(`[x] Error : Discord API`)
    }
  }
});
client.on("guildBanRemove", async (ban) => {
  const user = await ban.guild.fetchAuditLogs({
    type: "MEMBER_BAN_REMOVE"
  }).catch(console.log(`[x] Error : Discord API`)).then(audit => audit.entries.first())
  const entry = user.executor
  let permissions =
    (await ban.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.developer) ||
    (await ban.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.owner) ||
    (await ban.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.bot) ||
    entry.id === client.user.id;
  if (permissions) {
    return console.log(`[x] Error : Whitelisted User`)
  }
  else {
    try {
      (await ban.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then(
        punishuser => punishuser.roles.remove(punishuser.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
          punishuser.roles.add(roles.serverban).catch(console.log(`[x] Error : Discord API`))
        }, 2500))
      ))
    } catch {
      return console.log(`[x] Error : Discord API`)
    }
  }
});
client.on("guildMemberUpdate", async (member) => {
  const user = await member.guild.fetchAuditLogs({
    type: "MEMBER_ROLE_UPDATE"
  }).catch(console.log(`[x] Error : Discord API`)).then(audit => audit.entries.first());
  const entry = user.executor
  let permissions =
    (await member.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.developer) ||
    (await member.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.owner) ||
    (await member.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`))).roles.cache.has(roles.bot) ||
    entry.id === client.user.id;
  if (permissions) {
    return console.log(`[x] Error : Whitelisted User`)
  }
  else {
    try {
      (await member.guild.members.fetch({ user: entry.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then(
        punishuser => punishuser.roles.remove(punishuser.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
          punishuser.roles.add(roles.serverban).catch(console.log(`[x] Error : Discord API`))
        }, 2500))
      ))
    } catch {
      return console.log(`[x] Error : Discord API`)
    }
  }
});
client.on("messageCreate", (message) => {
  const joindate = moment().format("MM/DD/YYYY HH:mm")
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.mentions.everyone) {
    if (message.webhookId) {
      message.fetchWebhook().catch(console.log(`[x] Error : Discord API`)).then(web => message.guild.members.fetch({ user: web.owner.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then((webowner) => {
        let permissions =
          webowner.roles.cache.has(roles.developer) ||
          webowner.roles.cache.has(roles.owner) ||
          webowner.roles.cache.has(roles.bot);
        if (permissions) {
          return console.log(`[x] Error : Whitlisted User`);
        }
        else {
          webowner.roles.remove(webowner.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
            webowner.roles.add(roles.serverban).catch(console.log(`[x] Error : Discord API`))
            message.channel.permissionOverwrites.set([
              {
                id: roles.member,
                deny: ['VIEW_CHANNEL'],
              },
            ]).catch(console.log(`[x] Error : Discord API`))
          }, 2500))
        }
      }))
    }
    else if (!message.webhookId) {
      message.guild.members.fetch({ user: message.author.id, cache: false }).catch(console.log(`[x] Error : Discord API`)).then(function (fetchedmember) {
        let permissions =
          fetchedmember.roles.cache.has(roles.developer) ||
          fetchedmember.roles.cache.has(roles.owner) ||
          fetchedmember.roles.cache.has(roles.bot);
        if (permissions) {
          return console.log(`[x] Error : Whitlisted User`);
        }
        else {
          fetchedmember.roles.remove(fetchedmember.roles.cache).catch(console.log(`[x] Error : Discord API`)).then(setTimeout(function () {
            fetchedmember.roles.add(roles.serverban)
            message.channel.permissionOverwrites.set([
              {
                id: roles.member,
                deny: ['VIEW_CHANNEL'],
              },
            ]).catch(console.log(`[x] Error : Discord API`))
          }, 2500))
        }
      })
    }
  }
  else if (command == "serverban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let mutedrole = message.guild.roles.cache.get(roles.serverban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.cache.has(roles.serverban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن شده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای میوت کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(user.roles.cache).then(setTimeout(function () {
        user.roles.add(mutedrole)
        user.roles.add(roles.displayban)
      }, 1000)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت میوت شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از سرور بن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "amusementban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let mutedrole = message.guild.roles.cache.get(roles.eventban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.cache.has(roles.eventban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن شده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای میوت کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.add(mutedrole).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت میوت شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از بخش ایونت بن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "hobbyban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let mutedrole = message.guild.roles.cache.get(roles.hobbyban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.cache.has(roles.hobbyban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن شده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای میوت کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.add(roles.displayban).then(user.roles.add(mutedrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت میوت شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از بخش سرگرمی بن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "generalban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let displayban = message.guild.roles.cache.get(roles.displayban);
    let mutedrole = message.guild.roles.cache.get(roles.generalban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.cache.has(roles.generalban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن شده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای میوت کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.add(displayban).then(user.roles.add(mutedrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت میوت شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از بخش جنرال بن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "musicban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let displayban = message.guild.roles.cache.get(roles.displayban);
    let mutedrole = message.guild.roles.cache.get(roles.musicban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.cache.has(roles.musicban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن شده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای میوت کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.add(displayban).then(user.roles.add(mutedrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت میوت شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از بخش موسیقی بن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "textban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let displayban = message.guild.roles.cache.get(roles.displayban);
    let mutedrole = message.guild.roles.cache.get(roles.textban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.cache.has(roles.textban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن شده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای میوت کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.add(displayban).then(user.roles.add(mutedrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت میوت شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از چت ها بن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "voiceban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let displayban = message.guild.roles.cache.get(roles.displayban);
    let mutedrole = message.guild.roles.cache.get(roles.voiceban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.cache.has(roles.voiceban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن شده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای میوت کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      uuser.roles.add(displayban).then(user.roles.add(mutedrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت میوت شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از ویس ها بن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "unserverban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let mutedrole = message.guild.roles.cache.get(roles.serverban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را آنبن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user.roles.cache.has(roles.serverban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن نشده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای بن کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(mutedrole).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت بن شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از سرور آنبن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "unamusementban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let mutedrole = message.guild.roles.cache.get(roles.eventban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را آنبن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user.roles.cache.has(roles.eventban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن نشده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای بن کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(mutedrole).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت آنبن شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از بخش ایونت آنبن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "unhobbyban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let mutedrole = message.guild.roles.cache.get(roles.hobbyban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را آنبن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user.roles.cache.has(roles.hobbyban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن نشده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای بن کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(mutedrole).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت آنبن شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از بخش سرگرمی آنبن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "ungeneralban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let mutedrole = message.guild.roles.cache.get(roles.generalban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را آنبن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user.roles.cache.has(roles.generalban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن نشده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای بن کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(mutedrole).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت آنبن شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از بخش جنرال آنبن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "unmusicban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let mutedrole = message.guild.roles.cache.get(roles.musicban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را آنبن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user.roles.cache.has(roles.musicban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن نشده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای بن کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(mutedrole).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت آنبن شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از بخش موسیقی آنبن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "untextban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let mutedrole = message.guild.roles.cache.get(roles.textban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را آنبن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user.roles.cache.has(roles.textban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن نشده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای بن کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(mutedrole).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت آنبن شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از چت ها آنبن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "unvoiceban") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let mutedrole = message.guild.roles.cache.get(roles.voiceban);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را میوت کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را آنبن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user.roles.cache.has(roles.voiceban)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده بن نشده بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای بن کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(mutedrole).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت آنبن شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} از ویس ها آنبن شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Punished User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "addnewcomer") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let displayadmin = message.guild.roles.cache.get(roles.displayadmin);
    let adminrole = message.guild.roles.cache.get(roles.topadmin4);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.cache.has(roles.topadmin4)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده ادمین بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای ادمین کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.add(displayadmin).then(user.roles.add(adminrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت ادمین شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} ادمین شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> New Admin <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "addsupport") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let displayadmin = message.guild.roles.cache.get(roles.displayadmin);
    let adminrole = message.guild.roles.cache.get(roles.topadmin3);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.cache.has(roles.topadmin3)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده ادمین بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای ادمین کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.add(displayadmin).then(user.roles.add(adminrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت ادمین شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} ادمین شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> New Admin <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "addsupervisor") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let displayadmin = message.guild.roles.cache.get(roles.displayadmin);
    let adminrole = message.guild.roles.cache.get(roles.topadmin2);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.cache.has(roles.topadmin2)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده ادمین بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای ادمین کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.add(displayadmin).then(user.roles.add(adminrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت ادمین شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} ادمین شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> New Admin <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "addmanager") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let displayadmin = message.guild.roles.cache.get(roles.displayadmin);
    let adminrole = message.guild.roles.cache.get(roles.topadmin1);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.cache.has(roles.topadmin1)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده ادمین بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای ادمین کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.add(displayadmin).then(user.roles.add(adminrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت ادمین شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} ادمین شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> New Admin <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "removenewcomer") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let displayadmin = message.guild.roles.cache.get(roles.displayadmin);
    let adminrole = message.guild.roles.cache.get(roles.topadmin4);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user.roles.cache.has(roles.topadmin4)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده ادمین بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای ادمین کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(displayadmin).then(user.roles.remove(adminrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت ادمین شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} عضو معمولی شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "removesupporter") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let displayadmin = message.guild.roles.cache.get(roles.displayadmin);
    let adminrole = message.guild.roles.cache.get(roles.topadmin3);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user.roles.cache.has(roles.topadmin3)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده ادمین بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای ادمین کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(adminrole).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت ادمین شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} عضو معمولی شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "removesupervisor") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let adminrole = message.guild.roles.cache.get(roles.topadmin2);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user.roles.cache.has(roles.topadmin2)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده ادمین بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای ادمین کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(displayadmin).then(user.roles.remove(adminrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت ادمین شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} عضو معمولی شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "removemanager") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner);
    let user = message.mentions.members.first();
    let reason = args[1]
    let mutedchannellog = client.channels.cache.get(channels.logchannel);
    let displayadmin = message.guild.roles.cache.get(roles.displayadmin);
    let adminrole = message.guild.roles.cache.get(roles.topadmin1);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک عضو را منشن کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.id === message.author.id) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید خود را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما نمی توانید کاربری که رول او با شما یکی است یا بالاتر از شما است را ادمین کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!user.roles.cache.has(roles.topadmin1)) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `کاربر منشن شده ادمین بوده است.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!reason) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما باید یک دلیل برای ادمین کردن بنویسید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      user.roles.remove(displayadmin).then(user.roles.remove(adminrole)).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کاربر با موفقیت ادمین شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کاربر ${user} عضو معمولی شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> User <:RightArrow:948183388580368425> ${user}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "help") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    if (!permissions) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })
        ]
      })
    }
    else {
      let row2 = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId("moderationselect")
            .setLabel("Moderation")
            .setEmoji(emoji.moderationemoji)
            .setDisabled()
            .setStyle("SECONDARY"),
          new MessageButton()
            .setCustomId("banselect")
            .setLabel("Limit User")
            .setEmoji(emoji.limituseremoji)
            .setDisabled()
            .setStyle("SECONDARY"),
          new MessageButton()
            .setCustomId("staffselect")
            .setLabel("Add Staff")
            .setEmoji(emoji.addstaffemoji)
            .setDisabled()
            .setStyle("SECONDARY")
        );
      let row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId("moderationselect")
            .setLabel("Moderation")
            .setEmoji(emoji.moderationemoji)
            .setStyle("SECONDARY"),
          new MessageButton()
            .setCustomId("banselect")
            .setLabel("Limit User")
            .setEmoji(emoji.limituseremoji)
            .setStyle("SECONDARY"),
          new MessageButton()
            .setCustomId("staffselect")
            .setLabel("Add Staff")
            .setEmoji(emoji.addstaffemoji)
            .setStyle("SECONDARY")
        );
      message.channel.send({ embeds: [new MessageEmbed().setTitle(`Hamilton Moderation`).setColor(config.embedcolor).setDescription(`Hello ${message.author}, I am ${client.user}.\nA Moderation Bot With Many Awesome Features.`).addFields({ name: `<:Pencil:948183387955429376> Prefix`, value: `<:Space:948205685995352145><:RightArrow2:948183389230493746> h!` }, { name: `<:List:948183387129143326> Commands`, value: `<:Space:948205685995352145><:RightArrow2:948183389230493746> Click on buttons to see commands.` }, { name: `<:HammerAndWrench:948183386697138196> Developer`, value: `<:Space:948205685995352145><:RightArrow2:948183389230493746> <@709864578216886444>` }, { name: `<:PhoneCall:948183388546826260> Contact Dev`, value: `<:Space:948205685995352145><:RightArrow2:948183389230493746> [Click here](https://discord.gg/JgtmkCgJCT)` })], components: [row] }).then(messagehelp => {
        setTimeout(function () {
          messagehelp.edit({ embeds: [new MessageEmbed().setTitle(`Hamilton Moderation`).setColor(config.embedcolor).setDescription(`Hello ${message.author}, I am ${client.user}.\nA Moderation Bot With Many Awesome Features.`).addFields({ name: `<:Pencil:948183387955429376> Prefix`, value: `<:Space:948205685995352145><:RightArrow2:948183389230493746> h!` }, { name: `<:List:948183387129143326> Commands`, value: `<:Space:948205685995352145><:RightArrow2:948183389230493746> Click on buttons to see commands.` }, { name: `<:HammerAndWrench:948183386697138196> Developer`, value: `<:Space:948205685995352145><:RightArrow2:948183389230493746> <@709864578216886444>` }, { name: `<:PhoneCall:948183388546826260> Contact Dev`, value: `<:Space:948205685995352145><:RightArrow2:948183389230493746> [Click here](https://discord.gg/JgtmkCgJCT)` })], components: [row2] })
        }, 15000)
      })
    }
  }
  else if (command === "rulessetup") {
    let permissions =
      message.member.permissions.has(`ADMINISTRATOR`)
    if (!permissions) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else if (message.channel.id !== channels.serverguide) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما اجازه استفاده از این دستور را در این کانال ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else if (message.channel.id === channels.serverguide) {
      let row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel("Ease of Access")
            .setStyle("LINK")
            .setURL("https://discord.com/channels/724786666291593277/947070150547505252"),
        );
      message.channel.send({
        embeds: [new MessageEmbed().setColor(config.embedcolor).setTitle(`The Rules of Hamilton Community`).setDescription(`**تمامی ممبر ها باید قوانین را رعایت نماییند.\nدرصورت هرگونه نقض قوانین ادمین ها میتوانند با فرد مربوطه برخورد کنند.\nقوانین برای تمامی اعضا یکسان بوده و هیچ تفاوتی بین دو شخص در نظر گرفته نخواهد شد.**`).addField(`<:Scroll:948183389536653352> قوانین کلی ویس ها و چت ها`, `>>> <:Button:948183385304621107> هر گونه نژاد پرستی و توهین به نژاد افراد ممنوع ، درصورت مشاهده به ادمین ها گزارش دهید\n<:Button:948183385304621107> شما حق بی احترامی ، شوخی و فحاشی  در چنل های جیریت  و افرادی که نمیشناسید را ندارید\n<:Button:948183385304621107> ارسال لینک تبلیغاتی سرور های دیگر و تبلیغات در ویس ها غیر قابل قبول بوده و با فرد مذکور برخورد میشود\n<:Button:948183385304621107> افشا و پخش اطلاعات شخصی ممبر ها در چنل ها ممنوع میباشد ، درصورت مشاهده منجر به بن همیشگی فرد افشا کننده میشود\n<:Button:948183385304621107> شما موظفید رفتار مناسب با جو ویس را داشته باشید و هرگونه ایجاد اختشاش و ... ممنوع و موجب برخورد با شما خواهد شد`)], components: [row]
      })
    }
  }
  else if (command === "bugreportsetup") {
    let permissions =
      message.member.permissions.has(`ADMINISTRATOR`)
    if (!permissions) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else {
      message.channel.send({
        embeds: [new MessageEmbed().setColor(config.embedcolor).setTitle(`Hamilton Moderation`).setDescription(`**باگ های سرور را در این چنل بنویسید.**`).addField(`\u200B`, `>>> <:Button:948183385304621107> در صورتی که گزارش شما حاوی عکس یا فیلم می باشد ابتدا آن را آپلود و سپس لینک آن را قرار دهید`).setThumbnail(config.thumbnailurl)]
      })
    }
  }
  else if (command === "suggestionsetup") {
    let permissions =
      message.member.permissions.has(`ADMINISTRATOR`)
    if (!permissions) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else {
      message.channel.send({
        embeds: [new MessageEmbed().setColor(config.embedcolor).setTitle(`Hamilton Moderation`).setDescription(`**پیشنهادات خود را در اینجا بنویسید**`).addField(`\u200B`, `>>> <:Button:948183385304621107> شما می توانید پیشنهادات و انتقادات خود را برای اعمال در سرور در اینجا بنویسید`).setThumbnail(config.thumbnailurl)]
      })
    }
  }
  else if (command === "rainbowsetup") {
    let permissions =
      message.member.permissions.has(`ADMINISTRATOR`)
    if (!permissions) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else if (message.channel.id !== channels.rainbowrolechannel) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما اجازه استفاده از این دستور را در این کانال ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else if (message.channel.id === channels.rainbowrolechannel) {
      let row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel("Rainbow")
            .setEmoji(emoji.colorrgbemoji)
            .setCustomId("rainbowroleselect")
            .setStyle("SECONDARY"),
        );
      message.channel.send({
        embeds: [new MessageEmbed().setColor(config.embedcolor).setThumbnail(config.thumbnailurl).setTitle(`Rainbow`).setDescription(`**رنگ این نقش همواره در حال تغییر می باشد.**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <@&${roles.colorrgb}>`)], components: [row]
      })
    }
  }
  else if (command === "adultsetup") {
    let permissions =
      message.member.permissions.has(`ADMINISTRATOR`)
    if (!permissions) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else if (message.channel.id !== channels.customroles) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما اجازه استفاده از این دستور را در این کانال ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else if (message.channel.id === channels.customroles) {
      let row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel("NSFW")
            .setEmoji(emoji.nsfwrole)
            .setCustomId("nsfwselect")
            .setStyle("SECONDARY"),
        );
      message.channel.send({
        embeds: [new MessageEmbed().setColor(config.embedcolor).setThumbnail(config.thumbnailurl).setTitle(`NSFW`).setDescription(`**با دریافت این نقش بخش پورن سرور باز می شود.**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <@&${roles.nsfw}>`)], components: [row]
      })
    }
  }
  else if (command === "booksetup") {
    let permissions =
      message.member.permissions.has(`ADMINISTRATOR`)
    if (!permissions) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else if (message.channel.id !== channels.customroles) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما اجازه استفاده از این دستور را در این کانال ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else if (message.channel.id === channels.customroles) {
      let row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel("Book Reader")
            .setEmoji(emoji.bookrole)
            .setCustomId("bookselect")
            .setStyle("SECONDARY"),
        );
      message.channel.send({
        embeds: [new MessageEmbed().setColor(config.embedcolor).setThumbnail(config.thumbnailurl).setTitle(`Book Reading`).setDescription(`**این نقش هنگام کتابخوانی منشن می شود.**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <@&${roles.bookreading}>`)], components: [row]
      })
    }
  }
  else if (command === 'setupticket') {
    let permissions =
      message.member.roles.cache.has(roles.developer);
    if (permissions) {
      let ticketembed = new MessageEmbed()
        .setColor(`#22E08A`)
        .setThumbnail(config.thumbnailurl)
        .setTitle(`Hamilton Ticket`)
        .setDescription(`**برای ارتباط با پشتیبانی تیکت باز کنید.**`)
        .addField(`\u200B`, `>>> <:Button:948183385304621107> شما حداکثر یک تیکت می توانید بسازید\n<:Button:948183385304621107> در صورت سوء استفاده دسترسی شما گرفته می شود\n<:Button:948183385304621107> تیکت ها برای رسیدگی به مشکلات هستند بی دلیل تیکت ایجاد نکنید`);
      let ticketembedlist = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId(`supportselect`)
            .setEmoji(`📩`)
            .setLabel(`Create Ticket`)
            .setStyle(`SECONDARY`),
        );
      message.channel.send({
        embeds: [ticketembed], components: [ticketembedlist]
      })
    }
  }
  else if (command === 'setupbanticket') {
    let permissions =
      message.member.roles.cache.has(roles.developer);
    if (permissions) {
      let ticketembed = new MessageEmbed()
        .setColor(`#22E08A`)
        .setThumbnail(config.thumbnailurl)
        .setTitle(`Hamilton Ticket`)
        .setDescription(`**برای ارتباط با پشتیبانی تیکت باز کنید.**`)
        .addField(`\u200B`, `>>> <:Button:948183385304621107> شما حداکثر یک تیکت می توانید بسازید\n<:Button:948183385304621107> در صورت سوء استفاده دسترسی شما گرفته می شود\n<:Button:948183385304621107> تیکت ها برای رسیدگی به مشکلات هستند بی دلیل تیکت ایجاد نکنید`);
      let ticketembedlist = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId(`bansupportselect`)
            .setEmoji(`📩`)
            .setLabel(`Create Ticket`)
            .setStyle(`SECONDARY`),
        );
      message.channel.send({
        embeds: [ticketembed], components: [ticketembedlist]
      })
    }
  }
  else if (command === "eoasetup") {
    let permissions =
      message.member.permissions.has(`ADMINISTRATOR`)
    if (!permissions) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else if (message.channel.id !== channels.easeofaccess) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما اجازه استفاده از این دستور را در این کانال ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })]
      })
    }
    else if (message.channel.id === channels.easeofaccess) {
      message.channel.send({
        embeds: [new MessageEmbed().setColor(config.embedcolor).setThumbnail(config.thumbnailurl).setTitle(`Ease of Access`).setDescription(`**با سلام به کانال دسترسی سریع خوش آمدید.\nکانال های پرکاربرد سرور برای دسترسی سریعتر شما در اینجا قرار  داده شده است.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <#947070205966835783> <:RightArrow:948183388580368425> [Click here](https://discord.com/channels/724786666291593277/947070205966835783)\n<:DownRightArrow:948183385745023026> <#947070208898629642> <:RightArrow:948183388580368425> [Click here](https://discord.com/channels/724786666291593277/947070208898629642)`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <#874431670600757258> <:RightArrow:948183388580368425> [Click here](https://discord.com/channels/724786666291593277/874431670600757258)\n<:DownRightArrow:948183385745023026> <#912777386288877588> <:RightArrow:948183388580368425> [Click here](https://discord.com/channels/724786666291593277/912777386288877588)\n<:DownRightArrow:948183385745023026> <#891755369762811914> <:RightArrow:948183388580368425> [Click here](https://discord.com/channels/724786666291593277/891755369762811914)\n<:DownRightArrow:948183385745023026> <#947070236597833788> <:RightArrow:948183388580368425> [Click here](https://discord.com/channels/724786666291593277/947070236597833788)\n<:DownRightArrow:948183385745023026> <#912775884929368118> <:RightArrow:948183388580368425> [Click here](https://discord.com/channels/724786666291593277/912775884929368118)`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <#875054785269735566> <:RightArrow:948183388580368425> [Click here](https://discord.com/channels/724786666291593277/875054785269735566)`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <#760250070846406676> <:RightArrow:948183388580368425> [Click here](https://discord.com/channels/724786666291593277/760250070846406676)\n<:DownRightArrow:948183385745023026> <#947070250296410152> <:RightArrow:948183388580368425> [Click here](https://discord.com/channels/724786666291593277/947070250296410152)\n<:DownRightArrow:948183385745023026> <#760251551510953985> <:RightArrow:948183388580368425> [Click here](https://discord.com/channels/724786666291593277/760251551510953985)`)]
      })
    }
  }
  else if (command === "lock") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let mutedchannellog = client.channels.cache.get(channels.modlog);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      message.channel.permissionOverwrites.create(roles.member, { 'SEND_MESSAGES': false, 'ADD_REACTIONS': false }).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کانال با موفقیت بسته شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کانال <#${message.channel.id}> با موفقیت بسته شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> <@${message.author.id}>\n<:DownRightArrow:948183385745023026> Channel <:RightArrow:948183388580368425> <#${message.channel.id}>\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "unlock") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let mutedchannellog = client.channels.cache.get(channels.modlog);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      message.channel.permissionOverwrites.delete(roles.member).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کانال با موفقیت باز شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کانال <#${message.channel.id}> با موفقیت باز شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> <@${message.author.id}>\n<:DownRightArrow:948183385745023026> Channel <:RightArrow:948183388580368425> <#${message.channel.id}>\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "slowmode") {
    let time = args[0]
    let amount = parseInt(args);
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let mutedchannellog = client.channels.cache.get(channels.modlog);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      if (args[0] === amount + "s") {
        message.channel.setRateLimitPerUser(amount).then(
          message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `محدودیت ${amount} ثانیه ای روی کانال فعال شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کانال <#${message.channel.id}> با موفقیت محدود شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Channel <:RightArrow:948183388580368425> <#${message.channel.id}>\n<:DownRightArrow:948183385745023026> Amount <:RightArrow:948183388580368425> [${amount}] Seconds\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
      }
      else if (args[0] === amount + "m") {
        message.channel.setRateLimitPerUser(amount * 60).then(
          message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `محدودیت ${amount} دقیقه ای روی کانال فعال شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کانال <#${message.channel.id}> با موفقیت محدود شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Channel <:RightArrow:948183388580368425> <#${message.channel.id}>\n<:DownRightArrow:948183385745023026> Amount <:RightArrow:948183388580368425> [${amount}] Minutes\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
      }
      else if (args[0] === amount + "h") {
        if (amount > "6") return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `بیشتر از 6 ساعت نمی توانید کانال را محدود کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
        else {
          message.channel.setRateLimitPerUser(amount * 60 * 60).then(message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `محدودیت ${amount} ساعتی روی کانال فعال شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کانال <#${message.channel.id}> با موفقیت محدود شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Channel <:RightArrow:948183388580368425> <#${message.channel.id}>\n<:DownRightArrow:948183385745023026> Amount <:RightArrow:948183388580368425> [${amount}] Hours\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
        }
      }
    }
  }
  else if (command === "hide") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let mutedchannellog = client.channels.cache.get(channels.modlog);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      message.channel.permissionOverwrites.create(roles.member, { 'VIEW_CHANNEL': false }).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کانال با موفقیت مخفی شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کانال <#${message.channel.id}> با موفقیت مخفی شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> <@${message.author.id}>\n<:DownRightArrow:948183385745023026> Channel <:RightArrow:948183388580368425> <#${message.channel.id}>\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "unhide") {
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let mutedchannellog = client.channels.cache.get(channels.modlog);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      message.channel.permissionOverwrites.delete(roles.member).then(
        message.channel.send({ content: `${message.author}`, embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `کانال با موفقیت از حالت مخفی در آمد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**کانال <#${message.channel.id}> با موفقیت از حالت مخفی در آمد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> <@${message.author.id}>\n<:DownRightArrow:948183385745023026> Channel <:RightArrow:948183388580368425> <#${message.channel.id}>\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (command === "clear") {
    let amount = parseInt(args);
    let permissions =
      message.member.roles.cache.has(roles.owner) ||
      message.member.roles.cache.has(roles.coowner) ||
      message.member.roles.cache.has(roles.topadmin1) ||
      message.member.roles.cache.has(roles.topadmin2) ||
      message.member.roles.cache.has(roles.topadmin3);
    let mutedchannellog = client.channels.cache.get(channels.modlog);
    if (!permissions) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else if (!amount) return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `لطفا عددی بین 1 تا 99 انتخاب کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    else if (amount > 99) {
      return message.channel.send({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `لطفا عددی بین 1 تا 99 انتخاب کنید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })] })
    }
    else {
      message.channel.bulkDelete(amount + 1).catch((err) => {
        return console.log(`[x] Discord API Error`)
      }).then(
        setTimeout(function () {
          message.channel.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `${amount} پیام پاک شد.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018235069943888/CheckMark.png` })] })
        }, 2000)).then(
          mutedchannellog.send({ embeds: [new MessageEmbed().setColor(`GREEN`).setTitle(`Hamilton Moderation`).setDescription(`**پیام های کانال <#${message.channel.id}> با موفقیت پاک شد.**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Admin <:RightArrow:948183388580368425> <@${message.author.id}>\n<:DownRightArrow:948183385745023026> Channel <:RightArrow:948183388580368425> <#${message.channel.id}>\n<:DownRightArrow:948183385745023026> Amount <:RightArrow:948183388580368425> [${amount}]\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setTimestamp()] }))
    }
  }
  else if (message.channel.id === channels.suggestion) {
    if (!message.member.roles.cache.has(roles.bot)) {
      if (!message.member.roles.cache.has(roles.hobbybot)) {
        message.react(`👍`).then(message.react(`👎`))
      }
    }
  }
  else if (message.channel.id === channels.bugreport) {
    if (!message.member.roles.cache.has(roles.bot)) {
      if (!message.member.roles.cache.has(roles.hobbybot)) {
        let recivedchannel = message.guild.channels.cache.get(channels.recivedbug)
        message.react(`✅`).then(recivedchannel.send({
          content: `<@&${roles.developer}>`,
          embeds: [new MessageEmbed()
            .setTitle(`Hamilton Moderation`).setColor(config.embedcolor).setDescription(`**باگ توسط ${message.author} دریافت شد.**`)
            .addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Reporter <:RightArrow:948183388580368425> ${message.author}\n<:DownRightArrow:948183385745023026> Bug Content <:RightArrow:948183388580368425> ${message.content}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`).setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` }).setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)]

        }).then((bug) => {
          bug.react(`👍`)
          bug.react(`👎`)
          setTimeout(function () {
            message.delete().catch(err => console.log(`[x] Error`))
          }, 5000)
        }))
      }
    }
  }
  else if (message.channel.id === channels.reportads) {
    message.react(`✅`)
  }
});
client.on('interactionCreate', async interaction => {
  const joindate = moment().format("MM/DD/YYYY HH:mm")
  if (interaction.commandName === 'menugender') {
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('roles')
          .setPlaceholder(config.menutextgender)
          .addOptions([
            {
              label: 'Male',
              value: 'maleselect',
              emoji: emoji.maleemoji
            },
            {
              label: 'Female',
              value: 'femaleselect',
              emoji: emoji.femaleemoji
            },
            {
              label: 'Transgender',
              value: 'transgenderselect',
              emoji: emoji.transgenderemoji
            },
          ]),
      );
    const rolesm = new MessageEmbed()
      .setColor(config.embedcolor)
      .setTitle(`Gender`)
      .setDescription(`**از منوی زیر جنسیت خود را انتخاب کنید.**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯`)
      .addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <@&${roles.male}>\n<:DownRightArrow:948183385745023026> <@&${roles.female}>\n<:DownRightArrow:948183385745023026> <@&${roles.transgender}>`)
      .setThumbnail(config.thumbnailurl);
    await interaction.channel.send({ embeds: [rolesm], ephemeral: false, components: [row] })
  }
  const gremoveroleembed = new MessageEmbed()
    .setColor(`RED`)
    .setAuthor({ name: `جنسیت شما حذف شد.`, iconURL: config.crossmarkurl });
  const gaddroleembed = new MessageEmbed()
    .setColor(`GREEN`)
    .setAuthor({ name: `جنسیت شما اضافه شد.`, iconURL: config.checkmarkurl });
  if (interaction.isSelectMenu()) {
    let choice = interaction.values[0]
    const member = interaction.member
    if (choice == 'maleselect') {
      if (member.roles.cache.some(role => role.id == roles.male)) {
        interaction.reply({ embeds: [gremoveroleembed], ephemeral: true })
        member.roles.remove(roles.male)
        member.roles.remove(roles.displaygender)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.male))
          member.roles.add(roles.male)
        if (!member.roles.cache.some(role => role.id == roles.displaygender))
          member.roles.add(roles.displaygender)
        if (member.roles.cache.some(role => role.id == roles.female))
          member.roles.remove(roles.female)
        if (member.roles.cache.some(role => role.id == roles.transgender))
          member.roles.remove(roles.transgender)
        await interaction.reply({ embeds: [gaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'femaleselect') {
      if (member.roles.cache.some(role => role.id == roles.female)) {
        interaction.reply({ embeds: [gremoveroleembed], ephemeral: true })
        member.roles.remove(roles.female)
        member.roles.remove(roles.displaygender)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.female))
          member.roles.add(roles.female)
        if (!member.roles.cache.some(role => role.id == roles.displaygender))
          member.roles.add(roles.displaygender)
        if (member.roles.cache.some(role => role.id == roles.male))
          member.roles.remove(roles.male)
        if (member.roles.cache.some(role => role.id == roles.transgender))
          member.roles.remove(roles.transgender)
        await interaction.reply({ embeds: [gaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'transgenderselect') {
      if (member.roles.cache.some(role => role.id == roles.transgender)) {
        interaction.reply({ embeds: [gremoveroleembed], ephemeral: true })
        member.roles.remove(roles.transgender)
        member.roles.remove(roles.displaygender)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.transgender))
          member.roles.add(roles.transgender)
        if (!member.roles.cache.some(role => role.id == roles.displaygender))
          member.roles.add(roles.displaygender)
        if (member.roles.cache.some(role => role.id == roles.male))
          member.roles.remove(roles.male)
        if (member.roles.cache.some(role => role.id == roles.female))
          member.roles.remove(roles.female)
        await interaction.reply({ embeds: [gaddroleembed], ephemeral: true })
      }
    }
  }
  else if (interaction.commandName === 'menucolor') {
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId("Setup Select Menu")
          .setPlaceholder(config.menutextcolor)
          .addOptions([
            {
              label: 'Valentine Red',
              description: 'Hex: #C80815',
              value: 'color1select',
              emoji: emoji.color1emoji
            },
            {
              label: 'Rose Wood',
              description: 'Hex: #65000B',
              value: 'color2select',
              emoji: emoji.color2emoji
            },
            {
              label: 'Pumpkin',
              description: 'Hex: #FF7518',
              value: 'color3select',
              emoji: emoji.color3emoji
            },
            {
              label: 'Dark Golden Rod',
              description: 'Hex: #B8860B',
              value: 'color4select',
              emoji: emoji.color4emoji
            },
            {
              label: 'Banana Yellow',
              description: 'Hex: #FFE135',
              value: 'color5select',
              emoji: emoji.color5emoji
            },
            {
              label: 'Moss Green',
              description: 'Hex: #8A9A5B',
              value: 'color6select',
              emoji: emoji.color6emoji
            },
            {
              label: 'UFO Green',
              description: 'Hex: #3CD070',
              value: 'color7select',
              emoji: emoji.color7emoji
            },
            {
              label: 'Jungle Green',
              description: 'Hex: #29AB87',
              value: 'color8select',
              emoji: emoji.color8emoji
            },
            {
              label: 'Columbia Blue',
              description: 'Hex: #9BDDFF',
              value: 'color9select',
              emoji: emoji.color9emoji
            },
            {
              label: 'Imperial Blue',
              description: 'Hex: #002395',
              value: 'color10select',
              emoji: emoji.color10emoji
            },
            {
              label: 'Persian Rose',
              description: 'Hex: #FE28A2',
              value: 'color11select',
              emoji: emoji.color11emoji
            },
            {
              label: 'Veronica',
              description: 'Hex: #A020F0',
              value: 'color12select',
              emoji: emoji.color12emoji
            },
            {
              label: 'Ghost White',
              description: 'Hex: #F8F8FF',
              value: 'color13select',
              emoji: emoji.color13emoji
            },
            {
              label: 'Spanish Gray',
              description: 'Hex: #989898',
              value: 'color14select',
              emoji: emoji.color14emoji
            },
            {
              label: 'Vampire Black',
              description: 'Hex: #080808',
              value: 'color15select',
              emoji: emoji.color15emoji
            },
          ]),
      );
    const selectmenuembed = new MessageEmbed()
      .setTitle(`Color Bundle`)
      .setDescription(`**از منوی زیر رنگ خود را انتخاب کنید.**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯`)
      .addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <@&${roles.color1}>\n<:DownRightArrow:948183385745023026> <@&${roles.color2}>\n<:DownRightArrow:948183385745023026> <@&${roles.color3}>\n<:DownRightArrow:948183385745023026> <@&${roles.color4}>\n<:DownRightArrow:948183385745023026> <@&${roles.color5}>\n<:DownRightArrow:948183385745023026> <@&${roles.color6}>\n<:DownRightArrow:948183385745023026> <@&${roles.color7}>\n<:DownRightArrow:948183385745023026> <@&${roles.color8}>\n<:DownRightArrow:948183385745023026> <@&${roles.color9}>\n<:DownRightArrow:948183385745023026> <@&${roles.color10}>\n<:DownRightArrow:948183385745023026> <@&${roles.color11}>\n<:DownRightArrow:948183385745023026> <@&${roles.color12}>\n<:DownRightArrow:948183385745023026> <@&${roles.color13}>\n<:DownRightArrow:948183385745023026> <@&${roles.color14}>\n<:DownRightArrow:948183385745023026> <@&${roles.color15}>`)
      .setThumbnail(config.thumbnailurl)
      .setColor(config.embedcolor);
    await interaction.channel.send({ embeds: [selectmenuembed], ephemeral: false, components: [row] })
  }
  const removeroleembed = new MessageEmbed()
    .setColor(`RED`)
    .setAuthor({ name: `رنگ شما حذف شد.`, iconURL: config.crossmarkurl });
  const addroleembed = new MessageEmbed()
    .setColor(`GREEN`)
    .setAuthor({ name: `رنگ شما اضافه شد.`, iconURL: config.checkmarkurl });
  const noneroleembed = new MessageEmbed()
    .setColor(`RED`)
    .setAuthor({ name: `رنگ شما حذف شد.`, iconURL: config.checkmarkurl });
  const noneroleembederror = new MessageEmbed()
    .setColor(`RED`)
    .setAuthor({ name: `شما رنگی ندارید.`, iconURL: config.crossmarkurl });
  if (interaction.isSelectMenu()) {
    let choice = interaction.values[0]
    const member = interaction.member
    if (choice == 'color1select') {
      if (member.roles.cache.some(role => role.id == roles.color1)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color1)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color1))
          member.roles.add(roles.color1)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color2select') {
      if (member.roles.cache.some(role => role.id == roles.color2)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color2)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color2))
          member.roles.add(roles.color2)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color3select') {
      if (member.roles.cache.some(role => role.id == roles.color3)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color3)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color3))
          member.roles.add(roles.color3)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color4select') {
      if (member.roles.cache.some(role => role.id == roles.color4)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color4)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color4))
          member.roles.add(roles.color4)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color5select') {
      if (member.roles.cache.some(role => role.id == roles.color5)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color5)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color5))
          member.roles.add(roles.color5)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color6select') {
      if (member.roles.cache.some(role => role.id == roles.color6)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color6)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color6))
          member.roles.add(roles.color6)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color7select') {
      if (member.roles.cache.some(role => role.id == roles.color7)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color7)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color7))
          member.roles.add(roles.color7)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color8select') {
      if (member.roles.cache.some(role => role.id == roles.color8)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color8)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color8))
          member.roles.add(roles.color8)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color9select') {
      if (member.roles.cache.some(role => role.id == roles.color9)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color9)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color9))
          member.roles.add(roles.color9)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color10select') {
      if (member.roles.cache.some(role => role.id == roles.color10)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color10)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color10))
          member.roles.add(roles.color10)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color11select') {
      if (member.roles.cache.some(role => role.id == roles.color11)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color11)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color11))
          member.roles.add(roles.color11)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color12select') {
      if (member.roles.cache.some(role => role.id == roles.color12)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color12)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color12))
          member.roles.add(roles.color12)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color13select') {
      if (member.roles.cache.some(role => role.id == roles.color13)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color13)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color13))
          member.roles.add(roles.color13)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color15))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color14select') {
      if (member.roles.cache.some(role => role.id == roles.color14)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color14)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color14))
          member.roles.add(roles.color14)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color10)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color15)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
    else if (choice == 'color15select') {
      if (member.roles.cache.some(role => role.id == roles.color15)) {
        interaction.reply({ embeds: [removeroleembed], ephemeral: true })
        member.roles.remove(roles.color15)
        member.roles.remove(roles.displaycolor)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.color15))
          member.roles.add(roles.color15)
        if (!member.roles.cache.some(role => role.id == roles.displaycolor))
          member.roles.add(roles.displaycolor)
        if (member.roles.cache.some(role => role.id == roles.color1))
          member.roles.remove(roles.color1)
        if (member.roles.cache.some(role => role.id == roles.color2))
          member.roles.remove(roles.color2)
        if (member.roles.cache.some(role => role.id == roles.color3))
          member.roles.remove(roles.color3)
        if (member.roles.cache.some(role => role.id == roles.color4))
          member.roles.remove(roles.color4)
        if (member.roles.cache.some(role => role.id == roles.color5))
          member.roles.remove(roles.color5)
        if (member.roles.cache.some(role => role.id == roles.color6))
          member.roles.remove(roles.color6)
        if (member.roles.cache.some(role => role.id == roles.color7))
          member.roles.remove(roles.color7)
        if (member.roles.cache.some(role => role.id == roles.color8))
          member.roles.remove(roles.color8)
        if (member.roles.cache.some(role => role.id == roles.color9))
          member.roles.remove(roles.color9)
        if (member.roles.cache.some(role => role.id == roles.colorrgb))
          member.roles.remove(roles.colorrgb)
        if (member.roles.cache.some(role => role.id == roles.color11))
          member.roles.remove(roles.color11)
        if (member.roles.cache.some(role => role.id == roles.color12))
          member.roles.remove(roles.color12)
        if (member.roles.cache.some(role => role.id == roles.color13))
          member.roles.remove(roles.color13)
        if (member.roles.cache.some(role => role.id == roles.color14))
          member.roles.remove(roles.color14)
        if (member.roles.cache.some(role => role.id == roles.color10))
          member.roles.remove(roles.color10)
        await interaction.reply({ embeds: [addroleembed], ephemeral: true })
      }
    }
  }
  else if (interaction.commandName === 'menudevice') {
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('roles')
          .setPlaceholder(config.menutextdevice)
          .addOptions([
            {
              label: 'Xbox',
              value: 'xboxselect',
              emoji: emoji.xboxemoji
            },
            {
              label: 'Play Station',
              value: 'playstationselect',
              emoji: emoji.playstationemoji
            },
            {
              label: 'PC / Laptop',
              value: 'pcselect',
              emoji: emoji.pcemoji
            },
            {
              label: 'Mobile / Tablet',
              value: 'mobileselect',
              emoji: emoji.mobileemoji
            },
            {
              label: 'Nintendo Switch',
              value: 'nintendoselect',
              emoji: emoji.nintendoswithemoji
            },
          ]),
      );
    const rolesm = new MessageEmbed()
      .setColor(config.embedcolor)
      .setTitle(`Device`)
      .setDescription(`**از منوی زیر دستگاه خود را انتخاب کنید.**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯`)
      .addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <@&${roles.xbox}>\n<:DownRightArrow:948183385745023026> <@&${roles.playstation}>\n<:DownRightArrow:948183385745023026> <@&${roles.pc}>\n<:DownRightArrow:948183385745023026> <@&${roles.mobile}>\n<:DownRightArrow:948183385745023026> <@&${roles.nintendoswitch}>`)
      .setThumbnail(config.thumbnailurl);
    await interaction.channel.send({ embeds: [rolesm], ephemeral: false, components: [row] })
  }
  const premoveroleembed = new MessageEmbed()
    .setColor(`RED`)
    .setAuthor({ name: `دستگاه شما حذف شد.`, iconURL: config.crossmarkurl });
  const paddroleembed = new MessageEmbed()
    .setColor(`GREEN`)
    .setAuthor({ name: `دستگاه شما اضافه شد.`, iconURL: config.checkmarkurl });
  if (interaction.isSelectMenu()) {
    let choice = interaction.values[0]
    const member = interaction.member
    if (choice == 'xboxselect') {
      if (member.roles.cache.some(role => role.id == roles.xbox)) {
        interaction.reply({ embeds: [premoveroleembed], ephemeral: true })
        member.roles.remove(roles.xbox)
        member.roles.remove(roles.displaydevice)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.xbox))
          member.roles.add(roles.xbox)
        if (!member.roles.cache.some(role => role.id == roles.displaydevice))
          member.roles.add(roles.displaydevice)
        if (member.roles.cache.some(role => role.id == roles.playstation))
          member.roles.remove(roles.playstation)
        if (member.roles.cache.some(role => role.id == roles.pc))
          member.roles.remove(roles.pc)
        if (member.roles.cache.some(role => role.id == roles.mobile))
          member.roles.remove(roles.mobile)
        if (member.roles.cache.some(role => role.id == roles.nintendoswitch))
          member.roles.remove(roles.nintendoswitch)
        await interaction.reply({ embeds: [paddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'playstationselect') {
      if (member.roles.cache.some(role => role.id == roles.playstation)) {
        interaction.reply({ embeds: [premoveroleembed], ephemeral: true })
        member.roles.remove(roles.playstation)
        member.roles.remove(roles.displaydevice)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.playstation))
          member.roles.add(roles.playstation)
        if (!member.roles.cache.some(role => role.id == roles.displaydevice))
          member.roles.add(roles.displaydevice)
        if (member.roles.cache.some(role => role.id == roles.xbox))
          member.roles.remove(roles.xbox)
        if (member.roles.cache.some(role => role.id == config.pc))
          member.roles.remove(roles.pc)
        if (member.roles.cache.some(role => role.id == roles.mobile))
          member.roles.remove(roles.mobile)
        if (member.roles.cache.some(role => role.id == roles.nintendoswitch))
          member.roles.remove(roles.nintendoswitch)
        await interaction.reply({ embeds: [paddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'pcselect') {
      if (member.roles.cache.some(role => role.id == roles.pc)) {
        interaction.reply({ embeds: [premoveroleembed], ephemeral: true })
        member.roles.remove(roles.pc)
        member.roles.remove(roles.displaydevice)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.pc))
          member.roles.add(roles.pc)
        if (!member.roles.cache.some(role => role.id == roles.displaydevice))
          member.roles.add(roles.displaydevice)
        if (member.roles.cache.some(role => role.id == roles.xbox))
          member.roles.remove(roles.xbox)
        if (member.roles.cache.some(role => role.id == roles.playstation))
          member.roles.remove(roles.playstation)
        if (member.roles.cache.some(role => role.id == roles.mobile))
          member.roles.remove(roles.mobile)
        if (member.roles.cache.some(role => role.id == roles.nintendoswitch))
          member.roles.remove(roles.nintendoswitch)
        await interaction.reply({ embeds: [paddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'mobileselect') {
      if (member.roles.cache.some(role => role.id == roles.mobile)) {
        interaction.reply({ embeds: [premoveroleembed], ephemeral: true })
        member.roles.remove(roles.mobile)
        member.roles.remove(roles.displaydevice)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.mobile))
          member.roles.add(roles.mobile)
        if (!member.roles.cache.some(role => role.id == roles.displaydevice))
          member.roles.add(roles.displaydevice)
        if (member.roles.cache.some(role => role.id == roles.xbox))
          member.roles.remove(roles.xbox)
        if (member.roles.cache.some(role => role.id == roles.playstation))
          member.roles.remove(roles.playstation)
        if (member.roles.cache.some(role => role.id == roles.pc))
          member.roles.remove(roles.pc)
        if (member.roles.cache.some(role => role.id == roles.nintendoswitch))
          member.roles.remove(roles.nintendoswitch)
        await interaction.reply({ embeds: [paddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'nintendoselect') {
      if (member.roles.cache.some(role => role.id == roles.nintendoswitch)) {
        interaction.reply({ embeds: [premoveroleembed], ephemeral: true })
        member.roles.remove(roles.nintendoswitch)
        member.roles.remove(roles.displaydevice)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.nintendoswitch))
          member.roles.add(roles.nintendoswitch)
        if (!member.roles.cache.some(role => role.id == roles.displaydevice))
          member.roles.add(roles.displaydevice)
        if (member.roles.cache.some(role => role.id == roles.xbox))
          member.roles.remove(roles.xbox)
        if (member.roles.cache.some(role => role.id == roles.playstation))
          member.roles.remove(roles.playstation)
        if (member.roles.cache.some(role => role.id == roles.pc))
          member.roles.remove(roles.pc)
        if (member.roles.cache.some(role => role.id == roles.mobile))
          member.roles.remove(roles.mobile)
        await interaction.reply({ embeds: [paddroleembed], ephemeral: true })
      }
    }
  }
  else if (interaction.commandName === 'menuuser') {
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('roles')
          .setPlaceholder(config.menutextuser)
          .addOptions([
            {
              label: 'Discord User',
              value: 'discorduserselect',
              emoji: emoji.discorduseremoji
            },
            {
              label: 'Discord Developer',
              value: 'discoddeveloperselect',
              emoji: emoji.discorddeveloperemoji
            },
            {
              label: 'Discord Configure',
              value: 'discodconfigureselect',
              emoji: emoji.discordconfigureemoji
            },
          ]),
      );
    const rolesm = new MessageEmbed()
      .setColor(config.embedcolor)
      .setTitle(`Your Situation`)
      .setDescription(`**از منوی زیر وضعیت خود را مشخص کنید.**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯`)
      .addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <@&${roles.discorduser}>\n<:DownRightArrow:948183385745023026> <@&${roles.discorddeveloper}>\n<:DownRightArrow:948183385745023026> <@&${roles.discordconfigure}>`)
      .setThumbnail(config.thumbnailurl);
    await interaction.channel.send({ embeds: [rolesm], ephemeral: false, components: [row] })
  }
  const pgremoveroleembed = new MessageEmbed()
    .setColor(`RED`)
    .setAuthor({ name: `نقش شما حذف شد.`, iconURL: config.crossmarkurl });
  const pgaddroleembed = new MessageEmbed()
    .setColor(`GREEN`)
    .setAuthor({ name: `نقش شما اضافه شد.`, iconURL: config.checkmarkurl });
  if (interaction.isSelectMenu()) {
    let choice = interaction.values[0]
    const member = interaction.member
    if (choice == 'discorduserselect') {
      if (member.roles.cache.some(role => role.id == roles.discorduser)) {
        interaction.reply({ embeds: [pgremoveroleembed], ephemeral: true })
        member.roles.remove(roles.discorduser)
        member.roles.remove(roles.discorduserdisplay)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.discorduser))
          member.roles.add(roles.discorduser)
        if (!member.roles.cache.some(role => role.id == roles.discorduserdisplay))
          member.roles.add(roles.discorduserdisplay)
        if (member.roles.cache.some(role => role.id == roles.discorddeveloper))
          member.roles.remove(roles.discorddeveloper)
        if (member.roles.cache.some(role => role.id == roles.discordconfigure))
          member.roles.remove(roles.discordconfigure)
        await interaction.reply({ embeds: [pgaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'discoddeveloperselect') {
      if (member.roles.cache.some(role => role.id == roles.discorddeveloper)) {
        interaction.reply({ embeds: [pgremoveroleembed], ephemeral: true })
        member.roles.remove(roles.discorddeveloper)
        member.roles.remove(roles.discorduserdisplay)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.discorddeveloper))
          member.roles.add(roles.discorddeveloper)
        if (!member.roles.cache.some(role => role.id == roles.discorduserdisplay))
          member.roles.add(roles.discorduserdisplay)
        if (member.roles.cache.some(role => role.id == roles.discorduser))
          member.roles.remove(roles.discorduser)
        if (member.roles.cache.some(role => role.id == roles.discordconfigure))
          member.roles.remove(roles.discordconfigure)
        await interaction.reply({ embeds: [pgaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'discodconfigureselect') {
      if (member.roles.cache.some(role => role.id == roles.discordconfigure)) {
        interaction.reply({ embeds: [pgremoveroleembed], ephemeral: true })
        member.roles.remove(roles.discordconfigure)
        member.roles.remove(roles.discorduserdisplay)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.discordconfigure))
          member.roles.add(roles.discordconfigure)
        if (!member.roles.cache.some(role => role.id == roles.discorduserdisplay))
          member.roles.add(roles.discorduserdisplay)
        if (member.roles.cache.some(role => role.id == roles.discorduser))
          member.roles.remove(roles.discorduser)
        if (member.roles.cache.some(role => role.id == roles.discorddeveloper))
          member.roles.remove(roles.discorddeveloper)
        await interaction.reply({ embeds: [pgaddroleembed], ephemeral: true })
      }
    }
  }
  else if (interaction.commandName === 'menugame') {
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId("Setup Select Menu")
          .setPlaceholder(config.menutextgame)
          .addOptions([
            {
              label: 'Plato',
              value: 'game1select',
              emoji: emoji.game1emoji
            },
            {
              label: 'COD Mobile',
              value: 'game2select',
              emoji: emoji.game2emoji
            },
            {
              label: 'PUBG Mobile',
              value: 'game3select',
              emoji: emoji.game3emoji
            },
            {
              label: 'CSGO',
              value: 'game4select',
              emoji: emoji.game4emoji
            },
            {
              label: 'Valorant',
              value: 'game5select',
              emoji: emoji.game5emoji
            },
            {
              label: 'Rainbow Six Siege',
              value: 'game6select',
              emoji: emoji.game6emoji
            },
            {
              label: 'FIFA',
              value: 'game7select',
              emoji: emoji.game7emoji
            },
            {
              label: 'eFootball',
              value: 'game8select',
              emoji: emoji.game8emoji
            },
            {
              label: 'Euro Truck',
              value: 'game9select',
              emoji: emoji.game9emoji
            },
            {
              label: 'Resident Evil',
              value: 'game10select',
              emoji: emoji.game10emoji
            },
            {
              label: 'Phasmaphobia',
              value: 'game11select',
              emoji: emoji.game11emoji
            },
            {
              label: 'Secret Neighbor',
              value: 'game12select',
              emoji: emoji.game12emoji
            },
            {
              label: 'Fortnite',
              value: 'game13select',
              emoji: emoji.game13emoji
            },
            {
              label: 'Apex Legends',
              value: 'game14select',
              emoji: emoji.game14emoji
            },
            {
              label: 'COD Warzone',
              value: 'game15select',
              emoji: emoji.game15emoji
            },
          ]),
      );
    const selectmenuembed = new MessageEmbed()
      .setTitle(`Game Pack`)
      .setDescription(`**از منوی زیر بازی خود را انتخاب کنید.**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯`)
      .addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <@&${roles.game1}>\n<:DownRightArrow:948183385745023026> <@&${roles.game2}>\n<:DownRightArrow:948183385745023026> <@&${roles.game3}>\n<:DownRightArrow:948183385745023026> <@&${roles.game4}>\n<:DownRightArrow:948183385745023026> <@&${roles.game5}>\n<:DownRightArrow:948183385745023026> <@&${roles.game6}>\n<:DownRightArrow:948183385745023026> <@&${roles.game7}>\n<:DownRightArrow:948183385745023026> <@&${roles.game8}>\n<:DownRightArrow:948183385745023026> <@&${roles.game9}>\n<:DownRightArrow:948183385745023026> <@&${roles.game10}>\n<:DownRightArrow:948183385745023026> <@&${roles.game11}>\n<:DownRightArrow:948183385745023026> <@&${roles.game12}>\n<:DownRightArrow:948183385745023026> <@&${roles.game13}>\n<:DownRightArrow:948183385745023026> <@&${roles.game14}>\n<:DownRightArrow:948183385745023026> <@&${roles.game15}>`)
      .setThumbnail(config.thumbnailurl)
      .setColor(config.embedcolor);
    await interaction.channel.send({ embeds: [selectmenuembed], ephemeral: false, components: [row] })
  }
  const ggremoveroleembed = new MessageEmbed()
    .setColor(`RED`)
    .setAuthor({ name: `بازی شما حذف شد.`, iconURL: config.crossmarkurl });
  const ggaddroleembed = new MessageEmbed()
    .setColor(`GREEN`)
    .setAuthor({ name: `بازی شما اضافه شد.`, iconURL: config.checkmarkurl });
  if (interaction.isSelectMenu()) {
    let choice = interaction.values[0]
    const member = interaction.member
    if (choice == 'game1select') {
      if (member.roles.cache.some(role => role.id == roles.game1)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game1)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game1))
          member.roles.add(roles.game1)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game2select') {
      if (member.roles.cache.some(role => role.id == roles.game2)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game2)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game2))
          member.roles.add(roles.game2)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game3select') {
      if (member.roles.cache.some(role => role.id == roles.game3)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game3)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game3))
          member.roles.add(roles.game3)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game4select') {
      if (member.roles.cache.some(role => role.id == roles.game4)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game4)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game4))
          member.roles.add(roles.game4)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game5select') {
      if (member.roles.cache.some(role => role.id == roles.game5)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game5)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game5))
          member.roles.add(roles.game5)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game6select') {
      if (member.roles.cache.some(role => role.id == roles.game6)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game6)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game6))
          member.roles.add(roles.game6)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game7select') {
      if (member.roles.cache.some(role => role.id == roles.game7)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game7)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game7))
          member.roles.add(roles.game7)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game8select') {
      if (member.roles.cache.some(role => role.id == roles.game8)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game8)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game8))
          member.roles.add(roles.game8)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game9select') {
      if (member.roles.cache.some(role => role.id == roles.game9)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game9)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game9))
          member.roles.add(roles.game9)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game10select') {
      if (member.roles.cache.some(role => role.id == roles.game10)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game10)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game10))
          member.roles.add(roles.game10)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game11select') {
      if (member.roles.cache.some(role => role.id == roles.game11)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game11)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game11))
          member.roles.add(roles.game11)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game12select') {
      if (member.roles.cache.some(role => role.id == roles.game12)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game12)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game12))
          member.roles.add(roles.game12)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game13select') {
      if (member.roles.cache.some(role => role.id == roles.game13)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game13)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game13))
          member.roles.add(roles.game13)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game14select') {
      if (member.roles.cache.some(role => role.id == roles.game14)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game14)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game14))
          member.roles.add(roles.game14)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'game15select') {
      if (member.roles.cache.some(role => role.id == roles.game15)) {
        interaction.reply({ embeds: [ggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.game15)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.game15))
          member.roles.add(roles.game15)
        if (!member.roles.cache.some(role => role.id == roles.displaygame))
          member.roles.add(roles.displaygame)
        await interaction.reply({ embeds: [ggaddroleembed], ephemeral: true })
      }
    }
  }
  else if (interaction.commandName === 'menuhidden') {
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId("Setup Select Menu")
          .setPlaceholder(config.menutexthidden)
          .addOptions([
            {
              label: 'Hidden Hobby',
              value: 'hidden1select',
              emoji: emoji.hidden1emoji
            },
            {
              label: 'Hidden Amusement',
              value: 'hidden2select',
              emoji: emoji.hidden2emoji
            },
            {
              label: 'Hidden General',
              value: 'hidden3select',
              emoji: emoji.hidden3emoji
            },
            {
              label: 'Hidden Music',
              value: 'hidden4select',
              emoji: emoji.hidden4emoji
            },
            {
              label: 'Hidden Private',
              value: 'hidden5select',
              emoji: emoji.hidden5emoji
            },
          ]),
      );
    const sselectmenuembed = new MessageEmbed()
      .setTitle(`Hide Section`)
      .setDescription(`**از منوی زیر بخش های بلا استفاده را مخفی کنید.**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯`)
      .addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> <@&${roles.hidden1}>\n<:DownRightArrow:948183385745023026> <@&${roles.hidden2}>\n<:DownRightArrow:948183385745023026> <@&${roles.hidden3}>\n<:DownRightArrow:948183385745023026> <@&${roles.hidden4}>\n<:DownRightArrow:948183385745023026> <@&${roles.hidden5}>`)
      .setThumbnail(config.thumbnailurl)
      .setColor(config.embedcolor);
    await interaction.channel.send({ embeds: [sselectmenuembed], ephemeral: false, components: [row] })
  }
  const gggremoveroleembed = new MessageEmbed()
    .setColor(`RED`)
    .setAuthor({ name: `بخش انتخاب شده از حالت مخفی در آمد.`, iconURL: config.crossmarkurl });
  const gggaddroleembed = new MessageEmbed()
    .setColor(`GREEN`)
    .setAuthor({ name: `بخش انتخاب شده به حالت مخفی در آمد.`, iconURL: config.checkmarkurl });
  if (interaction.isSelectMenu()) {
    let choice = interaction.values[0]
    const member = interaction.member
    if (choice == 'hidden1select') {
      if (member.roles.cache.some(role => role.id == roles.hidden1)) {
        interaction.reply({ embeds: [gggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.hidden1)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.hidden1))
          member.roles.add(roles.hidden1)
        if (!member.roles.cache.some(role => role.id == roles.displayhidden))
          member.roles.add(roles.displayhidden)
        await interaction.reply({ embeds: [gggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'hidden2select') {
      if (member.roles.cache.some(role => role.id == roles.hidden2)) {
        interaction.reply({ embeds: [gggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.hidden2)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.hidden2))
          member.roles.add(roles.hidden2)
        if (!member.roles.cache.some(role => role.id == roles.displayhidden))
          member.roles.add(roles.displayhidden)
        await interaction.reply({ embeds: [gggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'hidden3select') {
      if (member.roles.cache.some(role => role.id == roles.hidden3)) {
        interaction.reply({ embeds: [gggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.hidden3)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.hidden3))
          member.roles.add(roles.hidden3)
        if (!member.roles.cache.some(role => role.id == roles.displayhidden))
          member.roles.add(roles.displayhidden)
        await interaction.reply({ embeds: [gggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'hidden4select') {
      if (member.roles.cache.some(role => role.id == roles.hidden4)) {
        interaction.reply({ embeds: [gggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.hidden4)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.hidden4))
          member.roles.add(roles.hidden4)
        if (!member.roles.cache.some(role => role.id == roles.displayhidden))
          member.roles.add(roles.displayhidden)
        await interaction.reply({ embeds: [gggaddroleembed], ephemeral: true })
      }
    }
    else if (choice == 'hidden5select') {
      if (member.roles.cache.some(role => role.id == roles.hidden5)) {
        interaction.reply({ embeds: [gggremoveroleembed], ephemeral: true })
        member.roles.remove(roles.hidden5)
      }
      else {
        if (!member.roles.cache.some(role => role.id == roles.hidden5))
          member.roles.add(roles.hidden5)
        if (!member.roles.cache.some(role => role.id == roles.displayhidden))
          member.roles.add(roles.displayhidden)
        await interaction.reply({ embeds: [gggaddroleembed], ephemeral: true })
      }
    }
  }
  else if (interaction.commandName === 'menumembership') {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("verifyselect")
          .setLabel("Click To Verify")
          .setStyle("SUCCESS")
      );
    const membershipembed = new MessageEmbed()
      .setColor(config.embedcolor)
      .setTitle(`Hamilton Membership`)
      .setDescription(`**تمامی ممبر ها باید قوانین را رعایت نمایند.\nدرصورت هرگونه نقض قوانین ادمین ها میتوانند با فرد مربوطه برخورد کنند.\nقوانین برای تمامی اعضا یکسان بوده و هیچ تفاوتی بین دو شخص در نظر گرفته نخواهد شد.**`)
      .addField(`<:Scroll:948183389536653352> قوانین کلی ویس ها و چت ها`, `>>> <:Button:948183385304621107> هر گونه نژاد پرستی و توهین به نژاد افراد ممنوع ، درصورت مشاهده به ادمین ها گزارش دهید\n<:Button:948183385304621107> شما حق بی احترامی ، شوخی و فحاشی در چنل های جیریت و افرادی که نمیشناسید را ندارید\n<:Button:948183385304621107> ارسال لینک تبلیغاتی سرور های دیگر و تبلیغات در ویس ها غیر قابل قبول بوده و با فرد مذکور برخورد میشود\n<:Button:948183385304621107> افشا و پخش اطلاعات شخصی ممبر ها در چنل ها ممنوع میباشد ، درصورت مشاهده منجر به بن همیشگی فرد افشا کننده میشود\n<:Button:948183385304621107> شما موظفید رفتار مناسب با جو ویس را داشته باشید و هرگونه ایجاد اختشاش و ... ممنوع و موجب برخورد با شما خواهد شد`)
    interaction.channel.send({ embeds: [membershipembed], components: [row] })
  }
  if (interaction.isButton()) {
    if (interaction.customId == "verifyselect") {
      let channel1 = client.channels.cache.get(channels.mentionchannel1);
      let channel2 = client.channels.cache.get(channels.mentionchannel2);
      let verifyembed = new MessageEmbed()
        .setColor(config.embedcolor)
        .setAuthor({ name: `شما در سرور همیلتون عضو شدید.`, iconURL: config.checkmarkurl });
      let verifyerror = new MessageEmbed()
        .setColor(config.embedcolor)
        .setAuthor({ name: `شما قبلا عضو شده بودید.`, iconURL: config.crossmarkurl });
      if (!interaction.member.roles.cache.some(role => role.id == roles.guest)) return interaction.reply({ embeds: [verifyerror], ephemeral: true })
      else {
        interaction.reply({
          embeds: [verifyembed],
          ephemeral: true,
        }).then(setTimeout(function () {
          interaction.member.roles.add(roles.member)
          interaction.member.roles.remove(roles.guest)
        }, 3000)).then(setTimeout(function () {
          channel1.send(`<@${interaction.member.id}>`).then((ad) => {
            setTimeout(function () {
              ad.delete().catch(err => console.log(`[x] Error!`))
            }, 10000)
          })
        }, 5000)).then(setTimeout(function () {
          channel2.send(`<@${interaction.member.id}>`).then((ad2) => {
            setTimeout(function () {
              ad2.delete().catch(err => console.log(`[x] Error!`))
            }, 10000)
          })
        }, 5000))
      }
    }
  }
  if (interaction.isButton()) {
    let permissions =
      interaction.member.roles.cache.has(roles.owner) ||
      interaction.member.roles.cache.has(roles.coowner) ||
      interaction.member.roles.cache.has(roles.topadmin1) ||
      interaction.member.roles.cache.has(roles.topadmin2) ||
      interaction.member.roles.cache.has(roles.topadmin3);
    if (interaction.customId == "moderationselect") {
      if (!permissions) {
        return interaction.reply({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })], ephemeral: true })
      }
      else {
        interaction.reply({ embeds: [new MessageEmbed().setColor(config.embedcolor).setTitle(`Hamilton Moderation`).setDescription(`Read commands guide and use them for manage server.`).addField(`${emoji.moderationemoji} Moderation Commands`, `>>> <:DownRightArrow:948183385745023026> \`${config.botprefix}clear\` <:RightArrow:948183388580368425> Clear messages.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}lock\` <:RightArrow:948183388580368425> Lock current channel.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}unlock\` <:RightArrow:948183388580368425> Unlock current channel.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}hide\` <:RightArrow:948183388580368425> Hide current channel.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}unhide\` <:RightArrow:948183388580368425> Unhide current channel.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}slowmode\` <:RightArrow:948183388580368425> Apply slowmode for current channel.`)] })
      }
    }
  }
  if (interaction.isButton()) {
    let permissions =
      interaction.member.roles.cache.has(roles.owner) ||
      interaction.member.roles.cache.has(roles.coowner) ||
      interaction.member.roles.cache.has(roles.topadmin1) ||
      interaction.member.roles.cache.has(roles.topadmin2) ||
      interaction.member.roles.cache.has(roles.topadmin3);
    if (interaction.customId == "banselect") {
      if (!permissions) {
        return interaction.reply({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })], ephemeral: true })
      }
      else {
        interaction.reply({ embeds: [new MessageEmbed().setColor(config.embedcolor).setTitle(`Hamilton Moderation`).setDescription(`Read commands guide and use them for manage server.`).addField(`${emoji.limituseremoji} Limit User Commands`, `>>> <:DownRightArrow:948183385745023026> \`${config.botprefix}serverban\` <:RightArrow:948183388580368425> Ban user from server.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}hobbyban\` <:RightArrow:948183388580368425> Ban user from Hobby section.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}amusementban\` <:RightArrow:948183388580368425> Ban user from Amusement section.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}generalban\` <:RightArrow:948183388580368425> Ban user from General section.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}musicban\` <:RightArrow:948183388580368425> Ban user from Music section.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}textban\` <:RightArrow:948183388580368425> Ban user from text channels.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}voiceban\` <:RightArrow:948183388580368425> Ban user from voice channels.`)] })
      }
    }
  }
  if (interaction.isButton()) {
    let permissions =
      interaction.member.roles.cache.has(roles.owner) ||
      interaction.member.roles.cache.has(roles.coowner) ||
      interaction.member.roles.cache.has(roles.topadmin1) ||
      interaction.member.roles.cache.has(roles.topadmin2) ||
      interaction.member.roles.cache.has(roles.topadmin3);
    if (interaction.customId == "staffselect") {
      if (!permissions) {
        return interaction.reply({ embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما دسترسی ندارید.`, iconURL: `https://cdn.discordapp.com/attachments/922099796100137000/941018234847633439/CrossMark.png` })], ephemeral: true })
      }
      else {
        interaction.reply({ embeds: [new MessageEmbed().setColor(config.embedcolor).setTitle(`Hamilton Moderation`).setDescription(`Read commands guide and use them for manage server.`).addField(`${emoji.addstaffemoji} Add Staff Commands`, `>>> <:DownRightArrow:948183385745023026> \`${config.botprefix}addmanager\` <:RightArrow:948183388580368425> Add Manager role to a user.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}addsupervisor\` <:RightArrow:948183388580368425> Add Supervisor role to a user.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}addsupporter\` <:RightArrow:948183388580368425> Add Supporter role to a user.\n<:DownRightArrow:948183385745023026> \`${config.botprefix}addnewcomer\` <:RightArrow:948183388580368425> Add newcomer to a user.`)] })
      }
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId == "rainbowroleselect") {
      if (interaction.member.roles.cache.some(r => r.id === roles.colorrgb)) {
        interaction.member.roles.remove(roles.displaycolor)
        interaction.member.roles.remove(roles.colorrgb)
        interaction.reply({
          embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `رنگ شما حذف شد.`, iconURL: config.crossmarkurl })], ephemeral: true
        })
      }
      else {
        if (!interaction.member.roles.cache.some(r => r.id === roles.colorrgb))
          interaction.member.roles.add(roles.colorrgb)
        if (!interaction.member.roles.cache.some(r => r.id === roles.displaycolor))
          interaction.member.roles.add(roles.displaycolor)
        if (interaction.member.roles.cache.some(r => r.id === roles.color1))
          interaction.member.roles.remove(roles.color1)
        if (interaction.member.roles.cache.some(r => r.id === roles.color2))
          interaction.member.roles.remove(roles.color2)
        if (interaction.member.roles.cache.some(r => r.id === roles.color3))
          interaction.member.roles.remove(roles.color3)
        if (interaction.member.roles.cache.some(r => r.id === roles.color4))
          interaction.member.roles.remove(roles.color4)
        if (interaction.member.roles.cache.some(r => r.id === roles.color5))
          interaction.member.roles.remove(roles.color5)
        if (interaction.member.roles.cache.some(r => r.id === roles.color6))
          interaction.member.roles.remove(roles.color6)
        if (interaction.member.roles.cache.some(r => r.id === roles.color7))
          interaction.member.roles.remove(roles.color7)
        if (interaction.member.roles.cache.some(r => r.id === roles.color8))
          interaction.member.roles.remove(roles.color8)
        if (interaction.member.roles.cache.some(r => r.id === roles.color9))
          interaction.member.roles.remove(roles.color9)
        if (interaction.member.roles.cache.some(r => r.id === roles.color10))
          interaction.member.roles.remove(roles.color10)
        if (interaction.member.roles.cache.some(r => r.id === roles.color11))
          interaction.member.roles.remove(roles.color11)
        if (interaction.member.roles.cache.some(r => r.id === roles.color12))
          interaction.member.roles.remove(roles.color12)
        if (interaction.member.roles.cache.some(r => r.id === roles.color13))
          interaction.member.roles.remove(roles.color13)
        if (interaction.member.roles.cache.some(r => r.id === roles.color14))
          interaction.member.roles.remove(roles.color14)
        if (interaction.member.roles.cache.some(r => r.id === roles.color15))
          interaction.member.roles.remove(roles.color15)
        await interaction.reply({
          embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `رنگ شما اضافه شد.`, iconURL: config.checkmarkurl })], ephemeral: true
        })
      }
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId == "nsfwselect") {
      if (interaction.member.roles.cache.some(r => r.id === roles.nsfw)) {
        interaction.member.roles.remove(roles.nsfw)
        interaction.reply({
          embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `نقش شما حذف شد.`, iconURL: config.crossmarkurl })], ephemeral: true
        })
      }
      else {
        if (!interaction.member.roles.cache.some(r => r.id === roles.nsfw))
          interaction.member.roles.add(roles.nsfw)
        await interaction.reply({
          embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `نقش شما اضافه شد.`, iconURL: config.checkmarkurl })], ephemeral: true
        })
      }
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId == "bookselect") {
      if (interaction.member.roles.cache.some(r => r.id === roles.bookreading)) {
        interaction.member.roles.remove(roles.bookreading)
        interaction.reply({
          embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `نقش شما حذف شد.`, iconURL: config.crossmarkurl })], ephemeral: true
        })
      }
      else {
        if (!interaction.member.roles.cache.some(r => r.id === roles.bookreading))
          interaction.member.roles.add(roles.bookreading)
        await interaction.reply({
          embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `نقش شما اضافه شد.`, iconURL: config.checkmarkurl })], ephemeral: true
        })
      }
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === `supportselect`) {
      if (interaction.member.roles.cache.has(roles.ticketban)) {
        return interaction.reply({
          embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما برای ساخت تیکت محدود شده اید.`, iconURL: config.crossmarkurl })], ephemeral: true
        })
      }
      else {
        let hamiltonserver = client.guilds.cache.get(config.server);
        if (hamiltonserver.channels.cache.some(c => c.name === `➣📞︱𝖲𝗎𝗉𝗉𝗈𝗋𝗍︱${interaction.member.user.discriminator}`)) {
          return interaction.reply({
            embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما حداکثر یک تیکت می توانید بسازید.`, iconURL: config.crossmarkurl })], ephemeral: true
          })
        }
        const categoryticket = hamiltonserver.channels.cache.find(c => c.id == channels.ticketcategory && c.type == `GUILD_CATEGORY`);
        interaction.guild.channels.create(`➣📞︱𝖲𝗎𝗉𝗉𝗈𝗋𝗍︱${interaction.member.user.discriminator}`, {
          type: 'text',
          parent: categoryticket.id,
        }).then(function (ticketchannel) {
          let supporterchannel = interaction.guild.channels.cache.get(channels.supporterchannel);
          let ticketlogchannel = interaction.guild.channels.cache.get(channels.ticketlog);
          ticketchannel.permissionOverwrites.create(roles.topadmin1, { 'VIEW_CHANNEL': true, 'MANAGE_MESSAGES': true })
          ticketchannel.permissionOverwrites.create(roles.topadmin2, { 'VIEW_CHANNEL': true, 'MANAGE_MESSAGES': true })
          ticketchannel.permissionOverwrites.create(roles.topadmin3, { 'VIEW_CHANNEL': true, 'MANAGE_MESSAGES': true })
          ticketchannel.permissionOverwrites.create(interaction.member.id, { 'VIEW_CHANNEL': true, 'MANAGE_MESSAGES': false })
          ticketlogchannel.send({
            embeds: [new MessageEmbed().setColor(config.embedcolor).setTitle(`Hamilton Ticket`).setThumbnail(config.thumbnailurl).setDescription(`**تیکت جدیدی باز شده است**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Type <:RightArrow:948183388580368425> Support\n<:DownRightArrow:948183385745023026> User <:RightArrow:948183388580368425> ${interaction.member}\n<:DownRightArrow:948183385745023026> Channel Name <:RightArrow:948183388580368425> ${ticketchannel.name}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`)]
          })
          interaction.reply({
            embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `تیکت شما با موفقیت ساخته شد.`, iconURL: config.checkmarkurl })], ephemeral: true
          })
          let supportembed = new MessageEmbed()
            .setTitle(`Hamilton Ticket`)
            .setColor(`#22E08A`)
            .setDescription(`**${interaction.member} تیکت شما با موفقیت باز شد.**`)
            .addField(`\u200B`, `>>> <:Button:948183385304621107> مطلب خود را مطرح کنید\n<:Button:948183385304621107> ادمین های ما در اسرع وقت به درخواست شما رسیدگی می کنند\n<:Button:948183385304621107> برای بستن تیکت روی دکمه زیر کلیک کنید`)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }));
          let supportembedbutton = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId(`closeticketselect`)
                .setLabel(`Close Ticket`)
                .setEmoji(`🔒`)
                .setStyle(`SECONDARY`),
            );
          ticketchannel.send({
            content: `${interaction.member}`, embeds: [supportembed], components: [supportembedbutton]
          }).then(function () {
            let supporternotificationembed = new MessageEmbed()
              .setColor(`#22E08A`)
              .setTitle(`Hamilton Ticket`)
              .setThumbnail(config.thumbnailurl)
              .setDescription(`**تیکت جدیدی باز شده است.**`)
              .addField(`\u200B`, `>>> <:Button:948183385304621107> هر چه سریعتر به تیکت رسیدگی کنید\n<:Button:948183385304621107> برای دسترسی به کانال تیکت روی دکمه زیر کلیک کنید`);
            let supporternotificationembedbutton = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setLabel(`Jump To Channel`)
                  .setStyle(`LINK`)
                  .setURL(`https://discord.com/channels/724786666291593277/${ticketchannel.id}`),
              );
            supporterchannel.send({
              content: `<@&${roles.topadmin1}> / <@&${roles.topadmin2}> / <@&${roles.topadmin3}>`, embeds: [supporternotificationembed], components: [supporternotificationembedbutton]
            })
          })
        })
      }
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === `closeticketselect`) {
      let askembed = new MessageEmbed()
        .setColor(`#22E08A`)
        .setTitle(`Hamilton Support`)
        .setDescription(`**آیا از بستن تیکت اطمینان دارید ؟**`)
        .addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Yes <:RightArrow:948183388580368425> برای بستن تیکت\n<:DownRightArrow:948183385745023026> No <:RightArrow:948183388580368425> برای لغو عملیات`);
      let askembedbutton = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId(`yescloseticketselect`)
            .setLabel(`Yes`)
            .setStyle(`SUCCESS`),
          new MessageButton()
            .setCustomId(`nocloseticketselect`)
            .setLabel(`No`)
            .setStyle(`DANGER`),
        );
      interaction.reply({
        embeds: [askembed], components: [askembedbutton]
      })
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === `nocloseticketselect`) {
      interaction.message.delete()
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === `yescloseticketselect`) {
      let ticketlogchannel = interaction.guild.channels.cache.get(channels.ticketlog);
      interaction.channel.delete()
      ticketlogchannel.send({
        embeds: [new MessageEmbed().setColor(config.embedcolor).setTitle(`Hamilton Ticket`).setThumbnail(config.thumbnailurl).setDescription(`**تیکت بسته شده است**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Type <:RightArrow:948183388580368425> Support\n<:DownRightArrow:948183385745023026> Channel Name <:RightArrow:948183388580368425> ${interaction.channel.name}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`)]
      })
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === `bansupportselect`) {
      if (interaction.member.roles.cache.has(roles.ticketban)) {
        return interaction.reply({
          embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما برای ساخت تیکت محدود شده اید.`, iconURL: config.crossmarkurl })], ephemeral: true
        })
      }
      else {
        let hamiltonserver = client.guilds.cache.get(config.server);
        if (hamiltonserver.channels.cache.some(c => c.name === `➣⛔︱𝖡𝖺𝗇-𝖲𝗎𝗉𝗉𝗈𝗋𝗍︱${interaction.member.user.discriminator}`)) {
          return interaction.reply({
            embeds: [new MessageEmbed().setColor(`RED`).setAuthor({ name: `شما حداکثر یک تیکت می توانید بسازید.`, iconURL: config.crossmarkurl })], ephemeral: true
          })
        }
        const categoryticket = hamiltonserver.channels.cache.find(c => c.id == channels.ticketcategory && c.type == `GUILD_CATEGORY`);
        interaction.guild.channels.create(`➣⛔︱𝖡𝖺𝗇-𝖲𝗎𝗉𝗉𝗈𝗋𝗍︱${interaction.member.user.discriminator}`, {
          type: 'text',
          parent: categoryticket.id,
        }).then(function (ticketchannel) {
          let supporterchannel = interaction.guild.channels.cache.get(channels.supporterchannel);
          let ticketlogchannel = interaction.guild.channels.cache.get(channels.ticketlog);
          ticketchannel.permissionOverwrites.create(roles.topadmin1, { 'VIEW_CHANNEL': true, 'MANAGE_MESSAGES': true })
          ticketchannel.permissionOverwrites.create(roles.topadmin2, { 'VIEW_CHANNEL': true, 'MANAGE_MESSAGES': true })
          ticketchannel.permissionOverwrites.create(roles.topadmin3, { 'VIEW_CHANNEL': true, 'MANAGE_MESSAGES': true })
          ticketchannel.permissionOverwrites.create(interaction.member.id, { 'VIEW_CHANNEL': true, 'MANAGE_MESSAGES': false })
          ticketlogchannel.send({
            embeds: [new MessageEmbed().setColor(config.embedcolor).setTitle(`Hamilton Ticket`).setThumbnail(config.thumbnailurl).setDescription(`**تیکت جدیدی باز شده است**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Type <:RightArrow:948183388580368425> Ban Support\n<:DownRightArrow:948183385745023026> User <:RightArrow:948183388580368425> ${interaction.member}\n<:DownRightArrow:948183385745023026> Channel Name <:RightArrow:948183388580368425> ${ticketchannel.name}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`)]
          })
          interaction.reply({
            embeds: [new MessageEmbed().setColor(`GREEN`).setAuthor({ name: `تیکت شما با موفقیت ساخته شد.`, iconURL: config.checkmarkurl })], ephemeral: true
          })
          let supportembed = new MessageEmbed()
            .setTitle(`Hamilton Ticket`)
            .setColor(`#22E08A`)
            .setDescription(`**${interaction.member} تیکت شما با موفقیت باز شد.**`)
            .addField(`\u200B`, `>>> <:Button:948183385304621107> مطلب خود را مطرح کنید\n<:Button:948183385304621107> ادمین های ما در اسرع وقت به درخواست شما رسیدگی می کنند\n<:Button:948183385304621107> برای بستن تیکت روی دکمه زیر کلیک کنید`)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }));
          let supportembedbutton = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId(`bancloseticketselect`)
                .setLabel(`Close Ticket`)
                .setEmoji(`🔒`)
                .setStyle(`SECONDARY`),
            );
          ticketchannel.send({
            content: `${interaction.member}`, embeds: [supportembed], components: [supportembedbutton]
          }).then(function () {
            let supporternotificationembed = new MessageEmbed()
              .setColor(`#22E08A`)
              .setTitle(`Hamilton Ticket`)
              .setThumbnail(config.thumbnailurl)
              .setDescription(`**تیکت جدیدی باز شده است.**`)
              .addField(`\u200B`, `>>> <:Button:948183385304621107> هر چه سریعتر به تیکت رسیدگی کنید\n<:Button:948183385304621107> برای دسترسی به کانال تیکت روی دکمه زیر کلیک کنید`);
            let supporternotificationembedbutton = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setLabel(`Jump To Channel`)
                  .setStyle(`LINK`)
                  .setURL(`https://discord.com/channels/724786666291593277/${ticketchannel.id}`),
              );
            supporterchannel.send({
              content: `<@&${roles.topadmin1}> / <@&${roles.topadmin2}> / <@&${roles.topadmin3}>`, embeds: [supporternotificationembed], components: [supporternotificationembedbutton]
            })
          })
        })
      }
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === `bancloseticketselect`) {
      let askembed = new MessageEmbed()
        .setColor(`#22E08A`)
        .setTitle(`Hamilton Support`)
        .setDescription(`**آیا از بستن تیکت اطمینان دارید ؟**`)
        .addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Yes <:RightArrow:948183388580368425> برای بستن تیکت\n<:DownRightArrow:948183385745023026> No <:RightArrow:948183388580368425> برای لغو عملیات`);
      let askembedbutton = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId(`yesbancloseticketselect`)
            .setLabel(`Yes`)
            .setStyle(`SUCCESS`),
          new MessageButton()
            .setCustomId(`nobancloseticketselect`)
            .setLabel(`No`)
            .setStyle(`DANGER`),
        );
      interaction.reply({
        embeds: [askembed], components: [askembedbutton]
      })
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === `nobancloseticketselect`) {
      interaction.message.delete()
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === `yesbancloseticketselect`) {
      let ticketlogchannel = interaction.guild.channels.cache.get(channels.ticketlog);
      interaction.channel.delete()
      ticketlogchannel.send({
        embeds: [new MessageEmbed().setColor(config.embedcolor).setTitle(`Hamilton Ticket`).setThumbnail(config.thumbnailurl).setDescription(`**تیکت بسته شده است**`).addField(`\u200B`, `>>> <:DownRightArrow:948183385745023026> Type <:RightArrow:948183388580368425> Ban Support\n<:DownRightArrow:948183385745023026> Channel Name <:RightArrow:948183388580368425> ${interaction.channel.name}\n<:DownRightArrow:948183385745023026> Date <:RightArrow:948183388580368425> ${joindate}`)]
      })
    }
  }
});
process.on('uncaughtException', async (error) => {
  console.log(`[x] Uncaught Exception Error\n${error}`);
});
process.on('uncaughtExceptionMonitor', async (error) => {
  console.log(`[x] Uncaught Exception Monitor Error\n${error}`);
});
process.on('unhandledRejection', async (error) => {
  console.log(`[x] Unhandled Rejection Error\n${error}`);
});
process.on('rejectionHandled', async (error) => {
  console.log(`[x] Rejection Handled Error\n${error}`);
});
client.login(process.env.Token);