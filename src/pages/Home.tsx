import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonAlert
} from '@ionic/react';
import { checkmark, trash, reloadOutline } from 'ionicons/icons';
import './Home.css';
import { useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
  const [taskToComplete, setTaskToComplete] = useState<number | null>(null);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]);
      setNewTask('');
    }
  };

  const handleTaskCompletion = (id: number) => {
    setTaskToComplete(id);
  };

  const toggleTask = (id: number) => {
    setLoadingTaskId(id);
    setTimeout(() => {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
      setLoadingTaskId(null);
    }, 2000);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <IonPage>
      <IonAlert
        isOpen={taskToComplete !== null}
        onDidDismiss={() => setTaskToComplete(null)}
        header="Confirm Action"
        message="Are you sure you want to mark this task as complete?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => setTaskToComplete(null)
          },
          {
            text: 'Complete',
            handler: () => {
              if (taskToComplete !== null) {
                toggleTask(taskToComplete);
                setTaskToComplete(null);
              }
            }
          }
        ]}
      />
      <IonHeader>
        <IonToolbar>
          <IonTitle>To-Do List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding">
          <div className="add-task-container">
            <IonItem>
              <IonInput
                value={newTask}
                placeholder="Add a new task"
                onIonInput={e => setNewTask(e.detail.value!)}
                onKeyPress={e => e.key === 'Enter' && addTask()}
              />
              <IonButton slot="end" onClick={addTask}>Add</IonButton>
            </IonItem>
          </div>
          <IonList>
            {tasks.map(task => (
              <IonItemSliding key={task.id}>
                <IonItem>
                  <IonLabel className={task.completed ? 'completed-task' : ''}>
                    {task.text}
                  </IonLabel>
                  <IonButton
                    slot="end"
                    fill="clear"
                    onClick={() => handleTaskCompletion(task.id)}
                    disabled={loadingTaskId === task.id}
                  >
                    <IonIcon icon={loadingTaskId === task.id ? reloadOutline : checkmark} className={loadingTaskId === task.id ? 'spin-animation' : ''} />
                  </IonButton>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => deleteTask(task.id)}>
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
