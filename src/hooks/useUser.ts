import type { UserResponse } from "@/pages/api/auth/user";

import useSWR, { type Fetcher } from "swr";

export function useUser() {
  const fetcher: Fetcher<UserResponse, string> = (url) =>
    fetch(url).then(async (res) => {
      const data: UserResponse = await res.json();
      if (res.ok) return data;
      //   TODO: test this
      throw new Error(String(data.message));
    });

  const { data, ...fetchInfo } = useSWR(`/api/auth/user`, fetcher);

  return { user: data?.user, ...fetchInfo };
}
