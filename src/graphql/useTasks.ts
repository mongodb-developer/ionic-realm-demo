import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { TaskItem } from "../components/TaskItem";
import useTaskMutations from "./useTaskMutations";
import * as Realm from "realm-web";
import createRealmApolloClient from "./RealmApolloProvider";
import { useRealmApp } from "../Realm";

const useTasks = (project: any) => {
  const { tasks, loading } = useAllTasksInProject(project);
  const { addTask, updateTask } = useTaskMutations(project);
  return {
    loading,
    tasks,
    updateTask,
    addTask,
  };
};
export default useTasks;

function useAllTasksInProject(project: any) {

  console.log("Part", project.partition);
  const { data, loading, error } = useQuery(
    gql`
      query GetAllTasksForProject($partition: String!) {
        tasks(query: { _partition: $partition }) {
          _id
          name
          status
        }
      }
    `,
    { variables: { partition: project.partition } }
  );
  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }

  // If the query has finished, return the tasks from the result data
  // Otherwise, return an empty list
  const tasks = data?.tasks ?? [];
  return { tasks, loading };
}
