export type Actor = UserActor | PublicActor | PlaidTxActor;

type UserActor = {
  type: "user";
  properties: {
    id: string;
  };
};

type PlaidTxActor = {
  type: "plaid_tx";
  properties: {
    item_id: string;
  };
};

type PublicActor = {
  type: "public";
};

export function useContext(actor: Actor) {
  return {
    actor,
    assertAuthenticated() {
      if (actor.type === "public") {
        throw new Error("Not authenticated");
      }
      return actor.properties;
    },
  };
}

export type Context = ReturnType<typeof useContext>;
