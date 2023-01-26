const fs = require("fs")

module.exports = async (client) => {


  const SlashsArray = []

  fs.readdir(`./ComandosSlash`, (error, folder) => {
    folder.forEach(subfolder => {
      fs.readdir(`./ComandosSlash/${subfolder}/`, (error, files) => {
        files.forEach(files => {

          if (!files?.endsWith('.js')) return;
          files = require(`../ComandosSlash/${subfolder}/${files}`);
          if (!files?.name) return;
          client.slashCommands.set(files?.name, files);

          SlashsArray.push(files)
        });
      });
    });
  });

  fs.readdir(`./Eventos/`, (erro, pasta) => {
    pasta.forEach(subpasta => {
      fs.readdir(`./Eventos/${subpasta}/`, (erro, arquivos) => {
        arquivos.forEach(arquivo => {
          if (!arquivo.endsWith('.js')) return; require(`../Eventos/${subpasta}/${arquivo}`);
        });
      });
    });
  });
client.on("ready", async () => {
  client.guilds.cache.forEach(guild => guild.commands.set(SlashsArray))
});
};