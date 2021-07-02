import React from 'react';

class Sidebar extends React.Component {
    constructor(param) {
        super(param);
    }


    render() {
        return <div className="SidebarContainer"
                    style={{
                        width: this.props.enabled? '500px' : '0px',
                        visibility: this.props.enabled? 'visible' : 'collapse'
                    }}
        >
            {this.props.enabled? this.props.children : null}
        </div>;
    }
}

export default Sidebar;