const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a giveaway')
        .addStringOption(option =>
            option.setName('prize')
                .setDescription('Prize to be given in the giveaway')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Giveaway duration (e.g: 1h, 1d, 1w)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('winner_count')
                .setDescription('How many people will win')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('Giveaway image URL')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel where the giveaway will be held')
                .setRequired(false))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Role required to join the giveaway (optional)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Giveaway description')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const duration = interaction.options.getString('duration');
        const winnerCount = parseInt(interaction.options.getString('winner_count'));
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const role = interaction.options.getRole('role');
        const description = interaction.options.getString('description') || 'Click the button below to enter the giveaway!';
        const imageUrl = interaction.options.getString('image');

        const timeMultipliers = {
            's': 1000,
            'm': 60 * 1000,
            'h': 60 * 60 * 1000,
            'd': 24 * 60 * 60 * 1000,
            'w': 7 * 24 * 60 * 60 * 1000
        };

        const timeMatch = duration.match(/^(\d+)([smhdw])$/);
        if (!timeMatch) {
            return interaction.reply({ content: '❌ Geçersiz süre formatı! Örnek: 30s, 5m, 2h, 1d, 1w', ephemeral: true });
        }

        const timeValue = parseInt(timeMatch[1]);
        const timeUnit = timeMatch[2];
        const durationMs = timeValue * timeMultipliers[timeUnit];
        const endTime = Date.now() + durationMs;

        const giveawayEmbed = new EmbedBuilder()
            .setTitle('🎉 GIVEAWAY STARTED! 🎉')
            .setDescription(description)
            .addFields(
                { name: '🏆 Prize', value: prize, inline: true },
                { name: '👥 Winner Count', value: winnerCount.toString(), inline: true },
                { name: '⏰ End Date', value: `<t:${Math.floor(endTime / 1000)}:R>`, inline: true }
            )
            .setColor('#FF6B6B')
            .setImage(imageUrl)
            .setTimestamp()
            .setFooter({ text: `Giveaway ID: ${Date.now()}` });

        if (role) {
            giveawayEmbed.addFields({ name: '🎭 Required Role', value: role.toString(), inline: true });
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('giveaway_join')
                    .setLabel('🎉 Join Giveaway')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🎉')
            );

        try {
            const message = await channel.send({
                embeds: [giveawayEmbed],
                components: [row]
            });

            const giveawayData = {
                messageId: message.id,
                channelId: channel.id,
                guildId: interaction.guild.id,
                prize: prize,
                winnerCount: winnerCount,
                endTime: endTime,
                participants: [],
                role: role ? role.id : null,
                description: description,
                imageUrl: imageUrl,
                hostId: interaction.user.id
            };

            const giveawaysPath = path.join(__dirname, '..', 'data', 'giveaways.json');
            const fs = require('fs');
            
            const dataDir = path.join(__dirname, '..', 'data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir);
            }

            let giveaways = [];
            if (fs.existsSync(giveawaysPath)) {
                giveaways = JSON.parse(fs.readFileSync(giveawaysPath, 'utf8'));
            }

            giveaways.push(giveawayData);
            fs.writeFileSync(giveawaysPath, JSON.stringify(giveaways, null, 2));

            setTimeout(() => {
                endGiveaway(giveawayData);
            }, durationMs);

            await interaction.reply({ content: `✅ Giveaway created successfully! Published in ${channel} channel.`, ephemeral: true });

        } catch (error) {
            console.error('Error creating giveaway:', error);
            await interaction.reply({ content: '❌ An error occurred while creating the giveaway.', ephemeral: true });
        }
    }
};

async function endGiveaway(giveawayData) {
    const { Client, GatewayIntentBits } = require('discord.js');
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
    
    try {
        const guild = await client.guilds.fetch(giveawayData.guildId);
        const channel = await guild.channels.fetch(giveawayData.channelId);
        const message = await channel.messages.fetch(giveawayData.messageId);

        const participants = giveawayData.participants;
        
        if (participants.length === 0) {
            const noParticipantsEmbed = new EmbedBuilder()
                .setTitle('❌ Giveaway Ended')
                .setDescription('No one participated in the giveaway!')
                .setColor('#FF6B6B')
                .setTimestamp();

            await message.edit({ embeds: [noParticipantsEmbed], components: [] });
            return;
        }

        const winners = [];
        const shuffled = participants.sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < Math.min(giveawayData.winnerCount, participants.length); i++) {
            winners.push(shuffled[i]);
        }

        const winnerMentions = winners.map(id => `<@${id}>`).join(', ');

        const winnerEmbed = new EmbedBuilder()
            .setTitle('🎉 Giveaway Ended! 🎉')
            .setDescription(`**Prize:** ${giveawayData.prize}\n\n**Winners:** ${winnerMentions}\n\nPlease don't forget to claim your prize!`)
            .setColor('#4CAF50')
            .setImage(giveawayData.imageUrl)
            .setTimestamp();

        await message.edit({ embeds: [winnerEmbed], components: [] });

        for (const winnerId of winners) {
            try {
                const winner = await client.users.fetch(winnerId);
                await winner.send(`🎉 Congratulations! You have won **${giveawayData.prize}**! Please contact the server administrators.`);
            } catch (error) {
                console.error(`Could not send message to winner ${winnerId}:`, error);
            }
        }

        const giveawaysPath = path.join(__dirname, '..', 'data', 'giveaways.json');
        const fs = require('fs');
        
        if (fs.existsSync(giveawaysPath)) {
            let giveaways = JSON.parse(fs.readFileSync(giveawaysPath, 'utf8'));
            giveaways = giveaways.filter(g => g.messageId !== giveawayData.messageId);
            fs.writeFileSync(giveawaysPath, JSON.stringify(giveaways, null, 2));
        }

    } catch (error) {
        console.error('Error ending giveaway:', error);
    }
} 