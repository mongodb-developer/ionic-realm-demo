import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import RealmApolloProvider from './graphql/RealmApolloProvider';
import { RealmAppProvider, useRealmApp } from './Realm';
import { Login } from './pages/Login';
export const APP_ID = 'tasktracker-uryyk';
interface Props {
  Component: React.FC<RouteComponentProps>;
  path: string;
  exact?: boolean;
}
const AuthRoute = ({ Component, path, exact = true }: Props): JSX.Element => {
  const app = useRealmApp();
  const isAuthed = !!app.currentUser;
  return (
    <Route
      exact={exact}
      path={path}
      render={(props: RouteComponentProps) =>
        isAuthed ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};
const App: React.FC = () => {
  return (
    <RealmAppProvider appId={APP_ID}>
      <RealmApolloProvider>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <AuthRoute path="/home" Component ={Home}/>
              <Route exact path="/" component={Login} />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </RealmApolloProvider>
    </RealmAppProvider>
  );
};

export default App;
