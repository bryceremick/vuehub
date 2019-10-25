import * as components from './components'
import { use } from './utils/plugins'
// import colors from './assets/colors.json'
import ColorTools from './utils/colorTools'

const vuehub = {

    install(Vue, options = {}) {
        // Options
        // setOptions(Object.assign(config, options))

        const { token } = options;
        Vue.prototype.$GH_TOKEN = token;
        // Vue.prototype.$GH_COLORS = colors;
        Vue.prototype.$findLangColor = (lang) => {
             return ColorTools.findLangColor(lang);
        };
        Vue.prototype.$invertColor = (hex) => {
            return ColorTools.invertColor(hex);
        };
        Vue.prototype.$getContrastYIQ = (hex) => {
            return ColorTools.getContrastYIQ(hex);
        };


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