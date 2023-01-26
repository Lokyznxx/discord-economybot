const schema = require("../../Database/currencySchema");
const discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: 'dig',
    description: 'Cave por algumas moedas',
  
    run: async(client, interaction) => {
      
    let amount = Math.floor(Math.random() * 1000) + 100;

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

    let timeout = 30000;

    if (timeout - (Date.now() - data.digTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.digTimeout));

      await interaction.reply({
        content: `Você está em cooldown, por favor, espere por mais **${timeLeft}** para usar este comando novamente.`,
      });
    } else {
      data.digTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const digEmbed = new discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `Você fez algumas pesquisas e encontrou **:coin: ${amount.toLocaleString()}**`
        );

      await interaction.reply({
        embeds: [digEmbed],
      });
    }
  },
};