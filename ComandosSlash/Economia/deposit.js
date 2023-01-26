const schema = require("../../Database/currencySchema");
const Discord = require("discord.js");

module.exports = {
    name: 'deposit',
  
    description: 'Deposit your coins in the bank',
  
    options: [
        {
            name: "deposit_amount",
            description: "Enter the deposit amount",
            type: Discord.ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    run: async(client, interaction) => {
      
    let depositAmount = interaction.options.getInteger("deposit_amount");

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

    if (depositAmount > data.wallet) {
      await interaction.reply({
        content: "Você não tem tantas moedas na carteira para depositar.",
      });
    } else if (depositAmount <= 0) {
      await interaction.reply({
        content: "Insira um número acima de 0.",
      });
    } else {
      data.wallet -= depositAmount * 1;
      data.bank += depositAmount * 1;
      await data.save();

      const depositEmbed = new Discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `Depositado com sucesso **:coin: ${depositAmount.toLocaleString()}** no banco`
        );

      await interaction.reply({
        embeds: [depositEmbed],
      });
    }
  },
};