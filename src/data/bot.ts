import { ClientOptions, Events, Message, Client, REST, SlashCommandBuilder, Routes } from "discord.js"
import { EventBuilder } from "./event_manager.js";
import { ClientReadyHandler } from "../events/client_ready_handler.js";
import { MessageCreateHandler } from "../events/message_create_handler.js";
import { CommandBuilder } from "./command_manager.js";
import { PingCommand } from "../commands/ping.js";
import { EvalCommand } from "../commands/eval.js";

export class Bot {
    private token: string | undefined;
    private client: Client;

    constructor(_token: string | undefined) {
        let commands : CommandBuilder[] = [
            new PingCommand(),
            new EvalCommand()
        ]
        let events : EventBuilder[] = [
            new ClientReadyHandler(),
            new MessageCreateHandler(commands)
        ]
        this.token = _token;
        this.client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });
        this.addEventHandles(events);
    }

    private addEventHandles(events : EventBuilder[]) {
        events.forEach((event : EventBuilder) => {
            this.client.on(event.getEventType(), event.getEventCallFunction.bind(event));
        })
    }

    public run() {
        this.client.login(this.token);
    }

    public stop() {
        this.client.destroy();
    }
}