import React from "react";
import styles from "./NavBar.module.scss"; // Import SCSS module
import Logo from "./Logo2";

const NavBar: React.FC = () => {
	return (
		<div className={styles.Navbar}>
      <Logo />
			<div className={styles.NavigationButtons}>
				<div className={`${styles.Button} ${styles.Search}`}>Search</div>
				<div className={`${styles.Button} ${styles.About}`}>About this</div>
				<div className={`${styles.Button} ${styles.HowItWorks}`}>How it works</div>
				<div className={`${styles.Button} ${styles.Contact}`}>Contact</div>
			</div>
		</div>
	);
};

export default NavBar;
