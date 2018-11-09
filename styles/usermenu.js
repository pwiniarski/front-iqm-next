import styled from 'styled-components';

const UserMenu = styled.div`
    position: absolute;
    right: 10px;
    top: 0px;
    margin: auto;
    min-height: 40px;
    z-index: 4;
    .Avatar__label {
        color: #fff;
    }

    &.dark{
        .Avatar__label{
            color: $cardTextColor;
        }
    }
    &.light {
        .Avatar__label{
            color: #ffffff;
        }
    }
`;

export default UserMenu;