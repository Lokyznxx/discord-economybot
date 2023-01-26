const schema = require("../../Database/currencySchema");
const discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: 'hunt',
    description: 'Cace alguns animais e ganhe moedas',
  
    run: async(client, interaction) => {
      
    let amount = Math.floor(Math.random() * 1000) + 500;
    let animals = [
      "Tiger",
      "Lion",
      "Rabbit",
      "Skunk",
      "Deer",
      "Elephant",
      "Hippo",
      "Bear",
      "Rhino",
    ];
    let animal = animals[Math.floor(Math.random() * animals.length)];

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

    if (timeout - (Date.now() - data.huntTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.huntTimeout));

      await interaction.reply({
        content: `Você está em cooldown, por favor, espere por mais **${timeLeft}** to use este comando novamente.`,
      });
    } else {
      data.huntTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const huntEmbed = new discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `Você caçou um **${animal}**e ganhou **:coin: ${amount.toLocaleString()}**`
        );

      await interaction.reply({
        embeds: [huntEmbed],
      });
    }
  },
};