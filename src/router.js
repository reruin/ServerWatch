import Layout from './components/Layout'
import Signin from './components/Signin'
import Notfound from './components/Common/Notfound'
import { ServerList , ServerDetail , ServerCreate , ServerRemove , ServerEdit } from './components/Server'
import Setting from './components/Setting'

const routes = [
  {
    name:'app',
    path: '/',
    component: Layout,
    children:[
      
      {
        name: 'servers',
        path: 'servers',
        component: ServerList,
      },
      {
        name: 'server_create',
        path: 'server/create',
        component: ServerCreate,
      },
      {
        name: 'server',
        path: 'server/:id',
        component: ServerDetail,
      },
      {
        name: 'server_remove',
        path: 'server/:id/remove',
        component: ServerRemove,
      },
      {
        name: 'server_edit',
        path: 'server/:id/edit',
        component: ServerEdit,
      },
      
      {
        name:'setting',
        path: 'setting',
        component: Setting
      }
      
    ]
  },
  {
    name:'signin',
    path: '/signin',
    component: Signin,
  },
  {
    name:'notfound',
    path: '/404',
    component: Notfound,
  }
]

export default routes