// FloatingMenu.js
import React, { Component } from "react";
import { connect } from 'redux';
import Avatar from "./Avatar";
//import { UsersStore } from "../../stores/UsersStore";
import DropdownMenu from "./DropDownMenu";
import DropdownMenuItem from "./DropDownMenuItem";
import StyledUserMenu from '../styles/usermenu';
import AvatarImg from './../images/home-bg.jpg';

export default class UserMenu extends Component {

    open = false;

    constructor(props) {
        super(props);
        this.node = null;
    }

    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClickMenu);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClickMenu);
    }

    handleOutsideClickMenu = (e) => {
        if (this.node) {

            if (this.node.contains(e.target)) {
                return
            }

            if (!this.node.contains(e.target)) {
                this.open = false;
            }
        }
    }

    toggleAvatar = () => {
        this.open = !this.open;
    }

    render() {
        var {theme = null, addTopMargin=false } = this.props;

        // if (UsersStore.isLoggedIn === false) {
        //     return null;
        // }

        console.log('Avatar Image: ', AvatarImg)

        return (
            <StyledUserMenu ref={node => this.node = node}>
                <Avatar
                    size="small"
                    side='right'
                    imageUrl={AvatarImg} 
                    onClick={this.toggleAvatar}
                >
                    <div>

                        {/* {UsersStore.welcomeName} */}

                    </div>
                </Avatar>
                <DropdownMenu isVisible={this.open}>

                    <DropdownMenuItem rel="nofollow" to='logout'>Wyloguj</DropdownMenuItem>

                </DropdownMenu>

            </StyledUserMenu>
        )
    }
}