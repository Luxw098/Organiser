import { PrismaClient, UserConfig } from "@prisma/client";
import {
	APIApplicationCommandOption,
	Client,
	CommandInteraction,
	ComponentType,
	MessageFlags,
	PermissionFlags
} from "discord.js";
import { CommandType } from "../types/CommandType";
import { BuildEmbed } from "../utils/EmbedBuilter";

export default class config implements CommandType {
	public name = "config";
	public description = "Configure your personal settings.";
	public args: APIApplicationCommandOption[] = [
		{
			type: 3,
			name: "edit",
			choices: [
				{
					name: "Available Times",
					value: "available_times"
				},
				{
					name: "Preferences",
					value: "preferences"
				},
				{
					name: "Comfortability",
					value: "contact"
				},
				{
					name: "Preferred Tags",
					value: "tags"
				},
				{
					name: "Timezone",
					value: "timezone"
				}
			],
			description: "Select what setting youd like to edit",
			required: false
		}
	];
	public requiredPermissions: (keyof PermissionFlags)[] = [];

	public async run(
		client: Client,
		interaction: CommandInteraction,
		prisma: PrismaClient
	) {
		const userId = interaction.user.id;
		const guildId = interaction.guildId!;
		const type = interaction.options.get("edit", false);

		const default_data = {
			identifier: guildId + userId,
			available_times: "not set",
			preferences: "not set",
			contact: "not set",
			tags: "not set",
			timezone: "not set",
			verified_vrc: "not set"
		};

		if (!type) {
			let config = await prisma.userConfig.findFirst({
				where: {
					identifier: guildId + userId
				}
			});
			config ??= await prisma.userConfig.create({
				data: default_data
			});

			interaction.reply({
				embeds: [
					BuildEmbed({
						title: interaction.user.displayName + "'s Configuration",
						description:
							"`Available Times` " +
							config.available_times +
							"\n" +
							"`Preferences` " +
							config.preferences +
							"\n" +
							"`Comfortability` " +
							config.contact +
							"\n" +
							"`Preferred Tags` " +
							config.tags +
							"\n" +
							"`Timezone` " +
							config.timezone
					})
				],
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		const modal = await interaction.showModal({
			title: interaction.user.username + "'s Configuration",
			customId: "config_modal",
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.TextInput,
							label: "Editing " + type.name,
							customId: "config_input",
							style: 1
						}
					]
				}
			]
		});

		client.once("interactionCreate", async modalInteraction => {
			if (
				!modalInteraction.isModalSubmit() ||
				modalInteraction.customId !== "config_modal"
			)
				return modal.client;

			const new_value = modalInteraction.fields.getTextInputValue("config_input");

			await prisma.userConfig.upsert({
				where: {
					identifier: guildId + userId
				},
				update: {
					[type.value as keyof UserConfig]: new_value
				},
				create: {
					...default_data,
					[type.value as keyof UserConfig]: new_value
				}
			});

			await modalInteraction.reply({
				embeds: [
					BuildEmbed({
						title: "Configuration Updated",
						description: new_value
					})
				],
				flags: MessageFlags.Ephemeral
			});
		});
	}
}
