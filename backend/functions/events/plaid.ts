import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Connection } from "@mangrove/core/connection";

export const incoming: APIGatewayProxyHandlerV2 = async (
  event,
  ctx,
  callback
) => {
  await Connection.Plaid.incoming(JSON.parse(event.body!));

  return {
    statusCode: 200,
  };
};

function mangrove_tx() {}
