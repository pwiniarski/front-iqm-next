import styled from 'styled-components';

export default UserMenu = styled`
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