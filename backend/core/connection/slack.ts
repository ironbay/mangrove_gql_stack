import { InstallProvider } from "@slack/oauth";
import AWS from "aws-sdk";

export async function auth_start(user: string) {
  const ssm = await new AWS.SSM();
  const SSM_NAMES = {
    client_id: "/mangrove/dev/SLACK_CLIENT_ID",
    client_secret: "/mangrove/dev/SLACK_CLIENT_SECRET",
  };

  const [client_id, client_secret] = await ssm
    .getParameters({
      Names: [SSM_NAMES.client_id, SSM_NAMES.client_secret],
    })
    .promise()
    .then((resp) => {
      return [
        resp.Parameters?.find((p) => p.Name === SSM_NAMES.client_id)!.Value!,
        resp.Parameters?.find((p) => p.Name === SSM_NAMES.client_secret)!
          .Value!,
      ];
    });

  const installer = new InstallProvider({
    clientId: client_id,
    clientSecret: client_secret,
    stateSecret: JSON.stringify({ app: "mangrove" }),
  });

  const url = await installer.generateInstallUrl({
    scopes: ["team:read", "chat:write", "channels:read", "channels:join"],
    metadata: JSON.stringify({ user: user }),
    redirectUri: "https://google.com",
  });

  return url;
}
