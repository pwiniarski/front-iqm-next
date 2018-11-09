// FloatingMenu.js
import React, { Component } from "react";
import { inject, observer, useStaticRendering } from "mobx-react";
import Avatar from "../Avatar";
import { UsersStore } from "../../stores/UsersStore";
import { observable } from "mobx";
import DropdownMenu from "../DropdownMenu";
import DropdownMenuItem from "../DropdownMenuItem";
import StyledUserMenu from '../styles/usermenu';


@inject('store', 'routerStore')
@observer
export default class UserMenu extends Component {

    @observable open = false;
    //useStaticRendering(true);

    componentWillReact() {
        console.log("I will re-render, since the todo has changed!")
    }

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

    render() {

        var { store, theme = null, addTopMargin=false } = this.props;

        if (UsersStore.isLoggedIn === false) {
            return null;
        }

        var classes = classNames({
            'UserMenu': true,
            'show-for-large': true,
            'isCartEmpty': store.cart.isEmpty,
            [theme]: theme,
            'open': this.open,
            'topMargin16': addTopMargin
        });

        return (
            <StyledUserMenu className={classes} ref={node => this.node = node}>

                {/* <Avatar
                    size="small"
                    side='right'
                    imageUrl={'/avatar_person.jpg'} onClick={e => this.open = !this.open}>
                    <div className="">

                        {UsersStore.welcomeName}

                    </div>
                </Avatar> */}

                <DropdownMenu isVisible={this.open}>

                    <DropdownMenuItem rel="nofollow" to='logout'>Wyloguj</DropdownMenuItem>

                </DropdownMenu>

            </StyledUserMenu>
        )
    }
}