import { connect } from 'react-redux'
import StyledAvatar from './../styles/avatar';
import Papper from "./Paper";

const Avatar = ({onClick, children, imageUrl, side, size}) => {

    return (
        <button onClick={onClick} className={`Avatar relative ${side} ${size}`}>

            <StyledAvatar imageUrl={imageUrl}>
                <Papper />
            </StyledAvatar>
            <div className="Avatar__label">
                {children}
            </div>
        </button>
    );
}

Avatar.defaultProps = {
    imageUrl: '/avatar.jpg',
    onClick: null,
    side: 'left',
    size: null
}

const mapStateToProps = (state) => {
    return {
        intial: state
    }
};

export default connect(mapStateToProps,null)(Avatar);