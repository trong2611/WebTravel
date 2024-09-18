import AddUserComponent from "./AddUserComponent";
import ListUsersComponent from "./ListUsersComponent";

const Home = () => {

    return (
        <div className="container grid gap-8">
          <AddUserComponent/>
          <ListUsersComponent/>
        </div>
    )

}

export default Home;