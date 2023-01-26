const schema = require("../../Database/currencySchema");
const discord = require("discord.js");
const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: 'work',
    description: 'Trabalhe e ganhe algumas moedas',
    type: Discord.ApplicationCommandType.ChatInput,
    ownerOnly: true,
    options: [
        {
            name: 'job',
            description: 'Selecione um trabalho',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Software Developer",
                    value: "Software Developer",
                  },
                  {
                    name: "Data Scientist",
                    value: "Data Scientist",
                  },
                  {
                    name: "Doctor",
                    value: "doctor",
                  },
                  {
                    name: "Waiter",
                    value: "Waiter",
                  },
                  {
                    name: "Painter",
                    value: "Painter",
                  }
            ]
        }
    ],
    run: async (client, interaction) => {

    let job = interaction.options.getString("job");
    let amount = Math.floor(Math.random() * 5000) + 500;

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

    let timeout = 3600000;

    if (timeout - (Date.now() - data.workTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.workTimeout));

      await interaction.reply({
        content: `Você está em cooldown, por favor, espere por mais **${timeLeft}** para usar este comando novamente.`,
      });
    } else {
      data.workTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const workEmbed = new discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `Você trabalhou como **${job}** e ganhou **:coin: ${amount.toLocaleString()}**`
        );

      await interaction.reply({
        embeds: [workEmbed],
      });
    }
  },
};