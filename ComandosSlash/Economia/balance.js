const schema = require("../../Database/currencySchema");
const Discord = require("discord.js");

module.exports = {
    name: 'balance', // Nome do comando aqui
    description: 'Mostra o saldo de um usuário', // Coloque a descrição do comando aqui

    options: [
        {
            name: "user",
            description: "Selecione um usuário para visualizar seu saldo",
            type: Discord.ApplicationCommandOptionType.User,
            required: false
        },
    ],

    run: async(client, interaction) => {
      
    let user = interaction.options.getUser("user");

    if (!user) {
      user = interaction.user;
    }

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
      await interaction.reply({
        content: "Ocorreu um erro ao executar este comando...",
        ephemeral: true,
      });
    }

    const balanceEmbed = new Discord.EmbedBuilder()
      .setColor("#0155b6")
      .setThumbnail(user.displayAvatarURL())
      .setTitle(`__${user.username}\'s Balance__`)
      .setDescription(
        `<:Arrow:964215679387566151> Carteira: **${data.wallet.toLocaleString()}**\n<:Arrow:964215679387566151> Banco: **${data.bank.toLocaleString()}**`
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [balanceEmbed],
    });
  },
};