import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { TaskItem } from "../components/TaskItem";
import useTaskMutations from "./useTaskMutations";
import * as Realm from "realm-web";
import createRealmApolloClient from "./RealmApolloProvider";
import { useRealmApp } from "../Realm";
import { useState, useEffect } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";


const useTasks = (client: ApolloClient<InMemoryCache>, project: any) => {
  const { tasks, loading } = useAllTasksInProject(client, project);
  const { addTask, updateTask } = useTaskMutations(project);
  return {
    loading,
    tasks,
    updateTask,
    addTask,
  };
};
export default useTasks;

function useAllTasksInProject(client: ApolloClient<InMemoryCache>, project: any) {
  

  console.log("Calling obs tasks");

  observeTasks(client, project);
  // (async () => {
  //   await observeTasks(client, project);
  // })();
  console.log("Partition 1", project.partition);
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

function observeTasks(client: ApolloClient<InMemoryCache>, project: any) {

  console.log("Client ", client);

  // const observable = client.subscribe({
  //   query: gql`
  //     query GetAllTasksForProject($partition: String!) {
  //       tasks(query: { _partition: $partition }) {
  //         _id
  //         name
  //         status
  //       }
  //     }
  //   `, variables: {partition: project.partition}
  // });
  
  // observable.subscribe({
  //   next(data: { data: { tasks: any; }; }) {
  //     const tasks = data.data.tasks;
  //     // Update you UI
  //     console.log("next ", tasks);
  //     console.log("data ", data);


  //   },
  //   error(value: string) {
  //     // Notify the user of the failure
  //     console.log("error " + value);

  //   }
  // });
};