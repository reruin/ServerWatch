import sl from './config/sl'
import depends from './config/depends'
import services from './services'
import router from './router'

const app = sl('sl',depends)

app.mod(services)

app.router(router)

app.start()