const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`${interaction.commandName} komutu bulunamadı.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: '❌ Komut çalıştırılırken bir hata oluştu!', ephemeral: true });
                } else {
                    await interaction.reply({ content: '❌ Komut çalıştırılırken bir hata oluştu!', ephemeral: true });
                }
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'giveaway_join') {
                await handleGiveawayJoin(interaction);
            }
        }
    },
};

async function handleGiveawayJoin(interaction) {
    const fs = require('fs');
    const path = require('path');
    const { EmbedBuilder } = require('discord.js');

    try {
        const giveawaysPath = path.join(__dirname, '..', 'data', 'giveaways.json');
        
        if (!fs.existsSync(giveawaysPath)) {
            return await interaction.reply({ content: '❌ Çekiliş verisi bulunamadı!', ephemeral: true });
        }

        const giveaways = JSON.parse(fs.readFileSync(giveawaysPath, 'utf8'));
        const giveaway = giveaways.find(g => g.messageId === interaction.message.id);

        if (!giveaway) {
            return await interaction.reply({ content: '❌ Bu çekiliş bulunamadı!', ephemeral: true });
        }

        if (Date.now() > giveaway.endTime) {
            return await interaction.reply({ content: '❌ Bu çekiliş süresi dolmuş!', ephemeral: true });
        }

        if (giveaway.participants.includes(interaction.user.id)) {
            return await interaction.reply({ content: '❌ Zaten bu çekilişe katılmışsınız!', ephemeral: true });
        }

        if (giveaway.role) {
            const member = interaction.member;
            if (!member.roles.cache.has(giveaway.role)) {
                return await interaction.reply({ content: `❌ Bu çekilişe katılmak için <@&${giveaway.role}> rolüne sahip olmalısınız!`, ephemeral: true });
            }
        }

        giveaway.participants.push(interaction.user.id);

        const updatedGiveaways = giveaways.map(g => 
            g.messageId === giveaway.messageId ? giveaway : g
        );
        fs.writeFileSync(giveawaysPath, JSON.stringify(updatedGiveaways, null, 2));

        const successEmbed = new EmbedBuilder()
            .setTitle('✅ You have entered the giveaway!')
            .setDescription(`**${giveaway.prize}** You have successfully participated in the giveaway.!\n\n🎉 Good Luck!`)
            .setColor('#4CAF50')
            .setTimestamp();

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });

    } catch (error) {
        console.error('Çekilişe katılma hatası:', error);
        await interaction.reply({ content: '❌ An error occurred while participating in the giveaway.!', ephemeral: true });
    }
} 