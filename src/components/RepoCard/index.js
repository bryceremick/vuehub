import RepoCard from './RepoCard'

import { use, registerComponent } from '../../utils/plugins'

const Plugin = {
    install(Vue) {
        registerComponent(Vue, RepoCard)
    }
};

use(Plugin)

export default Plugin