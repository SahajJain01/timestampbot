const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
} = require("discord.js");
const { DateTime } = require("luxon");

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildIntegrations],
});

const errStr =
  "Invalid time format. Please provide the time in the format HH:MM.";

const getResStr = function (utcTimestamp) {
  return `<t:${utcTimestamp}:t> ->   \\<t:${utcTimestamp}:t>\n<t:${utcTimestamp}:R> ->   \\<t:${utcTimestamp}:R>`;
};

bot.on("ready", () => {
  const atCommand = new SlashCommandBuilder()
    .setName("at")
    .setDescription(
      "Converts a given time in a specific timezone to a UTC Discord timestamp."
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The time in the format HH:MM")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("timezone")
        .setDescription("Your local timezone.")
        .setRequired(true)
        .addChoices(
          { name: "PST - Pacific Standard Time (UTC-8)", value: "UTC-8" },
          { name: "MST - Mountain Standard Time (UTC-7)", value: "UTC-7" },
          { name: "CST - Central Standard Time (UTC-6)", value: "UTC-6" },
          { name: "EST - Eastern Standard Time (UTC-5)", value: "UTC-5" },
          { name: "CET - Central European Time (UTC+1)", value: "UTC+1" },
          { name: "EET - Eastern European Time (UTC+2)", value: "UTC+2" },
          { name: "WET - Western European Time (UTC+0)", value: "UTC+0" },
          { name: "IST - India Standard Time (UTC+5:30)", value: "UTC+5:30" }
        )
    );
  bot.application.commands.create(atCommand);

  const inCommand = new SlashCommandBuilder()
    .setName("in")
    .setDescription("Converts given hours/minutes to a UTC Discord timestamp.")
    .addStringOption((option) =>
      option.setName("hours").setDescription("How many hours from now.")
    )
    .addStringOption((option) =>
      option.setName("minutes").setDescription("How many minutes from now.")
    );
  bot.application.commands.create(inCommand);
});

bot.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "at") {
    const timeString = options.get("time").value;
    const timezoneString = options.get("timezone").value;
    try {
      const dateTime = DateTime.fromFormat(timeString, "HH:mm", {
        zone: timezoneString,
      });
      const utcTimestamp = dateTime.setZone("UTC").toUnixInteger();

      await interaction.reply({
        content: getResStr(utcTimestamp),
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: errStr + error,
        ephemeral: true,
      });
    }
  }

  if (commandName === "in") {
    const hours = options.get("hours")?.value;
    const minutes = options.get("minutes")?.value;
    try {
      const currentDateTime = DateTime.utc();
      const utcTimestamp = currentDateTime
        .plus({ hours: hours, minutes: minutes })
        .toUnixInteger();

      await interaction.reply({
        content: getResStr(utcTimestamp),
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: errStr + error,
        ephemeral: true,
      });
    }
  }
});

bot.login(Bun.env.TOKEN);
