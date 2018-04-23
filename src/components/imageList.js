import * as React from 'react'
import { Image, ImageListItem } from './imageListItem'

class ImageListProps {
    images: Image[];
}

export class ImageList extends React.Component<ImageListProps, {}> {
    render() {
        return (
            <table className="table table-hover table-striped">
                <thead>
                <tr>
                    <th>Repository</th>
                    <th>Tag</th>
                    <th>Image ID</th>
                    <th>Created</th>
                    <th>Size</th>
                </tr>
                </thead>
                <tbody>
                { this.props.images.length === 0 ? <tr><td>No images to show</td></tr> : null }
                { this.props.images.map(c => <ImageListItem key={c.id} {...c} />) }
                </tbody>
            </table>

        )
    }
}