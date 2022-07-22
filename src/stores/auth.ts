import { defineStore } from "pinia";
import type { PermissionsForQuery } from "@/graphql/types";
import { provideApolloClient, useQuery } from "@vue/apollo-composable";
import { apolloClient } from "@/apollo";
import { PermissionsForDocument, SelfIdDocument } from "@/graphql/types";

provideApolloClient(apolloClient);

export const useAuthStore = defineStore("auth", {
  state: (): {
    isLoggedIn: boolean;
    permissions: PermissionsForQuery["permissions"] | null;
    userId: number | null | undefined;
  } => ({
    isLoggedIn: false,
    permissions: null,
    userId: undefined,
  }),
  getters: {},
  actions: {
    async getPermissions(): Promise<PermissionsForQuery["permissions"]> {
      if (this.permissions === null) {
        try {
          const permissionsResult = useQuery(
            PermissionsForDocument,
            { user: String(this.userId) },
            { fetchPolicy: "no-cache" }
          );
          await new Promise<void>((resolve, reject) => {
            permissionsResult.onResult(({ data }) => {
              this.permissions = data.permissions;
              resolve();
            });
            permissionsResult.onError((error) => {
              reject(error);
            });
          });
        } catch (e) {
          throw e;
        }
      }
      if (this.permissions === null) {
        return [];
      }
      return this.permissions;
    },
    async getOwnId(): Promise<number | null> {
      if (this.userId === undefined) {
        try {
          const selfIdResult = useQuery(
            SelfIdDocument,
            {},
            { fetchPolicy: "no-cache" }
          );
          await new Promise<void>((resolve, reject) => {
            selfIdResult.onResult(({ data }) => {
              if (typeof data.self?.id === "string") {
                this.userId = parseInt(data.self.id);
              } else {
                this.userId = null;
              }
              resolve();
            });
            selfIdResult.onError((error) => {
              reject(error);
            });
          });
        } catch (e) {
          throw e;
        }
      }
      // If the userId is still undefined, then the user is not logged in. Shouldn't happen, since the
      //   GraphQL API would have returned null anyway if the user is not logged in.
      return this.userId ?? null;
    },
  },
});
