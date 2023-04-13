import { useQuery  } from "@tanstack/react-query";
import { getAssets } from "../../lib/api";

export default function ListFiles() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  })

  return (
    <div>
      <h1>listFiles</h1>
    </div>
  );
}
