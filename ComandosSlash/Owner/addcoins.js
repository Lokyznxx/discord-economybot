const schema = require("../../Database/currencySchema");
const Discord = require("discord.js");
const discord = require("discord.js");

module.exports = {
  name: "addcoins", // Coloque o nome do comando
  description: "Add coins in a user wallet.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options:[
    {
        name: "user", // nome da opção
        description: "Select a user", // descrição
        type: Discord.ApplicationCommandOptionType.User,
        required: true,
    },
    {
        name: "amount", // nome da opção
        description: "Enter the amount you want to add", // descrição
        type: Discord.ApplicationCommandOptionType.Integer,
        required: true,
    }
  ],

run: async(client, interaction) => {
      
    const permission = interaction.member.permissions.has(
      discord.PermissionFlagsBits.ManageGuild
    );
    let user = interaction.options.getUser("user");
    let amount = interaction.options.getInteger("amount");

    let data;
    try {
      data = await schema.findOne({
        userId: user.id,
      });

      if (!data) {
        data = await schema.create({
          userId: user.id,
          guildId: interaction.guild.id,
        });
      }
    } catch (err) {
      console.log(err);
      await interaction.reply({
        content: "There was an error while executing this command...",
        ephemeral: true,
      });
    }

    if (!permission) {
      await interaction.reply({
        content: "You don't have the permissions to use this command...",
        ephemeral: true,
      });
    } else {
      data.wallet += amount * 1;
      await data.save();

      const addcoinsEmbed = new Discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `You added **:coin: ${amount.toLocaleString()}** in **${
            user.username
          }'s** wallet`
        );

      await interaction.reply({
        embeds: [addcoinsEmbed],
      });
    }
  },
};