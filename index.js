const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "-";
const delay = require('delay');

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", async message => {

    if(message.author.bot) return;
    if (message.channel.type === "dm") return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd === 'poll'){
        if(message.channel.id != "465659831311794189"){return message.channel.send("Sorry, you can only make polls in the #polls channel.")}

        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{});

        const pEmbed = new Discord.RichEmbed()
        .setTitle(sayMessage)
        .setColor(0xCF40FA);

        message.channel.send(pEmbed)
        .then(function(message){
            message.react(`✅`);
            message.react(`❌`);
        }).catch(function() {
            
        });

    }  
    
    if(message.content.startsWith(`${prefix}kick`)){
        let kUser = message.guild.member(message.mentions.members.first());
        if(!kUser) message.channel.send("Can't find that user!");
        let kReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Sorry, you don't have enough permission!");
    
        let kickEmbed = new Discord.RichEmbed()
        .setDescription("Kick")
        .setColor("003459")
        .addField("Kicked User", `${kUser}`)
        .addField("Kicked By", `<@${message.author.id}>`)
        .addField("Kicked in", message.channel)
        .addField("Time", message.createdAt)
    
        message.guild.member(kUser).kick("has been kicked.");
        message.channel.send(kickEmbed);
    
        return;
      }
    
      if(message.content.startsWith(`${prefix}ban`)){
        let bUser = message.guild.member(message.mentions.members.first());
        if(!bUser) message.channel.send("Can't find that user!");
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Sorry, you don't have enough permission!");
    
        let banEmbed = new Discord.RichEmbed()
        .setDescription("Ban")
        .setColor("3A405A")
        .addField("Banned User", `${bUser}`)
        .addField("Banned By", `<@${message.author.id}>`)
        .addField("Banned in", message.channel)
        .addField("Time", message.createdAt)
    
        message.guild.member(bUser).ban("has been banned.");
        message.channel.send(banEmbed);
    
        return;
      }

      if(cmd === `purge`) {
        // This command removes all messages from all users in the channel, up to 100.
        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);
        
        // Ooooh nice, combined conditions. <3
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
          
        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({count: deleteCount});
        message.channel.bulkDelete(deleteCount + 1)
          .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }

    if(cmd === `mute`){
        let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tomute) return message.reply("Couldn't find user.");
        if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
        let muterole = message.guild.roles.find(`name`, "muted");
        //start of create role
        if(!muterole){
          try{
            muterole = await message.guild.createRole({
              name: "muted",
              color: "#000000",
              permissions:[]
            })
            message.guild.channels.forEach(async (channel, id) => {
              await channel.overwritePermissions(muterole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
              });
            });
          }catch(e){
            console.log(e.stack);
          }
        }
        //end of create role
        let mutetime = args[1];
        if(!mutetime) return message.reply("You didn't specify a time!");
      
        await(tomute.addRole(muterole.id));
        message.reply(`<@${tomute.id}> has been muted.`);
      
        setTimeout(function(){
          tomute.removeRole(muterole.id);
          message.channel.send(`<@${tomute.id}> has been unmuted!`);
        }, ms(mutetime));
      }
    
      if(cmd === `unmute`){
    
        let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tomute) return message.reply("Couldn't find user.");
    
        let muterole = message.guild.roles.find(`name`, "muted");
    
        if(!muterole){
            return message.channel.send("This user cannot be unmuted.")
        }
        tomute.removeRole(muterole.id);
      }


    if (message.content.toLowerCase().startsWith(prefix + `new`)) {
        if(message.channel.id != `465653274599751691`){return message.channel.send("You may only execute that command in the ticket request channel.")}
        const reason = message.content.split(" ").slice(1).join(" ");
        if (!message.guild.roles.exists("name", "✦ [Management] ✦")) return message.channel.send(`This server doesn't have a \`Management\` role made, so the ticket won't be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets.`);
        if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`You already have a ticket open.`);
        message.guild.createChannel(`ticket-${message.author.username}`, "text").then(c => {
            let role = message.guild.roles.find("name", "✦ [Management] ✦");
            let role2 = message.guild.roles.find("name", "@everyone");
            c.setParent("465653230542782484");
            c.overwritePermissions(role, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            c.overwritePermissions(role2, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false
            });
            c.overwritePermissions(message.author, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            message.channel.send(`:white_check_mark: Your ticket has been created, #${c.name}.`);
            const embed = new Discord.RichEmbed()
            .setColor(0xCF40FA)
            .addField(`Hey ${message.author.username}!`, `Please explain why you opened this ticket with as much detail as possible. Our **Support Team** will be here to help soon.`)
            .setTimestamp();
            c.send({ embed: embed });
        }).catch(console.error);
    }
    if (message.content.toLowerCase().startsWith(prefix + `close`)) {
        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`You can't use the close command outside of a ticket channel.`);
    
        message.channel.send(`Are you sure? You cannot reverse this action!\nTo confirm, type \`-confirm\`. This will time out in 10 seconds and be cancelled.`)
        .then((m) => {
          message.channel.awaitMessages(response => response.content === '-confirm', {
            max: 1,
            time: 10000,
            errors: ['time'],
          })
          .then((collected) => {
              message.channel.delete();
            })
            .catch(() => {
              m.edit('Ticket close-confirmation timed out, the ticket was not closed.').then(m2 => {
                  m2.delete();
              }, 3000);
            });
        });
    }
});

client.on('guildMemberAdd', member => {
    member.guild.channels.get('465636628338311169').send(`Welcome ${member} to **SupremePvp** - Map I!\n\n 💰 F-TOP: $3,100 Paypal/Buycraft 💰\n\n**• [Server Information] •**\n• Server ip: **Coming soon**\n• Website: **Coming soon**\n• Store: **Coming soon**\n• Discord: https://discord.gg/XcGY4CG`); 
    const role = member.addRole(member.guild.roles.find("name", "✦ [Member] ✦"));
    if (!role) return;
});



client.login("NDY1NjI4NzQ5MDUyNzcyMzUy.DiQSMQ.18pyDWoyvbleo_QueIzpgOclq9o");
