import { Config } from "@serverless-stack/node/config";
import { InstallProvider } from "@slack/oauth";

export async function auth_start(user: string) {
  const installer = new InstallProvider({
    clientId: Config.SLACK_CLIENT_ID,
    clientSecret: Config.SLACK_CLIENT_SECRET,
  });

  const url = await installer.generateInstallUrl({
    scopes: ["team:read", "chat:write", "channels:read", "channels:join"],
    metadata: JSON.stringify({ user: user }),
    redirectUri: "https://google.com",
  });
}
