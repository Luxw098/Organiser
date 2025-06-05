import { PrismaClient } from "@prisma/client";
import {
	ApplicationIntegrationType,
	BaseApplicationCommandData,
	CommandInteraction,
	InteractionContextType,
	Locale,
	PermissionResolvable
} from "discord.js";

export abstract class CommandType implements BaseApplicationCommandData {
	public abstract name: string;
	public abstract description: string;
	public abstract nameLocalizations?: Partial<Record<Locale, string | null>> | undefined;
	public abstract dmPermission?: boolean | undefined;
	public abstract defaultMemberPermissions?: PermissionResolvable | null | undefined;
	public abstract nsfw?: boolean | undefined;
	public abstract contexts?: readonly InteractionContextType[] | undefined;
	public abstract integrationTypes?: readonly ApplicationIntegrationType[] | undefined;

	public abstract run(
		interaction: CommandInteraction,
		prisma: PrismaClient
	): Promise<void>;
}
