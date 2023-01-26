const schema = require("../../Database/currencySchema");
const discord = require("discord.js");
const Discord = require("discord.js");

module.exports = {
    name: 'withdraw',
  
    description: 'Retire suas moedas do banco',
  
    options: [
        {
            name: "withdraw_amount",
            description: "Insira o valor do saque",
            type: Discord.ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    run: async(client, interaction) => {
      
    let withdrawAmount = interaction.options.getInteger("withdraw_amount");

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

    if (withdrawAmount > data.bank) {
      await interaction.reply({
        content: "Você não tem tantas moedas em seu banco para sacar.",
      });
    } else if (withdrawAmount <= 0) {
      await interaction.reply({
        content: "Insira um número acima de 0.",
      });
    } else {
      data.bank -= withdrawAmount * 1;
      data.wallet += withdrawAmount * 1;
      await data.save();

      const withdrawEmbed = new discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `Retirado com sucesso **:coin: ${withdrawAmount.toLocaleString()}** do banco`
        );

      await interaction.reply({
        embeds: [withdrawEmbed],
      });
    }
  },
};