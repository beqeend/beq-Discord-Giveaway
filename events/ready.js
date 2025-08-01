const { Events, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setPresence({
            activities: [{ 
                name: 'beqeend [Giveaway]', 
                type: ActivityType.Playing 
            }],
            status: 'online'
        });

        console.log('╔══════════════════════════════════════════════════════════╗');
        console.log('║                    CEKILIS BOTU                          ║');
        console.log('╠══════════════════════════════════════════════════════════╣');
        console.log(`║ Creator: beqeend                                        ║`);
        console.log(`║ Title: Cekilis Botu                                     ║`);
        console.log(`║ Status: Aktif [${client.user.username}]                 ║`);
        console.log('╚══════════════════════════════════════════════════════════╝');
        console.log(`✅ ${client.user.tag} olarak Giris Yapildi!`);
        console.log(`🤖 Bot ${client.guilds.cache.size} sunucuda aktif!`);
        
        const { REST, Routes } = require('discord.js');
        const config = require('../config.json');
        
        const commands = [];
        const commandsPath = path.join(__dirname, '..', 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '10' }).setToken(config.token);

        (async () => {
            try {
                console.log('🔄 Slash komutlari kaydediliyor...');

                await rest.put(
                    Routes.applicationCommands(config.clientId),
                    { body: commands },
                );

                console.log('✅ Slash komutlari başariyla kaydedildi!');
            } catch (error) {
                console.error('❌ Slash komutlari kaydedilirken hata:', error);
            }
        })();
    },
}; 