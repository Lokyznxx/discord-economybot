const schema = require("../../Database/currencySchema");
const Discord = require("discord.js");
const discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: 'search',
    description: 'Procure por algumas moedas',
    type: Discord.ApplicationCommandType.ChatInput,
    ownerOnly: true,
    options: [
        {
            name: 'search_location',
            description: 'Selecione um local para pesquisar',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Car",
                    value: "Car",
                  },
                  {
                    name: "Bike",
                    value: "Bike",
                  },
                  {
                    name: "Wallet",
                    value: "Wallet",
                  },
                  {
                    name: "Pocket",
                    value: "Pocket",
                  },
                  {
                    name: "Computer",
                    value: "Computer",
                  },
                  {
                    name: "Keyboard",
                    value: "Keyboard",
                  },
                  {
                    name: "Laptop",
                    value: "Laptop",
                  },
                  {
                    name: "Desk",
                    value: "Desk",
                  },
                  {
                    name: "Shoe",
                    value: "Shoe",
                  },
                  {
                    name: "Sock",
                    value: "Sock",
                  }
            ]
        }
    ],

    run: async (client, interaction) => {

    let searchLocation = interaction.options.getString("search_location");
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

    if (timeout - (Date.now() - data.searchTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.searchTimeout));

      await interaction.reply({
        content: `Você está em cooldown, por favor, espere por mais **${timeLeft}** para usar este comando novamente.`,
      });
    } else {
      data.searchTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const searchEmbed = new discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `você pesquisou um **${searchLocation}** e encontrei **:coin: ${amount.toLocaleString()}**`
        );

      await interaction.reply({
        embeds: [searchEmbed],
      });
    }
  },
};