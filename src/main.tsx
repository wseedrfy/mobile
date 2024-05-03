import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { ConfigProvider } from 'antd-mobile';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import Login from './containers/Login';
import Register from './containers/Register';
import { client } from './utils/apollo';
import StudentInfo from './components/StudentInfo';
import { routes } from './routes/menus';
import App from './App';
import { ROUTE_COMPONENT } from './routes';
import './theme.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider locale={zhCN}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <StudentInfo>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<App />}>
              {routes.map((item) => {
                const Component = ROUTE_COMPONENT[item.key];
                return (
                  <Route
                    path={item.path}
                    key={item.key}
                    element={<Component />}
                  />
                );
              })}
            </Route>
          </Routes>
        </StudentInfo>
      </BrowserRouter>
    </ApolloProvider>
  </ConfigProvider>,
);
