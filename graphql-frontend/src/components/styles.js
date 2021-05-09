import styled from 'styled-components'

const Button = styled.button`

    &:hover {
        background: #FFB81C;
        color: black;
    }

    background: ${props => props.active === props.name ? "#FFB81C" : "#005587"};
    color: ${props => props.active === props.name ? "black" : "white"};
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid #FFB81C;
    border-radius: 3px;
    font-weight: bold;
    cursor: pointer;
`

const Input = styled.input`
    margin: 0.25em;
`

const Page = styled.div`
    padding: 1em;
    background: #DAEBFE;
`

const Navigation = styled.div`
    background: #005587;
    padding: 1em;
`

const Footer = styled.div`
    background: Chocolate;
    padding: 1em;
    margin-top: 1em;
`

const Notification = styled.div`
    border: 'solid';
    border-width: 1;
    color: red;
    background: lightgrey;
    font-size: 1.5em;
    border-style: solid;
    border-radius: 5;
    padding: 10;
    margin-bottom: 10;
`

export { Button, Input, Page, Navigation, Footer, Notification }