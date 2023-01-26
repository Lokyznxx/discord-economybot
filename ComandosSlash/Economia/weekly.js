const schema = require("../../Database/currencySchema");
const discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: 'weekly',
    description: 'Reivindique sua recompensa semanal',
  
    run: async(client, interaction) => {
      
    let amount = Math.floor(Math.random() * 20000) + 2000;

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

    let timeout = 604800000;

    if (timeout - (Date.now() - data.weeklyTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.weeklyTimeout));

      await interaction.reply({
        content: `Você está em cooldown, por favor, espere por mais **${timeLeft}** para usar este comando novamente.`,
      });
    } else {
      data.weeklyTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const weeklyEmbed = new discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `Você recebeu uma recompensa semanal de **:coin: ${amount.toLocaleString()}**`
        );

      await interaction.reply({
        embeds: [weeklyEmbed],
      });
    }
  },
};