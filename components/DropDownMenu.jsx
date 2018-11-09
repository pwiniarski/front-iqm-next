import PropTypes from 'prop-types';

const DropdownMenu = ({isVisible = false, children}) => (
    <div className="DropdownMenu" style={{ display: isVisible ? 'block' : 'none' }}>
        {children}
    </div>
)

export default DropdownMenu;