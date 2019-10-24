import * as components from './components'

// // This is your plugin object. It can be exported to be used anywhere.
// const vuehub = {
//   // The install method is all that needs to exist on the plugin object.
//   // It takes the global Vue object as well as user-defined options.
//   install(Vue, options) {
//     // We call Vue.mixin() here to inject functionality into all components.
//   	Vue.mixin({
//       // Anything added to a mixin will be injected into all components.
//       // In this case, the mounted() method runs when the component is added to the DOM.
      
//       for (let index = 0; index < array.length; index++) {
//         const element = array[index];
        
//       }
//       mounted() {
//         console.log('Mounted!');
//       }
//     });
//   }
// };

const vuehub = {

    install(Vue, options = {}) {
        // Options
        // setOptions(Object.assign(config, options))
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

use(Buefy);

export default vuehub;

// export all components as vue plugin
export * from './components'