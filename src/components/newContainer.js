import * as React from 'react'
import * as classNames from 'classnames'

interface Properties {
    onRun?: (name: string, type: String) => void;
}

interface State {
    imageName: string;
    isValid: boolean;
}

export class NewContainer extends React.Component<Properties, State> {

    constructor(props: ModalProperties) {
        super(props)

        this.state = {
            type: this.props.id,
            imageName: '',
            isValid: false
        }
    }

    onImageNameChange(e: any) {
        const name = e.target.value

        this.setState({
            imageName: name,
            isValid: name.length > 0
        })
    }

    run() {
        if (this.state.isValid && this.props.onRun)
            this.props.onRun(this.state.imageName, this.state.type)

        return this.state.isValid
    }

    render() {

        var inputClass = classNames({
            "form-group": true,
            "has-error": !this.state.isValid
        })

        const help = this.state.type === 'image' ? 'Does not support commands atm' : 'Check npm server logs to see if image is downloading';

        return (
            <form className="form-horizontal" onSubmit={this.run.bind(this)}>
                <div className={inputClass}>
                    <label htmlFor="imageName" className="control-label">Image name</label>
                    <div className="row">
                        <div className="col-md-9">
                            <input type="text"
                                   className="form-control"
                                   onChange={this.onImageNameChange.bind(this)}
                                   id="imageName"
                                   placeholder="e.g mongo or mongo:latest"/>
                            <p>{ help }</p>

                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-primary" type="submit" value="submit">Create</button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}