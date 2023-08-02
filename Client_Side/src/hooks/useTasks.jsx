import { useQuery } from "@tanstack/react-query";

const useTasks = () => {

    const {data: task = [], isLoading: loading, refetch} = useQuery({
        queryKey: ['task'],
        queryFn: async() => {
            const res = await fetch('https://happy-to-trip-server.vercel.app/task');
            return res.json();
        }
    })

    return [place, loading, refetch]
}

export default useTasks;