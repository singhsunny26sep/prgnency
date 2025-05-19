import * as React from 'react';

const _navigationRef: any = React.createRef();

function navigateToScreen(name: any, params: any) {
    _navigationRef.current?.navigate(name, params);
}

export { _navigationRef };