import * as components from './components'
import { use } from './utils/plugins'

const vuehub = {

    install(Vue, options) {
        // Options
        // setOptions(Object.assign(config, options))

        const { token } = options;
        Vue.prototype.$GH_TOKEN = token;

        // Components
        for (let componentKey in components) {
            Vue.use(components[componentKey]);
        }

        // Config component
        // const BuefyProgrammatic = {
        //     setOptions(options) {
        //         setOptions(Object.assign(config, options))
        //     }
        // }
        // registerComponentProgrammatic(Vue, 'config', BuefyProgrammatic)
    }
}

use(vuehub);

export default vuehub;

// export all components as vue plugin
export * from './components'