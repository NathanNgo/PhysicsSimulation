import React from 'react';
import { SideBar } from './controller/SideBar';
import { ViewScreen } from './view/ViewScreen';
import { genColorGradient, genRandAttr, genCircleVals } from '../utils/generators';
import { Circle } from '../physics/rigid';
import Modal from './controller/containers/Modal';
import FPSStats from 'react-fps-stats';

// The "actual" root component.
class PhysicsSimulation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            vals: [],
            engineSettings: {
                gravity: [0.0, 0.0],
                cor: 1.00,
                boundCor: 1.00
            },
            genSettings: {
                amount: 0,
                minRadius: 0,
                maxRadius: 0,
                minVel: 0,
                maxVel: 0,
                minMass: 0,
                maxMass: 0,
                massGradient: false,
            },
            canvasWidth: undefined,
            canvasHeight: undefined,
            canvasHasRendered: false,
            aninIsPlaying: true,
            valSelected: null,
            modalOpen: false,
        }

        this.handleCanvasRender = this.handleCanvasRender.bind(this);
        this.handleAnimToggle = this.handleAnimToggle.bind(this);
        this.handleEngSettingsSubmit = this.handleEngSettingsSubmit.bind(this);
        this.handleGenSettingsSubmit = this.handleGenSettingsSubmit.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
    }

    handleCanvasRender(width, height) {
        if (!this.state.canvasHasRendered) {
            const initGenSettings = {
                amount: Math.floor(Math.random()*(20 - 10) + 10),
                minRadius: 10,
                maxRadius: 60,
                minVel: 1,
                maxVel: 2,
                minMass: 1,
                maxMass: 50,
                massGradient: false
            };

            this.setState((state) => ({
                canvasHasRendered: true,
                canvasWidth: width,
                canvasHeight: height,
                vals: genCircleVals(width, height, initGenSettings),
                genSettings: initGenSettings
            }));
        }
    }

    handleAnimToggle(animIsPlaying) {
        this.setState({ animIsPlaying });
    }

    handleEngSettingsSubmit(engineSettings) {
        this.setState({ engineSettings });
    }

    handleGenSettingsSubmit(genSettings) {
        const { canvasWidth, canvasHeight } = this.state;
        const vals = genCircleVals(canvasWidth, canvasHeight, genSettings);
        this.setState({ genSettings, vals });
    }

    handleModalClose() {
        this.setState({ valSelected: null, modalOpen: false });
    }

    handleModalOpen(val) {
        this.setState({ valSelected: val, modalOpen: true });
    }

    render() {
        let sideBar;

        if (this.state.canvasHasRendered) {
            sideBar =
                <SideBar
                    vals={this.state.vals}
                    canvasWidth={this.state.canvasWidth}
                    canvasHeight={this.state.canvasHeight}
                    engineSettings={this.state.engineSettings}
                    genSettings={this.state.genSettings}
                    animIsPlaying={this.state.animIsPlaying}
                    onAnimToggle={this.handleAnimToggle}
                    onEngSettingsSubmit={this.handleEngSettingsSubmit}
                    onGenSettingsSubmit={this.handleGenSettingsSubmit}
                />;
        } else {
            sideBar = <h2> Loading... </h2>;
        }

        return (
            <div className='containerMain'>
                {/* <FPSStats /> */}
                <header className='header'>
                    <h1> <span className='acc'> Physics Simulation </span> </h1>
                </header>
                <section className='sideBar'>
                    {sideBar}
                    {/*<button onClick={this.handleModalOpen}> Open </button>*/}
                </section>
                <section className='viewScreen'>
                    <ViewScreen
                        vals={this.state.vals}
                        onRender={this.handleCanvasRender}
                        engineSettings={this.state.engineSettings}
                    />
                </section>
                <footer className='footer'>
                    <p> <a href='https://github.com/NathanNgo/PhysicsSimulation'> GitHub </a> </p>
                </footer>
                <Modal isOpen={this.state.modalOpen} onClose={this.handleModalClose} >
                    <p> This is some content for the model </p>
                </Modal>
            </div>
        );
    }
}

export { PhysicsSimulation };
