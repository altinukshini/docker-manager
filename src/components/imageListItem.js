import * as React from 'react'

class Image {
    repository: string;
    id: string;
    created: string;
    size: string;
}
export class ImageListItem extends React.Component<Image, {}> {

    render() {

        const createdRaw = new Date(this.props.created*1000);
        const created = (createdRaw.getMonth() + 1) + '/' + createdRaw.getDate() + '/' +  createdRaw.getFullYear();
        const size = Math.round(this.props.size/1000000) + "MB";
        const repository = this.props.repository[0].split(":")[0];
        const tag = this.props.repository[0].split(":")[1];
        const id = this.props.id.split(":")[1].substring(0, 12);

        return (
            <tr>
                <td>{ repository }</td>
                <td>{ tag }</td>
                <td>{ id }</td>
                <td>{ created }</td>
                <td>{ size }</td>
            </tr>
        )
    }
}