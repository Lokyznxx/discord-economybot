const schema = require("../../Database/currencySchema");
const discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: 'monthly',
    description: 'Reivindique sua recompensa mensal',
  
    run: async(client, interaction) => {
      
    let amount = Math.floor(Math.random() * 100000) + 10000;

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

    let timeout = 2592000000;

    if (timeout - (Date.now() - data.monthlyTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.monthlyTimeout));

      await interaction.reply({
        content: `Você está em cooldown, por favor, espere por mais **${timeLeft}** para usar este comando novamente.`,
      });
    } else {
      data.monthlyTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const monthlyEmbed = new discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `Você recebeu uma recompensa mensal de **:coin: ${amount.toLocaleString()}**`
        );

      await interaction.reply({
        embeds: [monthlyEmbed],
      });
    }
  },
};