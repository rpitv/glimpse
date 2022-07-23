import { useAuthStore } from "@/stores/auth";
import { provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@/apollo";
import { useMutation } from "@vue/apollo-composable";
import { LogoutDocument } from "@/graphql/types";

export async function logout(): Promise<void> {
  provideApolloClient(apolloClient);

  const store = useAuthStore();
  const { mutate } = useMutation(LogoutDocument);

  const result = await mutate();
  if (!result?.data?.logoutSuccess) {
    throw new Error(
      "Logout failed. Please try again. If the problem persists, contact an administrator."
    );
  }

  store.isLoggedIn = false;
}
