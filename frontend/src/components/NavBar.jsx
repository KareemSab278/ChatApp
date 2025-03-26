import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <>
        <nav>
            {/* <Link to='/'> Users | </Link>
            <Link to='/Chats'>  Chat </Link> */}
            <Link to='/signin'>  sign in </Link>
            </nav>
        </>
    );
}
