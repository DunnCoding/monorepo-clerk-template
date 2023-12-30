import { Text } from "react-native";

import { api } from "../utils/trpc";

export default function Post() {
  const post = api.post.all.useQuery();

  console.log(post);
  return <Text>{post.data?.[0]?.name}</Text>;
}
