import React from "react";

class Tooltip extends React.Component {
    constructor(param) {
        super(param);
        this.state = {
            showTooltip: false,
            hovering: false,
            targetTime: 0,
            updating: false
        }
    }

    async startCountdown() {
        if (this.state.updating) return;
        this.setState({
            updating: true
        })
        while (Date.now() < this.state.targetTime) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.setState({
            showTooltip: this.state.hovering,
            updating: false
        })
    }

    render() {
        return (
            <div
                onMouseMove={e => {
                    this.setState({
                        targetTime: Date.now() + 500,
                        hovering: true
                    });
                    this.startCountdown();
                }}
                onMouseLeave={e => {
                    this.setState({
                        showTooltip: false,
                        hovering: false
                    });
                }}
                onMouseDown={e => {
                    this.setState({
                        showTooltip: true
                    });
                }}
            >
                {this.state.showTooltip? (<div style={{position: 'absolute'}}>{this.props.tooltip}</div>) : null}
                {this.props.children}
            </div>
        );
    }
}

export default Tooltip;