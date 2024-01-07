import { defineStore } from "pinia";
import type { PermissionsForQuery } from "@/graphql/types";
import {
  provideApolloClient,
  useMutation,
  useQuery,
} from "@vue/apollo-composable";
import { apolloClient } from "@/apollo";
import {
  LogoutDocument,
  PermissionsForDocument,
  SelfIdDocument,
} from "@/graphql/types";
import { ability } from "@/casl";

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
            { user: this.userId },
            { fetchPolicy: "no-cache" }
          );
          await new Promise<void>((resolve, reject) => {
            permissionsResult.onResult(({ data }) => {
              this.permissions = data.permissions?.map((p) => {
                if (p.fields?.length === 0) {
                  p.fields = null;
                }
                return p;
              });
              // Cast to get rid of err about string not being covariant with AbilityActions. Assume server is correct.
              ability.update(this.permissions as any);
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
              this.userId = parseInt(data.self?.id);
              if (isNaN(this.userId)) {
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
    async logout() {
      const { mutate } = useMutation(LogoutDocument);

      const result = await mutate();
      if (!result?.data?.logoutSuccess) {
        throw new Error(
          "Logout failed. Please try again. If the problem persists, contact an administrator."
        );
      }

      this.isLoggedIn = false;
      this.permissions = null;
      this.userId = undefined;
      await this.getPermissions();
    },
  },
});
