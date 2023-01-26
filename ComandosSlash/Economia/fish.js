const schema = require("../../Database/currencySchema");
const discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: 'fish',
    description: 'Pegue alguns peixes e ganhe moedas',
  
    run: async(client, interaction) => {
    
    let fishAmount = Math.floor(Math.random() * 20) + 1;
    let amount = fishAmount * 100 * 1;

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

    if (timeout - (Date.now() - data.fishTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.fishTimeout));

      await interaction.reply({
        content: `Você está em cooldown, por favor, espere por mais **${timeLeft}** para usar este comando novamente.`,
      });
    } else {
      data.fishTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const fishEmbed = new discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `Você pegou **${fishAmount}** peixes e ganhos**:coin: ${amount.toLocaleString()}**`
        );

      await interaction.reply({
        embeds: [fishEmbed],
      });
    }
  },
};