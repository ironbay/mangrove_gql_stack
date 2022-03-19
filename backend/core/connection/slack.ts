import { InstallProvider } from "@slack/oauth";
import { WebClient } from "@slack/web-api";
import { Config } from "@serverless-stack/node/config";

import { Dynamo } from "@mangrove/core/dynamo";
import { Entity, Model, Table } from "dynamodb-onetable";
import { v4 } from "uuid";

const installer = new InstallProvider({
  clientId: Config.SLACK_CLIENT_ID,
  clientSecret: Config.SLACK_CLIENT_SECRET,
  stateSecret: JSON.stringify({ app: "mangrove" }),
});

type SlackConnection = Entity<typeof Dynamo.Schema.models.SlackConnection>;
const SlackConnection =
  Dynamo.Table.getModel<SlackConnection>("SlackConnection");

export async function auth_start(user: string) {
  const url = await installer.generateInstallUrl({
    scopes: ["team:read", "chat:write", "channels:read", "channels:join"],
    metadata: JSON.stringify({ user: user }),
    redirectUri: "https://google.com",
  });

  return url;
}

export async function auth_finish(user: string, verification: string) {
  const client = new WebClient();

  const resp = await client.oauth.v2.access({
    client_id: Config.SLACK_CLIENT_ID,
    client_secret: Config.SLACK_CLIENT_SECRET,
    code: verification,
    redirect_uri: "https://google.com",
  });

  await SlackConnection.create({
    user: user,
    id: v4(),
    token: resp.access_token!,
  });
}

export async function team_info(user: string, id: string) {
  const item = await SlackConnection.get({ user: user, id: id });
  const client = new WebClient(item!.token);
  const info = await client.team.info();

  return {
    name: info.team?.name,
    icon: info.team?.icon,
  };
}

export async function connections(user: string) {
  const items = await SlackConnection.find({ user });
  const conns = await Promise.all(
    items.map(async (item) => {
      const client = new WebClient(item!.token);
      const team_info = await client.team.info();
      const channel_resp = await client.conversations.list();

      return {
        id: item.id,
        kind: "slack",
        name: team_info.team?.name,
        channels: channel_resp.channels!.map((c) => {
          return {
            id: c.id,
            name: c.name,
            topic: c.topic,
            num_members: c.num_members,
          };
        }),
      };
    })
  );

  return conns;
}

export async function get(user: string, id: string) {
  const item = await SlackConnection.get({ user, id })!;
  const client = new WebClient(item!.token!);
  const info = await client.team.info();
  const channels = await client.conversations.list().then((resp) =>
    resp.channels?.map((channel) => {
      return {
        id: channel.id!,
        name: channel.name!,
        topic: channel.topic!,
        num_members: channel.num_members!,
      };
    })
  );

  return {
    id: info.team?.id!,
    kind: "slack",
    name: info.team?.name!,
    channels: channels!,
  };
}
