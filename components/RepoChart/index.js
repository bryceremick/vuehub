import RepoChart from './RepoChart'

import { use, registerComponent } from '../../utils/plugins'

const Plugin = {
    install(Vue) {
        registerComponent(Vue, RepoChart)
    }
};

use(Plugin)

export default Plugin