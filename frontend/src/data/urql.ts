import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateTodoInput = {
  id: Scalars["String"];
  title: Scalars["String"];
};

export type Debug = {
  __typename?: "Debug";
  database: Scalars["String"];
};

export type Filter = {
  name: Scalars["String"];
  op: Scalars["String"];
};

export type Flags = {
  __typename?: "Flags";
  enabled: Scalars["Boolean"];
};

export type Mutation = {
  __typename?: "Mutation";
  createTodo: Todo;
  removeTodo?: Maybe<Todo>;
  upload: Scalars["String"];
};

export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};

export type MutationRemoveTodoArgs = {
  id: Scalars["String"];
};

export type MutationUploadArgs = {
  name: Scalars["String"];
  type: Scalars["String"];
};

export type NumberFilter = Filter & {
  __typename?: "NumberFilter";
  name: Scalars["String"];
  num: Scalars["Int"];
  op: Scalars["String"];
};

export type Pipe = {
  __typename?: "Pipe";
  destinations: Array<SlackChannel>;
  flags: Flags;
  name: Scalars["String"];
  sources: Array<Source>;
};

export type PlaidAccount = {
  __typename?: "PlaidAccount";
  category: Scalars["String"];
  name: Scalars["String"];
  subcategory: Scalars["String"];
};

export type PlaidConnection = {
  __typename?: "PlaidConnection";
  accounts: Array<PlaidAccount>;
  id: Scalars["ID"];
  institution: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  debug: Debug;
  session: Session;
  user: User;
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type Session = {
  __typename?: "Session";
  currentUser: User;
};

export type SlackChannel = {
  __typename?: "SlackChannel";
  name: Scalars["String"];
  num_members: Scalars["Int"];
  topic: Scalars["String"];
};

export type SlackConnection = {
  __typename?: "SlackConnection";
  channels: Array<SlackChannel>;
  name: Scalars["String"];
};

export type Source = {
  __typename?: "Source";
  account: PlaidAccount;
  filters: Array<Filter>;
};

export type TextFilter = Filter & {
  __typename?: "TextFilter";
  name: Scalars["String"];
  op: Scalars["String"];
  text: Scalars["String"];
};

export type Todo = {
  __typename?: "Todo";
  id: Scalars["ID"];
  title: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  pipes: Array<Pipe>;
  todos: Array<Todo>;
};

export type TodosQueryVariables = Exact<{ [key: string]: never }>;

export type TodosQuery = {
  __typename?: "Query";
  session: {
    __typename?: "Session";
    currentUser: {
      __typename?: "User";
      todos: Array<{ __typename?: "Todo"; id: string; title: string }>;
    };
  };
};

export type RemoveTodoMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type RemoveTodoMutation = {
  __typename?: "Mutation";
  removeTodo?:
    | { __typename?: "Todo"; id: string; title: string }
    | null
    | undefined;
};

export type CreateTodoMutationVariables = Exact<{
  id: Scalars["String"];
  title: Scalars["String"];
}>;

export type CreateTodoMutation = {
  __typename?: "Mutation";
  createTodo: { __typename?: "Todo"; id: string; title: string };
};

export type UploadMutationVariables = Exact<{
  name: Scalars["String"];
  type: Scalars["String"];
}>;

export type UploadMutation = { __typename?: "Mutation"; upload: string };

export type PipesQueryVariables = Exact<{ [key: string]: never }>;

export type PipesQuery = {
  __typename?: "Query";
  session: {
    __typename?: "Session";
    currentUser: {
      __typename?: "User";
      pipes: Array<{
        __typename?: "Pipe";
        flags: { __typename?: "Flags"; enabled: boolean };
        sources: Array<{
          __typename?: "Source";
          account: {
            __typename?: "PlaidAccount";
            name: string;
            category: string;
            subcategory: string;
          };
          filters: Array<
            | {
                __typename?: "NumberFilter";
                num: number;
                name: string;
                op: string;
              }
            | {
                __typename?: "TextFilter";
                text: string;
                name: string;
                op: string;
              }
          >;
        }>;
        destinations: Array<{
          __typename?: "SlackChannel";
          name: string;
          topic: string;
        }>;
      }>;
    };
  };
};

export const TodosDocument = gql`
  query Todos {
    session {
      currentUser {
        todos {
          id
          title
        }
      }
    }
  }
`;

export function useTodosQuery(
  options: Omit<Urql.UseQueryArgs<TodosQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<TodosQuery>({ query: TodosDocument, ...options });
}
export const RemoveTodoDocument = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id) {
      id
      title
    }
  }
`;

export function useRemoveTodoMutation() {
  return Urql.useMutation<RemoveTodoMutation, RemoveTodoMutationVariables>(
    RemoveTodoDocument
  );
}
export const CreateTodoDocument = gql`
  mutation CreateTodo($id: String!, $title: String!) {
    createTodo(input: { id: $id, title: $title }) {
      id
      title
    }
  }
`;

export function useCreateTodoMutation() {
  return Urql.useMutation<CreateTodoMutation, CreateTodoMutationVariables>(
    CreateTodoDocument
  );
}
export const UploadDocument = gql`
  mutation Upload($name: String!, $type: String!) {
    upload(name: $name, type: $type)
  }
`;

export function useUploadMutation() {
  return Urql.useMutation<UploadMutation, UploadMutationVariables>(
    UploadDocument
  );
}
export const PipesDocument = gql`
  query Pipes {
    session {
      currentUser {
        pipes {
          flags {
            enabled
          }
          sources {
            account {
              name
              category
              subcategory
            }
            filters {
              name
              op
              ... on NumberFilter {
                num
              }
              ... on TextFilter {
                text
              }
            }
          }
          destinations {
            name
            topic
          }
        }
      }
    }
  }
`;

export function usePipesQuery(
  options: Omit<Urql.UseQueryArgs<PipesQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<PipesQuery>({ query: PipesDocument, ...options });
}
