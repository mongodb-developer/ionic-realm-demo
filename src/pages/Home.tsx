import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import { add } from 'ionicons/icons';
import { useState } from 'react';
import { TaskItem } from '../components/TaskItem';
import useTasks from '../graphql/useTasks';
import { useRealmApp } from '../Realm';
import './Home.css';

const Home: React.FC = () => {
  const app = useRealmApp();
  const [currentProject] = useState(app.currentUser?.customData.memberOf[0]);
  const { tasks, addTask, loading } = useTasks(currentProject);
  const [presentAlert] = useIonAlert();

  const addNewTask = () => {
    presentAlert({
      header: 'Add a new task',
      inputs: [{ type: 'text', label: 'New Task' }],
      buttons: ['Cancel', 'Add'],
      onDidDismiss: async (e) => {
        const taskToAdd = e.detail.data.values[0];
        if (!taskToAdd) {
          return;
        }
        await addTask({ name: taskToAdd });
      },
    });
  };

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    console.log("Refresh");
    window.location.reload();
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tasks</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={addNewTask}>
              <IonIcon slot="icon-only" icon={add}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tasks</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {loading ? <IonLoading isOpen={loading} /> : null}
          {tasks.map((task: any) => (
            <TaskItem key={parseInt(task._id)} {...task}></TaskItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
