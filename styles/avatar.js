import styled from 'styled-components';

const Avatar = styled.div`
    background-image: url(${props => props.imageUrl})
`;

export default Avatar;