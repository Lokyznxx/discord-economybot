const schema = require("../../Database/currencySchema");
const discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: 'daily',
    description: 'Reivindique sua recompensa diária',
  
    run: async(client, interaction) => {
      
    let amount = Math.floor(Math.random() * 10000) + 1000;

    let data;
    try {
      data = await schema.findOne({
        userId: interaction.user.id,
      });

      if (!data) {
        data = await schema.create({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
        });
      }
    } catch (err) {
      console.log(err);
      await interaction.reply({
        content: "Ocorreu um erro ao executar este comando...",
        ephemeral: true,
      });
    }

    let timeout = 86400000;

    if (timeout - (Date.now() - data.dailyTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.dailyTimeout));

      await interaction.reply({
        content: `Você está em cooldown, por favor, espere por mais**${timeLeft}** para usar este comando novamente.`,
      });
    } else {
      data.dailyTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const dailyEmbed = new discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `Você recebeu uma recompensa diária de **:coin: ${amount.toLocaleString()}**`
        );

      await interaction.reply({
        embeds: [dailyEmbed],
      });
    }
  },
};