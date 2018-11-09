import { inject, observer } from "mobx-react";

export const MobxProvider = (props) => {
    console.log('props: ', props);
    return inject(props.store)(observer(props.component));
}
