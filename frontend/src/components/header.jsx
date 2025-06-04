import React from "react";
import { Link } from "react-router-dom";
import './header.css';

export default function  Header() {
	return (
		<header>
			<div className="header-content">
				<h1 className="logo">TETRIS GALACTIQUE</h1>
				<nav>
					<Link to={'/'} className="nav-link">Accueil</Link>
				</nav>
			</div>
		</header>
	);
}