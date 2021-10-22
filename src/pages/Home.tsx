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
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useState } from 'react';
import { TaskItem } from '../components/TaskItem';
import useTasks from '../graphql/useTasks';
import { useRealmApp } from '../Realm';
import './Home.css';

const Home: React.FC = (client: any) => {
  const app = useRealmApp();
  const [currentProject] = useState(app.currentUser?.customData.memberOf[0]);
  const { tasks, addTask, loading } = useTasks(client, currentProject);
  const [presentAlert] = useIonAlert();

  console.log("Client ", client);

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
