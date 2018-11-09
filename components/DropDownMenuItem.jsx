import PropTypes from 'prop-types';
import Link from 'next/link';

const DropdownMenuItem = ({to = null, rel, children}) => (
    <Link href={to}>
        <a rel={rel}>
            {children}
        </a>
    </Link>
)

export default DropdownMenuItem;