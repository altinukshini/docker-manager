import * as React from 'react'
import { Container, ContainerListItem } from './containerListItem'

class ContainerListProps {
    containers: Container[];
}

export class ContainerList extends React.Component<ContainerListProps, {}> {
    render() {
        return (
                <table className="table table-hover table-striped">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>State</th>
                        <th>Image</th>
                        <th>IP Address</th>
                        <th>Published Ports</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        { this.props.containers.length === 0 ? <tr><td>No containers to show</td></tr> : null }
                        { this.props.containers.map(c => <ContainerListItem key={c.name} {...c} />) }
                    </tbody>
                </table>

        )
    }
}