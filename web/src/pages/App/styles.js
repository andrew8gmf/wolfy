import styled from "styled-components";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

export const StyledContainer = styled(Container)`
    height: 100vh;
`;

export const StyledRow = styled(Row)`
    height: 100vh;
`;

export const Left = styled(Col)`
    background-color: yellow;
`;

export const Center = styled(Col)`
    background-color: red;
`;

export const Right = styled(Col)`
    background-color: green;
`;