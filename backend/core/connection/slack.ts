import { InstallProvider } from "@slack/oauth";
import { Config } from "@serverless-stack/node/config";

export async function auth_start(user: string) {
  console.log(Config);
  const installer = new InstallProvider({
    clientId: Config.SLACK_CLIENT_ID,
    clientSecret: Config.SLACK_CLIENT_SECRET,
    stateSecret: JSON.stringify({ app: "mangrove" }),
  });

  const url = await installer.generateInstallUrl({
    scopes: ["team:read", "chat:write", "channels:read", "channels:join"],
    metadata: JSON.stringify({ user: user }),
    redirectUri: "https://google.com",
  });

  return url;
}
